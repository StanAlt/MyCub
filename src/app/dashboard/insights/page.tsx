import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InsightsView } from "@/components/dashboard/insights-view";

export default async function InsightsPage({
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

  const { data: insights } = await supabase
    .from("ai_insights")
    .select("*")
    .eq("child_id", selectedChild.id)
    .order("created_at", { ascending: false });

  return (
    <InsightsView child={selectedChild} insights={insights || []} />
  );
}
