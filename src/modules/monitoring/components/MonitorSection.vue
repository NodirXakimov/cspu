<script setup lang="ts">
import { computed, type Component } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/core/stores/app.store'

defineProps<{
  title: string
  icon?: Component
  accent?: string
}>()

const { theme } = storeToRefs(useAppStore())
// Unified title+icon colour: dark blue on light, whitish blue on dark.
const headColor = computed(() => (theme.value === 'dark' ? '#dbeafe' : '#1e40af'))
</script>

<template>
  <section class="monitor-section flex min-h-0 flex-col rounded-lg">
    <header class="flex items-center justify-between gap-2 px-4 py-2.5">
      <div class="section-head flex items-center gap-2.5" :style="{ color: headColor }">
        <span v-if="icon" class="section-icon flex items-center justify-center">
          <el-icon :size="24"><component :is="icon" /></el-icon>
        </span>
        <h2 class="m-0 text-lg font-bold uppercase tracking-wide">{{ title }}</h2>
      </div>
      <div class="shrink-0">
        <slot name="toolbar" />
      </div>
    </header>
    <div class="flex min-h-0 flex-1 flex-col gap-2.5 px-4 py-3">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.monitor-section {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 1px 3px rgba(0, 0, 0, 0.06);
}
:global(html.dark) .monitor-section {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.25),
    0 1px 3px rgba(0, 0, 0, 0.3);
}
.monitor-section header {
  border-bottom: 1px solid var(--el-border-color-lighter);
}
/* Title + icon colour set inline (theme-aware); icon inherits currentColor */
.section-icon :deep(svg) {
  stroke-width: 2.25;
}
</style>
