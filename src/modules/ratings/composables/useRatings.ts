import { ref } from 'vue'
import { ratingsService } from '../services/ratings.service'
import type { RatingsAnalytics, StudentRating } from '../types/ratings.types'

export function useRatings() {
  const students = ref<StudentRating[]>([])
  const analytics = ref<RatingsAnalytics | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const [list, an] = await Promise.all([
        ratingsService.list(),
        ratingsService.analytics(),
      ])
      students.value = list
      analytics.value = an
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return { students, analytics, loading, error, fetchAll }
}
