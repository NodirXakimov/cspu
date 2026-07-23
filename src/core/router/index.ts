import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/core/components/AppLayout.vue'
import { setUnauthorizedHandler } from '@/core/api/session'
import { useAuthStore } from '@/modules/auth/stores/auth.store'

/**
 * Auto-collect each module's routes. A module's `index.ts` default-exports
 * `{ routes: RouteRecordRaw[]; rootRoutes?: RouteRecordRaw[] }`.
 * - `routes` are nested under the shared AppLayout (sidebar + header).
 * - `rootRoutes` are mounted at the top level (e.g. fullscreen pages with no chrome).
 */
const moduleModules = import.meta.glob<{
  default: { routes: RouteRecordRaw[]; rootRoutes?: RouteRecordRaw[] }
}>('../../modules/*/index.ts', { eager: true })

const byNavOrder = (a: RouteRecordRaw, b: RouteRecordRaw) => {
  const oa = (a.meta?.nav?.order as number) ?? 99
  const ob = (b.meta?.nav?.order as number) ?? 99
  return oa - ob
}

const moduleRoutes: RouteRecordRaw[] = Object.values(moduleModules)
  .flatMap((m) => m.default.routes)
  .sort(byNavOrder)

const rootRoutes: RouteRecordRaw[] = Object.values(moduleModules)
  .flatMap((m) => m.default.rootRoutes ?? [])
  .sort(byNavOrder)

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    redirect: '/dashboard',
    children: moduleRoutes,
  },
  ...rootRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// The axios client cannot import the router (cycle), so it signals an
// unrecoverable 401 through this handler instead.
setUnauthorizedHandler(() => {
  const current = router.currentRoute.value
  if (current.name === 'login' || current.meta.public) return
  void router.replace({ name: 'login', query: { redirect: current.fullPath } })
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  auth.syncFromStorage()

  if (to.meta.public) {
    // Already signed in? Skip the login page.
    if (to.name === 'login' && auth.isAuthenticated) return { path: '/dashboard' }
    return true
  }

  if (!auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Hydrate the profile once per session; a 401 here triggers the client's
  // silent refresh, and only a failed refresh bounces to /login.
  if (!auth.profileLoaded) {
    try {
      await auth.fetchMe()
    } catch {
      auth.clear()
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }

  return true
})
