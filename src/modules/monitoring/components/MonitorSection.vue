<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  icon?: Component
  accent?: string
}>()
</script>

<template>
  <section class="monitor-section flex min-h-0 flex-col rounded-2xl">
    <header class="flex items-center justify-between gap-2 px-5 py-3">
      <div class="flex items-center gap-2">
        <span
          v-if="icon"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-white"
          :style="{ backgroundColor: accent ?? 'var(--el-color-primary)' }"
        >
          <el-icon :size="18"><component :is="icon" /></el-icon>
        </span>
        <h2 class="m-0 text-lg font-semibold">{{ title }}</h2>
      </div>
      <div class="shrink-0">
        <slot name="toolbar" />
      </div>
    </header>
    <div class="flex min-h-0 flex-1 flex-col gap-3 px-5 pb-4">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.monitor-section {
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0 4px 20px -12px rgba(0, 0, 0, 0.35);
}
.monitor-section header {
  border-bottom: 1px solid var(--el-border-color-lighter);
}
</style>
