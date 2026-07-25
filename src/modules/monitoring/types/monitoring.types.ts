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

/** Contract-fee debtor student (public debtors board). */
export interface DebtorStudent {
  id: number
  name: string // short_name, e.g. "KARIMOVA X. A."
  fullName: string
  image: string // HEMIS crop URL
  group: string // group.name, e.g. "BOT-24/1"
  faculty: string // department.name
  totalCredit: number // total_credit
  paidPct: number // 0..1 — fabricated share of the contract paid
}

/** ③ Payment status. */
export interface PaymentBlock {
  totalStudents: number
  paid: number
  notPaid: number
  /** Money (UZS). */
  collectedAmount: number
  outstandingAmount: number
  totalAmount: number
}

/** ④ Academic performance. Selectable term (semester + year). */
export interface PerformanceBlock {
  avgGpa: number
  evaluated: number
  failed: number
  distribution: SeriesPoint[] // students per score bucket
}
