import { markRaw } from 'vue'
import { LayoutDashboard } from 'lucide-vue-next'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'dashboard',
    name: 'dashboard',
    component: () => import('./views/DashboardView.vue'),
    meta: {
      nav: { titleKey: 'nav.dashboard', icon: markRaw(LayoutDashboard), order: 1 },
    },
  },
]

export default { routes }
