<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import type { EChartsOption } from 'echarts'
import { ClipboardCheck, Users, Clock, UserCheck } from 'lucide-vue-next'
import BaseChart from '@/core/components/BaseChart.vue'
import { useAppStore } from '@/core/stores/app.store'
import MonitorSection from './MonitorSection.vue'
import MonitorStat from './MonitorStat.vue'
import { useMonitorScale } from '../composables/useMonitorScale'
import { useElementSize } from '../composables/useElementSize'
import { M } from '../palette'
import type { TeacherDiscipline } from '../types/monitoring.types'

const props = defineProps<{ data: TeacherDiscipline | null }>()
const { t, te } = useI18n()
const { theme } = storeToRefs(useAppStore())

const { scale } = useMonitorScale()
const fs = (n: number) => Math.round(n * scale.value)

// Donut center text sized from its real rendered width (fits the ring at any size).
const { setEl: setDonutEl, width: donutW } = useElementSize()
const dw = computed(() => donutW.value || 180)
const titleFs = computed(() => Math.max(12, Math.round(dw.value * 0.115)))
const subFs = computed(() => Math.max(6, Math.round(dw.value * 0.036)))
const sliceFs = computed(() => Math.max(9, Math.round(dw.value * 0.05)))

// ECharts (canvas) can't read CSS vars — resolve the donut gap to a real hex.
const gap = computed(() => (theme.value === 'dark' ? '#1d1e1f' : '#ffffff'))

/** Teachers on time today = total − late (aggregate only; no per-teacher PII). */
const onTime = computed(() =>
  props.data ? Math.max(props.data.total - props.data.lateToday, 0) : 0,
)
const rate = computed(() =>
  props.data && props.data.total
    ? Math.round((onTime.value / props.data.total) * 100)
    : 0,
)

/** Localized weekday label (falls back to the raw label if not mapped). */
function dayLabel(raw: string): string {
  const key = `monitoring.days.${raw.toLowerCase()}`
  return te(key) ? t(key) : raw
}

/** On-time vs late donut — the public, name-free view of teacher discipline. */
const punctualityOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item' },
  title: {
    text: `${rate.value}%`,
    subtext: t('monitoring.onTimeRate'),
    left: 'center',
    top: 'center',
    itemGap: 2,
    textStyle: { fontSize: titleFs.value, fontWeight: 800, color: M.emerald },
    subtextStyle: { fontSize: subFs.value },
  },
  series: [
    {
      type: 'pie',
      radius: ['46%', '84%'],
      center: ['50%', '50%'],
      itemStyle: { borderRadius: 10, borderColor: gap.value, borderWidth: 4 },
      label: {
        show: true,
        position: 'inside',
        formatter: (p: { percent?: number }) => `${Math.round(p.percent ?? 0)}%`,
        color: '#fff',
        fontSize: sliceFs.value,
        fontWeight: 700,
      },
      emphasis: { scale: true, scaleSize: 6 },
      data: [
        { name: t('monitoring.onTime'), value: onTime.value, itemStyle: { color: M.emerald } },
        { name: t('monitoring.late'), value: props.data?.lateToday ?? 0, itemStyle: { color: M.rose } },
      ],
    },
  ],
}))

const chartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 30, right: 12, top: 30, bottom: 24 },
  xAxis: {
    type: 'category',
    data: props.data?.weekly.map((d) => dayLabel(d.label)) ?? [],
  },
  yAxis: { type: 'value' },
  series: [
    {
      type: 'bar',
      barWidth: '55%',
      itemStyle: { color: M.rose, borderRadius: [4, 4, 0, 0] },
      label: {
        show: true,
        position: 'top',
        fontWeight: 700,
        fontSize: fs(15),
        color: 'inherit',
      },
      data: props.data?.weekly.map((d) => d.value) ?? [],
    },
  ],
}))
</script>

<template>
  <MonitorSection :title="t('monitoring.teachers')" :icon="ClipboardCheck" :accent="M.amber">
    <div class="flex flex-wrap gap-3">
      <MonitorStat
        :label="t('monitoring.totalTeachers')"
        :value="data?.total ?? null"
        :icon="Users"
        :accent="M.blue"
      />
      <MonitorStat
        :label="t('monitoring.notLate')"
        :value="data ? onTime : null"
        :icon="UserCheck"
        :accent="M.emerald"
      />
      <MonitorStat
        :label="t('monitoring.lateToday')"
        :value="data?.lateToday ?? null"
        :icon="Clock"
        :accent="M.rose"
      />
    </div>

    <!-- punctuality donut + weekly late chart — stacked below lg -->
    <div class="flex min-h-0 flex-1 flex-col items-center gap-3 lg:flex-row">
      <!-- On-time donut with a compact legend (aggregate, no teacher names) -->
      <div class="flex min-h-[180px] w-full flex-1 items-center gap-2 lg:h-full lg:min-h-0">
        <div class="flex h-full min-h-[160px] flex-1 items-center justify-center lg:min-h-0">
          <div :ref="setDonutEl" class="donut-box">
            <BaseChart :option="punctualityOption" height="100%" />
          </div>
        </div>
        <div class="flex flex-col justify-center gap-3 pr-1">
          <div class="pt-row">
            <span class="pt-label" :style="{ color: M.emerald }">
              <span class="dot" :style="{ background: M.emerald }" />
              {{ t('monitoring.onTime') }}
            </span>
            <span class="pt-val">{{ onTime }}</span>
          </div>
          <div class="pt-row">
            <span class="pt-label" :style="{ color: M.rose }">
              <span class="dot" :style="{ background: M.rose }" />
              {{ t('monitoring.late') }}
            </span>
            <span class="pt-val">{{ data?.lateToday ?? '—' }}</span>
          </div>
          <div class="my-1 border-t border-[var(--el-border-color-lighter)]" />
          <div class="pt-row">
            <span class="pt-label font-bold">{{ t('monitoring.totalTeachers') }}</span>
            <span class="pt-val text-lg font-extrabold">{{ data?.total ?? '—' }}</span>
          </div>
        </div>
      </div>

      <div class="min-h-[180px] w-full flex-1 lg:h-full lg:min-h-0">
        <BaseChart :option="chartOption" height="100%" />
      </div>
    </div>
  </MonitorSection>
</template>

<style scoped>
/* Keep the donut a centered square so its ring band stays consistent. */
.donut-box {
  height: 100%;
  aspect-ratio: 1 / 1;
  max-height: 100%;
  max-width: 100%;
  margin-inline: auto;
}

/* Punctuality legend rows beside the donut */
.pt-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: calc(15px * var(--mscale, 1));
}
.pt-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  white-space: nowrap;
}
.pt-val {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  text-align: right;
  white-space: nowrap;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  flex-shrink: 0;
}
</style>
