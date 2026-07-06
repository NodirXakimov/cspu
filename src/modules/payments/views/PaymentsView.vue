<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import type { EChartsOption } from 'echarts'
import { Money, Wallet, Warning } from '@element-plus/icons-vue'
import { LineChart, PieChart, Receipt } from 'lucide-vue-next'
import BaseChart from '@/core/components/BaseChart.vue'
import StatCard from '@/core/components/StatCard.vue'
import SectionCard from '@/core/components/SectionCard.vue'
import { useAppStore } from '@/core/stores/app.store'
import { formatMoney, formatDate } from '@/core/utils/format'
import { CHART_COLORS } from '@/core/utils/constants'
import { BRIGHT } from '@/core/utils/palette'
import { usePayments } from '../composables/usePayments'
import type { PaymentCategory, PaymentStatus } from '../types/payments.types'

const { t } = useI18n()
const { locale, theme } = storeToRefs(useAppStore())
const { payments, summary, analytics, loading, fetchAll } = usePayments()

// ECharts (canvas) can't read CSS vars — resolve the slice gap to a real hex.
const gap = computed(() => (theme.value === 'dark' ? '#1d1e1f' : '#ffffff'))

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
      itemStyle: { color: BRIGHT.emerald },
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
      itemStyle: { borderRadius: 8, borderColor: gap.value, borderWidth: 3 },
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
        :value="summary?.collected ?? null"
        format="money"
        :icon="Money"
        :accent="BRIGHT.emerald"
      />
      <StatCard
        :label="$t('payments.pending')"
        :value="summary?.pending ?? null"
        format="money"
        :icon="Wallet"
        :accent="BRIGHT.amber"
      />
      <StatCard
        :label="$t('payments.overdue')"
        :value="summary?.overdue ?? null"
        format="money"
        :icon="Warning"
        :accent="BRIGHT.rose"
      />
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <SectionCard :icon="LineChart" :title="$t('payments.monthly')" class="lg:col-span-2">
        <BaseChart :option="monthlyOption" :loading="loading" />
      </SectionCard>
      <SectionCard :icon="PieChart" :title="$t('payments.byCategory')">
        <BaseChart :option="categoryOption" :loading="loading" />
      </SectionCard>
    </div>

    <SectionCard :icon="Receipt" :title="$t('payments.title')">
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
    </SectionCard>
  </div>
</template>
