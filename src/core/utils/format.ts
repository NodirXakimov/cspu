import type { LocaleKey } from '@/core/types/common'

/** Map our locale keys to BCP-47 tags Intl understands. */
const INTL_LOCALE: Record<LocaleKey, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  'uz-Latn': 'uz-Latn-UZ',
  'uz-Cyrl': 'uz-Cyrl-UZ',
}

export function formatMoney(
  value: number,
  locale: LocaleKey = 'en',
  currency = 'UZS',
): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number, locale: LocaleKey = 'en'): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale]).format(value)
}

export function formatDate(
  value: string | number | Date,
  locale: LocaleKey = 'en',
): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(value))
}

export function formatDateTime(
  value: string | number | Date,
  locale: LocaleKey = 'en',
): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

/**
 * Group a number with a thin space every 3 digits, e.g. 1234567 -> "1 234 567".
 * Locale-agnostic (always a space) — used by the animated summary counters.
 */
export function formatSpaced(value: number, digits = 0): string {
  const fixed = Math.abs(value).toFixed(digits)
  const [int, frac] = fixed.split('.')
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  const sign = value < 0 ? '-' : ''
  return frac ? `${sign}${grouped}.${frac}` : `${sign}${grouped}`
}

export function formatPercent(value: number, locale: LocaleKey = 'en'): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value / 100)
}
