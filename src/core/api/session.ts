import axios from 'axios'
import { STORAGE_KEYS } from '@/core/utils/constants'

/**
 * Token plumbing shared by the axios interceptors (`core/api/client.ts`) and the
 * auth store (`modules/auth/stores/auth.store.ts`).
 *
 * Lives in `core` — and deliberately knows nothing about the auth module — so the
 * client can refresh a session without importing the module (which would create an
 * import cycle: client → store → service → client).
 */

export interface TokenPair {
  access_token: string
  refresh_token: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/** Headers every request needs. ngrok's free tier serves an HTML interstitial
 *  instead of JSON unless `ngrok-skip-browser-warning` is present. */
export const BASE_HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
} as const

/**
 * Interceptor-free axios instance. Used for `/auth/refresh` so a 401 while
 * refreshing cannot re-enter the refresh flow.
 */
export const rawHttp = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { ...BASE_HEADERS },
})

// --- Storage ---------------------------------------------------------------

export function getAccessToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.accessToken)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.refreshToken)
}

export function setTokens(tokens: TokenPair): void {
  localStorage.setItem(STORAGE_KEYS.accessToken, tokens.access_token)
  localStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refresh_token)
}

export function clearTokens(): void {
  localStorage.removeItem(STORAGE_KEYS.accessToken)
  localStorage.removeItem(STORAGE_KEYS.refreshToken)
  localStorage.removeItem(STORAGE_KEYS.user)
}

// --- Session-expired handler ----------------------------------------------

type UnauthorizedHandler = () => void
let unauthorizedHandler: UnauthorizedHandler | null = null

/** Registered once by `core/router` so the client can bounce to /login without
 *  importing the router (and through it, every module). */
export function setUnauthorizedHandler(handler: UnauthorizedHandler): void {
  unauthorizedHandler = handler
}

export function notifyUnauthorized(): void {
  unauthorizedHandler?.()
}

// --- Refresh (single-flight) ----------------------------------------------

let inFlight: Promise<string> | null = null

/**
 * Exchange the stored refresh token for a fresh pair. Concurrent callers share
 * one request; the backend rotates the refresh token, so the new pair is stored
 * before the promise settles. Resolves with the new access token.
 */
export function refreshTokens(): Promise<string> {
  if (inFlight) return inFlight

  const refresh_token = getRefreshToken()
  if (!refresh_token) return Promise.reject(new Error('No refresh token'))

  inFlight = rawHttp
    .post<TokenPair>('/auth/refresh', { refresh_token })
    .then(({ data }) => {
      setTokens(data)
      return data.access_token
    })
    .finally(() => {
      inFlight = null
    })

  return inFlight
}
