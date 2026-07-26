<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import {
  Receipt,
  Banknote,
  Wallet,
  Percent,
  Users,
  BadgeCheck,
  CircleAlert,
  Search,
  Building2,
  GraduationCap,
  ListFilter,
  X,
} from 'lucide-vue-next'
import StatCard from '@/core/components/StatCard.vue'
import SectionCard from '@/core/components/SectionCard.vue'
import { useAppStore } from '@/core/stores/app.store'
import { formatMoney } from '@/core/utils/format'
import { BRIGHT } from '@/core/utils/palette'
import { usePayments, ALL } from '../composables/usePayments'
import type { PaymentStatus } from '../types/payments.types'

const { t } = useI18n()
const { locale } = storeToRefs(useAppStore())
const {
  filtered,
  summary,
  facultyNames,
  loading,
  faculty,
  group,
  status,
  search,
  facultyOptions,
  groupOptions,
  fetchAll,
} = usePayments()

const statusOptions: (PaymentStatus | typeof ALL)[] = ['all', 'paid', 'partial', 'unpaid']

const facultyLabel = (code: string) => facultyNames.value[code] ?? code
const unpaidOf = (contract: number, paid: number) => Math.max(contract - paid, 0)
const percentOf = (contract: number, paid: number) =>
  contract ? Math.round((paid / contract) * 100) : 0

// Faculty options with the localized "All" label.
const facultySelect = computed(() =>
  facultyOptions.value.map((o) =>
    o.value === ALL ? { ...o, label: t('payments.allFaculties') } : o,
  ),
)
const groupSelect = computed(() =>
  groupOptions.value.map((o) =>
    o.value === ALL ? { ...o, label: t('payments.allGroups') } : o,
  ),
)

const hasFilters = computed(
  () =>
    faculty.value !== ALL ||
    group.value !== ALL ||
    status.value !== ALL ||
    search.value.trim() !== '',
)
function clearFilters() {
  faculty.value = ALL
  group.value = ALL
  status.value = ALL
  search.value = ''
}

// Client-side pagination.
const page = ref(1)
const pageSize = ref(20)
const pageSizes = [10, 20, 50, 100]
const paged = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value),
)
// Any filter change → back to page 1.
watch(filtered, () => {
  page.value = 1
})

