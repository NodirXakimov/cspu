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

function jitter(base: number, spread = 6): number {
  return Math.max(0, Math.round(base + (Math.random() - 0.5) * spread))
}

export const monitoringService = {
  async teacherDiscipline(): Promise<TeacherDiscipline> {
    if (USE_MOCK) {
      const lateToday = jitter(9, 4)
      const names = [
        ['A. Karimov', 'INF'], ['D. Yusupova', 'ECO'], ['S. Rahimov', 'ENG'],
        ['N. Tosheva', 'MED'], ['B. Aliyev', 'LAW'], ['M. Ismoilova', 'PHL'],
        ['O. Nazarov', 'INF'], ['K. Saidova', 'MED'],
      ]
      return mockDelay({
        total: 461,
        lateToday,
        lateList: names.slice(0, lateToday).map(([name, faculty], i) => {
          const lateMin = 6 + i * 4
          return {
            name,
            faculty,
            time: `08:${(lateMin).toString().padStart(2, '0')}`,
            lateMin,
          }
        }),
        weekly: [
          { label: 'Mon', value: jitter(7) },
          { label: 'Tue', value: jitter(5) },
          { label: 'Wed', value: jitter(9) },
          { label: 'Thu', value: jitter(4) },
          { label: 'Fri', value: jitter(11) },
          { label: 'Sat', value: jitter(3) },
        ],
      })
    }
    const { data } = await http.get<TeacherDiscipline>('/monitoring/teacher-discipline')
    return data
  },

  async attendance(range: AttendanceRange): Promise<AttendanceBlock> {
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
        active: 5970,
        today: 5314,
        deltaPct: Math.round((Math.random() - 0.4) * 60) / 10, // ~ -2.4..+3.6
        series: series[range],
      })
    }
    const { data } = await http.get<AttendanceBlock>('/monitoring/attendance', {
      params: { range },
    })
    return data
  },

  async payments(): Promise<PaymentBlock> {
    if (USE_MOCK) {
      const totalStudents = 5970
      const paid = jitter(4820, 40)
      return mockDelay({ totalStudents, paid, notPaid: totalStudents - paid })
    }
    const { data } = await http.get<PaymentBlock>('/monitoring/payments')
    return data
  },

  async performance(term: PerformanceTerm): Promise<PerformanceBlock> {
    if (USE_MOCK) {
      const seed = PERFORMANCE_TERMS.indexOf(term)
      return mockDelay({
        avgGpa: Math.round((3.4 + seed * 0.12) * 100) / 100,
        evaluated: 5210 + seed * 60,
        failed: 214 - seed * 18,
        distribution: [
          { label: '0–59', value: jitter(42) },
          { label: '60–69', value: jitter(130) },
          { label: '70–79', value: jitter(268) },
          { label: '80–89', value: jitter(210) },
          { label: '90–100', value: jitter(96) },
        ],
      })
    }
    const { data } = await http.get<PerformanceBlock>('/monitoring/performance', {
      params: { term },
    })
    return data
  },
}
