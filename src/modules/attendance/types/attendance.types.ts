import type { SeriesPoint } from '@/core/types/common'

export type AttendanceStatus = 'present' | 'late' | 'absent'

/** One FaceID check-in event coming from the attendance terminals. */
export interface AttendanceRecord {
  id: number
  studentId: string
  studentName: string
  faculty: string
  timestamp: string // ISO
  status: AttendanceStatus
  device: string // FaceID terminal id
}

export interface AttendanceSummary {
  present: number
  late: number
  absent: number
  rate: number // present % of total
}

export interface AttendanceTrend {
  /** Present percentage per day for the last N days. */
  daily: SeriesPoint[]
}
