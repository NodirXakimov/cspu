import { markRaw } from 'vue'
import { Wallet } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'payments',
    name: 'payments',
    component: () => import('./views/PaymentsView.vue'),
    meta: {
      nav: { titleKey: 'nav.payments', icon: markRaw(Wallet), order: 4 },
    },
  },
]

export default { routes }
