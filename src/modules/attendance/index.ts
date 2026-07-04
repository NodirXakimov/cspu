import { markRaw } from 'vue'
import { ScanFace } from 'lucide-vue-next'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'attendance',
    name: 'attendance',
    component: () => import('./views/AttendanceView.vue'),
    meta: {
      nav: { titleKey: 'nav.attendance', icon: markRaw(ScanFace), order: 2 },
    },
  },
]

export default { routes }
