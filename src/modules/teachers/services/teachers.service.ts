import { http, USE_MOCK, mockDelay } from '@/core/api/client'
import type {
  TeacherRecord,
  TeacherStatus,
  TeachersSummary,
} from '../types/teachers.types'

const NAMES = [
  'A. Karimov',
  'D. Yusupova',
  'S. Rahimov',
  'N. Tosheva',
  'B. Aliyev',
  'M. Ismoilova',
  'O. Nazarov',
  'K. Saidova',
  'R. Qodirov',
  'G. Ergasheva',
  'J. Toshev',
  'S. Rustamov',
]

/** Department (kafedra) codes → display names — mirrors the faculties module. */
export const DEPARTMENTS: Record<string, string> = {
  PED: 'Pedagogika kafedrasi',
  MTA: "Maktabgacha ta'lim kafedrasi",
  BTA: "Boshlang'ich ta'lim kafedrasi",
  JM: 'Jismoniy madaniyat kafedrasi',
  FIL: 'Filologiya kafedrasi',
  MAT: 'Matematika kafedrasi',
  TUR: 'Turizm kafedrasi',
}

const SUBJECTS = [
  'Pedagogika',
  'Psixologiya',
  'Ona tili',
  'Matematika',
  'Informatika',
  'Ingliz tili',
  'Tarix',
  'Jismoniy tarbiya',
]

// Weighted status pool (on-time most common).
const STATUS_POOL: TeacherStatus[] = [
  'present', 'present', 'present', 'present', 'present', 'present',
  'late', 'late', 'late',
  'absent', 'absent',
  'excused',
]

function mockRecords(): TeacherRecord[] {
  const now = Date.now()
  const codes = Object.keys(DEPARTMENTS)
  const rows: TeacherRecord[] = []
  let id = 1
  for (const code of codes) {
    for (let n = 0; n < 6; n++) {
      const status = STATUS_POOL[(id * 7) % STATUS_POOL.length]
      const lateMinutes = status === 'late' ? 5 + ((id * 13) % 26) : 0
      rows.push({
        id,
        teacherId: `T-${2000 + id}`,
        name: NAMES[id % NAMES.length],
        department: code,
        subject: SUBJECTS[(id * 3) % SUBJECTS.length],
        lessonPair: (id % 6) + 1,
        lateMinutes,
        timestamp: new Date(now - ((id * 137) % 5760) * 60000).toISOString(),
        status,
      })
      id++
    }
  }
  return rows
}

function computeSummary(rows: TeacherRecord[]): TeachersSummary {
  const total = rows.length
  const present = rows.filter((r) => r.status === 'present').length
  const late = rows.filter((r) => r.status === 'late').length
  const absent = rows.filter((r) => r.status === 'absent').length
  const lateOnes = rows.filter((r) => r.status === 'late')
  const avgLate = lateOnes.length
    ? Math.round(lateOnes.reduce((n, r) => n + r.lateMinutes, 0) / lateOnes.length)
    : 0
  return {
    total,
    present,
    late,
    absent,
    rate: total ? Math.round((present / total) * 100) : 0,
    avgLate,
  }
}

export const teachersService = {
  async list(): Promise<TeacherRecord[]> {
    if (USE_MOCK) return mockDelay(mockRecords())
    const { data } = await http.get<TeacherRecord[]>('/teachers/discipline')
    return data
  },

  async summary(): Promise<TeachersSummary> {
    if (USE_MOCK) return mockDelay(computeSummary(mockRecords()))
    const { data } = await http.get<TeachersSummary>('/teachers/discipline/summary')
    return data
  },
}
