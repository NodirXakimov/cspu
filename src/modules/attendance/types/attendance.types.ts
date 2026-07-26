export type AttendanceStatus =
  | 'present'
  | 'late'
  | 'absent'
  | 'excused'
  | 'earlyLeave'
  | 'remote'

/** One FaceID check-in event coming from the attendance terminals. */
export interface AttendanceRecord {
  id: number
  studentId: string
  studentName: string
  faculty: string // faculty code
  specialty: string
  group: string
  subject: string
  lessonPair: number // lesson pair (1..6)
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
