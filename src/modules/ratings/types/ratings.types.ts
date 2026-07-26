export type RiskLevel = 'critical' | 'atRisk' | 'average' | 'good'

export interface StudentRating {
  id: number
  studentId: string
  studentName: string
  faculty: string // faculty code
  specialty: string
  group: string
  gpa: number // 0–4
  score: number // 0–100
  failedSubjects: number // academic debt
  riskLevel: RiskLevel
}

export interface RatingsSummary {
  total: number
  critical: number
  atRisk: number
  avgGpa: number
  avgScore: number
  passRate: number // score ≥ 60 %
}
