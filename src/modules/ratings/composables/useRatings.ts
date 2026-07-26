import { computed, ref } from 'vue'
import { ratingsService } from '../services/ratings.service'
import { facultiesService } from '@/modules/faculties/services/faculties.service'
import type {
  RatingsSummary,
  RiskLevel,
  StudentRating,
} from '../types/ratings.types'

export const ALL = 'all'

export const RISK_LEVELS: RiskLevel[] = ['critical', 'atRisk', 'average', 'good']

export interface Option {
  value: string
  label: string
}

export function useRatings() {
  const students = ref<StudentRating[]>([])
  const summary = ref<RatingsSummary | null>(null)
  const facultyNames = ref<Record<string, string>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filters
  const faculty = ref<string>(ALL)
  const specialty = ref<string>(ALL)
  const group = ref<string>(ALL)
  const risk = ref<RiskLevel | typeof ALL>(ALL)
  const search = ref('')

  const facultyOptions = computed<Option[]>(() => [
    { value: ALL, label: '' },
    ...Object.entries(facultyNames.value).map(([value, label]) => ({ value, label })),
  ])

  const specialtyOptions = computed<Option[]>(() => {
    const pool =
      faculty.value === ALL
        ? students.value
        : students.value.filter((s) => s.faculty === faculty.value)
    const items = Array.from(new Set(pool.map((s) => s.specialty))).sort()
    return [{ value: ALL, label: '' }, ...items.map((s) => ({ value: s, label: s }))]
  })

  const groupOptions = computed<Option[]>(() => {
    const pool =
      faculty.value === ALL
        ? students.value
        : students.value.filter((s) => s.faculty === faculty.value)
    const groups = Array.from(new Set(pool.map((s) => s.group))).sort()
    return [{ value: ALL, label: '' }, ...groups.map((g) => ({ value: g, label: g }))]
  })

  const filtered = computed<StudentRating[]>(() => {
    const q = search.value.trim().toLowerCase()
    return students.value.filter((s) => {
      if (faculty.value !== ALL && s.faculty !== faculty.value) return false
      if (specialty.value !== ALL && s.specialty !== specialty.value) return false
      if (group.value !== ALL && s.group !== group.value) return false
      if (risk.value !== ALL && s.riskLevel !== risk.value) return false
      if (
        q &&
        !s.studentName.toLowerCase().includes(q) &&
        !s.studentId.toLowerCase().includes(q)
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
        ratingsService.list(),
        ratingsService.summary(),
        facultiesService.list(),
      ])
      students.value = list
      summary.value = s
      facultyNames.value = Object.fromEntries(faculties.map((f) => [f.code, f.name]))
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return {
    students,
    filtered,
    summary,
    facultyNames,
    loading,
    error,
    faculty,
    specialty,
    group,
    risk,
    search,
    facultyOptions,
    specialtyOptions,
    groupOptions,
    risks: RISK_LEVELS,
    fetchAll,
  }
}
