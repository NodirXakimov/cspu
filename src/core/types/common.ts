/** Shared, cross-module domain & API primitives. */

export type ThemeMode = 'light' | 'dark'

export type LocaleKey = 'en' | 'ru' | 'uz-Latn' | 'uz-Cyrl'

/** Envelope every backend endpoint is expected to return. */
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

/** Standard paginated list envelope. */
export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
}

/** Generic reactive fetch state used by module composables. */
export interface AsyncState<T> {
  data: T
  loading: boolean
  error: string | null
}

/** A single point for time-series charts. */
export interface SeriesPoint {
  label: string
  value: number
}

/** A named data series for multi-series charts. */
export interface NamedSeries {
  name: string
  data: number[]
}
