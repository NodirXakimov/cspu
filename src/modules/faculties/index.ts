import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'faculties',
    name: 'faculties',
    component: () => import('./views/FacultiesView.vue'),
    meta: {
      // TODO: Faculties hidden from the sidebar for now — route still works at
      // /faculties. To bring the sidebar item back, re-add the imports
      // `import { markRaw } from 'vue'` + `import { Building2 } from 'lucide-vue-next'`
      // and restore:
      // nav: { titleKey: 'nav.faculties', icon: markRaw(Building2), order: 5 },
    },
  },
]

export default { routes }
