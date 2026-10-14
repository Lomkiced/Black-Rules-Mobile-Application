/**
 * Google Stitch Material-Luxury Design Tokens
 * Black Rules Mobile Application
 */

export const colors = {
  surface: '#131315',
  surfaceDim: '#131315',
  surfaceContainerLowest: '#0e0e10',
  surfaceContainerLow: '#1c1b1d',
  surfaceContainer: '#201f22',
  surfaceContainerHigh: '#2a2a2c',
  surfaceContainerHighest: '#353437',
  surfaceBright: '#39393b',
  primary: '#f2ca50',
  primaryContainer: '#d4af37',
  primaryFixed: '#ffe088',
  primaryFixedDim: '#e9c349',
  onPrimary: '#3c2f00',
  secondary: '#e8c35a',
  secondaryContainer: '#896c00',
  onSecondaryContainer: '#fff3dc',
  secondaryFixed: '#ffe08e',
  onSurface: '#e5e1e4',
  onSurfaceVariant: '#d0c5af',
  outline: '#99907c',
  outlineVariant: '#4d4635',
  error: '#ffb4ab',
  errorContainer: '#93000a',
  onError: '#690005',

  // Aliases for legacy/backward compatibility
  obsidian: '#131315',
  charcoal: '#1c1b1d',
  borderSubtle: '#2a2a2c',
  gold: {
    DEFAULT: '#f2ca50',
    light: '#ffe088',
    dark: '#d4af37',
    muted: 'rgba(242, 202, 80, 0.15)',
  },
  crimson: {
    DEFAULT: '#93000a',
    light: '#ffb4ab',
    dark: '#690005',
    muted: 'rgba(147, 0, 10, 0.25)',
  },
  alabaster: '#e5e1e4',
  zincMuted: '#d0c5af',
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
  // standard fallbacks & aliases
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
