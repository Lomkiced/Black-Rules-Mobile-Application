# Architecture Map: Black Rules Mobile Application

## System Overview
Production-ready strategic character development and social defense mobile subscription app built with Expo SDK 52 (React Native), Expo Router, NativeWind v4, Zustand, and React Native SVG.

## Design System: Google Stitch Material-Luxury
- **Surfaces**:
  - `surface` / `surface-dim`: `#131315`
  - `surface-container-lowest`: `#0e0e10`
  - `surface-container-low`: `#1c1b1d`
  - `surface-container`: `#201f22`
  - `surface-container-high`: `#2a2a2c`
  - `surface-container-highest`: `#353437`
  - `surface-bright`: `#39393b`
- **Accents & Brand**:
  - `primary`: `#f2ca50` | `primary-container`: `#d4af37`
  - `secondary`: `#e8c35a` | `secondary-container`: `#896c00`
  - `on-surface`: `#e5e1e4` | `on-surface-variant`: `#d0c5af`
  - `outline`: `#99907c` | `outline-variant`: `#4d4635`
  - `error`: `#ffb4ab` | `error-container`: `#93000a`
- **Typography Tokens**:
  - `font-display` / `font-headline`: Playfair Display (600 SemiBold / 500 Medium)
  - `font-body`: Inter (400 Regular / 500 Medium / 600 SemiBold)
  - `font-label`: JetBrains Mono (500 Medium / 600 SemiBold)

## Screen & Component Inventory
```text
src/
├── app/
│   ├── _layout.tsx                     # Global Root Layout (Fonts, dark theme, QueryClient, paywall modal)
│   ├── (auth)/
│   │   ├── _layout.tsx                 # Auth Stack
│   │   └── login.tsx                   # Screen 0: Unique Sovereign Vault Login & Biometrics
│   ├── (tabs)/
│   │   ├── _layout.tsx                 # Tab Layout with FloatingBottomNav
│   │   ├── index.tsx                   # Screen 1: Daily Shadow (Tactical Dispatch & Micro-Challenge)
│   │   ├── codex/
│   │   │   ├── _layout.tsx             # Nested Codex Stack
│   │   │   ├── index.tsx               # Screen 2: Codex Archive Catalog (2-Column Bento Grid & Filters)
│   │   │   └── [id].tsx                # Screen 3: Swipeable Codex Reader (Tactile Deck & Segmented Tabs)
│   │   ├── arena.tsx                   # Screen 4: The Arena (Interactive Simulation Room 04)
│   │   └── stats.tsx                   # Screen 5: Character Stats (5-Trait SVG Radar & Velocity Breakdown)
│   └── paywall.tsx                     # Screen 6: Membership Elevation Modal (Annual/Monthly Plan Matrix)
├── components/
│   ├── ui/
│   │   ├── AppIcon.tsx                 # Material Symbol to Lucide SVG Icon Mapper
│   │   ├── TopAppBar.tsx               # Fixed luxury shell header with Monogram & Profile Avatar
│   │   ├── FloatingBottomNav.tsx       # Floating glassmorphic pill bottom navigation bar
│   │   ├── Button.tsx                  # Tactile button primitive with Haptics
│   │   ├── Card.tsx                    # Elevated surface card primitive
│   │   └── Badge.tsx                   # Monospace telemetry badge
│   └── features/
│       ├── RadarChart.tsx              # High-Fidelity 320x320 SVG 5-Trait Defense Radar
│       ├── CodexCard.tsx               # Editorial Rule Card
│       └── ScenarioNode.tsx            # Interactive Arena Scenario Node View
├── store/
│   ├── useUserStore.ts                 # Zustand store with Stitch challenge, search, and XP state
│   └── mockData.ts                     # Mock rules, scenarios, and baseline character metrics
├── theme/
│   └── tokens.ts                       # Google Stitch Material-Luxury tokens
└── types/
    └── index.ts                        # Strict TypeScript schemas
```
