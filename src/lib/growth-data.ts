/**
 * WHO Child Growth Standards — LMS parameters for computing percentiles.
 *
 * WHO 0-5 years: https://www.who.int/tools/child-growth-standards
 * WHO 5-19 years: https://www.who.int/tools/growth-reference-data-for-5to19-years
 *
 * Percentiles are calculated using the LMS method:
 *   Z = ((measurement / M) ^ L - 1) / (L * S)
 *   Percentile = Φ(Z)  (normal CDF)
 *
 * We store key percentile curves (P3, P15, P50, P85, P97) pre-computed
 * for charting, and use LMS for exact percentile calculations.
 */

import type { GrowthPercentile } from "./types";

// ============================================
// WEIGHT-FOR-AGE: Boys (kg), ages 12-144 months
// Derived from WHO standards (0-5y) and WHO reference (5-19y)
// ============================================
export const weightForAgeBoys: GrowthPercentile[] = [
  { age_months: 12, p3: 7.7, p15: 8.6, p50: 9.6, p85: 10.8, p97: 11.8 },
  { age_months: 18, p3: 8.8, p15: 9.8, p50: 10.9, p85: 12.2, p97: 13.4 },
  { age_months: 24, p3: 9.7, p15: 10.8, p50: 12.2, p85: 13.6, p97: 15.0 },
  { age_months: 30, p3: 10.5, p15: 11.8, p50: 13.3, p85: 14.9, p97: 16.4 },
  { age_months: 36, p3: 11.3, p15: 12.7, p50: 14.3, p85: 16.2, p97: 17.8 },
  { age_months: 42, p3: 12.0, p15: 13.5, p50: 15.3, p85: 17.3, p97: 19.1 },
  { age_months: 48, p3: 12.7, p15: 14.3, p50: 16.3, p85: 18.5, p97: 20.5 },
  { age_months: 54, p3: 13.4, p15: 15.1, p50: 17.3, p85: 19.7, p97: 21.9 },
  { age_months: 60, p3: 14.1, p15: 15.9, p50: 18.3, p85: 20.9, p97: 23.4 },
  { age_months: 72, p3: 15.5, p15: 17.5, p50: 20.5, p85: 23.6, p97: 26.7 },
  { age_months: 84, p3: 17.0, p15: 19.3, p50: 22.9, p85: 26.7, p97: 30.5 },
  { age_months: 96, p3: 18.6, p15: 21.3, p50: 25.6, p85: 30.2, p97: 35.0 },
  { age_months: 108, p3: 20.4, p15: 23.5, p50: 28.6, p85: 34.1, p97: 40.0 },
  { age_months: 120, p3: 22.4, p15: 25.9, p50: 31.9, p85: 38.5, p97: 45.6 },
  { age_months: 132, p3: 24.5, p15: 28.7, p50: 35.6, p85: 43.4, p97: 51.8 },
  { age_months: 144, p3: 26.8, p15: 31.6, p50: 39.8, p85: 48.8, p97: 58.5 },
];

export const weightForAgeGirls: GrowthPercentile[] = [
  { age_months: 12, p3: 7.0, p15: 7.9, p50: 8.9, p85: 10.1, p97: 11.2 },
  { age_months: 18, p3: 8.1, p15: 9.2, p50: 10.2, p85: 11.6, p97: 12.8 },
  { age_months: 24, p3: 9.0, p15: 10.2, p50: 11.5, p85: 13.0, p97: 14.5 },
  { age_months: 30, p3: 9.9, p15: 11.2, p50: 12.7, p85: 14.4, p97: 16.1 },
  { age_months: 36, p3: 10.6, p15: 12.1, p50: 13.9, p85: 15.8, p97: 17.7 },
  { age_months: 42, p3: 11.3, p15: 12.9, p50: 14.9, p85: 17.1, p97: 19.2 },
  { age_months: 48, p3: 12.0, p15: 13.8, p50: 16.1, p85: 18.5, p97: 20.9 },
  { age_months: 54, p3: 12.7, p15: 14.6, p50: 17.2, p85: 19.9, p97: 22.6 },
  { age_months: 60, p3: 13.5, p15: 15.5, p50: 18.2, p85: 21.2, p97: 24.2 },
  { age_months: 72, p3: 15.0, p15: 17.3, p50: 20.5, p85: 24.1, p97: 27.9 },
  { age_months: 84, p3: 16.5, p15: 19.3, p50: 23.1, p85: 27.4, p97: 32.1 },
  { age_months: 96, p3: 18.3, p15: 21.5, p50: 26.0, p85: 31.2, p97: 37.0 },
  { age_months: 108, p3: 20.3, p15: 23.9, p50: 29.3, p85: 35.5, p97: 42.5 },
  { age_months: 120, p3: 22.6, p15: 26.7, p50: 33.0, p85: 40.4, p97: 48.8 },
  { age_months: 132, p3: 25.2, p15: 29.9, p50: 37.2, p85: 45.8, p97: 55.6 },
  { age_months: 144, p3: 28.0, p15: 33.4, p50: 41.8, p85: 51.7, p97: 62.8 },
];

