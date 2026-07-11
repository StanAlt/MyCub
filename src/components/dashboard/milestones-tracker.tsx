"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  milestoneTemplates,
  getMilestonesForAge,
  getCategoryInfo,
} from "@/lib/milestones-data";
import { formatDateOnly, getAgeInMonths, getLocalDateInputValue, parseDateOnly } from "@/lib/utils";
import type { Child, Milestone, MilestoneCategory } from "@/lib/types";
import {
  CheckCircle2,
  Circle,
  Sparkles,
  PartyPopper,
} from "lucide-react";

interface MilestonesTrackerProps {
  child: Child;
  savedMilestones: Milestone[];
}

const categories: { value: MilestoneCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "motor", label: "Motor" },
  { value: "language", label: "Language" },
  { value: "cognitive", label: "Cognitive" },
  { value: "social", label: "Social" },
  { value: "self_care", label: "Self-Care" },
];

export function MilestonesTracker({
  child,
  savedMilestones,
}: MilestonesTrackerProps) {
  const [categoryFilter, setCategoryFilter] = useState<MilestoneCategory | "all">("all");
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const ageMonths = getAgeInMonths(parseDateOnly(child.birth_date));
  const relevantMilestones = getMilestonesForAge(ageMonths);

  const filtered =
    categoryFilter === "all"
      ? relevantMilestones
      : relevantMilestones.filter((m) => m.category === categoryFilter);

  // Check if a milestone template has been saved/achieved
  function isMilestoneAchieved(title: string): Milestone | undefined {
    return savedMilestones.find(
      (m) => m.title === title && m.achieved_at
    );
  }

  function isMilestoneSaved(title: string): Milestone | undefined {
    return savedMilestones.find((m) => m.title === title);
  }

  async function toggleMilestone(
    template: (typeof milestoneTemplates)[0]
  ) {
    setLoading(template.title);

    const existing = isMilestoneSaved(template.title);

    if (existing) {
      // Toggle achievement
      if (existing.achieved_at) {
        await supabase
          .from("milestones")
          .update({ achieved_at: null })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("milestones")
          .update({ achieved_at: getLocalDateInputValue() })
          .eq("id", existing.id);
      }
    } else {
      // Create new milestone as achieved
      await supabase.from("milestones").insert({
        child_id: child.id,
        category: template.category,
        title: template.title,
        description: template.description,
        expected_age_months: template.expected_age_months,
        achieved_at: getLocalDateInputValue(),
      });
    }

    setLoading(null);
    router.refresh();
  }

  const achievedCount = savedMilestones.filter((m) => m.achieved_at).length;
  const totalRelevant = relevantMilestones.length;

  // Group by age
  const ageGroups = filtered.reduce(
    (acc, m) => {
      const key = m.expected_age_months;
      if (!acc[key]) acc[key] = [];
      acc[key].push(m);
      return acc;
    },
    {} as Record<number, typeof filtered>
  );

  return (
    <div className="py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-warm-900">
          Milestones
        </h1>
        <p className="text-warm-500 text-sm">
          Track {child.name}&apos;s developmental milestones — based on CDC
          guidelines
        </p>
      </div>

      {/* Progress */}
      <Card className="bg-gradient-to-r from-lavender-50 to-brand-50">
        <CardContent className="py-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lavender-500" />
              <span className="font-display font-semibold text-warm-800">
                Progress
              </span>
            </div>
            <span className="text-sm text-warm-600">
              {achievedCount} of {totalRelevant} milestones
            </span>
          </div>
          <div className="w-full h-3 bg-white/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-lavender-400 to-brand-400 rounded-full transition-all duration-500"
              style={{
                width: `${totalRelevant > 0 ? (achievedCount / totalRelevant) * 100 : 0}%`,
              }}
            />
          </div>
          {achievedCount > 0 && achievedCount === totalRelevant && (
            <div className="flex items-center gap-2 mt-3 text-sage-600 text-sm">
              <PartyPopper className="w-4 h-4" />
              Amazing! {child.name} has reached all expected milestones!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={categoryFilter === cat.value ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter(cat.value)}
            className="whitespace-nowrap"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Milestones by age group */}
      {Object.entries(ageGroups)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([ageKey, milestones]) => {
          const age = Number(ageKey);
          const ageLabel =
            age < 24
              ? `${age} months`
              : `${Math.floor(age / 12)} years${age % 12 ? ` ${age % 12}m` : ""}`;
          const isPast = age <= ageMonths;
          const isCurrent = age > ageMonths - 6 && age <= ageMonths;

          return (
            <div key={ageKey}>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-display font-semibold text-warm-800">
                  {ageLabel}
                </h3>
                {isCurrent && (
                  <span className="text-xs bg-brand-100 text-brand-600 px-2 py-0.5 rounded-full font-medium">
                    Current stage
                  </span>
                )}
                {!isPast && (
                  <span className="text-xs bg-warm-100 text-warm-500 px-2 py-0.5 rounded-full">
                    Coming up
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-6">
                {milestones.map((m) => {
                  const achieved = isMilestoneAchieved(m.title);
                  const catInfo = getCategoryInfo(m.category);

                  return (
                    <Card
                      key={m.title}
                      className={`cursor-pointer transition-all ${
                        achieved
                          ? "bg-sage-50 border-sage-200"
                          : "hover:border-brand-200"
                      }`}
                      onClick={() => toggleMilestone(m)}
                    >
                      <CardContent className="py-3 px-4">
                        <div className="flex items-start gap-3">
                          <button
                            className="mt-0.5 flex-shrink-0"
                            disabled={loading === m.title}
                          >
                            {achieved ? (
                              <CheckCircle2 className="w-5 h-5 text-sage-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-warm-300" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`font-medium text-sm ${
                                  achieved
                                    ? "text-warm-700"
                                    : "text-warm-800"
                                }`}
                              >
                                {m.title}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${catInfo.bgColor} ${catInfo.color}`}
                              >
                                {catInfo.label}
                              </span>
                            </div>
                            <p className="text-xs text-warm-500 mt-0.5">
                              {m.description}
                            </p>
                            {achieved && (
                              <p className="text-xs text-sage-600 mt-1">
                                Achieved on{" "}
                                {formatDateOnly(achieved.achieved_at!, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}
