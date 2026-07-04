<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { EChartsOption } from 'echarts'
import { CalendarCheck } from 'lucide-vue-next'
import BaseChart from '@/core/components/BaseChart.vue'
import MonitorSection from './MonitorSection.vue'
import MonitorStat from './MonitorStat.vue'
import type { AttendanceBlock, AttendanceRange } from '../types/monitoring.types'

const props = defineProps<{ data: AttendanceBlock | null }>()
const range = defineModel<AttendanceRange>('range', { required: true })

const { t } = useI18n()

const ranges: AttendanceRange[] = ['week', 'month', 'semester']

const deltaUp = computed(() => (props.data?.deltaPct ?? 0) >= 0)

const chartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis', valueFormatter: (v) => `${v}%` },
  grid: { left: 36, right: 12, top: 12, bottom: 24 },
  xAxis: { type: 'category', data: props.data?.series.map((d) => d.label) ?? [] },
  yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
  series: [
    {
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.15 },
      lineStyle: { width: 3 },
      itemStyle: { color: '#409eff' },
      data: props.data?.series.map((d) => d.value) ?? [],
    },
  ],
}))
</script>

<template>
  <MonitorSection :title="t('monitoring.attendance')" :icon="CalendarCheck" accent="#409eff">
    <template #toolbar>
      <el-radio-group v-model="range" size="small">
        <el-radio-button v-for="r in ranges" :key="r" :value="r">
          {{ t(`monitoring.${r}`) }}
        </el-radio-button>
      </el-radio-group>
    </template>

    <div class="flex gap-3">
      <MonitorStat
        :label="t('monitoring.active')"
        :value="data?.active ?? null"
        accent="#409eff"
      />
      <MonitorStat
        :label="t('monitoring.todayAttendance')"
        :value="data?.today ?? null"
        accent="#67c23a"
      />
      <MonitorStat
        :label="t('monitoring.vsYesterday')"
        :value="data ? `${deltaUp ? '▲' : '▼'} ${Math.abs(data.deltaPct)}%` : '—'"
        :accent="deltaUp ? '#67c23a' : '#f56c6c'"
      />
    </div>

    <div class="min-h-0 flex-1">
      <BaseChart :option="chartOption" height="100%" />
    </div>
  </MonitorSection>
</template>
