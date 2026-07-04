import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import AppLayout from '@/core/components/AppLayout.vue'

/**
 * Auto-collect each module's routes. A module's `index.ts` default-exports
 * `{ routes: RouteRecordRaw[] }`; they are nested under the shared AppLayout.
 */
const moduleModules = import.meta.glob<{
  default: { routes: RouteRecordRaw[] }
}>('../../modules/*/index.ts', { eager: true })

const moduleRoutes: RouteRecordRaw[] = Object.values(moduleModules)
  .flatMap((m) => m.default.routes)
  .sort((a, b) => {
    const oa = (a.meta?.nav?.order as number) ?? 99
    const ob = (b.meta?.nav?.order as number) ?? 99
    return oa - ob
  })

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    redirect: '/dashboard',
    children: moduleRoutes,
  },
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
