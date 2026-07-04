<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import type { EChartsOption } from 'echarts'
import { Money, Wallet, Warning } from '@element-plus/icons-vue'
import BaseChart from '@/core/components/BaseChart.vue'
import StatCard from '@/core/components/StatCard.vue'
import { useAppStore } from '@/core/stores/app.store'
import { formatMoney, formatDate } from '@/core/utils/format'
import { CHART_COLORS } from '@/core/utils/constants'
import { usePayments } from '../composables/usePayments'
import type { PaymentCategory, PaymentStatus } from '../types/payments.types'

const { t } = useI18n()
const { locale } = storeToRefs(useAppStore())
const { payments, summary, analytics, loading, fetchAll } = usePayments()

const statusMeta: Record<PaymentStatus, 'success' | 'warning' | 'danger'> = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
}

const monthlyOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    valueFormatter: (v) => formatMoney(Number(v), locale.value),
  },
  grid: { left: 64, right: 16, top: 24, bottom: 32 },
  xAxis: {
    type: 'category',
    data: analytics.value?.monthly.map((d) => d.label) ?? [],
  },
  yAxis: {
    type: 'value',
    axisLabel: { formatter: (v: number) => `${v / 1_000_000}M` },
  },
  series: [
    {
      name: t('payments.monthly'),
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.2 },
      lineStyle: { width: 3 },
      itemStyle: { color: '#67c23a' },
      data: analytics.value?.monthly.map((d) => d.value) ?? [],
    },
  ],
}))

const categoryOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'item',
    valueFormatter: (v) => formatMoney(Number(v), locale.value),
  },
  legend: { bottom: 0 },
  series: [
    {
      name: t('payments.byCategory'),
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: 'var(--el-bg-color)', borderWidth: 2 },
      label: { show: false },
      data:
        analytics.value?.byCategory.map((d, i) => ({
          name: t(`payments.${d.label}`),
          value: d.value,
          itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
        })) ?? [],
    },
  ],
}))

onMounted(fetchAll)
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        :label="$t('payments.collected')"
        :value="summary ? formatMoney(summary.collected, locale) : '—'"
        :icon="Money"
        accent="#67c23a"
      />
      <StatCard
        :label="$t('payments.pending')"
        :value="summary ? formatMoney(summary.pending, locale) : '—'"
        :icon="Wallet"
        accent="#e6a23c"
      />
      <StatCard
        :label="$t('payments.overdue')"
        :value="summary ? formatMoney(summary.overdue, locale) : '—'"
        :icon="Warning"
        accent="#f56c6c"
      />
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <el-card shadow="never" class="lg:col-span-2">
        <template #header>{{ $t('payments.monthly') }}</template>
        <BaseChart :option="monthlyOption" :loading="loading" />
      </el-card>
      <el-card shadow="never">
        <template #header>{{ $t('payments.byCategory') }}</template>
        <BaseChart :option="categoryOption" :loading="loading" />
      </el-card>
    </div>

    <el-card shadow="never">
      <template #header>{{ $t('payments.title') }}</template>
      <el-table :data="payments" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="studentName" :label="$t('payments.student')" min-width="160" />
        <el-table-column prop="faculty" :label="$t('payments.faculty')" width="110" />
        <el-table-column :label="$t('payments.category')" width="130">
          <template #default="{ row }">
            {{ $t(`payments.${row.category as PaymentCategory}`) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('payments.amount')" min-width="150" align="right">
          <template #default="{ row }">{{ formatMoney(row.amount, locale) }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.date')" width="140">
          <template #default="{ row }">{{ formatDate(row.date, locale) }}</template>
        </el-table-column>
        <el-table-column :label="$t('payments.status')" width="120">
          <template #default="{ row }">
            <el-tag :type="statusMeta[row.status as PaymentStatus]" effect="light">
              {{ $t(`payments.${row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
