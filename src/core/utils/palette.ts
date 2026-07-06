/** Bright, modern accent palette shared across the whole app. */
/** Deliberately distinct from Element Plus defaults for a vivid, modern look. */
export const BRIGHT = {
  blue: '#3b82f6',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  cyan: '#06b6d4',
} as const

export type BrightColor = keyof typeof BRIGHT
