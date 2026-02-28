/**
 * Developmental milestones based on CDC "Learn the Signs. Act Early" guidelines.
 * https://www.cdc.gov/act-early/milestones/index.html
 *
 * Updated per 2022 CDC revisions — milestones reflect what 75% or more
 * of children at that age can do.
 *
 * For ages 6-12 we use general developmental expectations from pediatric
 * literature, as the CDC checklist focuses primarily on birth-5.
 */

export interface MilestoneTemplate {
  category: "motor" | "language" | "cognitive" | "social" | "self_care";
  title: string;
  description: string;
  expected_age_months: number;
}

export const milestoneTemplates: MilestoneTemplate[] = [
  // ============ 12 months ============
  { category: "motor", title: "Pulls up to stand", description: "Uses furniture or people to pull themselves to a standing position", expected_age_months: 12 },
  { category: "motor", title: "Walks holding on to furniture", description: "Cruises along furniture while holding on for support", expected_age_months: 12 },
  { category: "language", title: "Waves bye-bye", description: "Waves goodbye on their own without copying you", expected_age_months: 12 },
  { category: "language", title: "Calls a parent mama or dada", description: "Uses mama or dada specifically for the right parent", expected_age_months: 12 },
  { category: "cognitive", title: "Puts things in a container", description: "Drops toys or objects into a cup or container", expected_age_months: 12 },
  { category: "social", title: "Plays pat-a-cake", description: "Engages in simple interactive games like pat-a-cake", expected_age_months: 12 },

  // ============ 15 months ============
  { category: "motor", title: "Takes a few steps on their own", description: "Walks independently without holding on", expected_age_months: 15 },
  { category: "language", title: "Says 1-2 words besides mama/dada", description: "Uses at least one word meaningfully", expected_age_months: 15 },
  { category: "cognitive", title: "Looks at familiar object when named", description: "Turns to look at a ball, cup, or other object when you name it", expected_age_months: 15 },
  { category: "social", title: "Copies other children while playing", description: "Watches and imitates what other children do", expected_age_months: 15 },
  { category: "self_care", title: "Helps with getting dressed", description: "Pushes arm through sleeve or lifts foot for shoes", expected_age_months: 15 },

  // ============ 18 months ============
  { category: "motor", title: "Walks without holding on to anything", description: "Walks independently and confidently", expected_age_months: 18 },
  { category: "language", title: "Says 3 or more words", description: "Uses several words besides mama and dada", expected_age_months: 18 },
  { category: "language", title: "Points to show you something interesting", description: "Points at things to share interest, not just to ask for something", expected_age_months: 18 },
  { category: "cognitive", title: "Copies you doing chores", description: "Tries to help sweep, wipe, or do other household tasks", expected_age_months: 18 },
  { category: "social", title: "Shows you something by holding it out", description: "Brings toys or objects to show you", expected_age_months: 18 },

  // ============ 24 months ============
  { category: "motor", title: "Kicks a ball", description: "Walks up to a ball and kicks it forward", expected_age_months: 24 },
  { category: "motor", title: "Runs", description: "Runs, though may fall sometimes", expected_age_months: 24 },
  { category: "language", title: "Says two words together", description: "Puts two words together like 'more milk' or 'no bath'", expected_age_months: 24 },
  { category: "language", title: "Points to at least 2 body parts", description: "Can point to nose, eyes, tummy, etc. when asked", expected_age_months: 24 },
  { category: "cognitive", title: "Plays with more than one toy at a time", description: "Uses a spoon to feed a doll, puts blocks in a truck, etc.", expected_age_months: 24 },
  { category: "self_care", title: "Eats with a spoon", description: "Scoops food with a spoon and brings it to mouth", expected_age_months: 24 },

  // ============ 36 months ============
  { category: "motor", title: "Strings items together", description: "Can thread large beads onto a string", expected_age_months: 36 },
  { category: "motor", title: "Pedals a tricycle", description: "Can make a three-wheel bike move with pedals", expected_age_months: 36 },
  { category: "language", title: "Has a conversation with 2-3 exchanges", description: "Can go back and forth in a simple conversation", expected_age_months: 36 },
  { category: "language", title: "Asks who, what, where questions", description: "Shows curiosity by asking questions", expected_age_months: 36 },
  { category: "cognitive", title: "Draws a circle", description: "Can copy or draw a circle after being shown how", expected_age_months: 36 },
  { category: "social", title: "Notices other children and joins them to play", description: "Shows interest in playing with peers", expected_age_months: 36 },
  { category: "self_care", title: "Puts on some clothes alone", description: "Can put on loose-fitting pants or a jacket", expected_age_months: 36 },

  // ============ 48 months ============
  { category: "motor", title: "Catches a large ball most of the time", description: "Catches a ball thrown from a few feet away", expected_age_months: 48 },
  { category: "motor", title: "Hops on one foot", description: "Can hop on one foot without losing balance", expected_age_months: 48 },
  { category: "language", title: "Says sentences with 4+ words", description: "Speaks in longer, more complex sentences", expected_age_months: 48 },
  { category: "language", title: "Says some words from a favorite song or story", description: "Remembers and recites parts of songs or books", expected_age_months: 48 },
  { category: "cognitive", title: "Names a few colors", description: "Can identify and name at least 3-4 colors correctly", expected_age_months: 48 },
  { category: "cognitive", title: "Tells what comes next in a known story", description: "Can predict or recall what happens in a familiar story", expected_age_months: 48 },
  { category: "social", title: "Pretends to be something else during play", description: "Engages in imaginative play, like being a superhero or doctor", expected_age_months: 48 },

  // ============ 60 months ============
  { category: "motor", title: "Buttons some buttons", description: "Can fasten buttons on clothing independently", expected_age_months: 60 },
  { category: "motor", title: "Hops on one foot", description: "Can hop several times on one foot", expected_age_months: 60 },
  { category: "language", title: "Tells a story they heard or made up", description: "Can narrate a simple story with a beginning and end", expected_age_months: 60 },
  { category: "language", title: "Answers simple questions about a story", description: "Can answer who, what, and where questions about a story read to them", expected_age_months: 60 },
  { category: "cognitive", title: "Counts to 10", description: "Can count objects or recite numbers to 10", expected_age_months: 60 },
  { category: "cognitive", title: "Writes some letters in their name", description: "Can write or attempt to write some letters", expected_age_months: 60 },
  { category: "social", title: "Follows rules and takes turns when playing with others", description: "Understands turn-taking and game rules", expected_age_months: 60 },

  // ============ 72 months (6 years) ============
  { category: "motor", title: "Can ride a bicycle with training wheels", description: "Balances and pedals on a two-wheel bike with stabilizers", expected_age_months: 72 },
  { category: "language", title: "Uses complete sentences of 5+ words", description: "Speaks clearly in full sentences most of the time", expected_age_months: 72 },
  { category: "cognitive", title: "Understands the concept of numbers and counting", description: "Can count groups of objects and understands more/less", expected_age_months: 72 },
  { category: "cognitive", title: "Knows left from right", description: "Can identify left and right sides", expected_age_months: 72 },
  { category: "social", title: "Wants to please friends", description: "Actively tries to make friends happy and be liked", expected_age_months: 72 },
  { category: "self_care", title: "Dresses and undresses without much help", description: "Gets dressed independently including zippers and most buttons", expected_age_months: 72 },

  // ============ 96 months (8 years) ============
  { category: "motor", title: "Can ride a bicycle without training wheels", description: "Balances and rides independently", expected_age_months: 96 },
  { category: "language", title: "Reads age-appropriate books independently", description: "Can read and comprehend short chapter books", expected_age_months: 96 },
  { category: "cognitive", title: "Understands the concept of time", description: "Can read a clock and understand days, weeks, months", expected_age_months: 96 },
  { category: "social", title: "Develops close friendships", description: "Has best friends and understands social relationships", expected_age_months: 96 },
  { category: "social", title: "Shows growing independence from family", description: "Wants to do more things with friends than family", expected_age_months: 96 },
  { category: "self_care", title: "Takes care of personal hygiene independently", description: "Brushes teeth, bathes, and grooms with minimal supervision", expected_age_months: 96 },

  // ============ 120 months (10 years) ============
  { category: "cognitive", title: "Can plan ahead and think about consequences", description: "Beginning to understand cause and effect in social situations", expected_age_months: 120 },
  { category: "cognitive", title: "Understands abstract concepts", description: "Can grasp ideas like fairness, justice, and empathy", expected_age_months: 120 },
  { category: "social", title: "Strong sense of right and wrong", description: "Understands moral concepts and stands up for what's right", expected_age_months: 120 },
  { category: "social", title: "Increasing peer influence", description: "Friends become increasingly important in decision-making", expected_age_months: 120 },
  { category: "self_care", title: "Manages school supplies and homework independently", description: "Organizes and completes assignments with minimal help", expected_age_months: 120 },

  // ============ 144 months (12 years) ============
  { category: "cognitive", title: "Abstract and logical thinking", description: "Can reason about hypothetical situations and use logic", expected_age_months: 144 },
  { category: "social", title: "Developing own identity and values", description: "Forming personal opinions, interests, and values", expected_age_months: 144 },
  { category: "social", title: "Navigates complex social situations", description: "Handles peer pressure and multi-person social dynamics", expected_age_months: 144 },
  { category: "self_care", title: "Takes responsibility for personal tasks", description: "Manages schedule, chores, and personal responsibilities", expected_age_months: 144 },
];

/**
 * Get milestones relevant to a child's age (current + next 6 months)
 */
export function getMilestonesForAge(ageMonths: number): MilestoneTemplate[] {
  return milestoneTemplates.filter(
    (m) =>
      m.expected_age_months <= ageMonths + 6 &&
      m.expected_age_months >= ageMonths - 12
  );
}

/**
 * Get milestone category info
 */
export function getCategoryInfo(category: string) {
  const info: Record<string, { label: string; color: string; bgColor: string }> = {
    motor: { label: "Motor Skills", color: "text-sky-600", bgColor: "bg-sky-100" },
    language: { label: "Language", color: "text-brand-600", bgColor: "bg-brand-100" },
    cognitive: { label: "Cognitive", color: "text-lavender-600", bgColor: "bg-lavender-100" },
    social: { label: "Social & Emotional", color: "text-sage-600", bgColor: "bg-sage-100" },
    self_care: { label: "Self-Care", color: "text-warm-700", bgColor: "bg-warm-200" },
  };
  return info[category] || { label: category, color: "text-warm-600", bgColor: "bg-warm-100" };
}
