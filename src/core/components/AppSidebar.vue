<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import type { Component } from 'vue'
import { useAppStore } from '@/core/stores/app.store'

interface NavItem {
  path: string
  titleKey: string
  icon: Component
  order: number
}

const router = useRouter()
const route = useRoute()
const store = useAppStore()
const { sidebarCollapsed } = storeToRefs(store)

const navItems = computed<NavItem[]>(() => {
  const layout = router.options.routes.find((r) => r.children?.length)
  const children = layout?.children ?? []
  return children
    .filter((r) => r.meta?.nav)
    .map((r) => {
      const nav = r.meta!.nav as Omit<NavItem, 'path'>
      return { path: `/${r.path}`.replace(/\/+/g, '/'), ...nav }
    })
    .sort((a, b) => a.order - b.order)
})

const activePath = computed(() => route.path)
</script>

<template>
  <el-aside
    :width="sidebarCollapsed ? 'var(--app-sidebar-collapsed-width)' : 'var(--app-sidebar-width)'"
    class="app-sidebar border-r border-[var(--el-border-color-light)] transition-all duration-200"
  >
    <div
      class="flex items-center gap-2 h-[var(--app-header-height)] px-4 overflow-hidden"
    >
      <div
        class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white font-bold"
      >
        U
      </div>
      <span
        v-show="!sidebarCollapsed"
        class="text-base font-semibold whitespace-nowrap"
      >
        {{ $t('app.shortTitle') }}
      </span>
    </div>

    <el-menu
      :default-active="activePath"
      :collapse="sidebarCollapsed"
      :collapse-transition="false"
      router
      class="border-0"
    >
      <el-menu-item
        v-for="item in navItems"
        :key="item.path"
        :index="item.path"
      >
        <el-icon><component :is="item.icon" /></el-icon>
        <template #title>{{ $t(item.titleKey) }}</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<style scoped>
.app-sidebar {
  background-color: var(--el-bg-color);
  height: 100%;
  overflow-x: hidden;
}
.app-sidebar :deep(.el-menu) {
  background-color: transparent;
}
</style>
