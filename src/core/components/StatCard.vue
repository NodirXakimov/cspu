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
  { format: 'number', currency: 'UZS', duration: 1200 },
)

const display = useCountUp(
  toRef(props, 'value'),
  props.duration,
)

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
  <el-card shadow="hover" class="stat-card" body-class="!px-5 !py-6">
    <div class="flex items-center gap-4">
      <div
        v-if="icon"
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
        :style="{ backgroundColor: accent ?? 'var(--el-color-primary)' }"
      >
        <el-icon :size="24"><component :is="icon" /></el-icon>
      </div>
      <div class="min-w-0">
        <p class="m-0 text-sm text-[var(--el-text-color-secondary)] truncate">
          {{ label }}
        </p>
        <p class="m-0 text-2xl font-semibold leading-tight tabular-nums">
          {{ formatted }}
        </p>
        <p
          v-if="trend !== undefined"
          class="m-0 text-xs"
          :class="trend >= 0 ? 'text-green-500' : 'text-red-500'"
        >
          {{ trend >= 0 ? '▲' : '▼' }} {{ Math.abs(trend) }}%
        </p>
      </div>
    </div>
  </el-card>
</template>
