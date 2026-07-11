"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Baby, BarChart3, Check, Heart, LineChart, LockKeyhole, Ruler, Sparkles, Stars, Users } from "lucide-react";

const features = [
  [LineChart, "Growth, made visible", "Follow weight, length, height, and head circumference with calm, legible trend and percentile views."],
  [Stars, "A living timeline", "Keep measurements, moments, notes, and milestones together—ready whenever a pediatrician asks."],
  [Users, "Built for families", "One shared family space for every child, securely protected for the people who help them grow."],
] as const;

function GrowthOrbit() {
  const reduced = useReducedMotion();
  return (
    <div className="growth-orbit" aria-label="A preview of a child’s growth journey">
      <div className="orbit-glow" /><div className="orbit-ring one" /><div className="orbit-ring two" />
      <motion.div className="orbit-card left" animate={reduced ? undefined : { y: [0,-10,0], rotate: [-4,-2,-4] }} transition={{duration:5,repeat:Infinity}}>
        <span>TODAY</span><strong>71.2 cm</strong><small>Steady growth</small>
      </motion.div>
      <motion.div className="orbit-core" animate={reduced ? undefined : { rotateY:[0,12,0,-12,0], rotateX:[0,-4,0,4,0] }} transition={{duration:10,repeat:Infinity}}>
        <div className="cub-face"><i className="ear l"/><i className="ear r"/><i className="eye l"/><i className="eye r"/><i className="nose"/></div>
        <span>MILA’S WORLD</span><strong>18 months</strong><div className="progress"><i/></div><small>Growing beautifully</small>
      </motion.div>
      <motion.div className="orbit-card right" animate={reduced ? undefined : { y:[0,9,0], rotate:[5,3,5] }} transition={{duration:6,repeat:Infinity}}>
        <Heart fill="currentColor"/><strong>First steps</strong><small>2 days ago</small>
      </motion.div>
      <b className="dot d1"/><b className="dot d2"/><b className="dot d3"/>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="marketing">
      <nav className="marketing-nav">
        <Link href="/" className="brand"><span><Baby/></span>mycub</Link>
        <div className="nav-links"><a href="#why">Why MyCub</a><a href="#inside">Inside the app</a><a href="#privacy">Privacy</a></div>
        <div className="nav-actions"><Link href="/login">Log in</Link><Link className="button dark" href="/signup">Start your family <ArrowRight/></Link></div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles/> A gentler way to see them grow</div>
          <h1>Every little change becomes part of their <em>big story.</em></h1>
          <p>MyCub brings growth, milestones, memories, and family notes into one beautiful place—so you can notice the progress hiding in ordinary days.</p>
          <div className="hero-actions"><Link className="button primary" href="/signup">Create your free family <ArrowRight/></Link><a href="#inside" className="watch"><i>↘</i> See how it feels</a></div>
          <div className="trust"><span><Check/>Free to begin</span><span><Check/>No ads</span><span><Check/>Your data stays yours</span></div>
        </div>
        <GrowthOrbit/>
      </section>

      <section className="snapshots">
        <div className="snapshot-intro"><span>ONE CALM VIEW</span><p>From the first measurement to the latest “look what I can do.”</p></div>
        {[["Weight","8.4","kg","+0.7"],["Length","71.2","cm","+2.1"],["Milestones","12","logged","+3"]].map(([label,value,unit,change]) => (
          <div className="snapshot" key={label}><span>{label}</span><div><strong>{value}</strong><small>{unit}</small></div><em>{change} this month</em></div>
        ))}
      </section>

      <section id="why" className="features">
        <header><div className="eyebrow"><Heart/> Made for the in-between moments</div><h2>Not another baby log.<br/>A record of becoming.</h2><p>Clinical enough to be useful. Warm enough to feel like yours.</p></header>
        <div className="feature-grid">{features.map(([Icon,title,copy],i) => (
          <article key={title}><div className="feature-top"><span>0{i+1}</span><Icon/></div><h3>{title}</h3><p>{copy}</p><i className="accent-line"/></article>
        ))}</div>
      </section>

      <section id="inside" className="inside">
        <div className="inside-copy">
          <div className="eyebrow"><BarChart3/> Beautifully clear by design</div>
          <h2>The full picture,<br/>without the overwhelm.</h2>
          <p>See the trend, record the moment, and bring a clear history to checkups. MyCub turns scattered notes into a story you can understand at a glance.</p>
          <ul>
            <li><i><Ruler/></i><div><strong>Precise measurement history</strong><small>Metric entry with date-aware trends.</small></div></li>
            <li><i><Sparkles/></i><div><strong>Thoughtful progress reports</strong><small>Readable summaries for family and care teams.</small></div></li>
            <li><i><LockKeyhole/></i><div><strong>Private family workspace</strong><small>Supabase authentication and row-level security.</small></div></li>
          </ul>
          <Link className="inline-link" href="/signup">Explore your family dashboard <ArrowRight/></Link>
        </div>
        <div className="preview-wrap"><div className="preview">
          <div className="window-bar"><i/><i/><i/><b>Overview</b></div>
          <div className="preview-body">
            <div className="greeting"><div><small>GOOD MORNING</small><h3>Mila is growing beautifully.</h3></div><b>M</b></div>
            <div className="preview-stats"><div><small>WEIGHT</small><strong>8.4 <i>kg</i></strong><span>↗ on track</span></div><div><small>LENGTH</small><strong>71.2 <i>cm</i></strong><span>↗ +2.1 cm</span></div><div><small>NEXT CHECK-IN</small><strong>12 <i>days</i></strong><span>Oct 24</span></div></div>
            <div className="chart"><svg viewBox="0 0 600 220" role="img" aria-label="Sample growth chart"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#6978eb" stopOpacity=".3"/><stop offset="1" stopColor="#6978eb" stopOpacity="0"/></linearGradient></defs><path d="M0 180 C90 165 110 130 190 135 S310 95 370 105 S475 55 600 42 L600 220 L0 220Z" fill="url(#fill)"/><path d="M0 180 C90 165 110 130 190 135 S310 95 370 105 S475 55 600 42" fill="none" stroke="#6978eb" strokeWidth="5" strokeLinecap="round"/></svg></div>
          </div>
        </div></div>
      </section>

      <section id="privacy" className="privacy"><div><LockKeyhole/><span><strong>Their story is not our product.</strong><small>Private by default. No ads. No selling family data.</small></span></div><Link className="button light" href="/signup">Begin with MyCub <ArrowRight/></Link></section>
      <footer><div className="brand"><span><Baby/></span>mycub</div><p>Made with care for growing families.</p><div><Link href="/login">Log in</Link><a href="#privacy">Privacy</a></div></footer>
    </main>
  );
}
