export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Child {
  id: string;
  user_id: string;
  family_id?: string;
  name: string;
  birth_date: string;
  gender: "boy" | "girl";
  photo_url?: string;
  theme_color?: string;
  created_at: string;
}

export interface GrowthEntry {
  id: string;
  child_id: string;
  date: string;
  weight_kg?: number;
  height_cm?: number;
  head_circumference_cm?: number;
  notes?: string;
  created_at: string;
}

export interface Photo {
  id: string;
  child_id: string;
  url: string;
  storage_path?: string;
  caption?: string;
  tags: string[];
  taken_at: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  child_id: string;
  category: MilestoneCategory;
  title: string;
  description?: string;
  achieved_at?: string;
  expected_age_months: number;
  notes?: string;
  created_at: string;
}

export type MilestoneCategory =
  | "motor"
  | "language"
  | "cognitive"
  | "social"
  | "self_care";

export interface AIInsight {
  id: string;
  child_id: string;
  type: "growth" | "milestone" | "recommendation";
  title: string;
  content: string;
  products?: ProductRecommendation[];
  created_at: string;
}

export interface ProductRecommendation {
  name: string;
  description: string;
  category: string;
  age_range: string;
  why_recommended: string;
}

export interface GrowthPercentile {
  age_months: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
}
