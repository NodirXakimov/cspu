<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { EChartsOption } from 'echarts'
import { ClipboardCheck, Users, Clock } from 'lucide-vue-next'
import BaseChart from '@/core/components/BaseChart.vue'
import MonitorSection from './MonitorSection.vue'
import MonitorStat from './MonitorStat.vue'
import { M } from '../palette'
import type { TeacherDiscipline } from '../types/monitoring.types'

const props = defineProps<{ data: TeacherDiscipline | null }>()
const { t } = useI18n()

const chartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 30, right: 12, top: 12, bottom: 24 },
  xAxis: { type: 'category', data: props.data?.weekly.map((d) => d.label) ?? [] },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      barWidth: '55%',
      itemStyle: { color: M.rose, borderRadius: [4, 4, 0, 0] },
      data: props.data?.weekly.map((d) => d.value) ?? [],
    },
  ],
}))
</script>

<template>
  <MonitorSection :title="t('monitoring.teachers')" :icon="ClipboardCheck" :accent="M.amber">
    <div class="flex gap-3">
      <MonitorStat
        :label="t('monitoring.totalTeachers')"
        :value="data?.total ?? null"
        :icon="Users"
        :accent="M.blue"
      />
      <MonitorStat
        :label="t('monitoring.lateToday')"
        :value="data?.lateToday ?? null"
        :icon="Clock"
        :accent="M.rose"
      />
    </div>

    <BaseChart :option="chartOption" height="130px" />

    <div class="min-h-0 flex-1 overflow-hidden">
      <el-table :data="data?.lateList ?? []" height="100%" size="small">
        <el-table-column prop="name" :label="t('monitoring.name')" min-width="140" />
        <el-table-column prop="faculty" :label="t('monitoring.faculty')" width="90" />
        <el-table-column prop="time" :label="t('monitoring.time')" width="80" align="right" />
      </el-table>
    </div>
  </MonitorSection>
</template>
