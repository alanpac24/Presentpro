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

// Sales-Oriented Slides

// Cover & Context Module
export interface CoverSlideData {
  proposalTitle: string
  clientName: string
  clientLogo?: string
  vendorName: string
  vendorLogo?: string
  proposalDate: string
  salesRepName: string
  salesRepTitle: string
  salesRepContact?: string
  proposalSubtitle?: string
  dealReferenceId?: string
}

export interface AgendaSlideData {
  title: string
  agendaSections: Array<{
    section: string
    description?: string
    estimatedTime?: string
    icon?: string
  }>
}

// Customer Understanding Module
export interface CustomerVoiceSlideData {
  title: string
  subtitle?: string
  customerQuotes: string[]
  painPoints: Array<{
    functionalArea: string
    challenge: string
    impact: string
  }>
  stakeholders?: Array<{
    name: string
    role: string
  }>
}

export interface IndustryTrendsSlideData {
  title: string
  subtitle?: string
  trends: Array<{
    trend: string
    impact: string
    statistic?: string
    source?: string
  }>
}

export interface BusinessImpactSlideData {
  title: string
  subtitle?: string
  kpis: Array<{
    name: string
    current: string
    ideal: string
    cost?: string
    improvement?: string
  }>
}

// Solution Module
export interface SolutionOverviewSlideData {
  title: string
  subtitle?: string
  solutionName: string
  tagline?: string
  keyFeatures: Array<{
    feature: string
    description: string
    icon?: string
  }>
  screenshot?: string
}

export interface ProductDeepDiveSlideData {
  title: string
  subtitle?: string
  productName?: string
  coreFeatures: Array<{
    feature: string
    description: string
    howItWorks?: string
  }>
  businessBenefits: string[]
  technicalDetails?: {
    architecture?: string
    security?: string
    integrations?: string[]
  }
  demoAvailable?: boolean
}

export interface CaseStudySlideData {
  title: string
  customerName: string
  customerLogo?: string
  challenge: string
  solution: string
  metrics: Array<{
    metric: string
    value: string
    improvement?: string
  }>
  quote?: string
  quoteAuthor?: string
  quoteTitle?: string
}

// Value Proposition Module
export interface ROICalculatorSlideData {
  title: string
  subtitle?: string
  inputs: Array<{
    label: string
    value: string
    unit?: string
  }>
  outputs: Array<{
    label: string
    value: string
    unit?: string
    highlight?: boolean
  }>
  assumptions?: string[]
  disclaimer?: string
}

export interface CompetitiveDifferentiationSlideData {
  title: string
  subtitle?: string
  competitors: string[]
  features: Array<{
    feature: string
    us: string | boolean
    competitors: (string | boolean)[]
  }>
  differentiators?: string[]
}

export interface GoalAlignmentSlideData {
  title: string
  subtitle?: string
  goals: Array<{
    customerGoal: string
    ourCapability: string
    impact: string
    priority?: 'high' | 'medium' | 'low'
  }>
}

// Pricing & Commercials Module
export interface PricingTiersSlideData {
  title: string
  subtitle?: string
  tiers: Array<{
    name: string
    price: string
    period?: string
    features: string[]
    recommended?: boolean
  }>
  discountNote?: string
}


export interface TermsConditionsSlideData {
  title: string
  subtitle?: string
  contractDuration: string
  paymentTerms: string
  slaTerms?: string
  supportTerms?: string
  terminationClause?: string
  additionalTerms?: string[]
}

// Technical Module
export interface ArchitectureDiagramSlideData {
  title: string
  subtitle?: string
  components: Array<{
    name: string
    type: 'frontend' | 'backend' | 'database' | 'integration' | 'external'
    description?: string
  }>
  integrations: Array<{
    from: string
    to: string
    type?: string
  }>
  diagramUrl?: string
}

export interface SecurityComplianceSlideData {
  title: string
  subtitle?: string
  certifications: Array<{
    name: string
    icon?: string
    description?: string
  }>
  securityFeatures: Array<{
    feature: string
    description: string
    icon?: string
  }>
  policies?: string[]
}

// Next Steps Module
export interface MutualActionPlanSlideData {
  title: string
  subtitle?: string
  milestones: Array<{
    milestone: string
    date: string
    owner: string
    status?: 'completed' | 'in-progress' | 'upcoming'
    dependencies?: string[]
  }>
}

export interface CallToActionSlideData {
  title: string
  subtitle?: string
  ctaDescription: string
  ctaText: string
  ctaLink?: string
  additionalActions?: Array<{
    action: string
    deadline?: string
  }>
}

// Sales-oriented slide data interfaces

