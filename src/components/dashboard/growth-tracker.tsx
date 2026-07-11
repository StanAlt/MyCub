"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GrowthChart } from "@/components/dashboard/growth-chart";
import {
  getGrowthData,
  interpolatePercentile,
  getPercentileBand,
} from "@/lib/growth-data";
import { formatDateOnly, getAgeInMonths, getLocalDateInputValue, parseDateOnly } from "@/lib/utils";
import type { Child, GrowthEntry } from "@/lib/types";
import { Plus, Scale, Ruler, TrendingUp, X, Info } from "lucide-react";

interface GrowthTrackerProps {
  child: Child;
  entries: GrowthEntry[];
}

export function GrowthTracker({ child, entries }: GrowthTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [metric, setMetric] = useState<"weight" | "height">("weight");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [date, setDate] = useState(getLocalDateInputValue());
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const ageMonths = getAgeInMonths(parseDateOnly(child.birth_date));
  const growthData = getGrowthData(child.gender, metric);
  const currentPercentile = interpolatePercentile(growthData, ageMonths);

  // Get latest entry for percentile band display
  const latestEntry = entries.length > 0 ? entries[entries.length - 1] : null;
  const latestValue =
    metric === "weight" ? latestEntry?.weight_kg : latestEntry?.height_cm;
  const percentileBand =
    latestValue && currentPercentile
      ? getPercentileBand(latestValue, currentPercentile)
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("growth_entries").insert({
      child_id: child.id,
      date,
      weight_kg: weightKg ? parseFloat(weightKg) : null,
      height_cm: heightCm ? parseFloat(heightCm) : null,
      notes: notes || null,
    });

    if (!error) {
      setShowForm(false);
      setWeightKg("");
      setHeightCm("");
      setNotes("");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-warm-900">
            Growth Tracker
          </h1>
          <p className="text-warm-500 text-sm">
            {child.name}&apos;s growth journey â€” WHO percentile standards
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />
          Log Measurement
        </Button>
      </div>

      {/* Metric toggle */}
      <div className="flex gap-2">
        <Button
          variant={metric === "weight" ? "default" : "outline"}
          size="sm"
          onClick={() => setMetric("weight")}
          className="gap-2"
        >
          <Scale className="w-4 h-4" />
          Weight
        </Button>
        <Button
          variant={metric === "height" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setMetric("height")}
          className="gap-2"
        >
          <Ruler className="w-4 h-4" />
          Height
        </Button>
      </div>

      {/* Percentile insight card */}
      {percentileBand && latestValue && (
        <Card className="border-l-4 border-l-brand-400">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <p className="font-display font-semibold text-warm-900">
                  {child.name} is in the{" "}
                  <span className={percentileBand.color}>
                    {percentileBand.band} percentile
                  </span>
                </p>
                <p className="text-sm text-warm-600 mt-1 leading-relaxed">
                  {percentileBand.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {metric === "weight" ? (
              <>
                <Scale className="w-5 h-5 text-sky-500" />
                Weight for Age
              </>
            ) : (
              <>
                <Ruler className="w-5 h-5 text-sage-500" />
                Height for Age
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <GrowthChart
              entries={entries}
              percentileData={growthData}
              metric={metric}
              gender={child.gender}
              birthDate={child.birth_date}
            />
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {metric === "weight" ? (
                  <Scale className="w-7 h-7 text-warm-400" />
                ) : (
                  <Ruler className="w-7 h-7 text-warm-400" />
                )}
              </div>
              <h3 className="font-display font-semibold text-warm-700 mb-1">
                No measurements yet
              </h3>
              <p className="text-sm text-warm-500 mb-4">
                Add {child.name}&apos;s first {metric} measurement to see their
                growth chart.
              </p>
              <Button onClick={() => setShowForm(true)} size="sm">
                <Plus className="w-4 h-4" />
                Add First Measurement
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-warm-400" />
            <span className="text-sm font-medium text-warm-700">
              Understanding the chart
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            {[
              { label: "97th percentile", color: "bg-red-200", desc: "Very high" },
              { label: "85th percentile", color: "bg-brand-200", desc: "Above average" },
              { label: "50th percentile", color: "bg-sage-300", desc: "Average" },
              { label: "15th percentile", color: "bg-sky-200", desc: "Below average" },
              { label: "3rd percentile", color: "bg-sky-100", desc: "Very low" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-4 h-2 rounded-full ${item.color}`} />
                <div>
                  <span className="text-warm-700 font-medium">{item.label}</span>
                  <span className="text-warm-500 block">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-warm-500 mt-3">
            Percentiles show how your child compares to other children of the
            same age and sex. The 50th percentile is average â€” being above or
            below is usually perfectly normal.
          </p>
        </CardContent>
      </Card>

      {/* Measurement history */}
      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Measurement History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...entries].reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-2 border-b border-warm-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warm-100 flex items-center justify-center">
                      <Scale className="w-4 h-4 text-warm-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-warm-800">
                        {formatDateOnly(entry.date, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-warm-500">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    {entry.weight_kg && (
                      <span className="text-warm-700">
                        {entry.weight_kg} kg
                      </span>
                    )}
                    {entry.height_cm && (
                      <span className="text-warm-700">
                        {entry.height_cm} cm
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add measurement modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Log Measurement</CardTitle>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1 hover:bg-warm-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-warm-500" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1.5 block">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-warm-700 mb-1.5 block">
                      Weight (kg)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 12.5"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-warm-700 mb-1.5 block">
                      Height (cm)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 85.0"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1.5 block">
                    Notes (optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Doctor visit checkup"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Saving..." : "Save Measurement"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
