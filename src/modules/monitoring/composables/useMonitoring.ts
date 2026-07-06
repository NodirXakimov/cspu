import { onScopeDispose, ref, watch } from 'vue'
import {
  monitoringService,
  ALL_FACULTIES,
  PERFORMANCE_TERMS,
  type PerformanceTerm,
} from '../services/monitoring.service'
import { facultiesService } from '@/modules/faculties/services/faculties.service'
import type {
  AttendanceBlock,
  AttendanceRange,
  PaymentBlock,
  PerformanceBlock,
  TeacherDiscipline,
} from '../types/monitoring.types'

const REFRESH_MS = 30_000

export interface FacultyOption {
  value: string
  label: string
}

export function useMonitoring() {
  const teacher = ref<TeacherDiscipline | null>(null)
  const attendance = ref<AttendanceBlock | null>(null)
  const payments = ref<PaymentBlock | null>(null)
  const performance = ref<PerformanceBlock | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const loading = ref(false)

  // Global faculty filter (applies to all four cards)
  const faculty = ref<string>(ALL_FACULTIES)
  const facultyOptions = ref<FacultyOption[]>([{ value: ALL_FACULTIES, label: '' }])

  // Section toggles
  const range = ref<AttendanceRange>('week')
  const term = ref<PerformanceTerm>(PERFORMANCE_TERMS[PERFORMANCE_TERMS.length - 1])

  async function refreshAttendance() {
    attendance.value = await monitoringService.attendance(range.value, faculty.value)
  }
  async function refreshPerformance() {
    performance.value = await monitoringService.performance(term.value, faculty.value)
  }

  async function fetchAll() {
    loading.value = true
    try {
      const [t, p] = await Promise.all([
        monitoringService.teacherDiscipline(faculty.value),
        monitoringService.payments(faculty.value),
      ])
      teacher.value = t
      payments.value = p
      await Promise.all([refreshAttendance(), refreshPerformance()])
      lastUpdated.value = new Date()
    } finally {
      loading.value = false
    }
  }

  async function loadFaculties() {
    const list = await facultiesService.list()
    facultyOptions.value = [
      { value: ALL_FACULTIES, label: '' }, // label filled by the view (i18n)
      ...list.map((f) => ({ value: f.code, label: f.name })),
    ]
  }

  // Re-fetch on any filter/toggle change.
  watch(faculty, fetchAll)
  watch(range, refreshAttendance)
  watch(term, refreshPerformance)

  loadFaculties()
  fetchAll()
  const timer = window.setInterval(fetchAll, REFRESH_MS)
  onScopeDispose(() => window.clearInterval(timer))

  return {
    teacher,
    attendance,
    payments,
    performance,
    lastUpdated,
    loading,
    faculty,
    facultyOptions,
    range,
    term,
    terms: PERFORMANCE_TERMS,
    fetchAll,
  }
}
