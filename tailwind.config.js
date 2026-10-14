/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "surface": "#131315",
        "surface-dim": "#131315",
        "surface-container-lowest": "#0e0e10",
        "surface-container-low": "#1c1b1d",
        "surface-container": "#201f22",
        "surface-container-high": "#2a2a2c",
        "surface-container-highest": "#353437",
        "surface-bright": "#39393b",
        "primary": "#f2ca50",
        "primary-container": "#d4af37",
        "primary-fixed": "#ffe088",
        "primary-fixed-dim": "#e9c349",
        "on-primary": "#3c2f00",
        "secondary": "#e8c35a",
        "secondary-container": "#896c00",
        "on-secondary-container": "#fff3dc",
        "secondary-fixed": "#ffe08e",
        "on-surface": "#e5e1e4",
        "on-surface-variant": "#d0c5af",
        "outline": "#99907c",
        "outline-variant": "#4d4635",
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005"
      },
      fontFamily: {
        display: ["PlayfairDisplay_600SemiBold", "serif"],
        headline: ["PlayfairDisplay_600SemiBold", "serif"],
        "headline-medium": ["PlayfairDisplay_500Medium", "serif"],
        body: ["Inter_400Regular", "sans-serif"],
        "body-medium": ["Inter_500Medium", "sans-serif"],
        "body-semibold": ["Inter_600SemiBold", "sans-serif"],
        label: ["JetBrainsMono_500Medium", "monospace"],
        "label-semibold": ["JetBrainsMono_600SemiBold", "monospace"],
        sans: ["Inter_400Regular", "sans-serif"],
        serif: ["PlayfairDisplay_600SemiBold", "serif"],
        mono: ["JetBrainsMono_400Regular", "monospace"]
      }
    }
  },
  plugins: []
};
