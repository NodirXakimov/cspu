<script setup lang="ts">
import { computed, type Component } from 'vue'
import { useCountUp } from '@/core/composables/useCountUp'
import { formatSpaced } from '@/core/utils/format'

const props = withDefaults(
  defineProps<{
    label: string
    /** number → animated + space-grouped; string → shown as-is; null → "—". */
    value: number | string | null
    format?: 'number' | 'decimal' | 'percent'
    icon?: Component
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
    class="monitor-stat relative flex flex-1 flex-col justify-center gap-1.5 overflow-hidden rounded-xl px-4 py-5"
    :style="{ '--accent': accent }"
  >
    <!-- faded watermark icon, right side -->
    <el-icon v-if="icon" class="stat-watermark" :style="{ color: accent }">
      <component :is="icon" />
    </el-icon>

    <span class="relative text-xs font-semibold uppercase tracking-wide text-[var(--el-text-color-secondary)]">
      {{ label }}
    </span>
    <span class="relative text-3xl font-extrabold leading-none tabular-nums" :style="{ color: accent }">
      {{ text }}
    </span>
    <slot />
  </div>
</template>

<style scoped>
.monitor-stat {
  background: color-mix(in srgb, var(--accent) 7%, var(--el-fill-color-light));
  border: 1px solid color-mix(in srgb, var(--accent) 26%, transparent);
  border-left: 4px solid var(--accent);
  min-width: 0;
}
.stat-watermark {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 64px;
  opacity: 0.5;
  pointer-events: none;
}
.stat-watermark :deep(svg) {
  stroke-width: 2;
}
</style>
