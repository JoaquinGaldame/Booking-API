/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        steel: "#334155",
        mist: "#e2e8f0",
        shell: "#f8fafc",
        signal: "#0f766e",
        ember: "#b45309",
        alert: "#b91c1c",
        glow: "#f97316",
      },
      boxShadow: {
        panel: "0 18px 45px rgba(15, 23, 42, 0.08)",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "Segoe UI", "sans-serif"],
        mono: ["IBM Plex Mono", "Consolas", "monospace"],
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.15) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
