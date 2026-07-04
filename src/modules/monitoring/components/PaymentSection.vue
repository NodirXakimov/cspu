<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import type { EChartsOption } from 'echarts'
import { CreditCard } from 'lucide-vue-next'
import BaseChart from '@/core/components/BaseChart.vue'
import { useAppStore } from '@/core/stores/app.store'
import { formatNumber } from '@/core/utils/format'
import MonitorSection from './MonitorSection.vue'
import MonitorStat from './MonitorStat.vue'
import type { PaymentBlock } from '../types/monitoring.types'

const props = defineProps<{ data: PaymentBlock | null }>()
const { t } = useI18n()
const { locale } = storeToRefs(useAppStore())

const chartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      radius: ['50%', '72%'],
      center: ['50%', '45%'],
      itemStyle: { borderRadius: 6, borderColor: 'var(--el-bg-color)', borderWidth: 2 },
      label: { show: false },
      data: [
        { name: t('monitoring.paid'), value: props.data?.paid ?? 0, itemStyle: { color: '#67c23a' } },
        { name: t('monitoring.notPaid'), value: props.data?.notPaid ?? 0, itemStyle: { color: '#f56c6c' } },
      ],
    },
  ],
}))
</script>

<template>
  <MonitorSection :title="t('monitoring.payment')" :icon="CreditCard" accent="#67c23a">
    <div class="flex gap-3">
      <MonitorStat
        :label="t('monitoring.totalStudents')"
        :value="data ? formatNumber(data.totalStudents, locale) : '—'"
        accent="#409eff"
      />
      <MonitorStat
        :label="t('monitoring.paid')"
        :value="data ? formatNumber(data.paid, locale) : '—'"
        accent="#67c23a"
      />
      <MonitorStat
        :label="t('monitoring.notPaid')"
        :value="data ? formatNumber(data.notPaid, locale) : '—'"
        accent="#f56c6c"
      />
    </div>

    <div class="min-h-0 flex-1">
      <BaseChart :option="chartOption" height="100%" />
    </div>
  </MonitorSection>
</template>
