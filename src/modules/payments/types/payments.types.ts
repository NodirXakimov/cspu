export type PaymentStatus = 'paid' | 'partial' | 'unpaid'

export interface Payment {
  id: number
  studentName: string
  faculty: string // faculty code
  group: string
  contract: number // total contract fee
  paid: number // amount paid so far
  status: PaymentStatus // derived from paid vs contract
}

export interface PaymentsSummary {
  totalStudents: number
  paidStudents: number // fully paid
  unpaidStudents: number // not fully paid (partial + unpaid)
  collected: number // Σ paid
  outstanding: number // Σ (contract − paid)
  totalContract: number // Σ contract
  rate: number // collected / totalContract × 100
}
