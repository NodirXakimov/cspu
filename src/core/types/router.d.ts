import 'vue-router'
import type { Component } from 'vue'

declare module 'vue-router' {
  interface RouteMeta {
    /** True => reachable without a session (login page, TV monitoring kiosk). */
    public?: boolean
    /** Present => route shows in the sidebar navigation. */
    nav?: {
      titleKey: string
      icon: Component
      order: number
    }
  }
}
