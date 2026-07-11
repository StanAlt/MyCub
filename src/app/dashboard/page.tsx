import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHome } from "@/components/dashboard/home";

export default async function DashboardPage({
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

  if (!children || children.length === 0) {
    redirect("/dashboard/add-child");
  }

  const params = await searchParams;
  const selectedChildId = params.child || children[0].id;
  const selectedChild = children.find((child) => child.id === selectedChildId) || children[0];

  const [{ data: growthEntries }, { data: milestones }, { data: insights }] = await Promise.all([
    supabase.from("growth_entries").select("*").eq("child_id", selectedChild.id).order("date", { ascending: true }),
    supabase.from("milestones").select("*").eq("child_id", selectedChild.id).order("created_at", { ascending: false }),
    supabase.from("ai_insights").select("*").eq("child_id", selectedChild.id).order("created_at", { ascending: false }).limit(3),
  ]);

  return (
    <DashboardHome
      child={selectedChild}
      allChildren={children}
      growthEntries={growthEntries || []}
      recentMilestones={milestones || []}
      recentInsights={insights || []}
    />
  );
}
