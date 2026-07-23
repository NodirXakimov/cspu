/** Auth domain types — mirror the backend payloads exactly. */

export interface AuthUser {
  id: number
  username: string
  full_name: string
  /** Present on /auth/login + /auth/refresh, absent on /users/me (see `roles`). */
  role?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface UserRole {
  role_code: string
  role_name: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

/** POST /auth/login and POST /auth/refresh share this shape. */
export interface SessionResponse extends AuthTokens {
  user: AuthUser
}

/** GET /users/me */
export interface MeResponse {
  active_role: string
  roles: UserRole[]
  user: AuthUser
}

export interface LogoutResponse {
  message: string
}
