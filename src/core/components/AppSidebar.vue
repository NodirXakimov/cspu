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
  // getRoutes() is flattened with absolute paths, so it covers both layout
  // children (/dashboard …) and top-level routes (/monitoring).
  return router
    .getRoutes()
    .filter((r) => r.meta?.nav)
    .map((r) => {
      const nav = r.meta!.nav as Omit<NavItem, 'path'>
      return { path: r.path, ...nav }
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
  padding: 8px;
}

/* Rounded, inset menu items with breathing room + subtle outline */
.app-sidebar :deep(.el-menu-item) {
  height: 46px;
  margin: 4px 0;
  border-radius: 12px;
  border: 1px solid transparent;
  font-weight: 500;
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;
}
.app-sidebar :deep(.el-menu-item:hover) {
  background-color: var(--el-color-primary-light-9);
  border-color: var(--el-border-color-light);
}

/* Active item: rounded blue pill, white bolder text */
.app-sidebar :deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary);
  color: #fff;
  font-weight: 700;
  border-color: var(--el-color-primary);
  box-shadow: 0 4px 12px -4px var(--el-color-primary);
}
.app-sidebar :deep(.el-menu-item.is-active .el-icon) {
  color: #fff;
}

/* Bigger gap between icon and label */
.app-sidebar :deep(.el-menu-item .el-icon) {
  margin-right: 14px;
}

/* Lucide line icons: crisper stroke + slightly larger for a modern sidebar */
.app-sidebar :deep(.el-menu-item .el-icon svg) {
  width: 20px;
  height: 20px;
  stroke-width: 1.75;
}
</style>
