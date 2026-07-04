import { http, USE_MOCK, mockDelay } from '@/core/api/client'
import type { RatingsAnalytics, StudentRating } from '../types/ratings.types'

const NAMES = [
  'Ali Valiyev', 'Dilnoza Karimova', 'Sardor Rustamov', 'Malika Yusupova',
  'Jasur Toshev', 'Nigora Aliyeva', 'Bekzod Rahimov', 'Sevara Ismoilova',
  'Oybek Nazarov', 'Kamola Saidova',
]
const FACULTIES = ['INF', 'ECO', 'ENG', 'MED', 'LAW', 'PHL']

function mockRatings(): StudentRating[] {
  return Array.from({ length: 10 }, (_, i) => {
    const score = 96 - i * 3
    return {
      studentId: `S-${2000 + i}`,
      studentName: NAMES[i % NAMES.length],
      faculty: FACULTIES[i % FACULTIES.length],
      gpa: Math.round((score / 25) * 100) / 100,
      score,
      rank: i + 1,
    }
  })
}

export const ratingsService = {
  async list(): Promise<StudentRating[]> {
    if (USE_MOCK) return mockDelay(mockRatings())
    const { data } = await http.get<StudentRating[]>('/ratings')
    return data
  },

  async analytics(): Promise<RatingsAnalytics> {
    if (USE_MOCK) {
      return mockDelay({
        distribution: [
          { label: '0–59', value: 42 },
          { label: '60–69', value: 130 },
          { label: '70–79', value: 268 },
          { label: '80–89', value: 210 },
          { label: '90–100', value: 96 },
        ],
        byFaculty: [
          { label: 'INF', value: 84 },
          { label: 'ECO', value: 78 },
          { label: 'ENG', value: 81 },
          { label: 'MED', value: 88 },
          { label: 'LAW', value: 75 },
          { label: 'PHL', value: 79 },
        ],
      })
    }
    const { data } = await http.get<RatingsAnalytics>('/ratings/analytics')
    return data
  },
}
