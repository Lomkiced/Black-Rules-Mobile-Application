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
        "surface": "#09090B",
        "surface-dim": "#09090B",
        "surface-container-lowest": "#050507",
        "surface-container-low": "#121215",
        "surface-container": "#18181B",
        "surface-container-high": "#27272A",
        "surface-container-highest": "#3F3F46",
        "surface-bright": "#27272A",
        "primary": "#FFFFFF",
        "primary-container": "#E4E4E7",
        "primary-fixed": "#FFFFFF",
        "primary-fixed-dim": "#E4E4E7",
        "on-primary": "#09090B",
        "secondary": "#D4D4D8",
        "secondary-container": "#27272A",
        "on-secondary-container": "#FAFAFA",
        "secondary-fixed": "#E4E4E7",
        "on-surface": "#FAFAFA",
        "on-surface-variant": "#A1A1AA",
        "outline": "#71717A",
        "outline-variant": "#27272A",
        "error": "#F87171",
        "error-container": "#450A0A",
        "on-error": "#FAFAFA"
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
