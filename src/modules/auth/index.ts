import type { RouteRecordRaw } from 'vue-router'

/** Login page — mounted OUTSIDE AppLayout (no sidebar/header) and public.
 *  No `nav` meta ⇒ never appears in the sidebar. */
const rootRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/LoginView.vue'),
    meta: { public: true },
  },
]

export default { routes: [], rootRoutes }
