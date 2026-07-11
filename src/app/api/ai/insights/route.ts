import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { childId } = await request.json();
  if (typeof childId !== "string") {
    return NextResponse.json({ error: "A child is required" }, { status: 400 });
  }

  const [{ data: child }, { data: entries }, { data: milestones }] = await Promise.all([
    supabase.from("children").select("*").eq("id", childId).single(),
    supabase.from("growth_entries").select("*").eq("child_id", childId).order("date", { ascending: true }),
    supabase.from("milestones").select("*").eq("child_id", childId),
  ]);
  if (!child) return NextResponse.json({ error: "Child not found" }, { status: 404 });

  const achieved = (milestones ?? []).filter((milestone) => milestone.achieved_at).length;
  const latest = entries?.at(-1);
  const insights = [
    {
      type: "growth",
      title: latest ? "A clear new point in the story" : "Ready for a first measurement",
      content: latest
        ? `${child.name}'s latest check-in records ${latest.weight_kg ?? "—"} kg and ${latest.height_cm ?? "—"} cm. Trends over several measurements are more useful than any single point.`
        : `Add ${child.name}'s current weight or length to begin a private growth timeline.`,
      products: [],
    },
    {
      type: "milestone",
      title: achieved ? `${achieved} moments worth celebrating` : "Every new skill belongs here",
      content: achieved
        ? `You have captured ${achieved} milestones for ${child.name}. Add a note or photo to preserve the context around each one.`
        : "Record new skills as they happen, in your own words and without pressure.",
      products: [],
    },
  ];
  return NextResponse.json({ insights });
}
