<script setup lang="ts">
import { computed, ref, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  ChevronDown,
  LogOut,
} from 'lucide-vue-next'
import { useAppStore } from '@/core/stores/app.store'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import ThemeToggle from '@/core/components/ThemeToggle.vue'
import LangSwitcher from '@/core/components/LangSwitcher.vue'

const store = useAppStore()
const { sidebarCollapsed, theme } = storeToRefs(store)
const route = useRoute()
const router = useRouter()

const auth = useAuthStore()
const { displayName, roleLabel, initials } = storeToRefs(auth)

const signingOut = ref(false)

async function onSignOut() {
  if (signingOut.value) return
  signingOut.value = true
  try {
    await auth.logout()
  } finally {
    signingOut.value = false
    await router.replace({ name: 'login' })
  }
}

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

      <el-dropdown trigger="click" placement="bottom-end">
        <button class="user-chip">
          <span class="user-avatar">{{ initials }}</span>
          <span class="hidden text-left leading-tight lg:block">
            <span class="block text-sm font-semibold">{{ displayName }}</span>
            <span class="block text-xs text-[var(--el-text-color-secondary)]">{{ roleLabel }}</span>
          </span>
          <el-icon :size="14" class="hidden text-[var(--el-text-color-secondary)] lg:inline"><ChevronDown /></el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <div class="user-card">
              <span class="user-avatar user-avatar--lg">{{ initials }}</span>
              <span class="min-w-0">
                <span class="block truncate text-sm font-semibold">{{ displayName }}</span>
                <span class="block truncate text-xs text-[var(--el-text-color-secondary)]">
                  @{{ auth.user?.username }}
                </span>
                <span v-if="roleLabel" class="role-badge">{{ roleLabel }}</span>
              </span>
            </div>
            <el-dropdown-item divided :disabled="signingOut" @click="onSignOut">
              <el-icon :size="15" class="mr-2 text-[var(--el-color-danger)]"><LogOut /></el-icon>
              <span class="font-medium">{{ $t('auth.signOut') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
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
.user-avatar--lg {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  font-size: 15px;
}

/* Dropdown profile card */
.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 210px;
  max-width: 260px;
  padding: 10px 12px 12px;
}
.role-badge {
  display: inline-block;
  margin-top: 5px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  color: var(--el-color-primary);
  background: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
}
</style>
