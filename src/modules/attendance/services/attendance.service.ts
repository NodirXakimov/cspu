import { http, USE_MOCK, mockDelay } from '@/core/api/client'
import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
  AttendanceTrend,
} from '../types/attendance.types'

const NAMES = [
  'Ali Valiyev', 'Dilnoza Karimova', 'Sardor Rustamov', 'Malika Yusupova',
  'Jasur Toshev', 'Nigora Aliyeva', 'Bekzod Rahimov', 'Sevara Ismoilova',
]
const FACULTIES = ['INF', 'ECO', 'ENG', 'MED', 'LAW', 'PHL']
const STATUSES: AttendanceStatus[] = ['present', 'late', 'absent']

function mockRecords(): AttendanceRecord[] {
  const now = Date.now()
  return Array.from({ length: 40 }, (_, i) => {
    const status = STATUSES[i % 6 === 5 ? 2 : i % 5 === 4 ? 1 : 0]
    return {
      id: i + 1,
      studentId: `S-${1000 + i}`,
      studentName: NAMES[i % NAMES.length],
      faculty: FACULTIES[i % FACULTIES.length],
      timestamp: new Date(now - i * 37 * 60000).toISOString(),
      status,
      device: `FID-${(i % 4) + 1}`,
    }
  })
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

  async trend(): Promise<AttendanceTrend> {
    if (USE_MOCK) {
      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const values = [88, 91, 85, 93, 90, 76]
      return mockDelay({
        daily: labels.map((label, i) => ({ label, value: values[i] })),
      })
    }
    const { data } = await http.get<AttendanceTrend>('/attendance/trend')
    return data
  },
}
