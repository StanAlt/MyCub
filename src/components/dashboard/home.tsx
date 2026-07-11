import Link from "next/link";
import type { Child, GrowthEntry, Milestone, AIInsight } from "@/lib/types";
import { formatDateOnly, getAgeString, parseDateOnly } from "@/lib/utils";
import { ArrowRight, BookHeart, CalendarDays, Check, FileText, Plus, Ruler, Scale, Sparkles, TrendingUp } from "lucide-react";

interface Props {
  child: Child;
  allChildren: Child[];
  growthEntries: GrowthEntry[];
  recentMilestones: Milestone[];
  recentInsights: AIInsight[];
}

function delta(entries: GrowthEntry[], key: "weight_kg" | "height_cm") {
  const values = entries.filter((entry) => entry[key] != null);
  if (values.length < 2) return null;
  return Number(values.at(-1)![key]) - Number(values.at(-2)![key]);
}

function chartPoints(entries: GrowthEntry[]) {
  const values = entries.filter((entry) => entry.height_cm).slice(-8);
  if (!values.length) return "12,120 88,112 164,95 240,82 316,69 392,48 468,40 544,24";
  const nums = values.map((entry) => Number(entry.height_cm));
  const min = Math.min(...nums) - 1;
  const max = Math.max(...nums) + 1;
  return nums.map((value, index) => {
    const x = values.length === 1 ? 270 : 12 + index * (532 / (values.length - 1));
    const y = 130 - ((value - min) / Math.max(max - min, 1)) * 105;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

export function DashboardHome({ child, allChildren, growthEntries, recentMilestones, recentInsights }: Props) {
  const latest = growthEntries.at(-1);
  const weightDelta = delta(growthEntries, "weight_kg");
  const heightDelta = delta(growthEntries, "height_cm");
  const achieved = recentMilestones.filter((milestone) => milestone.achieved_at);
  const points = chartPoints(growthEntries);
  const childQuery = `?child=${child.id}`;
  const lastDate = latest ? formatDateOnly(latest.date, { month: "short", day: "numeric" }) : "Not yet";

  return (
    <div className="dashboard-overview">
      <section className="overview-heading">
        <div>
          <span className="workspace-kicker">OVERVIEW · {getAgeString(parseDateOnly(child.birth_date)).toUpperCase()}</span>
          <h1>{child.name} is <em>growing beautifully.</em></h1>
          <p>A calm view of the measurements, moments, and changes you have recorded together.</p>
        </div>
        <div className="heading-actions">
          <Link href={`/dashboard/growth${childQuery}`} className="app-button primary"><Plus /> Log measurement</Link>
          <Link href={`/dashboard/reports${childQuery}`} className="app-button secondary"><FileText /> Open report</Link>
        </div>
      </section>

      {allChildren.length > 1 ? <div className="child-pills">{allChildren.map((item) => <Link className={item.id === child.id ? "active" : ""} href={`/dashboard?child=${item.id}`} key={item.id}><span>{item.name[0]}</span>{item.name}</Link>)}</div> : null}

      <section className="metric-grid">
        <article><div className="metric-icon lavender"><Scale /></div><span>LATEST WEIGHT</span><strong>{latest?.weight_kg ?? "—"} <small>{latest?.weight_kg ? "kg" : ""}</small></strong><p>{weightDelta == null ? "Add another entry to see change" : <><TrendingUp /> {weightDelta >= 0 ? "+" : ""}{weightDelta.toFixed(1)} kg since last entry</>}</p></article>
        <article><div className="metric-icon mint"><Ruler /></div><span>LATEST LENGTH</span><strong>{latest?.height_cm ?? "—"} <small>{latest?.height_cm ? "cm" : ""}</small></strong><p>{heightDelta == null ? "Your trend will appear here" : <><TrendingUp /> {heightDelta >= 0 ? "+" : ""}{heightDelta.toFixed(1)} cm since last entry</>}</p></article>
        <article><div className="metric-icon apricot"><Sparkles /></div><span>MILESTONES</span><strong>{achieved.length} <small>saved</small></strong><p><Check /> {recentMilestones.length - achieved.length} still exploring</p></article>
        <article><div className="metric-icon blue"><CalendarDays /></div><span>LAST CHECK-IN</span><strong className="date-value">{lastDate}</strong><p>{growthEntries.length} measurements recorded</p></article>
      </section>

      <section className="overview-grid">
        <article className="trend-card">
          <header><div><span>GROWTH TREND</span><h2>Length over time</h2></div><Link href={`/dashboard/growth${childQuery}`}>View detailed chart <ArrowRight /></Link></header>
          <div className="trend-chart">
            <div className="chart-axis"><span>Higher</span><span>Middle</span><span>Start</span></div>
            <svg viewBox="0 0 560 150" role="img" aria-label={`${child.name}'s length trend`}>
              <defs><linearGradient id="overviewFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6978eb" stopOpacity=".28"/><stop offset="1" stopColor="#6978eb" stopOpacity="0"/></linearGradient></defs>
              <polyline points={`12,142 ${points} 544,142`} fill="url(#overviewFill)" stroke="none"/>
              <polyline points={points} fill="none" stroke="#6978eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              {points.split(" ").map((point) => { const [cx,cy] = point.split(","); return <circle key={point} cx={cx} cy={cy} r="5" fill="#fff" stroke="#6978eb" strokeWidth="3"/>; })}
            </svg>
          </div>
          <footer><span>First entry</span><span>{latest ? `Latest · ${lastDate}` : "Add the first measurement"}</span></footer>
        </article>

        <article className="story-card">
          <header><div><span>RECENT STORY</span><h2>Moments to remember</h2></div><BookHeart /></header>
          <div className="story-list">
            {achieved.slice(0, 3).map((milestone) => <div key={milestone.id}><i><Check /></i><div><strong>{milestone.title}</strong><small>{milestone.achieved_at ? formatDateOnly(milestone.achieved_at,{month:"long",day:"numeric"}) : "Recently"}</small></div></div>)}
            {!achieved.length ? <div className="empty-story"><i><Sparkles /></i><div><strong>The next first is waiting</strong><small>Save a milestone when it happens.</small></div></div> : null}
          </div>
          <Link href={`/dashboard/milestones${childQuery}`} className="story-link">See all milestones <ArrowRight /></Link>
        </article>
      </section>

      <section className="gentle-note"><Sparkles /><div><span>MYCUB NOTE</span><strong>{recentInsights[0]?.title || "Trends matter more than a single number."}</strong><p>{recentInsights[0]?.content || "Growth rarely follows a perfectly straight line. Keep recording consistently and bring questions to your child’s care team."}</p></div></section>
    </div>
  );
}
