"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Baby,
  BarChart3,
  Check,
  Heart,
  LineChart,
  LockKeyhole,
  Ruler,
  Sparkles,
  Stars,
  Users,
} from "lucide-react";

const chapters = [
  {
    number: "01",
    age: "The first days",
    title: "Remember the moment.",
    copy: "A first smile can last a second. In MyCub, it becomes part of the story forever—kept with the notes, dates, and people who were there.",
    value: "Milestones + private memories",
    image: "/journey/stage-newborn.png",
    position: "center 45%",
  },
  {
    number: "02",
    age: "The little explorer",
    title: "See growth take shape.",
    copy: "Turn every new measurement into a clear, beautiful trajectory. Understand the change without losing the child behind the chart.",
    value: "Measurements + growth analytics",
    image: "/journey/stage-toddler.png",
    position: "center 50%",
  },
  {
    number: "03",
    age: "The brave firsts",
    title: "Share the care.",
    copy: "First steps, new words, big feelings—one protected family space keeps everyone close to the moments that matter.",
    value: "One secure family workspace",
    image: "/journey/stage-first-steps.png",
    position: "center 48%",
  },
  {
    number: "04",
    age: "Ready for what’s next",
    title: "Carry the whole story forward.",
    copy: "From infancy to eighteen, give them a living record of how they grew—and the confidence to see just how far they’ve come.",
    value: "Reports + a lifelong record",
    image: "/journey/stage-young-adult.png",
    position: "center 38%",
  },
] as const;

const features = [
  [LineChart, "Growth, made visible", "Follow weight, length, height, and head circumference with calm trend and percentile views."],
  [Stars, "A living timeline", "Keep measurements, memories, notes, and milestones together, from day one to eighteen."],
  [Users, "Built for your circle", "One shared family space, protected for the people who help your child grow."],
] as const;

function Brand() {
  return <span className="brand"><span><Baby /></span>mycub</span>;
}

function JourneyExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });
  const progressWidth = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.09, 0.18], [1, 1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.94]);
  const haze = useTransform(smoothProgress, [0, 0.5, 1], [0.08, 0.24, 0.08]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(chapters.length - 1, Math.max(0, Math.floor((value + 0.08) * chapters.length)));
    setActive((current) => current === next ? current : next);
    if (!reduced && videoRef.current?.duration) {
      const target = value * Math.max(0, videoRef.current.duration - 0.05);
      if (Math.abs(videoRef.current.currentTime - target) > 0.08) videoRef.current.currentTime = target;
    }
  });

  useEffect(() => {
    const escape = window.setTimeout(() => setShowLoader(false), 4200);
    return () => window.clearTimeout(escape);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const exit = window.setTimeout(() => setShowLoader(false), 650);
    return () => window.clearTimeout(exit);
  }, [ready]);

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <motion.div className="journey-loader" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <div className="loader-mark"><Baby /></div>
            <p>Preparing their journey</p>
            <div className="loader-line"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 3.2, ease: "easeInOut" }} /></div>
            <span>FIRST SMILE&nbsp;&nbsp;•&nbsp;&nbsp;FIRST STEPS&nbsp;&nbsp;•&nbsp;&nbsp;EVERYTHING AHEAD</span>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="journey" ref={sectionRef} aria-label="The journey from infancy to young adulthood">
        <div className="journey-sticky">
          <div className="journey-media" aria-hidden="true">
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              poster="/journey/stage-newborn.png"
              onLoadedData={() => setReady(true)}
              onCanPlay={() => setReady(true)}
            >
              <source src="https://tempfile.aiquickdraw.com/v/9091b95b2e9e192724f9f62c3f7318ba_1783781779.mp4" type="video/mp4" />
            </video>
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.number}
                className="journey-still"
                initial={false}
                animate={{ opacity: active === index ? (ready ? 0 : 1) : 0, scale: active === index ? 1.04 : 1.1 }}
                transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ backgroundImage: `url(${chapter.image})`, backgroundPosition: chapter.position }}
              />
            ))}
          </div>
          <motion.div className="journey-haze" style={{ opacity: haze }} />
          <div className="journey-vignette" />

          <motion.div className="journey-intro" style={{ opacity: heroOpacity, scale: heroScale }}>
            <span className="cinema-kicker"><Sparkles /> The story only your family can tell</span>
            <h1>Every stage.<br /><em>One extraordinary story.</em></h1>
            <p>MyCub keeps the measurements, milestones, and memories that turn growing up into something you can see, understand, and hold onto.</p>
            <div className="journey-actions">
              <Link className="journey-button primary" href="/signup">Start their story <ArrowRight /></Link>
              <a className="scroll-prompt" href="#chapter-one"><ArrowDown /> Scroll to fly through the years</a>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.article
              key={active}
              id={active === 0 ? "chapter-one" : undefined}
              className={`chapter-card chapter-${active + 1}`}
              initial={{ opacity: 0, y: 48, filter: "blur(12px)" }}
              animate={{ opacity: scrollYProgress.get() > 0.14 ? 1 : 0, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="chapter-meta"><span>{chapters[active].number} / 04</span><span>{chapters[active].age}</span></div>
              <h2>{chapters[active].title}</h2>
              <p>{chapters[active].copy}</p>
              <div className="chapter-value"><Check /> {chapters[active].value}</div>
            </motion.article>
          </AnimatePresence>

          <div className="journey-rail" aria-hidden="true">
            <div className="journey-track"><motion.i style={{ width: progressWidth }} /></div>
            <div className="journey-dots">
              {chapters.map((chapter, index) => <span key={chapter.number} className={active === index ? "active" : ""}>{chapter.number}</span>)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <main className="marketing journey-marketing">
      <nav className="journey-nav">
        <Link href="/" aria-label="MyCub home"><Brand /></Link>
        <div className="nav-links"><a href="#why">Why MyCub</a><a href="#inside">Inside the app</a><a href="#privacy">Privacy</a></div>
        <div className="nav-actions"><Link href="/login">Log in</Link><Link className="journey-button compact" href="/signup">Start your family <ArrowRight /></Link></div>
      </nav>

      <JourneyExperience />

      <section id="why" className="journey-proof">
        <header>
          <span className="proof-kicker">THE YEARS MOVE FAST. YOUR STORY DOESN’T HAVE TO.</span>
          <h2>Not another baby log.<br /><em>A record of becoming.</em></h2>
          <p>Clinical enough to be useful. Warm enough to feel unmistakably yours.</p>
        </header>
        <div className="proof-grid">
          {features.map(([Icon, title, copy], index) => (
            <article key={title}>
              <div><span>0{index + 1}</span><Icon /></div>
              <h3>{title}</h3><p>{copy}</p><i />
            </article>
          ))}
        </div>
      </section>

      <section id="inside" className="journey-inside">
        <div className="inside-story">
          <span className="proof-kicker"><BarChart3 /> CLEAR BY DESIGN</span>
          <h2>The full picture,<br />without the overwhelm.</h2>
          <p>See the trend, record the moment, and bring a clear history to checkups. MyCub turns scattered notes into a story you understand at a glance.</p>
          <ul>
            <li><Ruler /><span><strong>Precise measurement history</strong><small>Beautiful, date-aware growth trends.</small></span></li>
            <li><Sparkles /><span><strong>Thoughtful progress reports</strong><small>Readable summaries for family and care teams.</small></span></li>
            <li><LockKeyhole /><span><strong>Private family workspace</strong><small>Protected authentication and row-level security.</small></span></li>
          </ul>
          <Link className="text-link" href="/signup">Explore your family dashboard <ArrowRight /></Link>
        </div>
        <div className="story-mosaic" aria-label="A preview of MyCub’s growth tracking experience">
          <div className="mosaic-photo" />
          <div className="mosaic-stat"><span>HEIGHT</span><strong>71.2 <small>cm</small></strong><em>+2.1 this month</em></div>
          <div className="mosaic-chart"><span>GROWTH JOURNEY</span><svg viewBox="0 0 500 170" role="img" aria-label="Sample upward growth trend"><defs><linearGradient id="journeyFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#8fd0ba" stopOpacity=".4"/><stop offset="1" stopColor="#8fd0ba" stopOpacity="0"/></linearGradient></defs><path d="M0 145 C75 135 115 112 170 118 S280 83 330 90 S420 45 500 32 L500 170 L0 170Z" fill="url(#journeyFill)"/><path d="M0 145 C75 135 115 112 170 118 S280 83 330 90 S420 45 500 32" fill="none" stroke="#8fd0ba" strokeWidth="5" strokeLinecap="round"/></svg></div>
          <div className="mosaic-moment"><Heart fill="currentColor" /><span><strong>First steps</strong><small>Added to the story</small></span></div>
        </div>
      </section>

      <section id="privacy" className="journey-privacy">
        <div><LockKeyhole /><span><strong>Their story is not our product.</strong><small>Private by default. No ads. No selling family data.</small></span></div>
        <Link className="journey-button light" href="/signup">Begin with MyCub <ArrowRight /></Link>
      </section>
      <footer className="journey-footer"><Brand /><p>Made with care for growing families.</p><div><Link href="/login">Log in</Link><a href="#privacy">Privacy</a></div></footer>
    </main>
  );
}

