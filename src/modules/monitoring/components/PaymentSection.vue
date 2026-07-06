<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import type { EChartsOption } from 'echarts'
import { Banknote, Users, BadgeCheck, CircleAlert } from 'lucide-vue-next'
import BaseChart from '@/core/components/BaseChart.vue'
import { useAppStore } from '@/core/stores/app.store'
import MonitorSection from './MonitorSection.vue'
import MonitorStat from './MonitorStat.vue'
import { M } from '../palette'
import type { PaymentBlock } from '../types/monitoring.types'

const props = defineProps<{ data: PaymentBlock | null }>()
const { t } = useI18n()
const { theme } = storeToRefs(useAppStore())

// ECharts (canvas) can't read CSS vars — resolve the gap colour to a real hex.
const gap = computed(() => (theme.value === 'dark' ? '#1d1e1f' : '#ffffff'))

const chartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, icon: 'roundRect', itemGap: 20, itemWidth: 12, itemHeight: 12 },
  series: [
    {
      type: 'pie',
      radius: ['40%', '78%'],
      center: ['50%', '42%'],
      itemStyle: { borderRadius: 10, borderColor: gap.value, borderWidth: 4 },
      label: { show: false },
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

    <div class="min-h-0 flex-1">
      <BaseChart :option="chartOption" height="100%" />
    </div>
  </MonitorSection>
</template>
