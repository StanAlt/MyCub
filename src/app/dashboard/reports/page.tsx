import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReportView } from "@/components/dashboard/report-view";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: children } = await supabase.from("children").select("*").order("created_at");
  if (!children?.length) redirect("/dashboard/add-child");
  const { child: childId } = await searchParams;
  const child = children.find((item) => item.id === childId) || children[0];
  const [{ data: growth }, { data: milestones }] = await Promise.all([
    supabase.from("growth_entries").select("*").eq("child_id", child.id).order("date"),
    supabase.from("milestones").select("*").eq("child_id", child.id).order("achieved_at", { ascending: false }),
  ]);
  return <ReportView child={child} entries={growth || []} milestones={milestones || []} />;
}
