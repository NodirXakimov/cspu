import { computed, ref } from 'vue'
import { paymentsService } from '../services/payments.service'
import { facultiesService } from '@/modules/faculties/services/faculties.service'
import type { Payment, PaymentsSummary, PaymentStatus } from '../types/payments.types'

export const ALL = 'all'

export interface Option {
  value: string
  label: string
}

export function usePayments() {
  const payments = ref<Payment[]>([])
  const summary = ref<PaymentsSummary | null>(null)
  const facultyNames = ref<Record<string, string>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filters (table only — cards stay whole-university).
  const faculty = ref<string>(ALL)
  const group = ref<string>(ALL)
  const status = ref<PaymentStatus | typeof ALL>(ALL)
  const search = ref('')

  const facultyOptions = computed<Option[]>(() => [
    { value: ALL, label: '' }, // label filled by the view (i18n)
    ...Object.entries(facultyNames.value).map(([value, label]) => ({ value, label })),
  ])

  // Groups available for the current faculty selection.
  const groupOptions = computed<Option[]>(() => {
    const pool =
      faculty.value === ALL
        ? payments.value
        : payments.value.filter((p) => p.faculty === faculty.value)
    const groups = Array.from(new Set(pool.map((p) => p.group))).sort()
    return [{ value: ALL, label: '' }, ...groups.map((g) => ({ value: g, label: g }))]
  })

  const filtered = computed<Payment[]>(() => {
    const q = search.value.trim().toLowerCase()
    return payments.value.filter((p) => {
      if (faculty.value !== ALL && p.faculty !== faculty.value) return false
      if (group.value !== ALL && p.group !== group.value) return false
      if (status.value !== ALL && p.status !== status.value) return false
      if (q && !p.studentName.toLowerCase().includes(q)) return false
      return true
    })
  })

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const [list, s, faculties] = await Promise.all([
        paymentsService.list(),
        paymentsService.summary(),
        facultiesService.list(),
      ])
      payments.value = list
      summary.value = s
      facultyNames.value = Object.fromEntries(faculties.map((f) => [f.code, f.name]))
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return {
    payments,
    filtered,
    summary,
    facultyNames,
    loading,
    error,
    faculty,
    group,
    status,
    search,
    facultyOptions,
    groupOptions,
    fetchAll,
  }
}
