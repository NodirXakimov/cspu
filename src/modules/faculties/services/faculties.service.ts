import { http, USE_MOCK, mockDelay } from '@/core/api/client'
import type { Faculty, FacultyDraft } from '../types/faculties.types'

const MOCK_FACULTIES: Faculty[] = [
  { id: 1, code: 'PED', name: 'Pedagogika', dean: 'A. Karimov', studentsCount: 720, staffCount: 68, established: 1974 },
  { id: 2, code: 'MTA', name: "Maktabgacha ta'lim", dean: 'D. Yusupova', studentsCount: 360, staffCount: 34, established: 1998 },
  { id: 3, code: 'BTA', name: "Boshlang'ich ta'lim", dean: 'S. Rahimov', studentsCount: 480, staffCount: 44, established: 1992 },
  { id: 4, code: 'TSG', name: "Tasviriy san'at va muhandislik grafikasi", dean: 'N. Tosheva', studentsCount: 300, staffCount: 30, established: 1995 },
  { id: 5, code: 'JM', name: 'Jismoniy madaniyat', dean: 'B. Aliyev', studentsCount: 420, staffCount: 38, established: 1986 },
  { id: 6, code: 'MXP', name: 'Maxsus pedagogika', dean: 'M. Ismoilova', studentsCount: 300, staffCount: 28, established: 2001 },
  { id: 7, code: 'MUS', name: "Musiqa ta'limi", dean: 'O. Nazarov', studentsCount: 300, staffCount: 32, established: 1990 },
  { id: 8, code: 'FIL', name: 'Filologiya', dean: 'K. Saidova', studentsCount: 600, staffCount: 58, established: 1974 },
  { id: 9, code: 'TAR', name: 'Tarix', dean: 'R. Qodirov', studentsCount: 540, staffCount: 46, established: 1980 },
  { id: 10, code: 'TAB', name: 'Tabiiy fanlar', dean: 'G. Ergasheva', studentsCount: 540, staffCount: 52, established: 1985 },
  { id: 11, code: 'MAT', name: 'Matematika va informatika', dean: 'J. Toshev', studentsCount: 720, staffCount: 64, established: 1974 },
  { id: 12, code: 'TUR', name: 'Turizm', dean: 'S. Rustamov', studentsCount: 720, staffCount: 50, established: 2010 },
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
