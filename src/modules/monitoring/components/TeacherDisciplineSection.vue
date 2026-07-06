<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import type { EChartsOption } from 'echarts'
import { ClipboardCheck, Users, Clock, CalendarClock, UserRound } from 'lucide-vue-next'
import BaseChart from '@/core/components/BaseChart.vue'
import { useAppStore } from '@/core/stores/app.store'
import MonitorSection from './MonitorSection.vue'
import MonitorStat from './MonitorStat.vue'
import { M } from '../palette'
import type { TeacherDiscipline } from '../types/monitoring.types'

const props = defineProps<{ data: TeacherDiscipline | null }>()
const { t } = useI18n()
const { theme } = storeToRefs(useAppStore())
const isDark = computed(() => theme.value === 'dark')

/** Localized weekday label (falls back to the raw label if not mapped). */
function dayLabel(raw: string): string {
  const key = `monitoring.days.${raw.toLowerCase()}`
  const translated = t(key)
  return translated === key ? raw : translated
}

/** Bright badge colour by how many minutes late. */
function lateColor(min: number): string {
  if (min >= 25) return '#ef4444' // red
  if (min >= 15) return '#f97316' // orange
  return '#f59e0b' // amber
}

/** Outlined badge style: coloured text + border, faint tinted fill. */
function lateStyle(min: number) {
  const c = lateColor(min)
  return {
    color: c,
    borderColor: c,
    backgroundColor: `color-mix(in srgb, ${c} 14%, transparent)`,
  }
}

const chartOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 30, right: 12, top: 12, bottom: 24 },
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

    <!-- table + chart side by side -->
    <div class="flex min-h-0 flex-1 gap-3">
      <div
        class="h-full min-h-0 flex-1 overflow-hidden rounded-lg border border-[var(--el-border-color)]"
      >
        <el-table
          :data="data?.lateList ?? []"
          height="100%"
          class="late-table"
          :style="{ '--th-color': isDark ? '#dbeafe' : '#1e40af' }"
        >
          <el-table-column prop="name" :label="t('monitoring.name')" min-width="110">
            <template #default="{ row }">
              <span
                class="teacher-name inline-flex items-center gap-2"
                :style="{ color: isDark ? '#ffffff' : '#1a1a1a' }"
              >
                <span
                  class="teacher-avatar"
                  :style="{
                    color: isDark ? '#93c5fd' : 'var(--el-color-primary)',
                    backgroundColor: isDark
                      ? 'rgba(147,197,253,0.18)'
                      : 'color-mix(in srgb, var(--el-color-primary) 16%, transparent)',
                  }"
                >
                  <el-icon :size="15"><UserRound /></el-icon>
                </span>
                {{ row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.faculty')" width="100" align="center">
            <template #default="{ row }">
              <span class="fac-chip">{{ row.faculty }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.lateMin')" width="94" align="center">
            <template #default="{ row }">
              <span class="late-badge" :style="lateStyle(row.lateMin)">
                {{ row.lateMin }} {{ t('monitoring.min') }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="t('monitoring.time')" width="100" align="right">
            <template #default="{ row }">
              <span class="inline-flex items-center gap-1 font-semibold">
                <el-icon class="text-[var(--el-text-color-secondary)]"><CalendarClock /></el-icon>
                {{ row.time }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="h-full min-h-0 flex-1">
        <BaseChart :option="chartOption" height="100%" />
      </div>
    </div>
  </MonitorSection>
</template>

<style scoped>
.late-table {
  font-size: 15px;
}
.late-table :deep(.el-table__cell) {
  padding: 8px 0;
}

/* Header text: theme-aware (var set inline on the table) */
.late-table :deep(.el-table__header th .cell) {
  font-size: 14px;
  font-weight: 700;
  color: var(--th-color);
}

/* Teacher name (colour set inline, theme-aware) */
.teacher-name {
  font-weight: 600;
}

/* Round colored avatar behind the name icon (colours set inline) */
.teacher-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 9999px;
}

/* Faculty short code chip */
.fac-chip {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--el-color-primary);
  background: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
}

/* Outlined, modern late badge */
.late-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 9999px;
  border: 1.5px solid;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}
</style>
