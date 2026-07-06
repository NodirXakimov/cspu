import type { SeriesPoint } from '@/core/types/common'

/** ① Teacher discipline. */
export interface LateTeacher {
  name: string
  faculty: string
  time: string // HH:mm
  lateMin: number // minutes late
}
export interface TeacherDiscipline {
  total: number
  lateToday: number
  lateList: LateTeacher[]
  weekly: SeriesPoint[] // late count per weekday
}

/** ② Student attendance. Selectable range. */
export type AttendanceRange = 'week' | 'month' | 'semester'
export interface AttendanceBlock {
  active: number
  today: number
  deltaPct: number // +/- vs yesterday
  series: SeriesPoint[]
}

/** ③ Payment status. */
export interface PaymentBlock {
  totalStudents: number
  paid: number
  notPaid: number
}

/** ④ Academic performance. Selectable term (semester + year). */
export interface PerformanceBlock {
  avgGpa: number
  evaluated: number
  failed: number
  distribution: SeriesPoint[] // students per score bucket
}
