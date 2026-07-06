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
  <div class="stat-card" :style="{ '--accent': accent }">
    <!-- faded watermark icon, right side -->
    <el-icon v-if="icon" class="stat-watermark" :style="{ color: accent }">
      <component :is="icon" />
    </el-icon>

    <span class="relative text-xs font-semibold uppercase tracking-wide text-[var(--el-text-color-secondary)]">
      {{ label }}
    </span>
    <span
      class="relative mt-1.5 block text-3xl font-extrabold leading-none tabular-nums"
      :style="{ color: accent }"
    >
      {{ formatted }}
    </span>
    <span
      v-if="trend !== undefined"
      class="relative mt-1 block text-xs font-semibold"
      :class="trend >= 0 ? 'text-green-500' : 'text-red-500'"
    >
      {{ trend >= 0 ? '▲' : '▼' }} {{ Math.abs(trend) }}%
    </span>
  </div>
</template>

<style scoped>
.stat-card {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  padding: 18px 20px;
  background: color-mix(in srgb, var(--accent) 6%, var(--el-bg-color));
  border: 1px solid color-mix(in srgb, var(--accent) 24%, var(--el-border-color-lighter));
  border-left: 4px solid var(--accent);
  box-shadow: 0 2px 8px -4px rgba(0, 0, 0, 0.15);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.25);
}
.stat-watermark {
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 84px;
  opacity: 0.1;
  pointer-events: none;
}
.stat-watermark :deep(svg) {
  stroke-width: 1.75;
}
</style>
