<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { EChartsOption } from 'echarts'
import BaseChart from '@/core/components/BaseChart.vue'
import { CHART_COLORS } from '@/core/utils/constants'
import { useRatings } from '../composables/useRatings'

const { t } = useI18n()
const { students, analytics, loading, fetchAll } = useRatings()

const distributionOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 44, right: 16, top: 24, bottom: 32 },
  xAxis: {
    type: 'category',
    data: analytics.value?.distribution.map((d) => d.label) ?? [],
  },
  yAxis: { type: 'value' },
  series: [
    {
      name: t('ratings.distribution'),
      type: 'bar',
      barWidth: '55%',
      itemStyle: { color: '#409eff', borderRadius: [6, 6, 0, 0] },
      data: analytics.value?.distribution.map((d) => d.value) ?? [],
    },
  ],
}))

const byFacultyOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 44, right: 16, top: 24, bottom: 32 },
  xAxis: {
    type: 'category',
    data: analytics.value?.byFaculty.map((d) => d.label) ?? [],
  },
  yAxis: { type: 'value', max: 100 },
  series: [
    {
      name: t('ratings.byFaculty'),
      type: 'bar',
      barWidth: '50%',
      itemStyle: { borderRadius: [6, 6, 0, 0] },
      data:
        analytics.value?.byFaculty.map((d, i) => ({
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
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <el-card shadow="never">
        <template #header>{{ $t('ratings.distribution') }}</template>
        <BaseChart :option="distributionOption" :loading="loading" />
      </el-card>
      <el-card shadow="never">
        <template #header>{{ $t('ratings.byFaculty') }}</template>
        <BaseChart :option="byFacultyOption" :loading="loading" />
      </el-card>
    </div>

    <el-card shadow="never">
      <template #header>{{ $t('ratings.topStudents') }}</template>
      <el-table :data="students" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="rank" :label="$t('ratings.rank')" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.rank <= 3" type="warning" effect="dark" round>
              {{ row.rank }}
            </el-tag>
            <span v-else>{{ row.rank }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="studentName" :label="$t('ratings.student')" min-width="160" />
        <el-table-column prop="faculty" :label="$t('ratings.faculty')" width="110" />
        <el-table-column prop="gpa" :label="$t('ratings.gpa')" width="120" sortable />
        <el-table-column :label="$t('ratings.score')" min-width="180" sortable prop="score">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-progress
                :percentage="row.score"
                :stroke-width="10"
                :show-text="false"
                class="flex-1"
              />
              <span class="w-8 text-right text-sm">{{ row.score }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