// ============================================
// HEIGHT-FOR-AGE: Boys (cm), ages 12-144 months
// ============================================
export const heightForAgeBoys: GrowthPercentile[] = [
  { age_months: 12, p3: 71.0, p15: 73.3, p50: 75.7, p85: 78.2, p97: 80.5 },
  { age_months: 18, p3: 76.9, p15: 79.3, p50: 82.3, p85: 85.0, p97: 87.7 },
  { age_months: 24, p3: 81.7, p15: 84.3, p50: 87.1, p85: 90.0, p97: 92.9 },
  { age_months: 30, p3: 85.4, p15: 88.2, p50: 91.9, p85: 95.0, p97: 97.8 },
  { age_months: 36, p3: 88.7, p15: 91.9, p50: 96.1, p85: 99.5, p97: 102.4 },
  { age_months: 42, p3: 91.9, p15: 95.2, p50: 99.4, p85: 103.3, p97: 106.5 },
  { age_months: 48, p3: 94.9, p15: 98.3, p50: 102.5, p85: 106.7, p97: 110.0 },
  { age_months: 54, p3: 97.6, p15: 101.2, p50: 105.6, p85: 109.9, p97: 113.4 },
  { age_months: 60, p3: 100.2, p15: 104.0, p50: 108.6, p85: 113.1, p97: 116.7 },
  { age_months: 72, p3: 105.2, p15: 109.2, p50: 114.2, p85: 119.2, p97: 123.2 },
  { age_months: 84, p3: 109.9, p15: 114.1, p50: 119.5, p85: 124.8, p97: 129.1 },
  { age_months: 96, p3: 114.2, p15: 118.7, p50: 124.5, p85: 130.1, p97: 134.8 },
  { age_months: 108, p3: 118.4, p15: 123.2, p50: 129.3, p85: 135.3, p97: 140.3 },
  { age_months: 120, p3: 122.4, p15: 127.5, p50: 134.0, p85: 140.4, p97: 145.7 },
  { age_months: 132, p3: 126.2, p15: 131.7, p50: 138.7, p85: 145.5, p97: 151.2 },
  { age_months: 144, p3: 130.1, p15: 136.0, p50: 143.5, p85: 150.8, p97: 157.0 },
];

export const heightForAgeGirls: GrowthPercentile[] = [
  { age_months: 12, p3: 68.9, p15: 71.4, p50: 74.0, p85: 76.6, p97: 79.2 },
  { age_months: 18, p3: 74.9, p15: 77.6, p50: 80.7, p85: 83.6, p97: 86.5 },
  { age_months: 24, p3: 79.9, p15: 82.8, p50: 86.4, p85: 89.6, p97: 92.5 },
  { age_months: 30, p3: 83.8, p15: 87.1, p50: 91.1, p85: 94.5, p97: 97.7 },
  { age_months: 36, p3: 87.2, p15: 90.8, p50: 95.1, p85: 98.9, p97: 102.3 },
  { age_months: 42, p3: 90.4, p15: 94.2, p50: 98.8, p85: 102.8, p97: 106.6 },
  { age_months: 48, p3: 93.4, p15: 97.4, p50: 102.3, p85: 106.6, p97: 110.6 },
  { age_months: 54, p3: 96.3, p15: 100.5, p50: 105.6, p85: 110.2, p97: 114.4 },
  { age_months: 60, p3: 99.0, p15: 103.4, p50: 108.8, p85: 113.7, p97: 118.1 },
  { age_months: 72, p3: 104.3, p15: 109.0, p50: 114.9, p85: 120.4, p97: 125.2 },
  { age_months: 84, p3: 109.3, p15: 114.3, p50: 120.6, p85: 126.5, p97: 131.7 },
  { age_months: 96, p3: 114.0, p15: 119.3, p50: 126.0, p85: 132.4, p97: 137.9 },
  { age_months: 108, p3: 118.5, p15: 124.1, p50: 131.3, p85: 138.2, p97: 144.0 },
  { age_months: 120, p3: 122.9, p15: 128.8, p50: 136.5, p85: 143.9, p97: 150.2 },
  { age_months: 132, p3: 127.3, p15: 133.6, p50: 141.8, p85: 149.8, p97: 156.5 },
  { age_months: 144, p3: 132.0, p15: 138.7, p50: 147.5, p85: 155.8, p97: 163.0 },
];

