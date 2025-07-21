// AI Service Constants

export const DEFAULT_MODEL = 'gpt-4o-mini'

export const SALES_STAGES = {
  DISCOVERY: 'discovery',
  DEMO: 'demo',
  PROPOSAL: 'proposal',
  CLOSING: 'closing',
  GENERAL: 'general'
} as const

export type SalesStage = typeof SALES_STAGES[keyof typeof SALES_STAGES]

export const SLIDE_CATEGORIES = {
  ANALYSIS: 'analysis',
  FINANCIAL: 'financial',
  STRATEGIC: 'strategic',
  COMPETITIVE: 'competitive',
  TIMELINE: 'timeline',
  METRICS: 'metrics',
  CUSTOMER: 'customer',
  SOLUTION: 'solution',
  ACTION: 'action'
} as const

export const STAGE_SLIDE_COUNTS = {
  [SALES_STAGES.DISCOVERY]: { min: 6, max: 8 },
  [SALES_STAGES.DEMO]: { min: 8, max: 12 },
  [SALES_STAGES.PROPOSAL]: { min: 10, max: 15 },
  [SALES_STAGES.CLOSING]: { min: 5, max: 7 },
  [SALES_STAGES.GENERAL]: { min: 7, max: 10 }
} as const

export const INDUSTRIES = {
  SOFTWARE: 'software',
  FINANCE: 'finance',
  HEALTHCARE: 'healthcare',
  RETAIL: 'retail',
  MANUFACTURING: 'manufacturing',
  OTHER: 'other'
} as const

export type Industry = typeof INDUSTRIES[keyof typeof INDUSTRIES]