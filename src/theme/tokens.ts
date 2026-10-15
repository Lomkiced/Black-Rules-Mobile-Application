/**
 * Monochrome Pixel-Noir Design Tokens
 * Black Rules Mobile Application
 * Inspired by Nothing OS, Linear, and Notion
 */

export const colors = {
  surface: '#09090B',
  surfaceDim: '#09090B',
  surfaceContainerLowest: '#050507',
  surfaceContainerLow: '#121215',
  surfaceContainer: '#18181B',
  surfaceContainerHigh: '#27272A',
  surfaceContainerHighest: '#3F3F46',
  surfaceBright: '#27272A',
  primary: '#FFFFFF',
  primaryContainer: '#E4E4E7',
  primaryFixed: '#FFFFFF',
  primaryFixedDim: '#E4E4E7',
  onPrimary: '#09090B',
  secondary: '#D4D4E8',
  secondaryContainer: '#27272A',
  onSecondaryContainer: '#FAFAFA',
  secondaryFixed: '#E4E4E7',
  onSurface: '#FAFAFA',
  onSurfaceVariant: '#A1A1AA',
  outline: '#71717A',
  outlineVariant: '#27272A',
  error: '#F87171',
  errorContainer: '#450A0A',
  onError: '#FAFAFA',

  // Legacy/Backwards Compatibility Aliases
  obsidian: '#09090B',
  charcoal: '#121215',
  borderSubtle: '#27272A',
  gold: {
    DEFAULT: '#FFFFFF',
    light: '#FFFFFF',
    dark: '#D4D4D8',
    muted: 'rgba(255, 255, 255, 0.12)',
  },
  crimson: {
    DEFAULT: '#F87171',
    light: '#FCA5A5',
    dark: '#7F1D1D',
    muted: 'rgba(248, 113, 113, 0.15)',
  },
  alabaster: '#FAFAFA',
  zincMuted: '#A1A1AA',
} as const;

export const fonts = {
  display: 'PlayfairDisplay_600SemiBold',
  headline: 'PlayfairDisplay_600SemiBold',
  headlineMedium: 'PlayfairDisplay_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  label: 'JetBrainsMono_500Medium',
  labelSemiBold: 'JetBrainsMono_600SemiBold',
  serif: 'PlayfairDisplay_600SemiBold',
  serifBold: 'PlayfairDisplay_700Bold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  mono: 'JetBrainsMono_400Regular',
  monoSemiBold: 'JetBrainsMono_600SemiBold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;
