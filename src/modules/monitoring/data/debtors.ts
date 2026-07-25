import type { DebtorStudent } from '../types/monitoring.types'

/** Flat yearly contract fee per student (so'm). Debt = fee × (1 − paidPct). */
export const CONTRACT_FEE = 12_000_000

/**
 * Static contract-fee debtors — mapped from a real HEMIS student sample
 * (only the fields the board needs). `paidPct` is fabricated per student so
 * debts vary; swap this list for the `/monitoring/debtors` API response later.
 */
export const DEBTORS: DebtorStudent[] = [
  {
    id: 43269,
    name: 'KARIMOVA X. A.',
    fullName: 'KARIMOVA XULKAROY ANVARJON QIZI',
    image: 'https://hemis.cspi.uz/static/crop/2/5/320__90_2563614264.jpg',
    group: 'BOT-24/1',
    faculty: "Maktabgacha va Boshlang'ich ta'lim fakulteti",
    totalCredit: 105,
    paidPct: 0.3,
  },
  {
    id: 43267,
    name: 'UBAYDULLAYEVA K. I.',
    fullName: 'UBAYDULLAYEVA KOMILA INOMOVNA',
    image: 'https://hemis.cspi.uz/static/crop/4/0/320__90_4090267095.jpg',
    group: 'BOT(2-OT)-23/5rus',
    faculty: "Maktabgacha va Boshlang'ich ta'lim fakulteti",
    totalCredit: 186,
    paidPct: 0.08,
  },
  {
    id: 43266,
    name: 'RAHMATULLAYEVA Z. A.',
    fullName: 'RAHMATULLAYEVA ZARINA AKBAR QIZI',
    image: 'https://hemis.cspi.uz/static/crop/2/3/320__90_2358388757.jpg',
    group: 'TTNM(MT)-25/1(magistr)',
    faculty: "Maktabgacha va Boshlang'ich ta'lim fakulteti",
    totalCredit: 35,
    paidPct: 0.62,
  },
  {
    id: 43254,
    name: "ALIYEVA S. G'.",
    fullName: 'ALIYEVA SEVINCH G‘ULOMJON QIZI',
    image: 'https://hemis.cspi.uz/static/crop/2/7/320__90_2731137076.jpg',
    group: 'BOT-23/2',
    faculty: "Maktabgacha va Boshlang'ich ta'lim fakulteti",
    totalCredit: 128,
    paidPct: 0.18,
  },
  {
    id: 43253,
    name: 'TUXSONOVA G. X.',
    fullName: 'TUXSONOVA GULDONA XOLMIRZA QIZI',
    image: 'https://hemis.cspi.uz/static/crop/2/8/320__90_2876211741.jpg',
    group: 'MAT(s)-23/4',
    faculty: "Maktabgacha va Boshlang'ich ta'lim fakulteti",
    totalCredit: 99,
    paidPct: 0.42,
  },
  {
    id: 43247,
    name: 'DUYSEBAYEV N. T.',
    fullName: 'DUYSEBAYEV NURBEK TOLKINOVICH',
    image: 'https://hemis.cspi.uz/static/crop/5/8/320__90_587501997.jpg',
    group: 'BOT -25/7(qozoq)',
    faculty: "Maktabgacha va Boshlang'ich ta'lim fakulteti",
    totalCredit: 60,
    paidPct: 0.55,
  },
  {
    id: 43242,
    name: 'ASRAKULOVA G. A.',
    fullName: 'ASRAKULOVA GAYANE ABRAMOVNA',
    image: 'https://hemis.cspi.uz/static/crop/1/1/320__90_1139552907.jpg',
    group: 'MAT-25/4(rus)',
    faculty: "Maktabgacha va Boshlang'ich ta'lim fakulteti",
    totalCredit: 56,
    paidPct: 0.7,
  },
  {
    id: 43237,
    name: 'DADAYEVA S. T.',
    fullName: 'DADAYEVA SEVARA TASHPULATOVNA',
    image: 'https://hemis.cspi.uz/static/crop/3/3/320__90_3333955973.jpg',
    group: 'MBTJT (SP) 22/8',
    faculty: "Maktabgacha va Boshlang'ich ta'lim fakulteti",
    totalCredit: 131,
    paidPct: 0.24,
  },
  {
    id: 43229,
    name: 'ABDUQODIROVA M. A.',
    fullName: 'ABDUQODIROVA MAFTUNA ABDUMAJIDOVNA',
    image: 'https://hemis.cspi.uz/static/crop/3/9/320__90_3961323888.jpg',
    group: 'MBTJT (SP) 22/7',
    faculty: "Maktabgacha va Boshlang'ich ta'lim fakulteti",
    totalCredit: 131,
    paidPct: 0.15,
  },
  {
    id: 43228,
    name: 'XUDOYQULOVA P. Y.',
    fullName: 'XUDOYQULOVA PARDAXOL YO‘LDOSHEVNA',
    image: 'https://hemis.cspi.uz/static/crop/3/7/320__90_3763100548.jpg',
    group: 'MBTJT-23/2',
    faculty: "Maktabgacha va Boshlang'ich ta'lim fakulteti",
    totalCredit: 180,
    paidPct: 0.05,
  },
]
