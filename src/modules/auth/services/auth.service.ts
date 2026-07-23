import axios from 'axios'
import { ApiError, http } from '@/core/api/client'
import { rawHttp, refreshTokens } from '@/core/api/session'
import type {
  LoginPayload,
  LogoutResponse,
  MeResponse,
  SessionResponse,
} from '../types/auth.types'

/** `rawHttp` has no interceptors, so normalize its failures the same way `http` does. */
function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError<{ message?: string; error?: string }>(err)) {
    const message =
      err.response?.data?.error ??
      err.response?.data?.message ??
      err.message ??
      'Unexpected network error'
    return new ApiError(message, err.response?.status ?? null)
  }
  return new ApiError((err as Error)?.message ?? 'Unexpected error', null)
}

/**
 * Auth calls always hit the real API — they ignore `USE_MOCK` (which only gates
 * the feature modules whose endpoints are not live yet).
 */
export const authService = {
  async login(payload: LoginPayload): Promise<SessionResponse> {
    try {
      // rawHttp: no stale Authorization header, no refresh-retry on bad credentials.
      const { data } = await rawHttp.post<SessionResponse>('/auth/login', payload)
      return data
    } catch (err) {
      throw toApiError(err)
    }
  },

  /** Single-flight refresh; also persists the rotated token pair. */
  refresh(): Promise<string> {
    return refreshTokens()
  },

  async me(): Promise<MeResponse> {
    const { data } = await http.get<MeResponse>('/users/me')
    return data
  },

  async logout(refresh_token: string): Promise<LogoutResponse> {
    const { data } = await http.post<LogoutResponse>('/auth/logout', {
      refresh_token,
    })
    return data
  },
}
