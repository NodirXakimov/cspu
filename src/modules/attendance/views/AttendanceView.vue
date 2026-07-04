<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import type { EChartsOption } from 'echarts'
import { CircleCheck, Clock, CircleClose } from '@element-plus/icons-vue'
import BaseChart from '@/core/components/BaseChart.vue'
import StatCard from '@/core/components/StatCard.vue'
import { useAppStore } from '@/core/stores/app.store'
import { formatDateTime } from '@/core/utils/format'
import { useAttendance } from '../composables/useAttendance'
import type { AttendanceStatus } from '../types/attendance.types'

const { t } = useI18n()
const { locale } = storeToRefs(useAppStore())
const { records, summary, trend, loading, fetchAll } = useAttendance()

const statusMeta: Record<AttendanceStatus, { type: 'success' | 'warning' | 'danger'; key: string }> = {
  present: { type: 'success', key: 'attendance.present' },
  late: { type: 'warning', key: 'attendance.late' },
  absent: { type: 'danger', key: 'attendance.absent' },
}

const trendOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis', valueFormatter: (v) => `${v}%` },
  grid: { left: 40, right: 16, top: 24, bottom: 32 },
  xAxis: {
    type: 'category',
    data: trend.value?.daily.map((d) => d.label) ?? [],
  },
  yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
  series: [
    {
      name: t('attendance.rate'),
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.15 },
      lineStyle: { width: 3 },
      itemStyle: { color: '#409eff' },
      data: trend.value?.daily.map((d) => d.value) ?? [],
    },
  ],
}))

onMounted(fetchAll)
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        :label="$t('attendance.present')"
        :value="summary?.present ?? null"
        :icon="CircleCheck"
        accent="#67c23a"
      />
      <StatCard
        :label="$t('attendance.late')"
        :value="summary?.late ?? null"
        :icon="Clock"
        accent="#e6a23c"
      />
      <StatCard
        :label="$t('attendance.absent')"
        :value="summary?.absent ?? null"
        :icon="CircleClose"
        accent="#f56c6c"
      />
      <StatCard
        :label="$t('attendance.rate')"
        :value="summary?.rate ?? null"
        format="percent"
        accent="#409eff"
      />
    </div>

    <el-card shadow="never">
      <template #header>{{ $t('attendance.trendTitle') }}</template>
      <BaseChart :option="trendOption" :loading="loading" height="300px" />
    </el-card>

    <el-card shadow="never">
      <template #header>{{ $t('attendance.title') }}</template>
      <el-table :data="records" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="studentId" label="ID" width="100" />
        <el-table-column prop="studentName" :label="$t('attendance.student')" min-width="160" />
        <el-table-column prop="faculty" :label="$t('attendance.faculty')" width="110" />
        <el-table-column prop="device" :label="$t('attendance.device')" width="110" />
        <el-table-column :label="$t('attendance.time')" min-width="170">
          <template #default="{ row }">{{ formatDateTime(row.timestamp, locale) }}</template>
        </el-table-column>
        <el-table-column :label="$t('attendance.status')" width="130">
          <template #default="{ row }">
            <el-tag :type="statusMeta[row.status as AttendanceStatus].type" effect="light">
              {{ $t(statusMeta[row.status as AttendanceStatus].key) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
