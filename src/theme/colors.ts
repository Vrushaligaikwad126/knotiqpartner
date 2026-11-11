/**
 * KnotIQ Partner Color Palette
 * Derived from the Maritime Captain Dashboard & Design System
 */
export const colors = {
  // Brand / Maritime Primary
  brand: {
    primary: '#1592A6', // Signature Ocean Teal (active tabs, primary CTA)
    primaryDark: '#0D6C7C',
    primaryDeep: '#084854',
    primaryLight: '#E8F6F8',
    primarySubtle: '#F0F9FA',
  },

  // App Backgrounds
  background: {
    main: '#F4F7F9',
    card: '#FFFFFF',
    elevated: '#FFFFFF',
    dark: '#0B1B2B',
  },

  // Card Gradient & Accent Tints
  accent: {
    skySoft: '#EBF6F9',
    sunSoft: '#FFF6E3',
    bluePill: '#E8F2FD',
    pinkPill: '#FDECEE',
    greenPill: '#E6F8F3',
  },

  // Alert & Status Colors
  status: {
    warningBg: '#FFF8E7',
    warningBorder: '#FFE6A8',
    warningText: '#926306',

    dangerBg: '#FFF2EC',
    dangerBorder: '#FFD7C7',
    dangerText: '#A8481F',

    successBg: '#E7F8F2',
    successBorder: '#B2EBD8',
    successText: '#0D7A5C',

    ready: '#1592A6',
    preparingBg: '#FFF5DC',
    preparingText: '#A06E00',
  },

  // Typography Colors
  text: {
    primary: '#122534', // Deep Maritime Navy
    secondary: '#5C7181', // Slate Gray
    muted: '#92A4B2', // Soft Gray
    inverse: '#FFFFFF',
    brand: '#1592A6',
  },

  // Border & Divider Colors
  border: {
    light: '#EBF0F3',
    subtle: '#E2E8F0',
    card: '#E9EEF2',
  },

  // Quick Action Icon Colors
  quickAction: {
    tripsBg: '#E9F1FD',
    tripsIcon: '#2B6CB0',

    vesselBg: '#E3F6F8',
    vesselIcon: '#1592A6',

    messagesBg: '#EDF1F5',
    messagesIcon: '#4A5568',

    reportBg: '#FCEBEB',
    reportIcon: '#E53E3E',
  },

  // Navigation Pill Bar
  nav: {
    barBg: '#FFFFFF',
    activePill: '#1592A6',
    activeText: '#FFFFFF',
    inactiveText: '#334155',
    inactiveIcon: '#334155',
  },
} as const;

export type Colors = typeof colors;

