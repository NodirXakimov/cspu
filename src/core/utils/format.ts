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

export function formatPercent(value: number, locale: LocaleKey = 'en'): string {
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(value / 100)
}
