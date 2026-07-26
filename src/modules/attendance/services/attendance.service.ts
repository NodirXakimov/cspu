import { http, USE_MOCK, mockDelay } from '@/core/api/client'
import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
} from '../types/attendance.types'

const NAMES = [
  'KARIMOVA XULKAROY ANVARJON QIZI',
  'UBAYDULLAYEVA KOMILA INOMOVNA',
  'RAHMATULLAYEVA ZARINA AKBAR QIZI',
  'ALIYEVA SEVINCH G‘ULOMJON QIZI',
  'TUXSONOVA GULDONA XOLMIRZA QIZI',
  'DUYSEBAYEV NURBEK TOLKINOVICH',
  'ASRAKULOVA GAYANE ABRAMOVNA',
  'DADAYEVA SEVARA TASHPULATOVNA',
  'ABDUQODIROVA MAFTUNA ABDUMAJIDOVNA',
  'XUDOYQULOVA PARDAXOL YO‘LDOSHEVNA',
]

/** Faculty code → group codes (mirrors the faculties module + payments). */
const FACULTY_GROUPS: Record<string, string[]> = {
  PED: ['PED-24/1', 'PED-23/2'],
  MTA: ['MAT(s)-23/4', 'MAT-25/4'],
  BTA: ['BOT-24/1', 'BOT-23/2', 'BOT-25/7'],
  JM: ['JM-24/1', 'JM-22/3'],
  FIL: ['FIL-23/1', 'FIL-24/2'],
  MAT: ['MBTJT-23/2', 'MBTJT-22/7'],
  TUR: ['TUR-24/1', 'TUR-23/2'],
}

/** Faculty code → its specialty. */
const FACULTY_SPECIALTY: Record<string, string> = {
  PED: 'Pedagogika',
  MTA: "Maktabgacha ta'lim",
  BTA: "Boshlang'ich ta'lim",
  JM: 'Jismoniy madaniyat',
  FIL: 'Filologiya',
  MAT: 'Matematika va informatika',
  TUR: 'Turizm',
}

const SUBJECTS = [
  'Pedagogika',
  'Psixologiya',
  'Ona tili',
  'Matematika',
  'Informatika',
  'Ingliz tili',
  'Tarix',
  'Jismoniy tarbiya',
]

// Weighted status pool (present most common).
const STATUS_POOL: AttendanceStatus[] = [
  'present', 'present', 'present', 'present', 'present',
  'late', 'late',
  'absent', 'absent',
  'excused',
  'earlyLeave',
  'remote',
]

function mockRecords(): AttendanceRecord[] {
  const now = Date.now()
  const facultyCodes = Object.keys(FACULTY_GROUPS)
  const rows: AttendanceRecord[] = []
  let id = 1
  for (const code of facultyCodes) {
    const groups = FACULTY_GROUPS[code]
    for (let n = 0; n < 8; n++) {
      const status = STATUS_POOL[(id * 7) % STATUS_POOL.length]
      rows.push({
        id,
        studentId: `S-${1000 + id}`,
        studentName: NAMES[id % NAMES.length],
        faculty: code,
        specialty: FACULTY_SPECIALTY[code],
        group: groups[id % groups.length],
        subject: SUBJECTS[(id * 3) % SUBJECTS.length],
        lessonPair: (id % 6) + 1,
        // spread across the last ~4 days for the date filter
        timestamp: new Date(now - ((id * 137) % 5760) * 60000).toISOString(),
        status,
        device: `FID-${(id % 4) + 1}`,
      })
      id++
    }
  }
  return rows
}

export const attendanceService = {
  async list(): Promise<AttendanceRecord[]> {
    if (USE_MOCK) return mockDelay(mockRecords())
    const { data } = await http.get<AttendanceRecord[]>('/attendance')
    return data
  },

  async summary(): Promise<AttendanceSummary> {
    if (USE_MOCK) {
      const present = 1180
      const late = 92
      const absent = 148
      const total = present + late + absent
      return mockDelay({
        present,
        late,
        absent,
        rate: Math.round((present / total) * 100),
      })
    }
    const { data } = await http.get<AttendanceSummary>('/attendance/summary')
    return data
  },
}
