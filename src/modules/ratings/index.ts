import { markRaw } from 'vue'
import { Award } from 'lucide-vue-next'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'ratings',
    name: 'ratings',
    component: () => import('./views/RatingsView.vue'),
    meta: {
      nav: { titleKey: 'nav.ratings', icon: markRaw(Award), order: 3 },
    },
  },
]

export default { routes }
