<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import type { EChartsOption } from 'echarts'
import { Banknote, Users, BadgeCheck, CircleAlert, Play, Pause } from 'lucide-vue-next'
import BaseChart from '@/core/components/BaseChart.vue'
import { useAppStore } from '@/core/stores/app.store'
import { formatSpaced } from '@/core/utils/format'
import MonitorSection from './MonitorSection.vue'
import MonitorStat from './MonitorStat.vue'
import PaymentDebtors from './PaymentDebtors.vue'
import { CONTRACT_FEE } from '../services/monitoring.service'
import { usePaymentCarousel } from '../composables/usePaymentCarousel'
import { M } from '../palette'
import type { DebtorStudent, PaymentBlock } from '../types/monitoring.types'

const props = defineProps<{
  data: PaymentBlock | null
  debtors: DebtorStudent[]
}>()
const { t } = useI18n()
const { theme } = storeToRefs(useAppStore())

// Carousel: summary ⇄ debtors, controlled by this tile's own header switcher.
const {
  view,
  playing,
  views,
  setView,
  togglePlay,
} = usePaymentCarousel()

const VIEW_LABEL_KEY: Record<string, string> = {
  summary: 'monitoring.viewSummary',
  debtors: 'monitoring.viewDebtors',
}

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
    <template #toolbar>
      <div class="switcher">
        <div class="seg-switch">
          <button
            v-for="v in views"
            :key="v"
            class="seg-btn"
            :class="{ active: view === v }"
            @click="setView(v)"
          >
            {{ t(VIEW_LABEL_KEY[v]) }}
          </button>
        </div>
        <el-tooltip :content="playing ? t('monitoring.pause') : t('monitoring.play')" placement="bottom">
          <button class="play-btn" @click="togglePlay">
            <el-icon :size="16">
              <Pause v-if="playing" />
              <Play v-else />
            </el-icon>
          </button>
        </el-tooltip>
      </div>
    </template>

    <transition name="carousel" mode="out-in">
      <!-- View A: payment summary (5s) -->
      <div v-if="view === 'summary'" key="summary" class="view flex min-h-0 flex-1 flex-col gap-2.5">
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
      </div>

      <!-- View B: contract-fee debtors board (20s) -->
      <PaymentDebtors
        v-else
        key="debtors"
        class="view"
        :items="debtors"
        :contract="CONTRACT_FEE"
      />
    </transition>
  </MonitorSection>
</template>

<style scoped>
/* Header switcher: segmented views + play/pause */
.switcher {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.seg-switch {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border-radius: 9999px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color);
}
.seg-btn {
  border: none;
  border-radius: 9999px;
  padding: 4px 11px;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}
.seg-btn:hover {
  color: var(--el-color-primary);
}
.seg-btn.active {
  background: var(--el-color-primary);
  color: #fff;
  box-shadow: 0 3px 10px -3px var(--el-color-primary);
}
.play-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 9px;
  background: transparent;
  color: var(--el-text-color-regular);
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}
.play-btn:hover {
  background: var(--el-fill-color);
  color: var(--el-color-primary);
}

/* Carousel: slide-x + fade between the two views */
.view {
  width: 100%;
}
.carousel-enter-active,
.carousel-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.carousel-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.carousel-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
@media (prefers-reduced-motion: reduce) {
  .carousel-enter-active,
  .carousel-leave-active {
    transition: opacity 0.3s ease;
  }
  .carousel-enter-from,
  .carousel-leave-to {
    transform: none;
  }
}

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
