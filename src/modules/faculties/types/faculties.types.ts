export interface Faculty {
  id: number
  code: string
  name: string
  dean: string
  studentsCount: number
  staffCount: number
  established: number // year
}

export type FacultyDraft = Omit<Faculty, 'id'>
