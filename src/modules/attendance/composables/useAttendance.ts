import { ref } from 'vue'
import { attendanceService } from '../services/attendance.service'
import type {
  AttendanceRecord,
  AttendanceSummary,
  AttendanceTrend,
} from '../types/attendance.types'

export function useAttendance() {
  const records = ref<AttendanceRecord[]>([])
  const summary = ref<AttendanceSummary | null>(null)
  const trend = ref<AttendanceTrend | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const [r, s, t] = await Promise.all([
        attendanceService.list(),
        attendanceService.summary(),
        attendanceService.trend(),
      ])
      records.value = r
      summary.value = s
      trend.value = t
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return { records, summary, trend, loading, error, fetchAll }
}
