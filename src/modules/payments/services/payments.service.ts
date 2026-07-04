import { http, USE_MOCK, mockDelay } from '@/core/api/client'
import type {
  Payment,
  PaymentCategory,
  PaymentStatus,
  PaymentsAnalytics,
  PaymentsSummary,
} from '../types/payments.types'

const NAMES = [
  'Ali Valiyev', 'Dilnoza Karimova', 'Sardor Rustamov', 'Malika Yusupova',
  'Jasur Toshev', 'Nigora Aliyeva', 'Bekzod Rahimov', 'Sevara Ismoilova',
]
const FACULTIES = ['INF', 'ECO', 'ENG', 'MED', 'LAW', 'PHL']
const CATEGORIES: PaymentCategory[] = ['tuition', 'dormitory', 'other']
const STATUSES: PaymentStatus[] = ['paid', 'pending', 'overdue']

function mockPayments(): Payment[] {
  const now = Date.now()
  return Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    studentName: NAMES[i % NAMES.length],
    faculty: FACULTIES[i % FACULTIES.length],
    amount: [1200000, 6500000, 350000][i % 3] + (i % 5) * 100000,
    category: CATEGORIES[i % CATEGORIES.length],
    status: STATUSES[i % 3 === 2 ? 2 : i % 4 === 3 ? 1 : 0],
    date: new Date(now - i * 3 * 86400000).toISOString(),
  }))
}

export const paymentsService = {
  async list(): Promise<Payment[]> {
    if (USE_MOCK) return mockDelay(mockPayments())
    const { data } = await http.get<Payment[]>('/payments')
    return data
  },

  async summary(): Promise<PaymentsSummary> {
    if (USE_MOCK) {
      return mockDelay({
        collected: 1_845_000_000,
        pending: 264_000_000,
        overdue: 92_000_000,
      })
    }
    const { data } = await http.get<PaymentsSummary>('/payments/summary')
    return data
  },

  async analytics(): Promise<PaymentsAnalytics> {
    if (USE_MOCK) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      const values = [210, 240, 198, 305, 288, 604].map((v) => v * 1_000_000)
      return mockDelay({
        monthly: months.map((label, i) => ({ label, value: values[i] })),
        byCategory: [
          { label: 'tuition', value: 1_520_000_000 },
          { label: 'dormitory', value: 246_000_000 },
          { label: 'other', value: 79_000_000 },
        ],
      })
    }
    const { data } = await http.get<PaymentsAnalytics>('/payments/analytics')
    return data
  },
}
