"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getAgeString } from "@/lib/utils";
import type { Child, GrowthEntry, Milestone, AIInsight } from "@/lib/types";
import {
  TrendingUp,
  Brain,
  Sparkles,
  Plus,
  ArrowRight,
  Scale,
  Ruler,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface DashboardHomeProps {
  child: Child;
  allChildren: Child[];
  latestGrowth: GrowthEntry | null;
  recentMilestones: Milestone[];
  recentInsights: AIInsight[];
}

export function DashboardHome({
  child,
  allChildren,
  latestGrowth,
  recentMilestones,
  recentInsights,
}: DashboardHomeProps) {
  const age = getAgeString(new Date(child.birth_date));

  return (
    <div className="py-6 space-y-6 animate-fade-in">
      {/* Child header */}
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16 ring-4 ring-brand-100">
          {child.photo_url && <AvatarImage src={child.photo_url} />}
          <AvatarFallback className="text-xl bg-brand-100 text-brand-600">
            {child.name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-2xl font-bold text-warm-900">
            {child.name}
          </h1>
          <p className="text-warm-500 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {age} old
            <span className="text-warm-300">|</span>
            {child.gender === "boy" ? "Boy" : "Girl"}
          </p>
        </div>
      </div>

      {/* Child switcher (if multiple children) */}
      {allChildren.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allChildren.map((c) => (
            <Link key={c.id} href={`/dashboard?child=${c.id}`}>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                  c.id === child.id
                    ? "bg-brand-500 text-white shadow-md"
                    : "bg-white text-warm-600 border border-warm-200 hover:border-brand-200"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                  {c.name[0]}
                </span>
                {c.name}
              </button>
            </Link>
          ))}
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-xs text-warm-500">Weight</p>
              <p className="font-display font-bold text-lg text-warm-900">
                {latestGrowth?.weight_kg
                  ? `${latestGrowth.weight_kg} kg`
                  : "—"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
              <Ruler className="w-5 h-5 text-sage-600" />
            </div>
            <div>
              <p className="text-xs text-warm-500">Height</p>
              <p className="font-display font-bold text-lg text-warm-900">
                {latestGrowth?.height_cm
                  ? `${latestGrowth.height_cm} cm`
                  : "—"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lavender-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-lavender-600" />
            </div>
            <div>
              <p className="text-xs text-warm-500">Milestones</p>
              <p className="font-display font-bold text-lg text-warm-900">
                {recentMilestones.filter((m) => m.achieved_at).length} done
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-xs text-warm-500">Insights</p>
              <p className="font-display font-bold text-lg text-warm-900">
                {recentInsights.length} new
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Growth prompt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-sky-500" />
              Growth Check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestGrowth ? (
              <div>
                <p className="text-warm-600 text-sm mb-4">
                  Last recorded on{" "}
                  {new Date(latestGrowth.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                  })}
                  . Time for an update?
                </p>
                <div className="flex gap-3">
                  <Link href="/dashboard/growth">
                    <Button size="sm">
                      <Plus className="w-4 h-4" />
                      Log Growth
                    </Button>
                  </Link>
                  <Link href="/dashboard/growth">
                    <Button variant="outline" size="sm">
                      View Chart
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-warm-600 text-sm mb-4">
                  Start tracking {child.name}&apos;s growth! Add their current
                  weight and height to see beautiful percentile charts.
                </p>
                <Link href="/dashboard/growth">
                  <Button size="sm">
                    <Plus className="w-4 h-4" />
                    Add First Measurement
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Milestones prompt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-lavender-500" />
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMilestones.length > 0 ? (
              <div>
                <div className="space-y-2 mb-4">
                  {recentMilestones.slice(0, 3).map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      {m.achieved_at ? (
                        <CheckCircle2 className="w-4 h-4 text-sage-500 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-warm-400 flex-shrink-0" />
                      )}
                      <span
                        className={
                          m.achieved_at ? "text-warm-700" : "text-warm-500"
                        }
                      >
                        {m.title}
                      </span>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/milestones">
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-warm-600 text-sm mb-4">
                  Track developmental milestones based on CDC guidelines.
                  We&apos;ll help you know what to look for at {child.name}
                  &apos;s age.
                </p>
                <Link href="/dashboard/milestones">
                  <Button variant="accent" size="sm">
                    <Plus className="w-4 h-4" />
                    Explore Milestones
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {recentInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-brand-500" />
              AI Insights for {child.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 to-lavender-50 border border-brand-100"
                >
                  <h4 className="font-display font-semibold text-warm-900 mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-warm-600 leading-relaxed">
                    {insight.content}
                  </p>
                </div>
              ))}
            </div>
            <Link href="/dashboard/insights" className="block mt-4">
              <Button variant="soft" size="sm" className="w-full">
                View All Insights
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
