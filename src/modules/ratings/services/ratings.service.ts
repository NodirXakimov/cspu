import { http, USE_MOCK, mockDelay } from '@/core/api/client'
import type {
  RatingsSummary,
  RiskLevel,
  StudentRating,
} from '../types/ratings.types'

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

const FACULTY_GROUPS: Record<string, string[]> = {
  PED: ['PED-24/1', 'PED-23/2'],
  MTA: ['MAT(s)-23/4', 'MAT-25/4'],
  BTA: ['BOT-24/1', 'BOT-23/2', 'BOT-25/7'],
  JM: ['JM-24/1', 'JM-22/3'],
  FIL: ['FIL-23/1', 'FIL-24/2'],
  MAT: ['MBTJT-23/2', 'MBTJT-22/7'],
  TUR: ['TUR-24/1', 'TUR-23/2'],
}

/** Faculty code → its specialty. */
const FACULTY_SPECIALTY: Record<string, string> = {
  PED: 'Pedagogika',
  MTA: "Maktabgacha ta'lim",
  BTA: "Boshlang'ich ta'lim",
  JM: 'Jismoniy madaniyat',
  FIL: 'Filologiya',
  MAT: 'Matematika va informatika',
  TUR: 'Turizm',
}

function riskFor(score: number): RiskLevel {
  if (score < 60) return 'critical'
  if (score < 70) return 'atRisk'
  if (score < 85) return 'average'
  return 'good'
}

/** Deterministic pseudo-random so list() and summary() agree. */
function seeded(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const MOCK: StudentRating[] = (() => {
  const codes = Object.keys(FACULTY_GROUPS)
  const rows: StudentRating[] = []
  let id = 1
  for (const code of codes) {
    const groups = FACULTY_GROUPS[code]
    for (let n = 0; n < 7; n++) {
      const score = Math.round(40 + seeded(id) * 58) // 40..98
      const risk = riskFor(score)
      const failedSubjects =
        risk === 'critical'
          ? 2 + Math.round(seeded(id * 3) * 3)
          : risk === 'atRisk'
            ? 1 + Math.round(seeded(id * 3))
            : 0
      rows.push({
        id,
        studentId: `S-${2000 + id}`,
        studentName: NAMES[id % NAMES.length],
        faculty: code,
        specialty: FACULTY_SPECIALTY[code],
        group: groups[id % groups.length],
        gpa: Math.round((score / 25) * 100) / 100,
        score,
        failedSubjects,
        riskLevel: risk,
      })
      id++
    }
  }
  // Worst-first: lowest score at the top.
  return rows.sort((a, b) => a.score - b.score)
})()

function computeSummary(rows: StudentRating[]): RatingsSummary {
  const total = rows.length
  const critical = rows.filter((r) => r.riskLevel === 'critical').length
  const atRisk = rows.filter((r) => r.riskLevel === 'atRisk').length
  const passed = rows.filter((r) => r.score >= 60).length
  const avgGpa = total
    ? Math.round((rows.reduce((n, r) => n + r.gpa, 0) / total) * 100) / 100
    : 0
  const avgScore = total
    ? Math.round(rows.reduce((n, r) => n + r.score, 0) / total)
    : 0
  return {
    total,
    critical,
    atRisk,
    avgGpa,
    avgScore,
    passRate: total ? Math.round((passed / total) * 100) : 0,
  }
}

export const ratingsService = {
  async list(): Promise<StudentRating[]> {
    if (USE_MOCK) return mockDelay([...MOCK])
    const { data } = await http.get<StudentRating[]>('/ratings')
    return data
  },

  async summary(): Promise<RatingsSummary> {
    if (USE_MOCK) return mockDelay(computeSummary(MOCK))
    const { data } = await http.get<RatingsSummary>('/ratings/summary')
    return data
  },
}
