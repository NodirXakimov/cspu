import type { SeriesPoint } from '@/core/types/common'

export interface StudentRating {
  studentId: string
  studentName: string
  faculty: string
  gpa: number // 0-4
  score: number // 0-100
  rank: number
}

export interface RatingsAnalytics {
  /** Number of students per score bucket (0-59, 60-69, …). */
  distribution: SeriesPoint[]
  /** Average score per faculty. */
  byFaculty: SeriesPoint[]
}
