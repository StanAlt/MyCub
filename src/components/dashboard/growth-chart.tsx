"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Scatter,
} from "recharts";
import type { GrowthEntry, GrowthPercentile } from "@/lib/types";
import { getAgeInMonths } from "@/lib/utils";

interface GrowthChartProps {
  entries: GrowthEntry[];
  percentileData: GrowthPercentile[];
  metric: "weight" | "height";
  gender: "boy" | "girl";
  birthDate: string;
}

export function GrowthChart({
  entries,
  percentileData,
  metric,
  gender,
  birthDate,
}: GrowthChartProps) {
  // Build the chart data by merging percentile curves with actual measurements
  const chartData = percentileData.map((p) => {
    const entry = entries.find((e) => {
      const entryAge = getAgeInMonths(new Date(birthDate));
      const entryDate = new Date(e.date);
      const birth = new Date(birthDate);
      const months =
        (entryDate.getFullYear() - birth.getFullYear()) * 12 +
        (entryDate.getMonth() - birth.getMonth());
      return Math.abs(months - p.age_months) <= 3;
    });

    const value =
      entry && metric === "weight" ? entry.weight_kg : entry?.height_cm;

    return {
      age: p.age_months,
      ageLabel:
        p.age_months < 24
          ? `${p.age_months}m`
          : `${Math.floor(p.age_months / 12)}y`,
      p3: Math.round(p.p3 * 10) / 10,
      p15: Math.round(p.p15 * 10) / 10,
      p50: Math.round(p.p50 * 10) / 10,
      p85: Math.round(p.p85 * 10) / 10,
      p97: Math.round(p.p97 * 10) / 10,
      actual: value ? Math.round(value * 10) / 10 : undefined,
    };
  });

  // Also add actual data points at their real ages
  const actualPoints = entries
    .filter((e) => (metric === "weight" ? e.weight_kg : e.height_cm))
    .map((e) => {
      const birth = new Date(birthDate);
      const entryDate = new Date(e.date);
      const months =
        (entryDate.getFullYear() - birth.getFullYear()) * 12 +
        (entryDate.getMonth() - birth.getMonth());
      return {
        age: months,
        actual:
          metric === "weight"
            ? Math.round((e.weight_kg || 0) * 10) / 10
            : Math.round((e.height_cm || 0) * 10) / 10,
      };
    });

  // Merge actual points into chart data
  const mergedData = [...chartData];
  actualPoints.forEach((point) => {
    const existing = mergedData.find((d) => d.age === point.age);
    if (existing) {
      existing.actual = point.actual;
    } else {
      // Interpolate percentile values at this age
      const lower = chartData.filter((d) => d.age <= point.age).pop();
      const upper = chartData.find((d) => d.age > point.age);
      if (lower && upper) {
        const ratio = (point.age - lower.age) / (upper.age - lower.age);
        mergedData.push({
          age: point.age,
          ageLabel:
            point.age < 24
              ? `${point.age}m`
              : `${Math.floor(point.age / 12)}y`,
          p3: Math.round((lower.p3 + (upper.p3 - lower.p3) * ratio) * 10) / 10,
          p15: Math.round((lower.p15 + (upper.p15 - lower.p15) * ratio) * 10) / 10,
          p50: Math.round((lower.p50 + (upper.p50 - lower.p50) * ratio) * 10) / 10,
          p85: Math.round((lower.p85 + (upper.p85 - lower.p85) * ratio) * 10) / 10,
          p97: Math.round((lower.p97 + (upper.p97 - lower.p97) * ratio) * 10) / 10,
          actual: point.actual,
        });
      }
    }
  });

  mergedData.sort((a, b) => a.age - b.age);

  const unit = metric === "weight" ? "kg" : "cm";
  const accentColor = gender === "boy" ? "#0ea5e9" : "#ff6b3d";

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={mergedData}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradientP97" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fecaca" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#fecaca" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientP85" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffb088" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ffb088" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientP50" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a6d0a8" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#a6d0a8" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f7e3c4"
            vertical={false}
          />
          <XAxis
            dataKey="ageLabel"
            tick={{ fontSize: 12, fill: "#875932" }}
            tickLine={false}
            axisLine={{ stroke: "#f1d0a0" }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#875932" }}
            tickLine={false}
            axisLine={false}
            unit={` ${unit}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #fbf0de",
              borderRadius: "1rem",
              boxShadow: "0 2px 15px -3px rgba(0,0,0,0.07)",
              fontSize: "0.875rem",
            }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                p97: "97th percentile",
                p85: "85th percentile",
                p50: "50th (average)",
                p15: "15th percentile",
                p3: "3rd percentile",
                actual: `${metric === "weight" ? "Weight" : "Height"}`,
              };
              return [`${value} ${unit}`, labels[name] || name];
            }}
            labelFormatter={(label) => `Age: ${label}`}
          />

          {/* Percentile bands */}
          <Area
            type="monotone"
            dataKey="p97"
            stroke="#fca5a5"
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="none"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="p85"
            stroke="#ffb088"
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="none"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="p50"
            stroke="#78b57c"
            strokeWidth={2}
            fill="url(#gradientP50)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="p15"
            stroke="#7dd3fc"
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="none"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="p3"
            stroke="#bae6fd"
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="none"
            dot={false}
          />

          {/* Child's actual data */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke={accentColor}
            strokeWidth={3}
            dot={{
              fill: accentColor,
              stroke: "white",
              strokeWidth: 2,
              r: 5,
            }}
            activeDot={{
              fill: accentColor,
              stroke: "white",
              strokeWidth: 2,
              r: 7,
            }}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
