import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { childId } = await request.json();

  // Fetch child data
  const { data: child } = await supabase
    .from("children")
    .select("*")
    .eq("id", childId)
    .eq("user_id", user.id)
    .single();

  if (!child) {
    return NextResponse.json({ error: "Child not found" }, { status: 404 });
  }

  // Fetch growth history
  const { data: growthEntries } = await supabase
    .from("growth_entries")
    .select("*")
    .eq("child_id", childId)
    .order("date", { ascending: true });

  // Fetch milestones
  const { data: milestones } = await supabase
    .from("milestones")
    .select("*")
    .eq("child_id", childId);

  const birthDate = new Date(child.birth_date);
  const now = new Date();
  const ageMonths =
    (now.getFullYear() - birthDate.getFullYear()) * 12 +
    (now.getMonth() - birthDate.getMonth());

  const achievedMilestones = (milestones || []).filter((m: any) => m.achieved_at);
  const pendingMilestones = (milestones || []).filter((m: any) => !m.achieved_at);

  const prompt = `You are a warm, supportive pediatric development advisor for the MyCub app. A parent is tracking their child's development and you need to provide gentle, encouraging insights.

Child Information:
- Name: ${child.name}
- Age: ${ageMonths} months (${Math.floor(ageMonths / 12)} years ${ageMonths % 12} months)
- Gender: ${child.gender}

Growth Data (most recent entries):
${
  growthEntries && growthEntries.length > 0
    ? growthEntries
        .slice(-5)
        .map(
          (e: any) =>
            `  - ${e.date}: Weight ${e.weight_kg || "N/A"} kg, Height ${e.height_cm || "N/A"} cm`
        )
        .join("\n")
    : "  No growth data recorded yet."
}

Achieved Milestones: ${achievedMilestones.length} milestones achieved
${achievedMilestones.map((m: any) => `  - ${m.title} (${m.category})`).join("\n")}

Pending Milestones: ${pendingMilestones.length} milestones pending
${pendingMilestones.slice(0, 5).map((m: any) => `  - ${m.title} (expected at ${m.expected_age_months} months)`).join("\n")}

Please respond with a valid JSON object (no markdown formatting) with this structure:
{
  "insights": [
    {
      "type": "growth" | "milestone" | "recommendation",
      "title": "Short encouraging title",
      "content": "2-3 sentences of gentle, supportive insight. Be warm, not clinical. Never alarming.",
      "products": [
        {
          "name": "Product name",
          "description": "Why this helps",
          "category": "toys|books|nutrition|outdoor|educational",
          "age_range": "e.g. 2-4 years",
          "why_recommended": "How it helps development"
        }
      ]
    }
  ]
}

Guidelines:
- Always be ENCOURAGING and GENTLE. Never use alarming language.
- Frame everything positively — "Your child is growing at their own perfect pace"
- Suggest 2-3 specific product recommendations that genuinely help development
- Include at least one growth insight, one milestone insight, and one recommendation
- Products should be age-appropriate and genuinely useful (books, toys, activities)
- Keep each insight to 2-3 concise sentences`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Parse AI response
    const parsed = JSON.parse(responseText);

    // Save insights to database
    for (const insight of parsed.insights) {
      await supabase.from("ai_insights").insert({
        child_id: childId,
        type: insight.type,
        title: insight.title,
        content: insight.content,
        products: insight.products || [],
      });
    }

    return NextResponse.json({ insights: parsed.insights });
  } catch (error: any) {
    console.error("AI insight generation failed:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
