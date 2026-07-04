import 'vue-router'
import type { Component } from 'vue'

declare module 'vue-router' {
  interface RouteMeta {
    /** Present => route shows in the sidebar navigation. */
    nav?: {
      titleKey: string
      icon: Component
      order: number
    }
  }
}
