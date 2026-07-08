<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { EChartsOption } from 'echarts'
import { CalendarCheck, Users, UserCheck, TrendingUp, TrendingDown } from 'lucide-vue-next'
import BaseChart from '@/core/components/BaseChart.vue'
import MonitorSection from './MonitorSection.vue'
import MonitorStat from './MonitorStat.vue'
import { M } from '../palette'
import type { AttendanceBlock, AttendanceRange } from '../types/monitoring.types'

const props = defineProps<{ data: AttendanceBlock | null }>()
const range = defineModel<AttendanceRange>('range', { required: true })

const { t, te } = useI18n()

const ranges: AttendanceRange[] = ['week', 'month', 'semester']

const deltaUp = computed(() => (props.data?.deltaPct ?? 0) >= 0)

/** Localize weekday labels; non-day labels (W1, Sep…) pass through unchanged. */
function dayLabel(raw: string): string {
  const key = `monitoring.days.${raw.toLowerCase()}`
  return te(key) ? t(key) : raw
}

const chartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis', valueFormatter: (v) => `${v}%` },
  grid: { left: 36, right: 16, top: 30, bottom: 24 },
  xAxis: { type: 'category', data: props.data?.series.map((d) => dayLabel(d.label)) ?? [] },
  yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
  series: [
    {
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.15 },
      lineStyle: { width: 3 },
      itemStyle: { color: M.blue },
      label: {
        show: true,
        position: 'top',
        formatter: '{c}%',
        fontSize: 13,
        fontWeight: 700,
        color: 'inherit',
      },
      data: props.data?.series.map((d) => d.value) ?? [],
    },
  ],
}))
</script>

<template>
  <MonitorSection :title="t('monitoring.attendance')" :icon="CalendarCheck" :accent="M.blue">
    <template #toolbar>
      <el-radio-group v-model="range" size="small" class="term-seg">
        <el-radio-button v-for="r in ranges" :key="r" :value="r">
          {{ t(`monitoring.${r}`) }}
        </el-radio-button>
      </el-radio-group>
    </template>

    <div class="flex gap-3">
      <MonitorStat
        :label="t('monitoring.active')"
        :value="data?.active ?? null"
        :icon="Users"
        :accent="M.blue"
      />
      <MonitorStat
        :label="t('monitoring.todayAttendance')"
        :value="data?.today ?? null"
        :icon="UserCheck"
        :accent="M.emerald"
      />
      <MonitorStat
        :label="t('monitoring.vsYesterday')"
        :value="data ? `${deltaUp ? '▲' : '▼'} ${Math.abs(data.deltaPct)}%` : '—'"
        :icon="deltaUp ? TrendingUp : TrendingDown"
        :accent="deltaUp ? M.emerald : M.rose"
      />
    </div>

    <div class="min-h-0 flex-1">
      <BaseChart :option="chartOption" height="100%" />
    </div>
  </MonitorSection>
</template>
