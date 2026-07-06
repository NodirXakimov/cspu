<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { PanelLeftClose, PanelLeftOpen, Bell, ChevronDown } from 'lucide-vue-next'
import { useAppStore } from '@/core/stores/app.store'
import ThemeToggle from '@/core/components/ThemeToggle.vue'
import LangSwitcher from '@/core/components/LangSwitcher.vue'

const store = useAppStore()
const { sidebarCollapsed, theme } = storeToRefs(store)
const route = useRoute()

const nav = computed(
  () => route.meta?.nav as { titleKey?: string; icon?: Component } | undefined,
)
const pageTitleKey = computed(() => nav.value?.titleKey)
const pageIcon = computed(() => nav.value?.icon)

// Theme-aware dark-blue heading (matches section titles).
const headColor = computed(() => (theme.value === 'dark' ? '#dbeafe' : '#1e40af'))
</script>

<template>
  <el-header
    class="app-header flex items-center justify-between gap-3 border-b border-[var(--el-border-color-light)] px-4"
    :height="'var(--app-header-height)'"
  >
    <!-- Left: brand + toggle + page title -->
    <div class="flex min-w-0 items-center gap-3">
      <div class="flex items-center gap-2.5 pr-1">
        <div class="brand-logo">U</div>
        <span class="hidden text-base font-extrabold tracking-tight md:inline">
          {{ $t('app.shortTitle') }}
        </span>
      </div>

      <span class="header-divider" />

      <button class="hdr-btn" :aria-label="'toggle sidebar'" @click="store.toggleSidebar()">
        <el-icon :size="20">
          <PanelLeftOpen v-if="sidebarCollapsed" />
          <PanelLeftClose v-else />
        </el-icon>
      </button>

      <div v-if="pageTitleKey" class="flex min-w-0 items-center gap-2" :style="{ color: headColor }">
        <el-icon v-if="pageIcon" :size="20" class="page-icon shrink-0">
          <component :is="pageIcon" />
        </el-icon>
        <h1 class="m-0 truncate text-lg font-bold">{{ $t(pageTitleKey) }}</h1>
      </div>
    </div>

    <!-- Right: controls + user -->
    <div class="flex shrink-0 items-center gap-1">
      <button class="hdr-btn hdr-bell" aria-label="notifications">
        <el-icon :size="18"><Bell /></el-icon>
        <span class="bell-dot" />
      </button>
      <LangSwitcher />
      <ThemeToggle />

      <span class="header-divider mx-1" />

      <button class="user-chip">
        <span class="user-avatar">AD</span>
        <span class="hidden text-left leading-tight lg:block">
          <span class="block text-sm font-semibold">Admin</span>
          <span class="block text-xs text-[var(--el-text-color-secondary)]">Administrator</span>
        </span>
        <el-icon :size="14" class="hidden text-[var(--el-text-color-secondary)] lg:inline"><ChevronDown /></el-icon>
      </button>
    </div>
  </el-header>
</template>

<style scoped>
.app-header {
  background-color: var(--el-bg-color);
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 11px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #2563eb, #3b82f6 55%, #60a5fa);
  box-shadow: 0 4px 12px -3px color-mix(in srgb, #2563eb 55%, transparent);
}

.header-divider {
  width: 1px;
  height: 24px;
  background: var(--el-border-color);
}

.hdr-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}
.hdr-btn:hover {
  background: var(--el-fill-color);
  color: var(--el-color-primary);
}
.hdr-btn :deep(svg) {
  stroke-width: 2;
}
.bell-dot {
  position: absolute;
  top: 8px;
  right: 9px;
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: #f43f5e;
  border: 2px solid var(--el-bg-color);
}
.page-icon :deep(svg) {
  stroke-width: 2.25;
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px 4px 4px;
  border: none;
  border-radius: 12px;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.18s ease;
}
.user-chip:hover {
  background: var(--el-fill-color);
}
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
}
</style>
