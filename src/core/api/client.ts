import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import {
  BASE_HEADERS,
  clearTokens,
  getAccessToken,
  notifyUnauthorized,
  refreshTokens,
} from '@/core/api/session'

/** Error thrown by every service call — carries the HTTP status for callers
 *  that need to react to it (e.g. the login form separating 401 from network). */
export class ApiError extends Error {
  readonly status: number | null

  constructor(message: string, status: number | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Request config extended with our one-shot retry marker. */
type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean }

/**
 * Central axios instance. Every module service imports this so auth headers,
 * base URL and error handling live in one place.
 */
export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  headers: { ...BASE_HEADERS },
})

/** Auth endpoints must never trigger the refresh-and-retry flow themselves. */
function isAuthRoute(url?: string): boolean {
  return Boolean(url && url.includes('/auth/'))
}

// --- Request: attach auth token -------------------------------------------
http.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// --- Response: refresh on 401, then normalize errors -----------------------
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; error?: string }>) => {
    const config = error.config as RetriableConfig | undefined
    const status = error.response?.status ?? null

    // 401 → try one silent refresh, then replay the original request.
    if (
      status === 401 &&
      config &&
      !config._retry &&
      !isAuthRoute(config.url)
    ) {
      config._retry = true
      try {
        const token = await refreshTokens()
        config.headers.Authorization = `Bearer ${token}`
        return await http(config)
      } catch {
        clearTokens()
        notifyUnauthorized()
        return Promise.reject(new ApiError('Session expired', 401))
      }
    }

    const message =
      error.response?.data?.error ??
      error.response?.data?.message ??
      error.message ??
      'Unexpected network error'

    return Promise.reject(new ApiError(message, status))
  },
)

/** True when the app should serve built-in mock data instead of hitting the API. */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/** Small helper to simulate network latency for mock services. */
export function mockDelay<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}
