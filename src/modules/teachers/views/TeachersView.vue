<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import {
  ClipboardCheck,
  Users,
  UserCheck,
  Clock,
  UserX,
  Percent,
  Timer,
  Search,
  Building2,
  BookOpen,
  ListFilter,
  X,
} from 'lucide-vue-next'
import StatCard from '@/core/components/StatCard.vue'
import SectionCard from '@/core/components/SectionCard.vue'
import { useAppStore } from '@/core/stores/app.store'
import { formatDateTime } from '@/core/utils/format'
import { BRIGHT } from '@/core/utils/palette'
import { useTeachers, ALL } from '../composables/useTeachers'

const { t } = useI18n()
const { locale } = storeToRefs(useAppStore())
const {
  filtered,
  summary,
  departmentNames,
  loading,
  department,
  subject,
  status,
  search,
  date,
  departmentOptions,
  subjectOptions,
  statuses,
  fetchAll,
} = useTeachers()

const departmentLabel = (code: string) => departmentNames.value[code] ?? code

const departmentSelect = computed(() =>
  departmentOptions.value.map((o) =>
    o.value === ALL ? { ...o, label: t('teachers.allDepartments') } : o,
  ),
)
const subjectSelect = computed(() =>
  subjectOptions.value.map((o) =>
    o.value === ALL ? { ...o, label: t('teachers.allSubjects') } : o,
  ),
)

