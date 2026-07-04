import type { SeriesPoint } from '@/core/types/common'

export interface DashboardStats {
  students: number
  faculties: number
  attendanceRate: number // %
  revenue: number // collected this year
}

export interface DashboardOverview {
  stats: DashboardStats
  attendanceTrend: SeriesPoint[] // weekly present %
  facultyHeadcount: SeriesPoint[] // students per faculty
  paymentsByCategory: SeriesPoint[] // amount per category
  ratingsDistribution: SeriesPoint[] // students per score bucket
}
