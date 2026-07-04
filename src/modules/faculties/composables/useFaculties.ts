import { ref } from 'vue'
import { facultiesService } from '../services/faculties.service'
import type { Faculty, FacultyDraft } from '../types/faculties.types'

export function useFaculties() {
  const items = ref<Faculty[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetch() {
    loading.value = true
    error.value = null
    try {
      items.value = await facultiesService.list()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  async function create(draft: FacultyDraft) {
    const created = await facultiesService.create(draft)
    items.value.push(created)
  }

  async function update(id: number, draft: FacultyDraft) {
    const updated = await facultiesService.update(id, draft)
    const idx = items.value.findIndex((f) => f.id === id)
    if (idx >= 0) items.value[idx] = updated
  }

  async function remove(id: number) {
    await facultiesService.remove(id)
    items.value = items.value.filter((f) => f.id !== id)
  }

  return { items, loading, error, fetch, create, update, remove }
}
