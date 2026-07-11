"use client";

import type { Child, GrowthEntry, Milestone } from "@/lib/types";
import { formatDateOnly, getAgeString, parseDateOnly } from "@/lib/utils";
import { Check, FileText, Printer, Ruler, Scale, Sparkles } from "lucide-react";

export function ReportView({ child, entries, milestones }: { child: Child; entries: GrowthEntry[]; milestones: Milestone[] }) {
  const latest = entries.at(-1);
  const first = entries[0];
  const achieved = milestones.filter((item) => item.achieved_at);
  const generated = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return (
    <div className="report-page">
      <div className="report-toolbar">
        <div><span className="workspace-kicker">REPORTS</span><h1>Growth & progress summary</h1><p>A clear, shareable view for family records and care conversations.</p></div>
        <button className="app-button primary" onClick={() => window.print()}><Printer /> Print or save PDF</button>
      </div>
      <article className="report-paper">
        <header className="report-cover">
          <div className="brand"><span><FileText /></span>mycub report</div>
          <div className="report-child"><div className="report-avatar">{child.name[0]}</div><div><small>CHILD PROGRESS SUMMARY</small><h2>{child.name}</h2><p>{getAgeString(parseDateOnly(child.birth_date))} · Generated {generated}</p></div></div>
          <div className="report-badge"><Sparkles /> A record of becoming</div>
        </header>
        <section className="report-metrics">
          <div><Scale /><span>Latest weight</span><strong>{latest?.weight_kg ?? "—"} <small>kg</small></strong><p>{first?.weight_kg && latest?.weight_kg ? `${(Number(latest.weight_kg)-Number(first.weight_kg)).toFixed(1)} kg change across the record` : "Add more entries for a trend"}</p></div>
          <div><Ruler /><span>Latest length</span><strong>{latest?.height_cm ?? "—"} <small>cm</small></strong><p>{first?.height_cm && latest?.height_cm ? `${(Number(latest.height_cm)-Number(first.height_cm)).toFixed(1)} cm change across the record` : "Add more entries for a trend"}</p></div>
          <div><Check /><span>Milestones saved</span><strong>{achieved.length}</strong><p>{milestones.length - achieved.length} currently being explored</p></div>
        </section>
        <section className="report-section">
          <div className="report-title"><span>MEASUREMENT HISTORY</span><h3>Recorded growth</h3></div>
          {entries.length ? <div className="report-table"><div className="report-row head"><span>Date</span><span>Weight</span><span>Length</span><span>Head</span></div>{entries.slice(-8).reverse().map((entry) => <div className="report-row" key={entry.id}><span>{formatDateOnly(entry.date)}</span><span>{entry.weight_kg ? `${entry.weight_kg} kg` : "—"}</span><span>{entry.height_cm ? `${entry.height_cm} cm` : "—"}</span><span>{entry.head_circumference_cm ? `${entry.head_circumference_cm} cm` : "—"}</span></div>)}</div> : <p className="report-empty">No measurements have been recorded yet.</p>}
        </section>
        <section className="report-section">
          <div className="report-title"><span>DEVELOPMENT STORY</span><h3>Recent milestones</h3></div>
          <div className="report-milestones">{achieved.slice(0,6).map((item) => <div key={item.id}><i><Check /></i><div><strong>{item.title}</strong><p>{item.description || item.category.replace("_"," ")}</p><small>{item.achieved_at ? formatDateOnly(item.achieved_at) : ""}</small></div></div>)}{!achieved.length ? <p className="report-empty">No completed milestones have been saved yet.</p> : null}</div>
        </section>
        <footer className="report-disclaimer"><strong>For your records</strong><p>MyCub helps families organize observations. It does not diagnose conditions or replace guidance from a qualified healthcare professional.</p></footer>
      </article>
    </div>
  );
}
