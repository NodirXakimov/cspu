import { markRaw } from 'vue'
import { OfficeBuilding } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'faculties',
    name: 'faculties',
    component: () => import('./views/FacultiesView.vue'),
    meta: {
      nav: { titleKey: 'nav.faculties', icon: markRaw(OfficeBuilding), order: 5 },
    },
  },
]

export default { routes }
