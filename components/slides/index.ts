// Central registry for all slide components
export { TitleSlide } from './TitleSlide'
export { ContentSlide } from './ContentSlide'
export { MetricsSlide } from './MetricsSlide'
export { ChartSlide } from './ChartSlide'
export { ComparisonSlide } from './ComparisonSlide'
export { TimelineSlide } from './TimelineSlide'
export { ExecutiveSummarySlide } from './ExecutiveSummarySlide'
export { MatrixSlide } from './MatrixSlide'
export { WaterfallChartSlide } from './WaterfallChartSlide'
export { SWOTAnalysisSlide } from './SWOTAnalysisSlide'
export { ValueChainSlide } from './ValueChainSlide'
export { ROICalculationSlide } from './ROICalculationSlide'
export { RoadmapSlide } from './RoadmapSlide'
export { QuickWinsSlide } from './QuickWinsSlide'
export { MarketSizingSlide } from './MarketSizingSlide'
export { HeatmapSlide } from './HeatmapSlide'
export { CompetitiveLandscapeSlide } from './CompetitiveLandscapeSlide'
export { ProcessFlowSlide } from './ProcessFlowSlide'
export { KPIDashboardSlide } from './KPIDashboardSlide'
export { RiskMatrixSlide } from './RiskMatrixSlide'
export { BenchmarkSlide } from './BenchmarkSlide'
export { StakeholderMapSlide } from './StakeholderMapSlide'
export { CostBenefitSlide } from './CostBenefitSlide'
export { InitiativePrioritizationSlide } from './InitiativePrioritizationSlide'
export { HypothesisTreeSlide } from './HypothesisTreeSlide'
export { DecisionTreeSlide } from './DecisionTreeSlide'
export { OrgStructureSlide } from './OrgStructureSlide'

// Sales-oriented slides
export { CoverSlide } from './CoverSlide'
export { AgendaSlide } from './AgendaSlide'
export { CustomerVoiceSlide } from './CustomerVoiceSlide'
export { IndustryTrendsSlide } from './IndustryTrendsSlide'
export { BusinessImpactSlide } from './BusinessImpactSlide'
export { SolutionOverviewSlide } from './SolutionOverviewSlide'
export { ProductDeepDiveSlide } from './ProductDeepDiveSlide'
export { CaseStudySlide } from './CaseStudySlide'
export { WhyUsSlide } from './WhyUsSlide'
export { WhyNowSlide } from './WhyNowSlide'
export { ValuePropSlide } from './ValuePropSlide'
export { PricingSlide } from './PricingSlide'
export { ROISlide } from './ROISlide'
export { InvestmentSummarySlide } from './InvestmentSummarySlide'
export { TechnicalArchitectureSlide } from './TechnicalArchitectureSlide'
export { ImplementationTimelineSlide } from './ImplementationTimelineSlide'
export { NextStepsSlide } from './NextStepsSlide'
export { ContactSlide } from './ContactSlide'
export { ThankYouSlide } from './ThankYouSlide'

export * from './types'

// Slide component mapping
import { TitleSlide } from './TitleSlide'
import { ContentSlide } from './ContentSlide'
import { MetricsSlide } from './MetricsSlide'
import { ChartSlide } from './ChartSlide'
import { ComparisonSlide } from './ComparisonSlide'
import { TimelineSlide } from './TimelineSlide'
import { ExecutiveSummarySlide } from './ExecutiveSummarySlide'
import { MatrixSlide } from './MatrixSlide'
import { WaterfallChartSlide } from './WaterfallChartSlide'
import { SWOTAnalysisSlide } from './SWOTAnalysisSlide'
import { ValueChainSlide } from './ValueChainSlide'
import { ROICalculationSlide } from './ROICalculationSlide'
import { RoadmapSlide } from './RoadmapSlide'
import { QuickWinsSlide } from './QuickWinsSlide'
import { MarketSizingSlide } from './MarketSizingSlide'
import { HeatmapSlide } from './HeatmapSlide'
import { CompetitiveLandscapeSlide } from './CompetitiveLandscapeSlide'
import { ProcessFlowSlide } from './ProcessFlowSlide'
import { KPIDashboardSlide } from './KPIDashboardSlide'
import { RiskMatrixSlide } from './RiskMatrixSlide'
import { BenchmarkSlide } from './BenchmarkSlide'
import { StakeholderMapSlide } from './StakeholderMapSlide'
import { CostBenefitSlide } from './CostBenefitSlide'
import { InitiativePrioritizationSlide } from './InitiativePrioritizationSlide'
import { HypothesisTreeSlide } from './HypothesisTreeSlide'
import { DecisionTreeSlide } from './DecisionTreeSlide'
import { OrgStructureSlide } from './OrgStructureSlide'

