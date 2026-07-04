<script setup lang="ts">
import { computed } from 'vue'
import { useCountUp } from '@/core/composables/useCountUp'
import { formatSpaced } from '@/core/utils/format'

const props = withDefaults(
  defineProps<{
    label: string
    /** number → animated + space-grouped; string → shown as-is; null → "—". */
    value: number | string | null
    format?: 'number' | 'decimal' | 'percent'
    accent?: string
    duration?: number
  }>(),
  { accent: 'var(--el-color-primary)', format: 'number', duration: 1200 },
)

const numRef = computed(() =>
  typeof props.value === 'number' ? props.value : null,
)
const display = useCountUp(numRef, props.duration)

const text = computed(() => {
  if (props.value == null) return '—'
  if (typeof props.value === 'string') return props.value
  const n = display.value
  switch (props.format) {
    case 'decimal':
      return formatSpaced(n, 2)
    case 'percent':
      return `${formatSpaced(Math.round(n))}%`
    default:
      return formatSpaced(Math.round(n))
  }
})
</script>

<template>
  <div
    class="monitor-stat flex flex-1 flex-col justify-center rounded-xl px-4 py-5"
    :style="{ borderColor: accent }"
  >
    <span class="text-xs font-medium uppercase tracking-wide text-[var(--el-text-color-secondary)]">
      {{ label }}
    </span>
    <span class="mt-1 text-3xl font-bold leading-none tabular-nums" :style="{ color: accent }">
      {{ text }}
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
