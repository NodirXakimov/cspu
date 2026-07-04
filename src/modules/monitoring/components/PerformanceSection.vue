<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { EChartsOption } from 'echarts'
import { GraduationCap } from 'lucide-vue-next'
import BaseChart from '@/core/components/BaseChart.vue'
import MonitorSection from './MonitorSection.vue'
import MonitorStat from './MonitorStat.vue'
import type { PerformanceBlock } from '../types/monitoring.types'
import type { PerformanceTerm } from '../services/monitoring.service'

const props = defineProps<{
  data: PerformanceBlock | null
  terms: readonly PerformanceTerm[]
}>()
const term = defineModel<PerformanceTerm>('term', { required: true })

const { t } = useI18n()

const chartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 36, right: 12, top: 12, bottom: 24 },
  xAxis: { type: 'category', data: props.data?.distribution.map((d) => d.label) ?? [] },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      barWidth: '55%',
      itemStyle: { color: '#9b59b6', borderRadius: [4, 4, 0, 0] },
      data: props.data?.distribution.map((d) => d.value) ?? [],
    },
  ],
}))
</script>

<template>
  <MonitorSection :title="t('monitoring.performance')" :icon="GraduationCap" accent="#9b59b6">
    <template #toolbar>
      <el-radio-group v-model="term" size="small">
        <el-radio-button v-for="tm in terms" :key="tm" :value="tm">
          {{ tm }}
        </el-radio-button>
      </el-radio-group>
    </template>

    <div class="flex gap-3">
      <MonitorStat
        :label="t('monitoring.avgGpa')"
        :value="data?.avgGpa ?? null"
        format="decimal"
        accent="#9b59b6"
      />
      <MonitorStat
        :label="t('monitoring.evaluated')"
        :value="data?.evaluated ?? null"
        accent="#409eff"
      />
      <MonitorStat
        :label="t('monitoring.failed')"
        :value="data?.failed ?? null"
        accent="#f56c6c"
      />
    </div>

    <div class="min-h-0 flex-1">
      <BaseChart :option="chartOption" height="100%" />
    </div>
  </MonitorSection>
</template>
