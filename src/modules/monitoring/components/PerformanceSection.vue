<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import type { EChartsOption } from 'echarts'
import { Trophy, Star, ClipboardCheck, CircleX } from 'lucide-vue-next'
import BaseChart from '@/core/components/BaseChart.vue'
import { useAppStore } from '@/core/stores/app.store'
import MonitorSection from './MonitorSection.vue'
import MonitorStat from './MonitorStat.vue'
import { useMonitorScale } from '../composables/useMonitorScale'
import { M } from '../palette'
import type { PerformanceBlock } from '../types/monitoring.types'
import type { PerformanceTerm } from '../services/monitoring.service'

const props = defineProps<{
  data: PerformanceBlock | null
  terms: readonly PerformanceTerm[]
}>()
const term = defineModel<PerformanceTerm>('term', { required: true })

const { t } = useI18n()
const { scale } = useMonitorScale()
const fs = (n: number) => Math.round(n * scale.value)
const { theme } = storeToRefs(useAppStore())
// Bar-top labels: dark ink on light, light ink on dark ('inherit' rendered black).
const labelColor = computed(() => (theme.value === 'dark' ? '#e5e7eb' : '#1f2937'))

/** Cool vertical gradient — cyan → indigo → violet (keeps the section's violet identity). */
const BAR_GRADIENT = {
  type: 'linear' as const,
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    { offset: 0, color: '#22d3ee' }, // cyan-400 (top)
    { offset: 0.5, color: '#6366f1' }, // indigo-500
    { offset: 1, color: '#8b5cf6' }, // violet-500 (bottom)
  ],
}

const chartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 36, right: 12, top: 30, bottom: 24 },
  xAxis: { type: 'category', data: props.data?.distribution.map((d) => d.label) ?? [] },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      barWidth: '55%',
      itemStyle: { color: BAR_GRADIENT, borderRadius: [6, 6, 0, 0] },
      label: {
        show: true,
        position: 'top',
        fontWeight: 700,
        fontSize: fs(15),
        color: labelColor.value,
      },
      data: props.data?.distribution.map((d) => d.value) ?? [],
    },
  ],
}))
</script>

<template>
  <MonitorSection :title="t('monitoring.performance')" :icon="Trophy" :accent="M.violet">
    <template #toolbar>
      <el-radio-group v-model="term" size="small" class="term-seg">
        <el-radio-button v-for="tm in terms" :key="tm" :value="tm">
          {{ tm }}
        </el-radio-button>
      </el-radio-group>
    </template>

    <div class="flex flex-wrap gap-3">
      <MonitorStat
        :label="t('monitoring.avgGpa')"
        :value="data?.avgGpa ?? null"
        format="decimal"
        :icon="Star"
        :accent="M.violet"
      />
      <MonitorStat
        :label="t('monitoring.evaluated')"
        :value="data?.evaluated ?? null"
        :icon="ClipboardCheck"
        :accent="M.blue"
      />
      <MonitorStat
        :label="t('monitoring.failed')"
        :value="data?.failed ?? null"
        :icon="CircleX"
        :accent="M.rose"
      />
    </div>

    <div class="min-h-0 flex-1">
      <BaseChart :option="chartOption" height="100%" />
    </div>
  </MonitorSection>
</template>
