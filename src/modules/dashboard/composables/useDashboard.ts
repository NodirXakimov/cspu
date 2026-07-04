import { ref } from 'vue'
import { dashboardService } from '../services/dashboard.service'
import type { DashboardOverview } from '../types/dashboard.types'

export function useDashboard() {
  const overview = ref<DashboardOverview | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch() {
    loading.value = true
    error.value = null
    try {
      overview.value = await dashboardService.overview()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return { overview, loading, error, fetch }
}
