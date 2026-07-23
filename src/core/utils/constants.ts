import type { LocaleKey } from '@/core/types/common'

export const STORAGE_KEYS = {
  theme: 'ums.theme',
  locale: 'ums.locale',
  sidebarCollapsed: 'ums.sidebar.collapsed',
  accessToken: 'ums.access_token',
  refreshToken: 'ums.refresh_token',
  user: 'ums.user',
} as const

export interface LocaleOption {
  key: LocaleKey
  label: string // native label
  flag: string
}

export const LOCALE_OPTIONS: LocaleOption[] = [
  { key: 'uz-Latn', label: "O'zbekcha", flag: '🇺🇿' },
  { key: 'uz-Cyrl', label: 'Ўзбекча', flag: '🇺🇿' },
  { key: 'ru', label: 'Русский', flag: '🇷🇺' },
  { key: 'en', label: 'English', flag: '🇬🇧' },
]

export const DEFAULT_LOCALE: LocaleKey = 'uz-Latn'

/** Shared bright chart palette. */
export const CHART_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#64748b', // slate
]