// Value Proposition Module
export interface WhyUsSlideData {
  title: string
  subtitle?: string
  differentiators: Array<{
    differentiator: string
    description: string
    proof?: string
    icon?: string
  }>
  clientResults?: Array<{
    metric: string
    description: string
  }>
  awards?: Array<{
    award: string
    year?: string
  }>
  partnershipLevel?: string
}

export interface WhyNowSlideData {
  title: string
  subtitle?: string
  urgencyFactors: Array<{
    factor: string
    impact: string
    timeline?: string
  }>
  opportunities: Array<{
    opportunity: string
    benefit: string
    expiryDate?: string
  }>
  costOfDelay?: {
    dailyCost?: string
    monthlyCost?: string
    yearlyCost?: string
    lostOpportunities?: string[]
  }
  callToAction?: string
}

export interface ValuePropSlideData {
  title: string
  subtitle?: string
  mainValue: string
  valuePillars: Array<{
    pillar: string
    description: string
    metrics?: string[]
  }>
  beforeAfter?: {
    before: string[]
    after: string[]
  }
  uniqueSellingPoint?: string
}

// Pricing & Commercials Module
export interface PricingSlideData {
  title: string
  subtitle?: string
  pricingTiers: Array<{
    tierName: string
    description?: string
    price: string
    billingPeriod?: string
    setupFee?: string
    features?: string[]
    limitations?: string[]
    isRecommended?: boolean
  }>
  volumeDiscounts?: Array<{
    volume: string
    discount: string
  }>
  paymentTerms?: {
    options?: string[]
    contractLength?: string
    earlyTermination?: string
  }
  customQuote?: string
}

export interface ROISlideData {
  title: string
  subtitle?: string
  totalInvestment: {
    software: string
    implementation: string
    training: string
    firstYearTotal?: string
  }
  annualSavings: Array<{
    category: string
    amount: string
    description?: string
  }>
  totalAnnualSavings?: string
  paybackPeriod: string
  threeYearROI: string
  netPresentValue?: string
  additionalBenefits?: string[]
  assumptions?: string[]
}

export interface InvestmentSummarySlideData {
  title: string
  subtitle?: string
  packages: Array<{
    packageName: string
    description?: string
    totalPrice: string
    pricePerUser?: string
    includedItems: string[]
    paymentTerms?: string
    contractLength?: string
    validUntil?: string
    optionalAddOns?: Array<{
      item: string
      price: string
    }>
  }>
  executiveSponsorIncentive?: string
  additionalServices?: Array<{
    service: string
    price?: string
  }>
  termsConditions?: string
}

// Technical Module
export interface TechnicalArchitectureSlideData {
  title: string
  subtitle?: string
  architectureLayers: Array<{
    layer: string
    description: string
    technologies?: string[]
  }>
  keyFeatures: string[]
  securityMeasures: string[]
  performanceMetrics?: {
    uptime?: string
    responseTime?: string
    scalability?: string
  }
  deploymentOptions?: string[]
}

export interface ImplementationTimelineSlideData {
  title: string
  subtitle?: string
  totalDuration: string
  startDate?: string
  phases: Array<{
    phase: string
    duration: string
    description?: string
    deliverables?: string[]
    milestones?: string[]
  }>
  keySuccessFactors?: string[]
  risks?: Array<{
    risk: string
    mitigation: string
  }>
}

// Next Steps Module
export interface NextStepsSlideData {
  title: string
  subtitle?: string
  immediateActions: Array<{
    action: string
    owner?: string
    timeline?: string
  }>
  decisionCriteria?: string[]
  stakeholders?: Array<{
    name: string
    role: string
    involvement?: string
  }>
  proposedTimeline?: {
    contractSigning?: string
    kickoff?: string
    goLive?: string
  }
  callToAction?: string
  contactInfo?: {
    email?: string
    phone?: string
  }
}

export interface ContactSlideData {
  title: string
  subtitle?: string
  companyName: string
  companyLogo?: string
  tagline?: string
  addresses?: Array<{
    label?: string
    street: string
    city: string
    state: string
    zip: string
    country?: string
  }>
  website?: string
  email?: string
  phone?: string
  socialLinks?: Array<{
    platform: string
    url: string
  }>
  teamContacts: Array<{
    name: string
    title: string
    email?: string
    phone?: string
    linkedin?: string
  }>
  legalText?: string
}

export interface ThankYouSlideData {
  title: string
  subtitle?: string
  icon?: 'heart' | 'star' | 'handshake'
  messages?: string[]
  contactPrompt?: string
  contactInfo?: {
    email?: string
    phone?: string
    website?: string
  }
  closingStatement?: string
  companyLogo?: string
}

