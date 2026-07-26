<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Trophy,
  Users,
  TriangleAlert,
  AlertTriangle,
  Star,
  Gauge,
  Percent,
  Search,
  Building2,
  Layers,
  GraduationCap,
  ShieldAlert,
  X,
} from 'lucide-vue-next'
import StatCard from '@/core/components/StatCard.vue'
import SectionCard from '@/core/components/SectionCard.vue'
import { BRIGHT } from '@/core/utils/palette'
import { useRatings, ALL } from '../composables/useRatings'
import type { RiskLevel } from '../types/ratings.types'

const { t } = useI18n()
const {
  filtered,
  summary,
  facultyNames,
  loading,
  faculty,
  specialty,
  group,
  risk,
  search,
  facultyOptions,
  specialtyOptions,
  groupOptions,
  risks,
  fetchAll,
} = useRatings()

const facultyLabel = (code: string) => facultyNames.value[code] ?? code

// Score bar colour follows the risk level.
const RISK_COLOR: Record<RiskLevel, string> = {
  critical: '#f43f5e',
  atRisk: '#f59e0b',
  average: '#3b82f6',
  good: '#10b981',
}
const scoreColor = (r: RiskLevel) => RISK_COLOR[r]

const facultySelect = computed(() =>
  facultyOptions.value.map((o) =>
    o.value === ALL ? { ...o, label: t('ratings.allFaculties') } : o,
  ),
)
const specialtySelect = computed(() =>
  specialtyOptions.value.map((o) =>
    o.value === ALL ? { ...o, label: t('ratings.allSpecialties') } : o,
  ),
)
const groupSelect = computed(() =>
  groupOptions.value.map((o) =>
    o.value === ALL ? { ...o, label: t('ratings.allGroups') } : o,
  ),
)

const hasFilters = computed(
  () =>
    faculty.value !== ALL ||
    specialty.value !== ALL ||
    group.value !== ALL ||
    risk.value !== ALL ||
    search.value.trim() !== '',
)
function clearFilters() {
  faculty.value = ALL
  specialty.value = ALL
  group.value = ALL
  risk.value = ALL
  search.value = ''
}

// Client-side pagination.
const page = ref(1)
const pageSize = ref(20)
const pageSizes = [10, 20, 50, 100]
const paged = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value),
)
watch(filtered, () => {
  page.value = 1
})

