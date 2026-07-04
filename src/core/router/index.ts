import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/core/components/AppLayout.vue'

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
