<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import type { EChartsOption } from 'echarts'
import { Banknote, Users, BadgeCheck, CircleAlert } from 'lucide-vue-next'
import BaseChart from '@/core/components/BaseChart.vue'
import { useAppStore } from '@/core/stores/app.store'
import { formatSpaced } from '@/core/utils/format'
import MonitorSection from './MonitorSection.vue'
import MonitorStat from './MonitorStat.vue'
import { M } from '../palette'
import type { PaymentBlock } from '../types/monitoring.types'

const props = defineProps<{ data: PaymentBlock | null }>()
const { t } = useI18n()
const { theme } = storeToRefs(useAppStore())

// ECharts (canvas) can't read CSS vars — resolve the gap colour to a real hex.
const gap = computed(() => (theme.value === 'dark' ? '#1d1e1f' : '#ffffff'))

// Theme-aware dark-blue for the money texts.
const textColor = computed(() => (theme.value === 'dark' ? '#dbeafe' : '#1e40af'))

/** Compact money: 78 804 000 000 -> "78.8 mlrd" (space grouping, localized unit). */
function money(v: number | undefined | null): string {
  if (v == null) return '—'
  if (v >= 1e9) return `${formatSpaced(v / 1e9, 1)} ${t('monitoring.bln')}`
  if (v >= 1e6) return `${formatSpaced(v / 1e6, 1)} ${t('monitoring.mln')}`
  return formatSpaced(v)
}

const rate = computed(() =>
  props.data && props.data.totalStudents
    ? Math.round((props.data.paid / props.data.totalStudents) * 100)
    : 0,
)

const chartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item' },
  title: {
    text: `${rate.value}%`,
    subtext: t('monitoring.collectionRate'),
    left: 'center',
    top: 'center',
    itemGap: 2,
    textStyle: { fontSize: 30, fontWeight: 800, color: M.emerald },
    subtextStyle: { fontSize: 14 },
  },
  series: [
    {
      type: 'pie',
      radius: ['48%', '84%'],
      center: ['50%', '50%'],
      itemStyle: { borderRadius: 10, borderColor: gap.value, borderWidth: 4 },
      label: {
        show: true,
        position: 'inside',
        formatter: '{d}%',
        color: '#fff',
        fontSize: 16,
        fontWeight: 700,
      },
      emphasis: { scale: true, scaleSize: 6 },
      data: [
        { name: t('monitoring.paid'), value: props.data?.paid ?? 0, itemStyle: { color: M.emerald } },
        { name: t('monitoring.notPaid'), value: props.data?.notPaid ?? 0, itemStyle: { color: M.rose } },
      ],
    },
  ],
}))
</script>

<template>
  <MonitorSection :title="t('monitoring.payment')" :icon="Banknote" :accent="M.emerald">
    <div class="flex gap-3">
      <MonitorStat
        :label="t('monitoring.totalStudents')"
        :value="data?.totalStudents ?? null"
        :icon="Users"
        :accent="M.blue"
      />
      <MonitorStat
        :label="t('monitoring.paid')"
        :value="data?.paid ?? null"
        :icon="BadgeCheck"
        :accent="M.emerald"
      />
      <MonitorStat
        :label="t('monitoring.notPaid')"
        :value="data?.notPaid ?? null"
        :icon="CircleAlert"
        :accent="M.rose"
      />
    </div>

    <!-- donut + money summary side by side -->
    <div class="flex min-h-0 flex-1 items-center gap-2">
      <div class="h-full min-h-0 flex-1">
        <BaseChart :option="chartOption" height="100%" />
      </div>

      <div class="flex flex-1 flex-col justify-center gap-3 pr-1" :style="{ color: textColor }">
        <div class="money-row">
          <span class="money-label font-semibold" :style="{ color: M.emerald }">
            <span class="dot" :style="{ background: M.emerald }" />
            {{ t('monitoring.collected') }}
          </span>
          <span class="money-val">{{ money(data?.collectedAmount) }}</span>
        </div>
        <div class="money-row">
          <span class="money-label font-semibold" :style="{ color: M.rose }">
            <span class="dot" :style="{ background: M.rose }" />
            {{ t('monitoring.outstanding') }}
          </span>
          <span class="money-val">{{ money(data?.outstandingAmount) }}</span>
        </div>

        <div class="my-1 border-t border-[var(--el-border-color-lighter)]" />

        <div class="money-row">
          <span class="money-label font-bold">{{ t('monitoring.totalExpected') }}</span>
          <span class="money-val text-lg font-extrabold">{{ money(data?.totalAmount) }}</span>
        </div>

        <div class="mt-5">
          <div class="mb-1.5 flex justify-between text-md font-semibold" :style="{ color: M.emerald }">
            <span>{{ t('monitoring.collectionRate') }}</span>
            <span class="font-extrabold">{{ rate }}%</span>
          </div>
          <el-progress
            :percentage="rate"
            :color="M.emerald"
            :stroke-width="16"
            :show-text="false"
          />
        </div>
      </div>
    </div>
  </MonitorSection>
</template>

<style scoped>
.money-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 15px;
}
.money-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  flex-shrink: 0;
}
.money-val {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  text-align: right;
  white-space: nowrap;
}
</style>
