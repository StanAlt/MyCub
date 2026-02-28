import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GrowthTracker } from "@/components/dashboard/growth-tracker";

export default async function GrowthPage({
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
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (!children || children.length === 0) redirect("/dashboard/add-child");

  const params = await searchParams;
  const selectedChildId = params.child || children[0].id;
  const selectedChild =
    children.find((c: any) => c.id === selectedChildId) || children[0];

  const { data: growthEntries } = await supabase
    .from("growth_entries")
    .select("*")
    .eq("child_id", selectedChild.id)
    .order("date", { ascending: true });

  return (
    <GrowthTracker
      child={selectedChild}
      entries={growthEntries || []}
    />
  );
}
