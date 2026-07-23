import { markRaw } from 'vue'
import { Tv } from 'lucide-vue-next'
import type { RouteRecordRaw } from 'vue-router'

/** Fullscreen TV monitoring page — mounted OUTSIDE AppLayout (no sidebar/header). */
const rootRoutes: RouteRecordRaw[] = [
  {
    path: '/monitoring',
    name: 'monitoring',
    component: () => import('./views/MonitoringView.vue'),
    meta: {
      // Kiosk/TV screens show this without signing in.
      public: true,
      nav: { titleKey: 'nav.monitoring', icon: markRaw(Tv), order: 6 },
    },
  },
]

export default { routes: [], rootRoutes }
