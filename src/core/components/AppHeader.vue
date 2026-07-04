<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Fold, Expand } from '@element-plus/icons-vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/core/stores/app.store'
import ThemeToggle from '@/core/components/ThemeToggle.vue'
import LangSwitcher from '@/core/components/LangSwitcher.vue'

const store = useAppStore()
const { sidebarCollapsed } = storeToRefs(store)
const route = useRoute()

const pageTitleKey = computed(
  () => (route.meta?.nav as { titleKey?: string } | undefined)?.titleKey,
)
</script>

<template>
  <el-header
    class="app-header flex items-center justify-between border-b border-[var(--el-border-color-light)] px-4"
    :height="'var(--app-header-height)'"
  >
    <div class="flex items-center gap-3">
      <el-button circle text @click="store.toggleSidebar()">
        <el-icon :size="18">
          <Expand v-if="sidebarCollapsed" />
          <Fold v-else />
        </el-icon>
      </el-button>
      <h1 v-if="pageTitleKey" class="text-lg font-semibold m-0">
        {{ $t(pageTitleKey) }}
      </h1>
    </div>

    <div class="flex items-center gap-1">
      <LangSwitcher />
      <ThemeToggle />
      <el-avatar :size="32" class="ml-2 bg-brand">A</el-avatar>
    </div>
  </el-header>
</template>

<style scoped>
.app-header {
  background-color: var(--el-bg-color);
}
</style>
