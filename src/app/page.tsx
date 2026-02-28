import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Baby,
  TrendingUp,
  Brain,
  Heart,
  Shield,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-warm-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
              <Baby className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-warm-900">
              MyCub
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            AI-powered child development tracking
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-warm-900 leading-tight mb-6">
            Nurture Every{" "}
            <span className="text-brand-500">Milestone</span>
          </h1>
          <p className="text-lg md:text-xl text-warm-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track growth, celebrate firsts, and get gentle AI-powered insights
            to help your child thrive — from their first steps to their
            twelfth birthday.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="xl" className="w-full sm:w-auto">
                Start Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </div>
          <p className="text-sm text-warm-500 mt-4">
            Free forever for your first child. No credit card needed.
          </p>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-8 border-y border-warm-100 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 text-warm-500 text-sm">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-brand-400 text-brand-400" />
            ))}
            <span className="ml-2 font-medium">Loved by parents</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sage-500" />
            <span>WHO Growth Standards</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-lavender-500" />
            <span>CDC Milestone Guidelines</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-4">
              Everything your growing family needs
            </h2>
            <p className="text-warm-600 text-lg max-w-2xl mx-auto">
              Simple, beautiful tools designed by parents, for parents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Growth Charts",
                description:
                  "Beautiful, WHO-standard percentile charts that show exactly where your child stands — explained gently and clearly.",
                color: "bg-sky-100 text-sky-600",
              },
              {
                icon: Brain,
                title: "Milestone Tracking",
                description:
                  "CDC-based developmental milestones across motor, language, cognitive, and social skills. Know what to expect and when.",
                color: "bg-lavender-100 text-lavender-600",
              },
              {
                icon: Sparkles,
                title: "AI Insights",
                description:
                  "Gentle, personalized guidance powered by AI. Get product recommendations and activities tailored to your child's stage.",
                color: "bg-brand-100 text-brand-600",
              },
              {
                icon: Heart,
                title: "Photo Memories",
                description:
                  "Capture and tag precious moments. Build a visual timeline of your child's journey from year one to twelve.",
                color: "bg-brand-100 text-brand-600",
              },
              {
                icon: Baby,
                title: "Multiple Children",
                description:
                  "Track all your cubs in one place. Each child gets their own profile, color theme, and personalized dashboard.",
                color: "bg-sage-100 text-sage-600",
              },
              {
                icon: Shield,
                title: "Privacy First",
                description:
                  "Your family's data is yours. End-to-end encryption, no third-party sharing, and full data portability.",
                color: "bg-warm-200 text-warm-700",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="card-warm group hover:scale-[1.02] transition-transform duration-200"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-warm-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-warm-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-white/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-4">
              Up and running in 60 seconds
            </h2>
            <p className="text-warm-600 text-lg">
              No complicated setup. Just sign in and start tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Sign in",
                description:
                  "One tap with Google or Facebook. No forms, no passwords to remember.",
              },
              {
                step: "2",
                title: "Add your cub",
                description:
                  "Enter their name, birthday, and a photo. Pick a fun color theme.",
              },
              {
                step: "3",
                title: "Start tracking",
                description:
                  "Log growth, celebrate milestones, and get gentle AI insights each month.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-brand-500 text-white font-display font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-display font-bold text-lg text-warm-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-warm-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center card-warm bg-gradient-to-br from-brand-50 to-lavender-50 py-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-900 mb-4">
            Every moment matters
          </h2>
          <p className="text-warm-600 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of parents who use MyCub to nurture confident,
            healthy, happy children.
          </p>
          <Link href="/signup">
            <Button size="xl">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-warm-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <Baby className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-warm-900">MyCub</span>
          </div>
          <p className="text-warm-500 text-sm">
            Made with love for growing families.
          </p>
        </div>
      </footer>
    </div>
  );
}
