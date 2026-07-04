import { markRaw } from 'vue'
import { TrendCharts } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'ratings',
    name: 'ratings',
    component: () => import('./views/RatingsView.vue'),
    meta: {
      nav: { titleKey: 'nav.ratings', icon: markRaw(TrendCharts), order: 3 },
    },
  },
]

export default { routes }