const hasFilters = computed(
  () =>
    department.value !== ALL ||
    subject.value !== ALL ||
    status.value !== ALL ||
    search.value.trim() !== '' ||
    date.value !== null,
)
function clearFilters() {
  department.value = ALL
  subject.value = ALL
  status.value = ALL
  search.value = ''
  date.value = null
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
        :label="$t('teachers.total')"
        :value="summary?.total ?? null"
        :icon="Users"
        :accent="BRIGHT.blue"
      />
      <StatCard
        :label="$t('teachers.present')"
        :value="summary?.present ?? null"
        :icon="UserCheck"
        :accent="BRIGHT.emerald"
      />
      <StatCard
        :label="$t('teachers.late')"
        :value="summary?.late ?? null"
        :icon="Clock"
        :accent="BRIGHT.amber"
      />
      <StatCard
        :label="$t('teachers.absent')"
        :value="summary?.absent ?? null"
        :icon="UserX"
        :accent="BRIGHT.rose"
      />
      <StatCard
        :label="$t('teachers.rate')"
        :value="summary?.rate ?? null"
        format="percent"
        :icon="Percent"
        :accent="BRIGHT.violet"
      />
      <StatCard
        :label="$t('teachers.avgLate')"
        :value="summary?.avgLate ?? null"
        :icon="Timer"
        :accent="BRIGHT.cyan"
      />
    </div>

    <SectionCard :icon="ClipboardCheck" :title="$t('teachers.title')">
      <!-- Filters -->
      <div class="tea-filters mb-4 mt-1 flex flex-nowrap items-center gap-3 overflow-x-auto py-2">
        <el-input
          v-model="search"
          size="large"
          clearable
          class="shrink-0 !w-64"
          :placeholder="$t('teachers.searchName')"
        >
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-select
          v-model="department"
          size="large"
          class="shrink-0 !w-56"
          :placeholder="$t('teachers.department')"
        >
          <template #prefix><el-icon><Building2 /></el-icon></template>
          <el-option
            v-for="o in departmentSelect"
            :key="o.value"
            :value="o.value"
            :label="o.label"
          />
        </el-select>
        <el-select
          v-model="subject"
          size="large"
          class="shrink-0 !w-48"
          :placeholder="$t('teachers.subject')"
        >
          <template #prefix><el-icon><BookOpen /></el-icon></template>
          <el-option
            v-for="o in subjectSelect"
            :key="o.value"
            :value="o.value"
            :label="o.label"
          />
        </el-select>
        <el-select
          v-model="status"
          size="large"
          class="shrink-0 !w-44"
          :placeholder="$t('teachers.status')"
        >
          <template #prefix><el-icon><ListFilter /></el-icon></template>
          <el-option :value="ALL" :label="$t('teachers.allStatuses')" />
          <el-option
            v-for="s in statuses"
            :key="s"
            :value="s"
            :label="$t(`teachers.${s}`)"
          />
        </el-select>
        <el-date-picker
          v-model="date"
          type="date"
          size="large"
          clearable
          class="shrink-0 !w-44"
          :placeholder="$t('teachers.date')"
        />
        <button v-if="hasFilters" class="clear-btn shrink-0" @click="clearFilters">
          <el-icon :size="16"><X /></el-icon>{{ $t('teachers.clear') }}
        </button>
      </div>

      <div ref="tableWrap">
        <el-table
          :data="paged"
          v-loading="loading"
          border
          class="tea-table"
          :height="tableHeight"
          style="width: 100%"
        >
          <el-table-column prop="teacherId" label="ID" width="96" align="center" />
          <el-table-column prop="name" :label="$t('teachers.teacher')" min-width="150" />
          <el-table-column :label="$t('teachers.department')" min-width="180">
            <template #default="{ row }">{{ departmentLabel(row.department) }}</template>
          </el-table-column>
          <el-table-column prop="subject" :label="$t('teachers.subject')" min-width="140" />
          <el-table-column :label="$t('teachers.lessonPair')" width="100" align="center">
            <template #default="{ row }">{{ row.lessonPair }}-{{ $t('teachers.pairSuffix') }}</template>
          </el-table-column>
          <el-table-column :label="$t('teachers.lateMinutes')" width="120" align="center">
            <template #default="{ row }">
              <span v-if="row.status === 'late'" class="font-semibold text-[var(--el-color-warning)]">
                {{ row.lateMinutes }} {{ $t('teachers.lateSuffix') }}
              </span>
              <span v-else class="text-[var(--el-text-color-secondary)]">—</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('teachers.time')" min-width="180">
            <template #default="{ row }">{{ formatDateTime(row.timestamp, locale) }}</template>
          </el-table-column>
          <el-table-column :label="$t('teachers.status')" width="140" align="center">
            <template #default="{ row }">
              <span class="tea-badge" :class="`tea-badge--${row.status}`">
                {{ $t(`teachers.${row.status}`) }}
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
.tea-filters :deep(.el-input__wrapper),
.tea-filters :deep(.el-select__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px color-mix(in srgb, #64748b 45%, var(--el-border-color)) inset;
  transition: box-shadow 0.18s ease;
}
.tea-filters :deep(.el-input__wrapper:hover),
.tea-filters :deep(.el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--el-color-primary) 55%, transparent) inset;
}
.tea-filters :deep(.el-input__wrapper.is-focus),
.tea-filters :deep(.el-select__wrapper.is-focused) {
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
.tea-table :deep(th.el-table__cell) {
  background: color-mix(in srgb, #5b7290 10%, var(--el-bg-color));
}
.tea-table :deep(th.el-table__cell .cell) {
  color: var(--el-text-color-primary);
  font-weight: 700;
  text-align: center;
  justify-content: center;
  white-space: normal;
  line-height: 1.15;
}
/* Lighter borders + slate-blue row hover (no zebra striping) */
.tea-table {
  --el-table-border-color: color-mix(in srgb, #64748b 24%, var(--el-border-color));
  --el-table-row-hover-bg-color: color-mix(in srgb, #5b7290 13%, transparent);
}

/* Outlined status badges with a leading colored dot */
.tea-badge {
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
}
.tea-badge::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: var(--badge-c);
  flex-shrink: 0;
}
.tea-badge--present {
  --badge-c: #10b981;
}
.tea-badge--late {
  --badge-c: #f59e0b;
}
.tea-badge--absent {
  --badge-c: #f43f5e;
}
.tea-badge--excused {
  --badge-c: #3b82f6;
}
</style>
