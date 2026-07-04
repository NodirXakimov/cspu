<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: string | number
    accent?: string
  }>(),
  { accent: 'var(--el-color-primary)' },
)
</script>

<template>
  <div
    class="monitor-stat flex flex-1 flex-col justify-center rounded-xl px-4 py-3"
    :style="{ borderColor: accent }"
  >
    <span class="text-xs font-medium uppercase tracking-wide text-[var(--el-text-color-secondary)]">
      {{ label }}
    </span>
    <span class="mt-1 text-3xl font-bold leading-none" :style="{ color: accent }">
      {{ value }}
    </span>
    <slot />
  </div>
</template>

<style scoped>
.monitor-stat {
  background-color: var(--el-fill-color-light);
  border-left: 4px solid;
  min-width: 0;
}
</style>
