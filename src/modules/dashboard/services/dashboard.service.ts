import { http, USE_MOCK, mockDelay } from '@/core/api/client'
import type { DashboardOverview } from '../types/dashboard.types'

export const dashboardService = {
  async overview(): Promise<DashboardOverview> {
    if (USE_MOCK) {
      return mockDelay({
        stats: {
          students: 5970,
          faculties: 6,
          attendanceRate: 89,
          revenue: 1_845_000_000,
        },
        attendanceTrend: [
          { label: 'Mon', value: 88 },
          { label: 'Tue', value: 91 },
          { label: 'Wed', value: 85 },
          { label: 'Thu', value: 93 },
          { label: 'Fri', value: 90 },
          { label: 'Sat', value: 76 },
        ],
        facultyHeadcount: [
          { label: 'INF', value: 1240 },
          { label: 'ECO', value: 980 },
          { label: 'ENG', value: 1520 },
          { label: 'MED', value: 870 },
          { label: 'LAW', value: 640 },
          { label: 'PHL', value: 720 },
        ],
        paymentsByCategory: [
          { label: 'tuition', value: 1_520_000_000 },
          { label: 'dormitory', value: 246_000_000 },
          { label: 'other', value: 79_000_000 },
        ],
        ratingsDistribution: [
          { label: '0–59', value: 42 },
          { label: '60–69', value: 130 },
          { label: '70–79', value: 268 },
          { label: '80–89', value: 210 },
          { label: '90–100', value: 96 },
        ],
      })
    }
    const { data } = await http.get<DashboardOverview>('/dashboard/overview')
    return data
  },
}
