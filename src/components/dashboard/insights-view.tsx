"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Child, AIInsight, ProductRecommendation } from "@/lib/types";
import {
  Sparkles,
  TrendingUp,
  Brain,
  ShoppingBag,
  RefreshCw,
  Gift,
  Star,
} from "lucide-react";

interface InsightsViewProps {
  child: Child;
  insights: AIInsight[];
}

export function InsightsView({ child, insights }: InsightsViewProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function generateInsights() {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId: child.id }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to generate insights:", err);
    }
    setLoading(false);
  }

  const typeIcons = {
    growth: TrendingUp,
    milestone: Brain,
    recommendation: ShoppingBag,
  };

  const typeColors = {
    growth: { bg: "from-sky-50 to-sky-100", text: "text-sky-600", badge: "bg-sky-100 text-sky-700" },
    milestone: { bg: "from-lavender-50 to-lavender-100", text: "text-lavender-600", badge: "bg-lavender-100 text-lavender-700" },
    recommendation: { bg: "from-brand-50 to-brand-100", text: "text-brand-600", badge: "bg-brand-100 text-brand-700" },
  };

  return (
    <div className="py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-warm-900">
            AI Insights
          </h1>
          <p className="text-warm-500 text-sm">
            Personalized guidance for {child.name}&apos;s development
          </p>
        </div>
        <Button onClick={generateInsights} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Get New Insights
            </>
          )}
        </Button>
      </div>

      {/* Info card */}
      <Card className="bg-gradient-to-r from-brand-50 to-lavender-50 border-brand-100">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-brand-500" />
            </div>
            <div>
              <p className="font-display font-semibold text-warm-800 text-sm">
                How AI Insights work
              </p>
              <p className="text-xs text-warm-600 mt-1">
                Our AI analyzes {child.name}&apos;s growth data and milestone
                progress to provide gentle, encouraging insights and
                age-appropriate product suggestions. These are guidance only —
                always consult your pediatrician for medical advice.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights list */}
      {insights.length > 0 ? (
        <div className="space-y-4">
          {insights.map((insight) => {
            const Icon =
              typeIcons[insight.type as keyof typeof typeIcons] || Sparkles;
            const colors =
              typeColors[insight.type as keyof typeof typeColors] ||
              typeColors.recommendation;
            const products = (insight.products as ProductRecommendation[]) || [];

            return (
              <Card key={insight.id}>
                <CardContent className="py-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-semibold text-warm-900">
                          {insight.title}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}
                        >
                          {insight.type}
                        </span>
                      </div>
                      <p className="text-sm text-warm-600 mt-1 leading-relaxed">
                        {insight.content}
                      </p>
                    </div>
                  </div>

                  {/* Product recommendations */}
                  {products.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-warm-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Gift className="w-4 h-4 text-brand-500" />
                        <span className="text-sm font-medium text-warm-700">
                          Recommended products
                        </span>
                      </div>
                      <div className="grid gap-3">
                        {products.map((product, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-warm-50 border border-warm-100"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-sm text-warm-800">
                                  {product.name}
                                </p>
                                <p className="text-xs text-warm-500 mt-0.5">
                                  {product.description}
                                </p>
                              </div>
                              <span className="text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                {product.age_range}
                              </span>
                            </div>
                            <p className="text-xs text-brand-600 mt-2 flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              {product.why_recommended}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-warm-400 mt-3">
                    {new Date(insight.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-brand-400" />
            </div>
            <h3 className="font-display font-semibold text-warm-700 mb-2">
              No insights yet
            </h3>
            <p className="text-sm text-warm-500 mb-4 max-w-sm mx-auto">
              Add some growth measurements and milestones, then click &quot;Get
              New Insights&quot; for personalized AI guidance.
            </p>
            <Button onClick={generateInsights} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate First Insights
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
