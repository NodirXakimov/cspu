import { http, USE_MOCK, mockDelay } from '@/core/api/client'
import type { Faculty, FacultyDraft } from '../types/faculties.types'

const MOCK_FACULTIES: Faculty[] = [
  { id: 1, code: 'INF', name: 'Information Technologies', dean: 'A. Karimov', studentsCount: 1240, staffCount: 86, established: 2001 },
  { id: 2, code: 'ECO', name: 'Economics', dean: 'D. Yusupova', studentsCount: 980, staffCount: 64, established: 1995 },
  { id: 3, code: 'ENG', name: 'Engineering', dean: 'S. Rahimov', studentsCount: 1520, staffCount: 102, established: 1992 },
  { id: 4, code: 'MED', name: 'Medicine', dean: 'N. Tosheva', studentsCount: 870, staffCount: 120, established: 1998 },
  { id: 5, code: 'LAW', name: 'Law', dean: 'B. Aliyev', studentsCount: 640, staffCount: 48, established: 2004 },
  { id: 6, code: 'PHL', name: 'Philology', dean: 'M. Ismoilova', studentsCount: 720, staffCount: 55, established: 1990 },
]

export const facultiesService = {
  async list(): Promise<Faculty[]> {
    if (USE_MOCK) return mockDelay([...MOCK_FACULTIES])
    const { data } = await http.get<Faculty[]>('/faculties')
    return data
  },

  async create(draft: FacultyDraft): Promise<Faculty> {
    if (USE_MOCK) {
      const id = Math.max(0, ...MOCK_FACULTIES.map((f) => f.id)) + 1
      const created = { id, ...draft }
      MOCK_FACULTIES.push(created)
      return mockDelay(created)
    }
    const { data } = await http.post<Faculty>('/faculties', draft)
    return data
  },

  async update(id: number, draft: FacultyDraft): Promise<Faculty> {
    if (USE_MOCK) {
      const idx = MOCK_FACULTIES.findIndex((f) => f.id === id)
      const updated = { id, ...draft }
      if (idx >= 0) MOCK_FACULTIES[idx] = updated
      return mockDelay(updated)
    }
    const { data } = await http.put<Faculty>(`/faculties/${id}`, draft)
    return data
  },

  async remove(id: number): Promise<void> {
    if (USE_MOCK) {
      const idx = MOCK_FACULTIES.findIndex((f) => f.id === id)
      if (idx >= 0) MOCK_FACULTIES.splice(idx, 1)
      return mockDelay(undefined)
    }
    await http.delete(`/faculties/${id}`)
  },
}
