import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/context/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0a0807",
          surface: "#141210",
          border: "#2a2420",
          primary: "#c9a96e",
          "primary-hover": "#d4b87a",
          text: "#f5f0e8",
          "text-secondary": "#9a8878",
          success: "#4a7c59",
          error: "#8b3a3a",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        accent: ["var(--font-accent)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;