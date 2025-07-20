// Shared types for all slide components
export interface BaseSlideProps {
  id: string
  className?: string
}

export interface TitleSlideData {
  title: string
  subtitle?: string
  presenter?: string
  company?: string
  date?: string
}

export interface ContentSlideData {
  title: string
  content?: string
  bullets?: string[]
}

export interface MetricsSlideData {
  title: string
  subtitle?: string
  metrics: Array<{
    label: string
    value: string
    trend?: string
    color?: 'blue' | 'green' | 'orange' | 'red'
  }>
}

export interface ChartSlideData {
  title: string
  subtitle?: string
  chartType: 'bar' | 'line' | 'pie'
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string
    }>
  }
}

export interface ComparisonSlideData {
  title: string
  subtitle?: string
  leftTitle: string
  rightTitle: string
  comparisons: Array<{
    feature: string
    left: string
    right: string
  }>
}

export interface TimelineSlideData {
  title: string
  subtitle?: string
  phases: Array<{
    phase: string
    duration: string
    activities: string[]
    milestone?: string
  }>
}

export interface InvestmentSlideData {
  title: string
  subtitle?: string
  investment: {
    initial: string
    monthly: string
    total: string
    roi: string
    payback: string
  }
  benefits: string[]
}

export interface ConclusionSlideData {
  title: string
  subtitle?: string
  keyTakeaways: string[]
  nextSteps: string[]
  callToAction?: string
}

// Executive & Summary Slides
export interface ExecutiveSummarySlideData {
  title: string
  keyMessage: string
  supportingPoints: Array<{
    label: string
    value: string
    description: string
  }>
  recommendation: string
}

export interface KeyMessageSlideData {
  message: string
  supportingFacts: string[]
  source?: string
}

// Data Analysis Slides
export interface MatrixSlideData {
  title: string
  subtitle?: string
  xAxis: { label: string; labels: string[] }
  yAxis: { label: string; labels: string[] }
  quadrants?: Array<{
    name: string
    color: string
  }>
  items: Array<{
    name: string
    x: number // 0-1
    y: number // 0-1
    size?: number
    color?: string
  }>
}

export interface WaterfallChartSlideData {
  title: string
  subtitle?: string
  items: Array<{
    label: string
    value: number
    type: 'start' | 'increase' | 'decrease' | 'end'
  }>
  units?: string
}


// Strategic Framework Slides
export interface SWOTAnalysisSlideData {
  title: string
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export interface ValueChainSlideData {
  title: string
  subtitle?: string
  primaryActivities: Array<{
    name: string
    description: string
  }>
  supportActivities: Array<{
    name: string
    description: string
  }>
}

// Financial Slides
export interface ROICalculationSlideData {
  title: string
  subtitle?: string
  investment: {
    label: string
    value: string
  }
  returns: Array<{
    year: string
    value: string
  }>
  metrics: {
    roi: string
    payback: string
    npv?: string
  }
}

export interface HeatmapSlideData {
  title: string
  subtitle?: string
  columns: string[]
  rows: Array<{
    label: string
    values: Array<{
      value: number
      label?: string
    }>
  }>
}

export interface CompetitiveLandscapeSlideData {
  title: string
  subtitle?: string
  xAxis: string
  yAxis: string
  competitors: Array<{
    name: string
    x: number // 0-100
    y: number // 0-100
    size?: 'small' | 'medium' | 'large'
    description?: string
    isUs?: boolean
  }>
}

export interface ProcessFlowSlideData {
  title: string
  subtitle?: string
  steps: Array<{
    name: string
    description: string
    duration?: string
    subSteps?: string[]
  }>
  metrics?: {
    totalTime?: string
    efficiency?: string
    costSaving?: string
  }
}

export interface KPIDashboardSlideData {
  title: string
  subtitle?: string
  kpis: Array<{
    name: string
    value: string
    unit?: string
    target?: string
    trend?: string
    comparison?: string
    status?: 'on-track' | 'at-risk' | 'off-track'
    progress?: number
  }>
  summary?: string
}

export interface RiskMatrixSlideData {
  title: string
  subtitle?: string
  risks: Array<{
    name: string
    description: string
    impact: 'High' | 'Medium' | 'Low'
    likelihood: 'High' | 'Medium' | 'Low'
    mitigation?: string
  }>
}

export interface BenchmarkSlideData {
  title: string
  subtitle?: string
  metrics: Array<{
    category: string
    us: number
    benchmark: number
    bestInClass: number
    unit?: string
  }>
  insights?: string[]
}

export interface StakeholderMapSlideData {
  title: string
  subtitle?: string
  stakeholders: Array<{
    name: string
    influence: 'high' | 'medium' | 'low'
    interest: 'high' | 'medium' | 'low'
    sentiment?: 'supportive' | 'neutral' | 'opposed'
    role?: string
  }>
}

export interface CostBenefitSlideData {
  title: string
  subtitle?: string
  costs: Array<{
    category: string
    description: string
    amount: number
    timing?: string
  }>
  benefits: Array<{
    category: string
    description: string
    amount: number
    timing?: string
  }>
}

export interface InitiativePrioritizationSlideData {
  title: string
  subtitle?: string
  initiatives: Array<{
    name: string
    impact: 'high' | 'medium' | 'low'
    effort: 'high' | 'medium' | 'low'
    value?: string
    timeframe?: string
    owner?: string
  }>
  totalValue?: string
}

export interface HypothesisTreeSlideData {
  title: string
  subtitle?: string
  mainHypothesis: string
  branches: Array<{
    hypothesis: string
    status?: 'proven' | 'disproven' | 'partial' | 'untested'
    evidence?: string
    dataRequired?: string
    subHypotheses?: Array<{
      hypothesis: string
      status?: 'proven' | 'disproven' | 'partial' | 'untested'
      evidence?: string
      dataRequired?: string
    }>
  }>
}

export interface DecisionTreeSlideData {
  title: string
  subtitle?: string
  tree: {
    type: 'decision' | 'chance' | 'outcome'
    label: string
    value?: string
    probability?: string
    branches?: Array<{
      type: 'decision' | 'chance' | 'outcome'
      label: string
      value?: string
      probability?: string
      branches?: any[]
    }>
  }
  expectedValue?: string
}

export interface OrgStructureSlideData {
  title: string
  subtitle?: string
  structure: {
    title: string
    name?: string
    department?: string
    reports?: Array<{
      title: string
      name?: string
      department?: string
      highlight?: boolean
      reports?: any[]
    }>
    highlight?: boolean
  }
  stats?: {
    totalEmployees?: number
    departments?: number
    reportingLevels?: number
  }
}

// Implementation Slides
export interface RoadmapSlideData {
  title: string
  subtitle?: string
  phases: Array<{
    name: string
    duration: string
    workstreams: Array<{
      name: string
      activities: string[]
    }>
  }>
}

export interface QuickWinsSlideData {
  title: string
  subtitle?: string
  timeframes: Array<{
    period: string
    actions: Array<{
      action: string
      impact: string
      owner?: string
    }>
  }>
}

// Market Analysis Slides
export interface MarketSizingSlideData {
  title: string
  subtitle?: string
  tam: { value: string; description: string }
  sam: { value: string; description: string }
  som: { value: string; description: string }
  growth?: string
}

