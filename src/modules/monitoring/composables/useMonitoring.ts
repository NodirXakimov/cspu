import { onScopeDispose, ref, watch } from 'vue'
import {
  monitoringService,
  PERFORMANCE_TERMS,
  type PerformanceTerm,
} from '../services/monitoring.service'
import type {
  AttendanceBlock,
  AttendanceRange,
  PaymentBlock,
  PerformanceBlock,
  TeacherDiscipline,
} from '../types/monitoring.types'

const REFRESH_MS = 30_000

export function useMonitoring() {
  const teacher = ref<TeacherDiscipline | null>(null)
  const attendance = ref<AttendanceBlock | null>(null)
  const payments = ref<PaymentBlock | null>(null)
  const performance = ref<PerformanceBlock | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const loading = ref(false)

  // Section toggles
  const range = ref<AttendanceRange>('week')
  const term = ref<PerformanceTerm>(PERFORMANCE_TERMS[PERFORMANCE_TERMS.length - 1])

  async function refreshAttendance() {
    attendance.value = await monitoringService.attendance(range.value)
  }
  async function refreshPerformance() {
    performance.value = await monitoringService.performance(term.value)
  }

  async function fetchAll() {
    loading.value = true
    try {
      const [t, p] = await Promise.all([
        monitoringService.teacherDiscipline(),
        monitoringService.payments(),
      ])
      teacher.value = t
      payments.value = p
      await Promise.all([refreshAttendance(), refreshPerformance()])
      lastUpdated.value = new Date()
    } finally {
      loading.value = false
    }
  }

  // Re-fetch only the affected section when a toggle changes.
  watch(range, refreshAttendance)
  watch(term, refreshPerformance)

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
    range,
    term,
    terms: PERFORMANCE_TERMS,
    fetchAll,
  }
}
