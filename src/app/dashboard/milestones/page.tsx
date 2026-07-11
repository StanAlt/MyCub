import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MilestonesTracker } from "@/components/dashboard/milestones-tracker";

export default async function MilestonesPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .order("created_at", { ascending: true });

  if (!children || children.length === 0) redirect("/dashboard/add-child");

  const params = await searchParams;
  const selectedChildId = params.child || children[0].id;
  const selectedChild =
    children.find((child) => child.id === selectedChildId) || children[0];

  const { data: milestones } = await supabase
    .from("milestones")
    .select("*")
    .eq("child_id", selectedChild.id)
    .order("expected_age_months", { ascending: true });

  return (
    <MilestonesTracker
      child={selectedChild}
      savedMilestones={milestones || []}
    />
  );
}
