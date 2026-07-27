/**
 * Temporary offline sign-in — used while the backend is unreachable from the
 * deployed frontend. Gated by `VITE_USE_MOCK_AUTH`; set it to `false` (or drop
 * this file and the branches in `auth.service.ts`) once the API is live again.
 */
import { ApiError } from '@/core/api/client'
import type {
  LoginPayload,
  MeResponse,
  SessionResponse,
} from '../types/auth.types'

export const MOCK_AUTH =
  import.meta.env.VITE_USE_MOCK_AUTH === 'true'

/** The only credentials the offline mode accepts. */
const CREDENTIALS = { username: 'admin', password: 'admin123' }

const MOCK_USER = {
  id: 1,
  username: CREDENTIALS.username,
  full_name: 'Demo Administrator',
  role: 'admin',
  is_active: true,
}

const MOCK_ROLES = [
  { role_code: 'admin', role_name: 'Administrator' },
  { role_code: 'dean', role_name: 'Dekan' },
]

/** Marker prefix so a mock token is never mistaken for a real one. */
const MOCK_TOKEN = 'mock.access.token'
const MOCK_REFRESH = 'mock.refresh.token'

export function mockLogin(payload: LoginPayload): Promise<SessionResponse> {
  const ok =
    payload.username.trim() === CREDENTIALS.username &&
    payload.password === CREDENTIALS.password

  if (!ok) {
    return Promise.reject(
      new ApiError('Login yoki parol noto‘g‘ri', 401),
    )
  }

  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          access_token: MOCK_TOKEN,
          refresh_token: MOCK_REFRESH,
          user: { ...MOCK_USER },
        }),
      300,
    ),
  )
}

export function mockMe(): Promise<MeResponse> {
  return Promise.resolve({
    active_role: 'admin',
    roles: [...MOCK_ROLES],
    user: { ...MOCK_USER },
  })
}