// Stretch the table to the bottom of the page; its body scrolls when rows overflow.
const tableWrap = ref<HTMLElement | null>(null)
const tableHeight = ref(360)
function updateHeight() {
  if (!tableWrap.value) return
  const top = tableWrap.value.getBoundingClientRect().top
  tableHeight.value = Math.max(240, Math.round(window.innerHeight - top - 96))
}
onMounted(() => {
  fetchAll()
  updateHeight()
  window.addEventListener('resize', updateHeight, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('resize', updateHeight))
watch([filtered, loading], () => requestAnimationFrame(updateHeight))
</script>

<template>
  <div class="space-y-4">
    <!-- 6 whole-university stat cards, single row -->
    <div class="grid grid-cols-6 gap-3">
      <StatCard
        :label="$t('ratings.total')"
        :value="summary?.total ?? null"
        :icon="Users"
        :accent="BRIGHT.blue"
      />
      <StatCard
        :label="$t('ratings.critical')"
        :value="summary?.critical ?? null"
        :icon="AlertTriangle"
        :accent="BRIGHT.rose"
      />
      <StatCard
        :label="$t('ratings.atRisk')"
        :value="summary?.atRisk ?? null"
        :icon="TriangleAlert"
        :accent="BRIGHT.amber"
      />
      <StatCard
        :label="$t('ratings.avgGpa')"
        :value="summary?.avgGpa ?? null"
        format="decimal"
        :icon="Star"
        :accent="BRIGHT.violet"
      />
      <StatCard
        :label="$t('ratings.avgScore')"
        :value="summary?.avgScore ?? null"
        :icon="Gauge"
        :accent="BRIGHT.cyan"
      />
      <StatCard
        :label="$t('ratings.passRate')"
        :value="summary?.passRate ?? null"
        format="percent"
        :icon="Percent"
        :accent="BRIGHT.emerald"
      />
    </div>

    <SectionCard :icon="Trophy" :title="$t('ratings.title')">
      <!-- Filters -->
      <div class="rat-filters mb-4 mt-1 flex flex-nowrap items-center gap-3 overflow-x-auto py-2">
        <el-input
          v-model="search"
          size="large"
          clearable
          class="shrink-0 !w-64"
          :placeholder="$t('ratings.searchName')"
        >
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-select
          v-model="faculty"
          size="large"
          class="shrink-0 !w-52"
          :placeholder="$t('ratings.faculty')"
        >
          <template #prefix><el-icon><Building2 /></el-icon></template>
          <el-option
            v-for="o in facultySelect"
            :key="o.value"
            :value="o.value"
            :label="o.label"
          />
        </el-select>
        <el-select
          v-model="specialty"
          size="large"
          class="shrink-0 !w-52"
          :placeholder="$t('ratings.specialty')"
        >
          <template #prefix><el-icon><Layers /></el-icon></template>
          <el-option
            v-for="o in specialtySelect"
            :key="o.value"
            :value="o.value"
            :label="o.label"
          />
        </el-select>
        <el-select
          v-model="group"
          size="large"
          class="shrink-0 !w-44"
          :placeholder="$t('ratings.group')"
        >
          <template #prefix><el-icon><GraduationCap /></el-icon></template>
          <el-option
            v-for="o in groupSelect"
            :key="o.value"
            :value="o.value"
            :label="o.label"
          />
        </el-select>
        <el-select
          v-model="risk"
          size="large"
          class="shrink-0 !w-48"
          :placeholder="$t('ratings.riskLevel')"
        >
          <template #prefix><el-icon><ShieldAlert /></el-icon></template>
          <el-option :value="ALL" :label="$t('ratings.allRisks')" />
          <el-option
            v-for="r in risks"
            :key="r"
            :value="r"
            :label="$t(`ratings.${r}`)"
          />
        </el-select>
        <button v-if="hasFilters" class="clear-btn shrink-0" @click="clearFilters">
          <el-icon :size="16"><X /></el-icon>{{ $t('ratings.clear') }}
        </button>
      </div>

      <div ref="tableWrap">
        <el-table
          :data="paged"
          v-loading="loading"
          border
          class="rat-table"
          :height="tableHeight"
          style="width: 100%"
        >
          <el-table-column prop="studentId" label="ID" width="96" align="center" />
          <el-table-column prop="studentName" :label="$t('ratings.student')" min-width="160" />
          <el-table-column :label="$t('ratings.faculty')" min-width="150">
            <template #default="{ row }">{{ facultyLabel(row.faculty) }}</template>
          </el-table-column>
          <el-table-column prop="specialty" :label="$t('ratings.specialty')" min-width="170" />
          <el-table-column prop="group" :label="$t('ratings.group')" width="150" />
          <el-table-column :label="$t('ratings.gpa')" width="100" align="center">
            <template #default="{ row }">{{ row.gpa.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column :label="$t('ratings.score')" width="200">
            <template #default="{ row }">
              <div class="flex items-center gap-2">
                <el-progress
                  class="flex-1"
                  :percentage="row.score"
                  :stroke-width="8"
                  :show-text="false"
                  :color="scoreColor(row.riskLevel)"
                />
                <span class="shrink-0 whitespace-nowrap text-sm font-semibold tabular-nums">
                  {{ row.score }}
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ratings.failed')" width="120" align="center">
            <template #default="{ row }">
              <span
                v-if="row.failedSubjects > 0"
                class="font-semibold text-[var(--el-color-danger)]"
              >
                {{ row.failedSubjects }}
              </span>
              <span v-else class="text-[var(--el-text-color-secondary)]">—</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('ratings.risk')" width="180" align="center">
            <template #default="{ row }">
              <span v-if="row?.riskLevel" class="rat-badge" :class="`rat-badge--${row.riskLevel}`">
                {{ $t(`ratings.${row.riskLevel}`) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="mt-4 flex justify-center">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          :total="filtered.length"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :hide-on-single-page="false"
        />
      </div>
    </SectionCard>
  </div>
</template>

<style scoped>
/* Slate field borders in the resting (non-focused) state, small rounded */
.rat-filters :deep(.el-input__wrapper),
.rat-filters :deep(.el-select__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px color-mix(in srgb, #64748b 45%, var(--el-border-color)) inset;
  transition: box-shadow 0.18s ease;
}
.rat-filters :deep(.el-input__wrapper:hover),
.rat-filters :deep(.el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--el-color-primary) 55%, transparent) inset;
}
.rat-filters :deep(.el-input__wrapper.is-focus),
.rat-filters :deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1.5px var(--el-color-primary) inset !important;
}

/* Modern Clear button */
.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  color: var(--el-color-primary);
  background: color-mix(in srgb, var(--el-color-primary) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--el-color-primary) 35%, transparent);
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;
}
.clear-btn:hover {
  color: #fff;
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
}

/* Slate-blue header band + centered, darker, tight-wrapping header text */
.rat-table :deep(th.el-table__cell) {
  background: color-mix(in srgb, #5b7290 10%, var(--el-bg-color));
}
.rat-table :deep(th.el-table__cell .cell) {
  color: var(--el-text-color-primary);
  font-weight: 700;
  text-align: center;
  justify-content: center;
  white-space: normal;
  line-height: 1.15;
}
/* Lighter borders + slate-blue row hover (no zebra striping) */
.rat-table {
  --el-table-border-color: color-mix(in srgb, #64748b 24%, var(--el-border-color));
  --el-table-row-hover-bg-color: color-mix(in srgb, #5b7290 13%, transparent);
}

/* Outlined risk badges with a leading colored dot */
.rat-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.01em;
  border: 1.5px solid var(--badge-c);
  color: var(--badge-c);
  background: color-mix(in srgb, var(--badge-c) 12%, transparent);
  white-space: nowrap;
}
.rat-badge::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: var(--badge-c);
  flex-shrink: 0;
}
.rat-badge--critical {
  --badge-c: #f43f5e;
}
.rat-badge--atRisk {
  --badge-c: #f59e0b;
}
.rat-badge--average {
  --badge-c: #3b82f6;
}
.rat-badge--good {
  --badge-c: #10b981;
}
</style>
