# MyCub — Nurture Every Milestone

AI-powered child development tracking for parents with children ages 1–12. Track growth, celebrate milestones, and get gentle AI-powered insights to help your child thrive.

## Features

- **One-tap signup** — Google or Facebook OAuth, no forms to fill
- **Child profiles** — Add children with photo, birthday, gender, and custom color theme
- **Growth tracking** — WHO-standard percentile charts (weight + height) with gentle explanations
- **Milestone tracking** — CDC-based developmental milestones across motor, language, cognitive, social, and self-care
- **Photo memories** — Upload, tag, and browse photos in a visual timeline
- **AI insights** — Personalized, encouraging guidance and age-appropriate product recommendations powered by Claude
- **Multi-child support** — Track all your cubs in one place

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS + custom warm design system |
| Components | Radix UI primitives (shadcn/ui pattern) |
| Charts | Recharts |
| Backend/BaaS | Supabase (Auth, PostgreSQL, Storage) |
| AI | Anthropic Claude API |
| Animations | Framer Motion |
| State | Zustand |
| Fonts | Nunito + Quicksand (Google Fonts) |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key

### Setup

1. **Clone and install**
   ```bash
   git clone https://github.com/StanAlt/MyCub.git
   cd MyCub
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your keys
   ```

3. **Set up database**
   - Go to your Supabase dashboard → SQL Editor
   - Run the contents of `supabase/schema.sql`

4. **Configure OAuth providers**
   - In Supabase dashboard → Authentication → Providers
   - Enable Google and/or Facebook with your OAuth credentials
   - Set redirect URL to `http://localhost:3000/auth/callback`

5. **Run the app**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Signup page
│   ├── auth/callback/route.ts      # OAuth callback handler
│   ├── api/ai/insights/route.ts    # AI insights API endpoint
│   └── dashboard/
│       ├── layout.tsx              # Dashboard layout (auth guard + nav)
│       ├── page.tsx                # Dashboard home
│       ├── add-child/page.tsx      # Add child form
│       ├── growth/page.tsx         # Growth tracking
│       ├── milestones/page.tsx     # Milestone tracking
│       ├── photos/page.tsx         # Photo gallery
│       └── insights/page.tsx       # AI insights
├── components/
│   ├── ui/                         # Design system (Button, Card, Input, Avatar)
│   └── dashboard/                  # Feature components
│       ├── nav.tsx                 # Dashboard navigation
│       ├── home.tsx                # Dashboard home view
│       ├── growth-tracker.tsx      # Growth tracking UI
│       ├── growth-chart.tsx        # Recharts percentile chart
│       ├── milestones-tracker.tsx  # Milestones UI
│       ├── insights-view.tsx       # AI insights UI
│       └── photo-gallery.tsx       # Photo upload + gallery
├── lib/
│   ├── utils.ts                    # Utility functions
│   ├── types.ts                    # TypeScript types
│   ├── growth-data.ts              # WHO percentile data (ages 1–12)
│   ├── milestones-data.ts          # CDC milestone templates
│   └── supabase/                   # Supabase client setup
│       ├── client.ts               # Browser client
│       ├── server.ts               # Server client
│       └── middleware.ts           # Session management
└── middleware.ts                   # Next.js middleware (auth)
```

## Data Sources

- **Growth charts**: [WHO Child Growth Standards](https://www.who.int/tools/child-growth-standards) (0–5 years) and [WHO Growth Reference 5–19](https://www.who.int/tools/growth-reference-data-for-5to19-years)
- **Milestones**: [CDC "Learn the Signs. Act Early"](https://www.cdc.gov/act-early/milestones/index.html) (2022 revision) + pediatric developmental literature for ages 6–12

## Design Philosophy

- **Warm, not clinical** — Soft coral, sage, and lavender palette with rounded corners
- **Mobile-first** — Every screen designed for phone-first, scales up beautifully
- **Gentle language** — AI insights are always encouraging, never alarming
- **One-minute onboarding** — OAuth → add child → start tracking

## License

Private. All rights reserved.
