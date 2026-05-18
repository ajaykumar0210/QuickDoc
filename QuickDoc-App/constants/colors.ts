// QuickDoc Design System — Single source of truth
// Inspired by ZocDoc + Practo: clean white, soft shadows, sky-blue primary

export const Colors = {
  // Brand Primary — Sky Blue
  primary: "#0EA5E9",
  primaryDark: "#0284C7",
  primaryLight: "#E0F2FE",
  primary50: "#F0F9FF",

  // Status colors
  available: "#22C55E",   // green — "Available Now"
  waiting: "#F59E0B",     // amber — queue warning
  emergency: "#EF4444",   // red — emergency tab
  offline: "#94A3B8",     // gray — offline / unavailable

  // Backgrounds
  background: "#F8FAFC",  // all screen backgrounds
  card: "#FFFFFF",        // cards, modals, sheets
  muted: "#F1F5F9",       // muted surface (chips, tags bg)

  // Text
  textMain: "#0F172A",    // headings, doctor names
  textSub: "#64748B",     // specialty, address, fees
  textMuted: "#94A3B8",   // timestamps, placeholders
  textWhite: "#FFFFFF",

  // Borders / Dividers
  border: "#E2E8F0",
  divider: "#F1F5F9",

  // Tab Bar
  tabActive: "#0EA5E9",
  tabInactive: "#94A3B8",

  // Overlay
  overlay: "rgba(15, 23, 42, 0.5)",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const Shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  modal: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 10,
  },
  btn: {
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export type ColorKey = keyof typeof Colors;