// Sales-oriented slide imports
import { CoverSlide } from './CoverSlide'
import { AgendaSlide } from './AgendaSlide'
import { CustomerVoiceSlide } from './CustomerVoiceSlide'
import { IndustryTrendsSlide } from './IndustryTrendsSlide'
import { BusinessImpactSlide } from './BusinessImpactSlide'
import { SolutionOverviewSlide } from './SolutionOverviewSlide'
import { ProductDeepDiveSlide } from './ProductDeepDiveSlide'
import { CaseStudySlide } from './CaseStudySlide'
import { WhyUsSlide } from './WhyUsSlide'
import { WhyNowSlide } from './WhyNowSlide'
import { ValuePropSlide } from './ValuePropSlide'
import { PricingSlide } from './PricingSlide'
import { ROISlide } from './ROISlide'
import { InvestmentSummarySlide } from './InvestmentSummarySlide'
import { TechnicalArchitectureSlide } from './TechnicalArchitectureSlide'
import { ImplementationTimelineSlide } from './ImplementationTimelineSlide'
import { NextStepsSlide } from './NextStepsSlide'
import { ContactSlide } from './ContactSlide'
import { ThankYouSlide } from './ThankYouSlide'

export const slideComponents = {
  title: TitleSlide,
  content: ContentSlide,
  metrics: MetricsSlide,
  chart: ChartSlide,
  comparison: ComparisonSlide,
  timeline: TimelineSlide,
  executiveSummary: ExecutiveSummarySlide,
  matrix: MatrixSlide,
  waterfallChart: WaterfallChartSlide,
  swotAnalysis: SWOTAnalysisSlide,
  valueChain: ValueChainSlide,
  roiCalculation: ROICalculationSlide,
  roadmap: RoadmapSlide,
  quickWins: QuickWinsSlide,
  marketSizing: MarketSizingSlide,
  heatmap: HeatmapSlide,
  competitiveLandscape: CompetitiveLandscapeSlide,
  processFlow: ProcessFlowSlide,
  kpiDashboard: KPIDashboardSlide,
  riskMatrix: RiskMatrixSlide,
  benchmark: BenchmarkSlide,
  stakeholderMap: StakeholderMapSlide,
  costBenefit: CostBenefitSlide,
  initiativePrioritization: InitiativePrioritizationSlide,
  hypothesisTree: HypothesisTreeSlide,
  decisionTree: DecisionTreeSlide,
  orgStructure: OrgStructureSlide,
  // Sales-oriented slides
  cover: CoverSlide,
  agenda: AgendaSlide,
  customerVoice: CustomerVoiceSlide,
  industryTrends: IndustryTrendsSlide,
  businessImpact: BusinessImpactSlide,
  solutionOverview: SolutionOverviewSlide,
  productDeepDive: ProductDeepDiveSlide,
  caseStudy: CaseStudySlide,
  whyUs: WhyUsSlide,
  whyNow: WhyNowSlide,
  valueProp: ValuePropSlide,
  pricing: PricingSlide,
  roi: ROISlide,
  investmentSummary: InvestmentSummarySlide,
  technicalArchitecture: TechnicalArchitectureSlide,
  implementationTimeline: ImplementationTimelineSlide,
  nextSteps: NextStepsSlide,
  contact: ContactSlide,
  thankYou: ThankYouSlide,
  // Legacy mappings
  bullet: ContentSlide,
  twoColumn: ComparisonSlide,
} as const

export type SlideType = keyof typeof slideComponents