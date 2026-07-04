import { ref } from 'vue'
import { paymentsService } from '../services/payments.service'
import type {
  Payment,
  PaymentsAnalytics,
  PaymentsSummary,
} from '../types/payments.types'

export function usePayments() {
  const payments = ref<Payment[]>([])
  const summary = ref<PaymentsSummary | null>(null)
  const analytics = ref<PaymentsAnalytics | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const [list, s, an] = await Promise.all([
        paymentsService.list(),
        paymentsService.summary(),
        paymentsService.analytics(),
      ])
      payments.value = list
      summary.value = s
      analytics.value = an
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return { payments, summary, analytics, loading, error, fetchAll }
}
