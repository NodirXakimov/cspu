import { computed, ref } from 'vue'
import { attendanceService } from '../services/attendance.service'
import { facultiesService } from '@/modules/faculties/services/faculties.service'
import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
} from '../types/attendance.types'

export const ALL = 'all'

export const ATTENDANCE_STATUSES: AttendanceStatus[] = [
  'present',
  'late',
  'absent',
  'excused',
  'earlyLeave',
  'remote',
]

export interface Option {
  value: string
  label: string
}

export function useAttendance() {
  const records = ref<AttendanceRecord[]>([])
  const summary = ref<AttendanceSummary | null>(null)
  const facultyNames = ref<Record<string, string>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filters
  const faculty = ref<string>(ALL)
  const specialty = ref<string>(ALL)
  const group = ref<string>(ALL)
  const subject = ref<string>(ALL)
  const status = ref<AttendanceStatus | typeof ALL>(ALL)
  const search = ref('')
  const date = ref<Date | null>(null)

  const facultyOptions = computed<Option[]>(() => [
    { value: ALL, label: '' },
    ...Object.entries(facultyNames.value).map(([value, label]) => ({ value, label })),
  ])

  const specialtyOptions = computed<Option[]>(() => {
    const pool =
      faculty.value === ALL
        ? records.value
        : records.value.filter((r) => r.faculty === faculty.value)
    const items = Array.from(new Set(pool.map((r) => r.specialty))).sort()
    return [{ value: ALL, label: '' }, ...items.map((s) => ({ value: s, label: s }))]
  })

  const groupOptions = computed<Option[]>(() => {
    const pool =
      faculty.value === ALL
        ? records.value
        : records.value.filter((r) => r.faculty === faculty.value)
    const groups = Array.from(new Set(pool.map((r) => r.group))).sort()
    return [{ value: ALL, label: '' }, ...groups.map((g) => ({ value: g, label: g }))]
  })

  const subjectOptions = computed<Option[]>(() => {
    const items = Array.from(new Set(records.value.map((r) => r.subject))).sort()
    return [{ value: ALL, label: '' }, ...items.map((s) => ({ value: s, label: s }))]
  })

  const filtered = computed<AttendanceRecord[]>(() => {
    const q = search.value.trim().toLowerCase()
    const day = date.value ? date.value.toDateString() : null
    return records.value.filter((r) => {
      if (faculty.value !== ALL && r.faculty !== faculty.value) return false
      if (specialty.value !== ALL && r.specialty !== specialty.value) return false
      if (group.value !== ALL && r.group !== group.value) return false
      if (subject.value !== ALL && r.subject !== subject.value) return false
      if (status.value !== ALL && r.status !== status.value) return false
      if (day && new Date(r.timestamp).toDateString() !== day) return false
      if (
        q &&
        !r.studentName.toLowerCase().includes(q) &&
        !r.studentId.toLowerCase().includes(q)
      )
        return false
      return true
    })
  })

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const [list, s, faculties] = await Promise.all([
        attendanceService.list(),
        attendanceService.summary(),
        facultiesService.list(),
      ])
      records.value = list
      summary.value = s
      facultyNames.value = Object.fromEntries(faculties.map((f) => [f.code, f.name]))
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return {
    records,
    filtered,
    summary,
    facultyNames,
    loading,
    error,
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
    statuses: ATTENDANCE_STATUSES,
    fetchAll,
  }
}