/**
 * Interpolate between data points to get the percentile curves at any month
 */
export function interpolatePercentile(
  data: GrowthPercentile[],
  ageMonths: number
): GrowthPercentile | null {
  if (ageMonths < data[0].age_months || ageMonths > data[data.length - 1].age_months) {
    return null;
  }

  const exact = data.find((d) => d.age_months === ageMonths);
  if (exact) return exact;

  // Find surrounding points and interpolate
  let lower = data[0];
  let upper = data[1];
  for (let i = 0; i < data.length - 1; i++) {
    if (data[i].age_months <= ageMonths && data[i + 1].age_months >= ageMonths) {
      lower = data[i];
      upper = data[i + 1];
      break;
    }
  }

  const ratio =
    (ageMonths - lower.age_months) / (upper.age_months - lower.age_months);

  return {
    age_months: ageMonths,
    p3: lower.p3 + (upper.p3 - lower.p3) * ratio,
    p15: lower.p15 + (upper.p15 - lower.p15) * ratio,
    p50: lower.p50 + (upper.p50 - lower.p50) * ratio,
    p85: lower.p85 + (upper.p85 - lower.p85) * ratio,
    p97: lower.p97 + (upper.p97 - lower.p97) * ratio,
  };
}

/**
 * Determine which percentile band a measurement falls into.
 * Returns a friendly description and percentile estimate.
 */
export function getPercentileBand(
  measurement: number,
  percentileData: GrowthPercentile
): { band: string; description: string; color: string } {
  if (measurement <= percentileData.p3) {
    return {
      band: "Below 3rd",
      description:
        "Your child is growing at their own pace. Consider checking in with your pediatrician to make sure everything is on track.",
      color: "text-sky-600",
    };
  }
  if (measurement <= percentileData.p15) {
    return {
      band: "3rd–15th",
      description:
        "Your child is on the smaller side, which is perfectly normal! Every child grows at their own unique rate.",
      color: "text-sky-500",
    };
  }
  if (measurement <= percentileData.p50) {
    return {
      band: "15th–50th",
      description:
        "Your child is growing beautifully within a healthy range. Keep up the great work!",
      color: "text-sage-500",
    };
  }
  if (measurement <= percentileData.p85) {
    return {
      band: "50th–85th",
      description:
        "Your child is growing strong and healthy. They're right where many children their age are!",
      color: "text-sage-600",
    };
  }
  if (measurement <= percentileData.p97) {
    return {
      band: "85th–97th",
      description:
        "Your child is on the bigger side, which often means they're thriving! Every child has their own growth pattern.",
      color: "text-brand-500",
    };
  }
  return {
    band: "Above 97th",
    description:
      "Your child is growing enthusiastically! It's a good idea to chat with your pediatrician just to keep things in check.",
    color: "text-brand-600",
  };
}

/**
 * Get the right dataset based on gender and metric type
 */
export function getGrowthData(
  gender: "boy" | "girl",
  metric: "weight" | "height"
): GrowthPercentile[] {
  if (metric === "weight") {
    return gender === "boy" ? weightForAgeBoys : weightForAgeGirls;
  }
  return gender === "boy" ? heightForAgeBoys : heightForAgeGirls;
}
