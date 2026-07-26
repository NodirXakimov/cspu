export type TeacherStatus = 'present' | 'late' | 'absent' | 'excused'

export interface TeacherRecord {
  id: number
  teacherId: string // T-xxxx
  name: string
  department: string // faculty / kafedra code
  subject: string
  lessonPair: number // 1..6
  lateMinutes: number // 0 when on time / absent
  timestamp: string // ISO datetime of the lesson
  status: TeacherStatus
}

export interface TeachersSummary {
  total: number
  present: number
  late: number
  absent: number
  rate: number // on-time % (present / total)
  avgLate: number // avg minutes of the late ones
}
