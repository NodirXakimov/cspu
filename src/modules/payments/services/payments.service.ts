import { http, USE_MOCK, mockDelay } from '@/core/api/client'
import type {
  Payment,
  PaymentStatus,
  PaymentsSummary,
} from '../types/payments.types'

/** Flat yearly contract fee per student (so'm). */
export const CONTRACT_FEE = 12_000_000

const NAMES = [
  'KARIMOVA XULKAROY ANVARJON QIZI',
  'UBAYDULLAYEVA KOMILA INOMOVNA',
  'RAHMATULLAYEVA ZARINA AKBAR QIZI',
  'ALIYEVA SEVINCH G‘ULOMJON QIZI',
  'TUXSONOVA GULDONA XOLMIRZA QIZI',
  'DUYSEBAYEV NURBEK TOLKINOVICH',
  'ASRAKULOVA GAYANE ABRAMOVNA',
  'DADAYEVA SEVARA TASHPULATOVNA',
  'ABDUQODIROVA MAFTUNA ABDUMAJIDOVNA',
  'XUDOYQULOVA PARDAXOL YO‘LDOSHEVNA',
  'YULDASHEV AZIZBEK SOBIR O‘G‘LI',
  'QODIROVA MADINA BAXTIYOR QIZI',
]

/** Faculty code → its group codes (mirrors the faculties module codes). */
const FACULTY_GROUPS: Record<string, string[]> = {
  PED: ['PED-24/1', 'PED-23/2'],
  MTA: ['MAT(s)-23/4', 'MAT-25/4'],
  BTA: ['BOT-24/1', 'BOT-23/2', 'BOT-25/7'],
  JM: ['JM-24/1', 'JM-22/3'],
  FIL: ['FIL-23/1', 'FIL-24/2'],
  MAT: ['MBTJT-23/2', 'MBTJT-22/7'],
  TUR: ['TUR-24/1', 'TUR-23/2'],
}

/** Deterministic pseudo-random so list() and summary() stay in sync. */
function seeded(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function statusFor(paid: number, contract: number): PaymentStatus {
  if (paid >= contract) return 'paid'
  if (paid <= 0) return 'unpaid'
  return 'partial'
}

/** Build the mock roster once so both endpoints agree. */
const MOCK_PAYMENTS: Payment[] = (() => {
  const facultyCodes = Object.keys(FACULTY_GROUPS)
  const rows: Payment[] = []
  let id = 1
  for (const code of facultyCodes) {
    const groups = FACULTY_GROUPS[code]
    for (let n = 0; n < 5; n++) {
      const r = seeded(id)
      // ~40% fully paid, ~20% unpaid, rest partial.
      let paid: number
      if (r < 0.4) paid = CONTRACT_FEE
      else if (r > 0.8) paid = 0
      else paid = Math.round(CONTRACT_FEE * (0.2 + seeded(id * 7) * 0.6))
      rows.push({
        id,
        studentName: NAMES[id % NAMES.length],
        faculty: code,
        group: groups[id % groups.length],
        contract: CONTRACT_FEE,
        paid,
        status: statusFor(paid, CONTRACT_FEE),
      })
      id++
    }
  }
  return rows
})()

function computeSummary(rows: Payment[]): PaymentsSummary {
  const totalStudents = rows.length
  const paidStudents = rows.filter((r) => r.status === 'paid').length
  const collected = rows.reduce((n, r) => n + r.paid, 0)
  const totalContract = rows.reduce((n, r) => n + r.contract, 0)
  return {
    totalStudents,
    paidStudents,
    unpaidStudents: totalStudents - paidStudents,
    collected,
    outstanding: totalContract - collected,
    totalContract,
    rate: totalContract ? Math.round((collected / totalContract) * 100) : 0,
  }
}

export const paymentsService = {
  async list(): Promise<Payment[]> {
    if (USE_MOCK) return mockDelay([...MOCK_PAYMENTS])
    const { data } = await http.get<Payment[]>('/payments')
    return data
  },

  async summary(): Promise<PaymentsSummary> {
    if (USE_MOCK) return mockDelay(computeSummary(MOCK_PAYMENTS))
    const { data } = await http.get<PaymentsSummary>('/payments/summary')
    return data
  },
}
