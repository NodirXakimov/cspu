import { markRaw } from 'vue'
import { Building2 } from 'lucide-vue-next'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'faculties',
    name: 'faculties',
    component: () => import('./views/FacultiesView.vue'),
    meta: {
      nav: { titleKey: 'nav.faculties', icon: markRaw(Building2), order: 5 },
    },
  },
]

export default { routes }
