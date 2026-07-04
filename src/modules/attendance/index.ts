import { markRaw } from 'vue'
import { Camera } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'attendance',
    name: 'attendance',
    component: () => import('./views/AttendanceView.vue'),
    meta: {
      nav: { titleKey: 'nav.attendance', icon: markRaw(Camera), order: 2 },
    },
  },
]

export default { routes }
