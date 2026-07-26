import { computed, ref } from 'vue'
import { teachersService, DEPARTMENTS } from '../services/teachers.service'
import type {
  TeacherRecord,
  TeacherStatus,
  TeachersSummary,
} from '../types/teachers.types'

export const ALL = 'all'

export const TEACHER_STATUSES: TeacherStatus[] = [
  'present',
  'late',
  'absent',
  'excused',
]

export interface Option {
  value: string
  label: string
}

export function useTeachers() {
  const records = ref<TeacherRecord[]>([])
  const summary = ref<TeachersSummary | null>(null)
  const departmentNames = ref<Record<string, string>>({ ...DEPARTMENTS })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filters
  const department = ref<string>(ALL)
  const subject = ref<string>(ALL)
  const status = ref<TeacherStatus | typeof ALL>(ALL)
  const search = ref('')
  const date = ref<Date | null>(null)

  const departmentOptions = computed<Option[]>(() => [
    { value: ALL, label: '' },
    ...Object.entries(departmentNames.value).map(([value, label]) => ({ value, label })),
  ])

  const subjectOptions = computed<Option[]>(() => {
    const items = Array.from(new Set(records.value.map((r) => r.subject))).sort()
    return [{ value: ALL, label: '' }, ...items.map((s) => ({ value: s, label: s }))]
  })

  const filtered = computed<TeacherRecord[]>(() => {
    const q = search.value.trim().toLowerCase()
    const day = date.value ? date.value.toDateString() : null
    return records.value.filter((r) => {
      if (department.value !== ALL && r.department !== department.value) return false
      if (subject.value !== ALL && r.subject !== subject.value) return false
      if (status.value !== ALL && r.status !== status.value) return false
      if (day && new Date(r.timestamp).toDateString() !== day) return false
      if (
        q &&
        !r.name.toLowerCase().includes(q) &&
        !r.teacherId.toLowerCase().includes(q)
      )
        return false
      return true
    })
  })

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const [list, s] = await Promise.all([
        teachersService.list(),
        teachersService.summary(),
      ])
      records.value = list
      summary.value = s
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
    departmentNames,
    loading,
    error,
    department,
    subject,
    status,
    search,
    date,
    departmentOptions,
    subjectOptions,
    statuses: TEACHER_STATUSES,
    fetchAll,
  }
}
