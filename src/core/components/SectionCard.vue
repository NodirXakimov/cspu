<script setup lang="ts">
import { computed, type Component } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/core/stores/app.store'

defineProps<{
  title: string
  icon?: Component
}>()

const { theme } = storeToRefs(useAppStore())
// Theme-aware dark-blue heading (matches the monitoring section titles).
const headColor = computed(() => (theme.value === 'dark' ? '#dbeafe' : '#1e40af'))
</script>

<template>
  <section class="section-card flex flex-col rounded-2xl">
    <header class="flex items-center justify-between gap-3 px-5 py-3.5">
      <div class="section-head flex items-center gap-2.5" :style="{ color: headColor }">
        <span v-if="icon" class="section-icon flex items-center justify-center">
          <el-icon :size="20"><component :is="icon" /></el-icon>
        </span>
        <h2 class="m-0 text-base font-bold">{{ title }}</h2>
      </div>
      <div class="shrink-0">
        <slot name="actions" />
      </div>
    </header>
    <div class="px-5 pb-5">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.section-card {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 2px 8px -4px rgba(0, 0, 0, 0.08);
}
:global(html.dark) .section-card {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.25),
    0 2px 10px -4px rgba(0, 0, 0, 0.35);
}
.section-card header {
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.section-icon :deep(svg) {
  stroke-width: 2.25;
}
</style>
