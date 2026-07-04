import type { LocaleKey } from '@/core/types/common'

export const STORAGE_KEYS = {
  theme: 'ums.theme',
  locale: 'ums.locale',
  sidebarCollapsed: 'ums.sidebar.collapsed',
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

/** Shared chart palette (kept in sync with tailwind brand + EP primary). */
export const CHART_COLORS = [
  '#409eff',
  '#67c23a',
  '#e6a23c',
  '#f56c6c',
  '#909399',
  '#9b59b6',
  '#1abc9c',
  '#34495e',
]
