import { markRaw } from 'vue'
import { Odometer } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'dashboard',
    name: 'dashboard',
    component: () => import('./views/DashboardView.vue'),
    meta: {
      nav: { titleKey: 'nav.dashboard', icon: markRaw(Odometer), order: 1 },
    },
  },
]

export default { routes }
