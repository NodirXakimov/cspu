import { markRaw } from 'vue'
import { UserCog } from 'lucide-vue-next'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'teachers',
    name: 'teachers',
    component: () => import('./views/TeachersView.vue'),
    meta: {
      // 4.5 → sits right after Payments (order 4), before Faculties (order 5).
      nav: { titleKey: 'nav.teachers', icon: markRaw(UserCog), order: 4.5 },
    },
  },
]

export default { routes }