// Stretch the table to the bottom of the page; its body scrolls when rows overflow.
const tableWrap = ref<HTMLElement | null>(null)
const tableHeight = ref(360)
function updateHeight() {
  if (!tableWrap.value) return
  const top = tableWrap.value.getBoundingClientRect().top
  // leave room for the pager + card/page bottom padding
  tableHeight.value = Math.max(240, Math.round(window.innerHeight - top - 96))
}
onMounted(() => {
  fetchAll()
  updateHeight()
  window.addEventListener('resize', updateHeight, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('resize', updateHeight))
// Recompute once data is in (filters row height, etc. settle).
watch([filtered, loading], () => requestAnimationFrame(updateHeight))
</script>

<template>
  <div class="space-y-4">
    <!-- 6 whole-university stat cards, single row -->
    <div class="grid grid-cols-6 gap-3">
      <StatCard
        :label="$t('payments.totalStudents')"
        :value="summary?.totalStudents ?? null"
        :icon="Users"
        :accent="BRIGHT.blue"
      />
      <StatCard
        :label="$t('payments.paidStudents')"
        :value="summary?.paidStudents ?? null"
        :icon="BadgeCheck"
        :accent="BRIGHT.emerald"
      />
      <StatCard
        :label="$t('payments.unpaidStudents')"
        :value="summary?.unpaidStudents ?? null"
        :icon="CircleAlert"
        :accent="BRIGHT.rose"
      />
      <StatCard
        :label="$t('payments.collected')"
        :value="summary?.collected ?? null"
        format="moneyCompact"
        :unit-bln="$t('payments.bln')"
        :unit-mln="$t('payments.mln')"
        :icon="Banknote"
        :accent="BRIGHT.emerald"
      />
      <StatCard
        :label="$t('payments.outstanding')"
        :value="summary?.outstanding ?? null"
        format="moneyCompact"
        :unit-bln="$t('payments.bln')"
        :unit-mln="$t('payments.mln')"
        :icon="Wallet"
        :accent="BRIGHT.amber"
      />
      <StatCard
        :label="$t('payments.rate')"
        :value="summary?.rate ?? null"
        format="percent"
        :icon="Percent"
        :accent="BRIGHT.violet"
      />
    </div>

    <SectionCard :icon="Receipt" :title="$t('payments.title')">
      <!-- Filters — single line, styled like the faculties dialog fields -->
      <div class="pay-filters mb-4 mt-1 flex flex-nowrap items-center gap-3 overflow-x-auto py-2">
        <el-input
          v-model="search"
          size="large"
          clearable
          class="shrink-0 !w-64"
          :placeholder="$t('payments.searchName')"
        >
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-select
          v-model="faculty"
          size="large"
          class="shrink-0 !w-52"
          :placeholder="$t('payments.faculty')"
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
          v-model="group"
          size="large"
          class="shrink-0 !w-44"
          :placeholder="$t('payments.group')"
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
          v-model="status"
          size="large"
          class="shrink-0 !w-44"
          :placeholder="$t('payments.status')"
        >
          <template #prefix><el-icon><ListFilter /></el-icon></template>
          <el-option
            v-for="s in statusOptions"
            :key="s"
            :value="s"
            :label="s === 'all' ? $t('payments.allStatuses') : $t(`payments.${s}`)"
          />
        </el-select>
        <button
          v-if="hasFilters"
          class="clear-btn shrink-0"
          @click="clearFilters"
        >
          <el-icon :size="16"><X /></el-icon>{{ $t('payments.clear') }}
        </button>
      </div>

      <div ref="tableWrap">
        <el-table
          :data="paged"
          v-loading="loading"
          border
          class="pay-table"
          :height="tableHeight"
          style="width: 100%"
        >
        <el-table-column prop="id" label="ID" width="64" align="center" />
        <el-table-column prop="studentName" :label="$t('payments.student')" min-width="150" />
        <el-table-column :label="$t('payments.faculty')" min-width="150">
          <template #default="{ row }">{{ facultyLabel(row.faculty) }}</template>
        </el-table-column>
        <el-table-column prop="group" :label="$t('payments.group')" width="180" />
        <el-table-column :label="$t('payments.paidAmount')" width="180" align="right">
          <template #default="{ row }">{{ formatMoney(row.paid, locale) }}</template>
        </el-table-column>
        <el-table-column :label="$t('payments.unpaidAmount')" width="180" align="right">
          <template #default="{ row }">
            {{ formatMoney(unpaidOf(row.contract, row.paid), locale) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('payments.percent')" width="220">
          <template #default="{ row }">
            <div class="flex items-center gap-2">
              <el-progress
                class="flex-1"
                :percentage="percentOf(row.contract, row.paid)"
                :stroke-width="8"
                :show-text="false"
                :color="BRIGHT.emerald"
              />
              <span class="shrink-0 whitespace-nowrap text-sm font-semibold tabular-nums">
                {{ percentOf(row.contract, row.paid) }}%
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('payments.status')" width="130" align="center">
          <template #default="{ row }">
            <span class="pay-badge" :class="`pay-badge--${row.status}`">
              {{ $t(`payments.${row.status}`) }}
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
.pay-filters :deep(.el-input__wrapper),
.pay-filters :deep(.el-select__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px color-mix(in srgb, #64748b 45%, var(--el-border-color)) inset;
  transition: box-shadow 0.18s ease;
}
.pay-filters :deep(.el-input__wrapper:hover),
.pay-filters :deep(.el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--el-color-primary) 55%, transparent) inset;
}
.pay-filters :deep(.el-input__wrapper.is-focus),
.pay-filters :deep(.el-select__wrapper.is-focused) {
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
.clear-btn:hover:not(:disabled) {
  color: #fff;
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
.clear-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Slate-blue header band + centered, darker, tight-wrapping header text */
.pay-table :deep(th.el-table__cell) {
  background: color-mix(in srgb, #5b7290 10%, var(--el-bg-color));
}
.pay-table :deep(th.el-table__cell .cell) {
  color: var(--el-text-color-primary);
  font-weight: 700;
  text-align: center;
  justify-content: center;
  white-space: normal;
  line-height: 1.15;
}
/* Lighter borders + slate-blue row hover (no zebra striping) */
.pay-table {
  --el-table-border-color: color-mix(in srgb, #64748b 24%, var(--el-border-color));
  --el-table-row-hover-bg-color: color-mix(in srgb, #5b7290 13%, transparent);
}

/* Outlined status badges with a leading colored dot */
.pay-badge {
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
.pay-badge::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: var(--badge-c);
  flex-shrink: 0;
}
.pay-badge--paid {
  --badge-c: #10b981;
}
.pay-badge--partial {
  --badge-c: #f59e0b;
}
.pay-badge--unpaid {
  --badge-c: #f43f5e;
}
</style>
