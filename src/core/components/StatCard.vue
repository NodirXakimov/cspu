<script setup lang="ts">
import { computed, toRef, type Component } from 'vue'
import { useCountUp } from '@/core/composables/useCountUp'
import { formatSpaced } from '@/core/utils/format'

const props = withDefaults(
  defineProps<{
    label: string
    /** Raw numeric value; null while loading. */
    value: number | null
    /** How the animated number is rendered. */
    format?: 'number' | 'money' | 'percent'
    currency?: string
    icon?: Component
    trend?: number // percentage, +/-
    accent?: string // css color
    duration?: number
  }>(),
  {
    format: 'number',
    currency: 'UZS',
    accent: 'var(--el-color-primary)',
    duration: 1200,
  },
)

const display = useCountUp(toRef(props, 'value'), props.duration)

const formatted = computed(() => {
  if (props.value == null) return '—'
  const n = display.value
  switch (props.format) {
    case 'money':
      return `${formatSpaced(Math.round(n))} ${props.currency}`
    case 'percent':
      return `${formatSpaced(Math.round(n))}%`
    default:
      return formatSpaced(Math.round(n))
  }
})
</script>

<template>
  <div
    class="stat-card relative flex flex-col justify-center gap-1.5 overflow-hidden rounded-xl px-5 py-5"
    :style="{ '--accent': accent }"
  >
    <!-- faded watermark icon, right side -->
    <el-icon v-if="icon" class="stat-watermark" :style="{ color: accent }">
      <component :is="icon" />
    </el-icon>

    <span class="relative text-xs font-semibold uppercase tracking-wide text-[var(--el-text-color-secondary)]">
      {{ label }}
    </span>
    <span
      class="relative text-3xl font-extrabold leading-none tabular-nums"
      :style="{ color: accent }"
    >
      {{ formatted }}
    </span>
    <span
      v-if="trend !== undefined"
      class="relative text-xs font-semibold"
      :class="trend >= 0 ? 'text-green-500' : 'text-red-500'"
    >
      {{ trend >= 0 ? '▲' : '▼' }} {{ Math.abs(trend) }}%
    </span>
  </div>
</template>

<style scoped>
.stat-card {
  background: var(--el-bg-color);
  border: 1px solid color-mix(in srgb, var(--accent) 65%, transparent);
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
