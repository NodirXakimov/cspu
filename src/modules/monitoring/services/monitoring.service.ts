import { http, USE_MOCK, mockDelay } from '@/core/api/client'
import type {
  AttendanceBlock,
  AttendanceRange,
  PaymentBlock,
  PerformanceBlock,
  TeacherDiscipline,
} from '../types/monitoring.types'

/** Available terms for the performance section toggle. */
export const PERFORMANCE_TERMS = [
  '2024-1',
  '2024-2',
  '2025-1',
] as const
export type PerformanceTerm = (typeof PERFORMANCE_TERMS)[number]

/** Faculty filter — 'all' means the whole university. */
export const ALL_FACULTIES = 'all'

/** Each faculty's share of the total (used to scale mock counts when filtered). */
const FACULTY_SHARE: Record<string, number> = {
  PED: 0.12,
  MTA: 0.06,
  BTA: 0.08,
  TSG: 0.05,
  JM: 0.07,
  MXP: 0.05,
  MUS: 0.05,
  FIL: 0.1,
  TAR: 0.09,
  TAB: 0.09,
  MAT: 0.12,
  TUR: 0.12,
}

function share(faculty: string): number {
  return faculty === ALL_FACULTIES ? 1 : (FACULTY_SHARE[faculty] ?? 0.18)
}

function jitter(base: number, spread = 6): number {
  return Math.max(0, Math.round(base + (Math.random() - 0.5) * spread))
}

/** Scale a base count by the selected faculty's share. */
function scaled(base: number, faculty: string): number {
  return Math.round(base * share(faculty))
}

export const monitoringService = {
  async teacherDiscipline(faculty = ALL_FACULTIES): Promise<TeacherDiscipline> {
    if (USE_MOCK) {
      const s = share(faculty)
      const lateToday = Math.max(1, Math.round(jitter(9, 4) * s))
      const names: string[][] = [
        ['A. Karimov', 'PED'], ['D. Yusupova', 'MTA'], ['S. Rahimov', 'BTA'],
        ['N. Tosheva', 'TSG'], ['B. Aliyev', 'JM'], ['M. Ismoilova', 'FIL'],
        ['O. Nazarov', 'MUS'], ['K. Saidova', 'MAT'],
      ]
      // When a faculty is selected, show only its teachers (re-tag if none match).
      let pool = names
      if (faculty !== ALL_FACULTIES) {
        const own = names.filter(([, f]) => f === faculty)
        pool = own.length ? own : names.map(([n]) => [n, faculty])
      }
      const count = Math.min(pool.length, lateToday)
      return mockDelay({
        total: scaled(461, faculty),
        lateToday: count,
        lateList: pool.slice(0, count).map(([name, fac], i) => {
          const lateMin = 6 + i * 4
          return {
            name,
            faculty: fac,
            time: `08:${lateMin.toString().padStart(2, '0')}`,
            lateMin,
          }
        }),
        weekly: [
          { label: 'Mon', value: Math.max(1, Math.round(jitter(7) * s)) },
          { label: 'Tue', value: Math.max(1, Math.round(jitter(5) * s)) },
          { label: 'Wed', value: Math.max(1, Math.round(jitter(9) * s)) },
          { label: 'Thu', value: Math.max(1, Math.round(jitter(4) * s)) },
          { label: 'Fri', value: Math.max(1, Math.round(jitter(11) * s)) },
          { label: 'Sat', value: Math.max(1, Math.round(jitter(3) * s)) },
        ],
      })
    }
    const { data } = await http.get<TeacherDiscipline>('/monitoring/teacher-discipline', {
      params: { faculty },
    })
    return data
  },

  async attendance(
    range: AttendanceRange,
    faculty = ALL_FACULTIES,
  ): Promise<AttendanceBlock> {
    if (USE_MOCK) {
      const series: Record<AttendanceRange, { label: string; value: number }[]> = {
        week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => ({
          label,
          value: jitter(90, 12),
        })),
        month: Array.from({ length: 4 }, (_, i) => ({
          label: `W${i + 1}`,
          value: jitter(88, 10),
        })),
        semester: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan'].map((label) => ({
          label,
          value: jitter(87, 8),
        })),
      }
      return mockDelay({
        active: scaled(5970, faculty),
        today: scaled(5314, faculty),
        deltaPct: Math.round((Math.random() - 0.4) * 60) / 10, // ~ -2.4..+3.6
        series: series[range], // percentages — not faculty-scaled
      })
    }
    const { data } = await http.get<AttendanceBlock>('/monitoring/attendance', {
      params: { range, faculty },
    })
    return data
  },

  async payments(faculty = ALL_FACULTIES): Promise<PaymentBlock> {
    if (USE_MOCK) {
      const totalStudents = scaled(5970, faculty)
      const paid = Math.round(totalStudents * (0.78 + (Math.random() - 0.5) * 0.06))
      const notPaid = totalStudents - paid
      // ~13.2M so'm contract per student.
      const perStudent = 13_200_000
      const totalAmount = totalStudents * perStudent
      const collectedAmount = paid * perStudent
      return mockDelay({
        totalStudents,
        paid,
        notPaid,
        collectedAmount,
        outstandingAmount: totalAmount - collectedAmount,
        totalAmount,
      })
    }
    const { data } = await http.get<PaymentBlock>('/monitoring/payments', {
      params: { faculty },
    })
    return data
  },

  async performance(
    term: PerformanceTerm,
    faculty = ALL_FACULTIES,
  ): Promise<PerformanceBlock> {
    if (USE_MOCK) {
      const seed = PERFORMANCE_TERMS.indexOf(term)
      const s = share(faculty)
      return mockDelay({
        avgGpa: Math.round((3.4 + seed * 0.12) * 100) / 100, // ratio — not scaled
        evaluated: scaled(5210 + seed * 60, faculty),
        failed: Math.max(1, Math.round((214 - seed * 18) * s)),
        distribution: [
          { label: '0–59', value: Math.max(1, Math.round(jitter(42) * s)) },
          { label: '60–69', value: Math.max(1, Math.round(jitter(130) * s)) },
          { label: '70–79', value: Math.max(1, Math.round(jitter(268) * s)) },
          { label: '80–89', value: Math.max(1, Math.round(jitter(210) * s)) },
          { label: '90–100', value: Math.max(1, Math.round(jitter(96) * s)) },
        ],
      })
    }
    const { data } = await http.get<PerformanceBlock>('/monitoring/performance', {
      params: { term, faculty },
    })
    return data
  },
}
