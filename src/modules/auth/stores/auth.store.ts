import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@/core/api/session'
import { STORAGE_KEYS } from '@/core/utils/constants'
import { authService } from '../services/auth.service'
import type { AuthUser, LoginPayload, UserRole } from '../types/auth.types'

function storedUser(): AuthUser | null {
  const raw = localStorage.getItem(STORAGE_KEYS.user)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(getAccessToken())
  const refreshToken = ref<string | null>(getRefreshToken())
  const user = ref<AuthUser | null>(storedUser())
  const roles = ref<UserRole[]>([])
  const activeRole = ref<string | null>(user.value?.role ?? null)
  /** True once /users/me has resolved for the current token. */
  const profileLoaded = ref(false)

  const isAuthenticated = computed(() => Boolean(accessToken.value))
  const displayName = computed(
    () => user.value?.full_name || user.value?.username || '',
  )
  const roleLabel = computed(() => {
    const code = activeRole.value
    if (!code) return ''
    return roles.value.find((r) => r.role_code === code)?.role_name ?? code
  })
  const initials = computed(() => {
    const parts = displayName.value.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return '?'
    const letters = parts.slice(0, 2).map((p) => p[0])
    return letters.join('').toUpperCase()
  })

  function persistUser(next: AuthUser | null) {
    user.value = next
    if (next) localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEYS.user)
  }

  /** Re-read tokens written by the axios refresh flow (which bypasses the store). */
  function syncFromStorage() {
    accessToken.value = getAccessToken()
    refreshToken.value = getRefreshToken()
  }

  function clear() {
    clearTokens()
    accessToken.value = null
    refreshToken.value = null
    roles.value = []
    activeRole.value = null
    profileLoaded.value = false
    persistUser(null)
  }

  async function login(payload: LoginPayload) {
    const data = await authService.login(payload)
    setTokens(data)
    accessToken.value = data.access_token
    refreshToken.value = data.refresh_token
    activeRole.value = data.user.role ?? null
    persistUser(data.user)
    await fetchMe()
  }

  /** Loads profile + roles. Throws if the session cannot be recovered. */
  async function fetchMe() {
    const data = await authService.me()
    syncFromStorage() // a silent refresh may have rotated the pair mid-flight
    roles.value = data.roles ?? []
    activeRole.value = data.active_role ?? activeRole.value
    persistUser({ ...data.user, role: data.active_role })
    profileLoaded.value = true
    return data
  }

  async function logout() {
    const token = refreshToken.value
    try {
      if (token) await authService.logout(token)
    } catch {
      // Server-side revocation failed (offline, expired token) — drop the local
      // session anyway; the user asked to sign out.
    } finally {
      clear()
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    roles,
    activeRole,
    profileLoaded,
    isAuthenticated,
    displayName,
    roleLabel,
    initials,
    login,
    fetchMe,
    logout,
    clear,
    syncFromStorage,
  }
})
