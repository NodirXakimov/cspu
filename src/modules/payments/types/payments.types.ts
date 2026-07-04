import type { SeriesPoint } from '@/core/types/common'

export type PaymentStatus = 'paid' | 'pending' | 'overdue'
export type PaymentCategory = 'tuition' | 'dormitory' | 'other'

export interface Payment {
  id: number
  studentName: string
  faculty: string
  amount: number
  category: PaymentCategory
  status: PaymentStatus
  date: string // ISO
}

export interface PaymentsSummary {
  collected: number
  pending: number
  overdue: number
}

export interface PaymentsAnalytics {
  /** Amount collected per month. */
  monthly: SeriesPoint[]
  /** Amount split by category. */
  byCategory: SeriesPoint[]
}
