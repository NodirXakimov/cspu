<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import type { EChartsOption } from 'echarts'
import { User, School, Checked, Money } from '@element-plus/icons-vue'
import BaseChart from '@/core/components/BaseChart.vue'
import StatCard from '@/core/components/StatCard.vue'
import { useAppStore } from '@/core/stores/app.store'
import { formatMoney } from '@/core/utils/format'
import { CHART_COLORS } from '@/core/utils/constants'
import { useDashboard } from '../composables/useDashboard'

const { t } = useI18n()
const { locale, theme } = storeToRefs(useAppStore())
const { overview, loading, fetch } = useDashboard()

// ECharts (canvas) can't read CSS vars — resolve the slice gap to a real hex.
const gap = computed(() => (theme.value === 'dark' ? '#1d1e1f' : '#ffffff'))

const attendanceOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis', valueFormatter: (v) => `${v}%` },
  grid: { left: 40, right: 16, top: 20, bottom: 28 },
  xAxis: { type: 'category', data: overview.value?.attendanceTrend.map((d) => d.label) ?? [] },
  yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
  series: [
    {
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.15 },
      lineStyle: { width: 3 },
      itemStyle: { color: '#409eff' },
      data: overview.value?.attendanceTrend.map((d) => d.value) ?? [],
    },
  ],
}))

const headcountOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 48, right: 16, top: 20, bottom: 28 },
  xAxis: { type: 'category', data: overview.value?.facultyHeadcount.map((d) => d.label) ?? [] },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      barWidth: '55%',
      itemStyle: { borderRadius: [6, 6, 0, 0] },
      data:
        overview.value?.facultyHeadcount.map((d, i) => ({
          value: d.value,
          itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
        })) ?? [],
    },
  ],
}))

const paymentsOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item', valueFormatter: (v) => formatMoney(Number(v), locale.value) },
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      itemStyle: { borderRadius: 8, borderColor: gap.value, borderWidth: 3 },
      label: { show: false },
      data:
        overview.value?.paymentsByCategory.map((d, i) => ({
          name: t(`payments.${d.label}`),
          value: d.value,
          itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
        })) ?? [],
    },
  ],
}))

const ratingsOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 44, right: 16, top: 20, bottom: 28 },
  xAxis: { type: 'category', data: overview.value?.ratingsDistribution.map((d) => d.label) ?? [] },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      barWidth: '55%',
      itemStyle: { color: '#9b59b6', borderRadius: [6, 6, 0, 0] },
      data: overview.value?.ratingsDistribution.map((d) => d.value) ?? [],
    },
  ],
}))

onMounted(fetch)
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        :label="$t('dashboard.students')"
        :value="overview?.stats.students ?? null"
        :icon="User"
        accent="#409eff"
      />
      <StatCard
        :label="$t('dashboard.faculties')"
        :value="overview?.stats.faculties ?? null"
        :icon="School"
        accent="#9b59b6"
      />
      <StatCard
        :label="$t('dashboard.attendanceRate')"
        :value="overview?.stats.attendanceRate ?? null"
        format="percent"
        :icon="Checked"
        accent="#67c23a"
      />
      <StatCard
        :label="$t('dashboard.revenue')"
        :value="overview?.stats.revenue ?? null"
        format="money"
        :icon="Money"
        accent="#e6a23c"
      />
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <el-card shadow="never" class="lg:col-span-2">
        <template #header>{{ $t('dashboard.attendanceTrend') }}</template>
        <BaseChart :option="attendanceOption" :loading="loading" height="300px" />
      </el-card>
      <el-card shadow="never">
        <template #header>{{ $t('dashboard.paymentsByCategory') }}</template>
        <BaseChart :option="paymentsOption" :loading="loading" height="300px" />
      </el-card>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <el-card shadow="never">
        <template #header>{{ $t('dashboard.facultyHeadcount') }}</template>
        <BaseChart :option="headcountOption" :loading="loading" />
      </el-card>
      <el-card shadow="never">
        <template #header>{{ $t('dashboard.ratingsDistribution') }}</template>
        <BaseChart :option="ratingsOption" :loading="loading" />
      </el-card>
    </div>
  </div>
</template>
