# Workspace Rules & Directives

## 1. Superpowers
Full agentic autonomy enabled for terminal execution, dependency resolution, and multi-file scaffolding. Deterministic, zero-error execution.

## 2. Understand Anything
Maintain a living architectural map in `ARCHITECTURE.md` before and after modifying cross-cutting modules. Every major subsystem must have traceable data flow and dependency hierarchy.

## 3. Graphify
Knowledge graph visualization and dependency mapping across components, state stores, navigation flows, and external services. Visual graphs are maintained in `ARCHITECTURE.md`.

## 4. UI/UX Pro Max
- "Stealth Luxury / Editorial Dark Mode" design system.
- Colors: Obsidian (#131315), Surface Container Low (#1c1b1d), Surface Container (#201f22), Gold Primary (#f2ca50), Gold Container (#d4af37), On-Surface (#e5e1e4), Outline (#99907c).
- Typography: Playfair Display (Serif / Display), Inter (Sans / Body), JetBrains Mono (Mono / Label).
- 60fps Reanimated transitions, micro-interactions, haptic feedback (`expo-haptics`), safe-area precision.

## 5. Caveman
Extreme brevity. No fluff. Action-first output with concise status updates.

## 6. Impeccable
Strict TypeScript (`"strict": true`), zero unused variables, modular components, production-grade error boundaries, and validated schemas (`zod`).

## 7. Ponytail
Feature-Sliced / cleanly decoupled layers:
- State (`src/store/`)
- Backend & SDKs (`src/lib/`)
- Reusable Primitives (`src/components/ui/`)
- Feature Components (`src/components/features/`)
- Screen routes (`src/app/`)
