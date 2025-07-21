import { SalesStage, SALES_STAGES } from './constants'

// Template recipes for each sales stage
export function getTemplateRecipes(salesStage: SalesStage): string[][] {
  const recipes = {
    [SALES_STAGES.DISCOVERY]: [
      // Recipe A: Executive-focused discovery
      ['executiveSummary', 'swotAnalysis', 'marketSizing', 'competitiveLandscape', 'valueChain', 'matrix', 'processFlow'],
      // Recipe B: Challenge-focused discovery
      ['marketSizing', 'hypothesisTree', 'benchmark', 'processFlow', 'stakeholderMap', 'valueChain', 'roadmap'],
      // Recipe C: Quick assessment
      ['executiveSummary', 'swotAnalysis', 'benchmark', 'quickWins', 'initiativePrioritization', 'roadmap'],
      // Recipe D: Industry-focused
      ['marketSizing', 'competitiveLandscape', 'valueChain', 'benchmark', 'hypothesisTree', 'matrix'],
      // Recipe E: Sales-oriented discovery
      ['cover', 'agenda', 'customerVoice', 'industryTrends', 'businessImpact', 'solutionOverview', 'whyNow', 'nextSteps', 'contact'],
      // Recipe F: Customer-centric discovery
      ['cover', 'executiveSummary', 'customerVoice', 'businessImpact', 'industryTrends', 'competitiveLandscape', 'quickWins', 'nextSteps']
    ],
    
    [SALES_STAGES.DEMO]: [
      // Recipe A: Solution-focused demo
      ['content', 'valueChain', 'content', 'roiCalculation', 'metrics', 'roadmap'],
      // Recipe B: Process-focused demo
      ['processFlow', 'valueChain', 'kpiDashboard', 'costBenefit', 'content', 'quickWins'],
      // Recipe C: Executive demo
      ['executiveSummary', 'competitiveLandscape', 'content', 'roiCalculation', 'quickWins', 'metrics'],
      // Recipe D: Technical demo
      ['hypothesisTree', 'processFlow', 'content', 'kpiDashboard', 'roadmap', 'riskMatrix'],
      // Recipe E: Product-focused demo
      ['cover', 'agenda', 'solutionOverview', 'productDeepDive', 'caseStudy', 'technicalArchitecture', 'roi', 'implementationTimeline', 'nextSteps'],
      // Recipe F: Value-focused demo
      ['cover', 'businessImpact', 'solutionOverview', 'productDeepDive', 'valueProp', 'caseStudy', 'quickWins', 'nextSteps', 'contact']
    ],
    
    [SALES_STAGES.PROPOSAL]: [
      // Recipe A: Financial-focused proposal
      ['executiveSummary', 'hypothesisTree', 'valueChain', 'roiCalculation', 'roadmap', 'riskMatrix', 'quickWins'],
      // Recipe B: Strategic proposal
      ['executiveSummary', 'marketSizing', 'swotAnalysis', 'valueChain', 'costBenefit', 'initiativePrioritization', 'stakeholderMap'],
      // Recipe C: Quick decision proposal
      ['executiveSummary', 'benchmark', 'valueChain', 'quickWins', 'roiCalculation', 'processFlow'],
      // Recipe D: Comprehensive proposal
      ['executiveSummary', 'swotAnalysis', 'competitiveLandscape', 'valueChain', 'roiCalculation', 'roadmap', 'kpiDashboard', 'riskMatrix'],
      // Recipe E: Sales proposal standard
      ['cover', 'agenda', 'executiveSummary', 'customerVoice', 'businessImpact', 'solutionOverview', 'whyUs', 'valueProp', 'pricing', 'roi', 'implementationTimeline', 'nextSteps', 'contact', 'thankYou'],
      // Recipe F: Compact sales proposal
      ['cover', 'agenda', 'businessImpact', 'solutionOverview', 'caseStudy', 'whyUs', 'whyNow', 'investmentSummary', 'nextSteps', 'thankYou'],
      // Recipe G: Executive sales proposal
      ['cover', 'executiveSummary', 'industryTrends', 'businessImpact', 'valueProp', 'caseStudy', 'roi', 'whyNow', 'nextSteps', 'contact']
    ],
    
    [SALES_STAGES.CLOSING]: [
      // Recipe A: Urgency-focused closing
      ['executiveSummary', 'quickWins', 'roiCalculation', 'competitiveLandscape', 'initiativePrioritization'],
      // Recipe B: Value-focused closing
      ['executiveSummary', 'costBenefit', 'benchmark', 'metrics', 'roadmap'],
      // Recipe C: Risk mitigation closing
      ['executiveSummary', 'riskMatrix', 'quickWins', 'stakeholderMap', 'processFlow'],
      // Recipe D: Sales closing standard
      ['cover', 'whyNow', 'valueProp', 'roi', 'investmentSummary', 'nextSteps', 'thankYou'],
      // Recipe E: Executive closing
      ['cover', 'executiveSummary', 'whyUs', 'whyNow', 'pricing', 'nextSteps', 'contact']
    ],
    
    [SALES_STAGES.GENERAL]: [
      // Generic sales presentations
      ['marketSizing', 'content', 'matrix', 'roiCalculation', 'quickWins'],
      ['executiveSummary', 'swotAnalysis', 'valueChain', 'metrics', 'roadmap'],
      ['content', 'competitiveLandscape', 'processFlow', 'costBenefit', 'initiativePrioritization'],
      // Sales-oriented generic
      ['cover', 'agenda', 'businessImpact', 'solutionOverview', 'valueProp', 'pricing', 'nextSteps', 'contact'],
      ['cover', 'industryTrends', 'customerVoice', 'solutionOverview', 'caseStudy', 'roi', 'nextSteps']
    ]
  }
  
  return recipes[salesStage] || recipes[SALES_STAGES.GENERAL]
}