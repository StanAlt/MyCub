import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // MyCub brand palette — warm, nurturing, playful
        brand: {
          // Primary: warm coral/peach — warmth, love, nurturing
          50: "#f4f5ff",
          100: "#e9ebff",
          200: "#d3d7ff",
          300: "#aeb6ff",
          400: "#8793f7",
          500: "#6978eb",
          600: "#5866d7",
          700: "#4854b7",
          800: "#3c4793",
          900: "#333d75",
        },
        // Secondary: soft sage green — growth, health, nature
        sage: {
          50: "#f4f9f4",
          100: "#e6f2e6",
          200: "#cee5cf",
          300: "#a6d0a8",
          400: "#78b57c",
          500: "#559a5a",
          600: "#427e47",
          700: "#36653a",
          800: "#2e5131",
          900: "#274329",
        },
        // Accent: soft lavender — calm, trust, gentle
        lavender: {
          50: "#f8f6fd",
          100: "#f0ecfb",
          200: "#e3dcf8",
          300: "#cdc0f1",
          400: "#b39de7",
          500: "#9a7bdb",
          600: "#865fcc",
          700: "#724db5",
          800: "#604197",
          900: "#4f367c",
        },
        // Warm neutrals — cozy backgrounds
        warm: {
          50: "#fafbfe",
          100: "#f4f6fb",
          200: "#e7eaf2",
          300: "#d4d9e5",
          400: "#aeb6c7",
          500: "#858fa3",
          600: "#687386",
          700: "#4f5b70",
          800: "#354158",
          900: "#17233f",
        },
        // Sky blue — for charts and data vis
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
      },
      fontFamily: {
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
        display: ["var(--font-quicksand)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        glow: "0 0 24px rgba(105, 120, 235, 0.18)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "bounce-soft": "bounceSoft 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
