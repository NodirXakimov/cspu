<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import {
  ScanFace,
  UserCheck,
  Clock,
  UserX,
  Percent,
  Search,
  Building2,
  Layers,
  GraduationCap,
  BookOpen,
  ListFilter,
  X,
} from 'lucide-vue-next'
import StatCard from '@/core/components/StatCard.vue'
import SectionCard from '@/core/components/SectionCard.vue'
import { useAppStore } from '@/core/stores/app.store'
import { formatDateTime } from '@/core/utils/format'
import { BRIGHT } from '@/core/utils/palette'
import { useAttendance, ALL } from '../composables/useAttendance'

const { t } = useI18n()
const { locale } = storeToRefs(useAppStore())
const {
  filtered,
  summary,
  facultyNames,
  loading,
  faculty,
  specialty,
  group,
  subject,
  status,
  search,
  date,
  facultyOptions,
  specialtyOptions,
  groupOptions,
  subjectOptions,
  statuses,
  fetchAll,
} = useAttendance()

const facultyLabel = (code: string) => facultyNames.value[code] ?? code

const facultySelect = computed(() =>
  facultyOptions.value.map((o) =>
    o.value === ALL ? { ...o, label: t('attendance.allFaculties') } : o,
  ),
)
const specialtySelect = computed(() =>
  specialtyOptions.value.map((o) =>
    o.value === ALL ? { ...o, label: t('attendance.allSpecialties') } : o,
  ),
)
const groupSelect = computed(() =>
  groupOptions.value.map((o) =>
    o.value === ALL ? { ...o, label: t('attendance.allGroups') } : o,
  ),
)
const subjectSelect = computed(() =>
  subjectOptions.value.map((o) =>
    o.value === ALL ? { ...o, label: t('attendance.allSubjects') } : o,
  ),
)

const hasFilters = computed(
  () =>
    faculty.value !== ALL ||
    specialty.value !== ALL ||
    group.value !== ALL ||
    subject.value !== ALL ||
    status.value !== ALL ||
    search.value.trim() !== '' ||
    date.value !== null,
)
function clearFilters() {
  faculty.value = ALL
  specialty.value = ALL
  group.value = ALL
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
    <!-- Stat cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        :label="$t('attendance.present')"
        :value="summary?.present ?? null"
        :icon="UserCheck"
        :accent="BRIGHT.emerald"
      />
      <StatCard
        :label="$t('attendance.late')"
        :value="summary?.late ?? null"
        :icon="Clock"
        :accent="BRIGHT.amber"
      />
      <StatCard
        :label="$t('attendance.absent')"
        :value="summary?.absent ?? null"
        :icon="UserX"
        :accent="BRIGHT.rose"
      />
      <StatCard
        :label="$t('attendance.rate')"
        :value="summary?.rate ?? null"
        format="percent"
        :icon="Percent"
        :accent="BRIGHT.blue"
      />
    </div>

    <SectionCard :icon="ScanFace" :title="$t('attendance.title')">
      <!-- Filters -->
      <div class="att-filters mb-4 mt-1 flex flex-nowrap items-center gap-3 overflow-x-auto py-2">
        <el-input
          v-model="search"
          size="large"
          clearable
          class="shrink-0 !w-64"
          :placeholder="$t('attendance.searchName')"
        >
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-select
          v-model="faculty"
          size="large"
          class="shrink-0 !w-52"
          :placeholder="$t('attendance.faculty')"
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
          :placeholder="$t('attendance.specialty')"
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
          :placeholder="$t('attendance.group')"
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
          v-model="subject"
          size="large"
          class="shrink-0 !w-48"
          :placeholder="$t('attendance.subject')"
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
          :placeholder="$t('attendance.status')"
        >
          <template #prefix><el-icon><ListFilter /></el-icon></template>
          <el-option :value="ALL" :label="$t('attendance.allStatuses')" />
          <el-option
            v-for="s in statuses"
            :key="s"
            :value="s"
            :label="$t(`attendance.${s}`)"
          />
        </el-select>
        <el-date-picker
          v-model="date"
          type="date"
          size="large"
          clearable
          class="shrink-0 !w-44"
          :placeholder="$t('attendance.date')"
        />
        <button v-if="hasFilters" class="clear-btn shrink-0" @click="clearFilters">
          <el-icon :size="16"><X /></el-icon>{{ $t('attendance.clear') }}
        </button>
      </div>

      <div ref="tableWrap">
        <el-table
          :data="paged"
          v-loading="loading"
          border
          class="att-table"
          :height="tableHeight"
          style="width: 100%"
        >
          <el-table-column prop="studentId" label="ID" width="96" align="center" />
          <el-table-column prop="studentName" :label="$t('attendance.student')" min-width="160" />
          <el-table-column :label="$t('attendance.faculty')" min-width="150">
            <template #default="{ row }">{{ facultyLabel(row.faculty) }}</template>
          </el-table-column>
          <el-table-column prop="specialty" :label="$t('attendance.specialty')" min-width="170" />
          <el-table-column prop="group" :label="$t('attendance.group')" width="150" />
          <el-table-column prop="subject" :label="$t('attendance.subject')" min-width="140" />
          <el-table-column :label="$t('attendance.lessonPair')" width="110" align="center">
            <template #default="{ row }">{{ row.lessonPair }}-{{ $t('attendance.pairSuffix') }}</template>
          </el-table-column>
          <el-table-column prop="device" :label="$t('attendance.device')" width="120" align="center" />
          <el-table-column :label="$t('attendance.time')" min-width="180">
            <template #default="{ row }">{{ formatDateTime(row.timestamp, locale) }}</template>
          </el-table-column>
          <el-table-column :label="$t('attendance.status')" width="140" align="center">
            <template #default="{ row }">
              <span v-if="row?.status" class="att-badge" :class="`att-badge--${row.status}`">
                {{ $t(`attendance.${row.status}`) }}
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
.att-filters :deep(.el-input__wrapper),
.att-filters :deep(.el-select__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px color-mix(in srgb, #64748b 45%, var(--el-border-color)) inset;
  transition: box-shadow 0.18s ease;
}
.att-filters :deep(.el-input__wrapper:hover),
.att-filters :deep(.el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--el-color-primary) 55%, transparent) inset;
}
.att-filters :deep(.el-input__wrapper.is-focus),
.att-filters :deep(.el-select__wrapper.is-focused) {
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
.att-table :deep(th.el-table__cell) {
  background: color-mix(in srgb, #5b7290 10%, var(--el-bg-color));
}
.att-table :deep(th.el-table__cell .cell) {
  color: var(--el-text-color-primary);
  font-weight: 700;
  text-align: center;
  justify-content: center;
  white-space: normal;
  line-height: 1.15;
}
/* Lighter borders + slate-blue row hover (no zebra striping) */
.att-table {
  --el-table-border-color: color-mix(in srgb, #64748b 24%, var(--el-border-color));
  --el-table-row-hover-bg-color: color-mix(in srgb, #5b7290 13%, transparent);
}

/* Outlined status badges with a leading colored dot */
.att-badge {
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
.att-badge::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: var(--badge-c);
  flex-shrink: 0;
}
.att-badge--present {
  --badge-c: #10b981;
}
.att-badge--late {
  --badge-c: #f59e0b;
}
.att-badge--absent {
  --badge-c: #f43f5e;
}
.att-badge--excused {
  --badge-c: #3b82f6;
}
.att-badge--earlyLeave {
  --badge-c: #8b5cf6;
}
.att-badge--remote {
  --badge-c: #06b6d4;
}
</style>
