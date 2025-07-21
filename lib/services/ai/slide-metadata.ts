// Slide metadata definitions

export interface SlideMetadata {
  title: string
  description: string
  layout: string
}

export function getSlideMetadata(
  slideType: string,
  context: {
    companyName?: string
    industry?: string
  }
): SlideMetadata {
  const { companyName = 'your organization', industry = 'your industry' } = context
  
  const metadata: Record<string, SlideMetadata> = {
    // McKinsey-style slides
    executiveSummary: {
      title: 'Executive Summary',
      description: `Key insights and recommendations for ${companyName}`,
      layout: 'executive'
    },
    swotAnalysis: {
      title: 'Situation Analysis',
      description: `${companyName} strengths, weaknesses, opportunities, and threats`,
      layout: 'matrix'
    },
    marketSizing: {
      title: 'Market Opportunity',
      description: `${industry} market size and growth potential`,
      layout: 'analysis'
    },
    competitiveLandscape: {
      title: 'Competitive Positioning',
      description: 'Market dynamics and differentiation',
      layout: 'positioning'
    },
    valueChain: {
      title: 'Value Creation',
      description: 'End-to-end value optimization',
      layout: 'process'
    },
    processFlow: {
      title: 'Process Optimization',
      description: 'Streamlined workflows and efficiency gains',
      layout: 'process'
    },
    roiCalculation: {
      title: 'Return on Investment',
      description: 'Financial benefits and payback analysis',
      layout: 'financial'
    },
    costBenefit: {
      title: 'Cost-Benefit Analysis',
      description: 'Investment breakdown and value creation',
      layout: 'financial'
    },
    quickWins: {
      title: 'Quick Wins',
      description: 'Immediate impact opportunities',
      layout: 'timeline'
    },
    roadmap: {
      title: 'Implementation Roadmap',
      description: 'Phased approach to success',
      layout: 'gantt'
    },
    metrics: {
      title: 'Key Performance Indicators',
      description: 'Measurable outcomes and targets',
      layout: 'dashboard'
    },
    content: {
      title: 'Key Insights',
      description: 'Strategic recommendations',
      layout: 'standard'
    },
    
    // Sales-oriented slides
    cover: {
      title: 'Proposal Cover',
      description: `Tailored proposal for ${companyName}`,
      layout: 'cover'
    },
    agenda: {
      title: 'Meeting Agenda',
      description: "What we'll cover today",
      layout: 'agenda'
    },
    customerVoice: {
      title: 'What We Heard',
      description: 'Understanding your challenges and needs',
      layout: 'customer'
    },
    industryTrends: {
      title: 'Industry Landscape',
      description: `Key trends shaping ${industry}`,
      layout: 'trends'
    },
    businessImpact: {
      title: 'Business Impact Analysis',
      description: 'Current state vs. desired outcomes',
      layout: 'impact'
    },
    solutionOverview: {
      title: 'Our Solution',
      description: 'How we address your specific needs',
      layout: 'solution'
    },
    productDeepDive: {
      title: 'Solution Deep Dive',
      description: 'Detailed capabilities and features',
      layout: 'product'
    },
    caseStudy: {
      title: 'Success Story',
      description: 'Similar client transformation',
      layout: 'case'
    },
    whyUs: {
      title: 'Why Partner With Us',
      description: 'Our unique differentiators',
      layout: 'differentiators'
    },
    whyNow: {
      title: 'Why Act Now',
      description: 'The urgency and opportunity',
      layout: 'urgency'
    },
    valueProp: {
      title: 'Value Proposition',
      description: 'Your transformation journey',
      layout: 'value'
    },
    pricing: {
      title: 'Investment Options',
      description: 'Flexible pricing to meet your needs',
      layout: 'pricing'
    },
    roi: {
      title: 'Return on Investment',
      description: 'Financial benefits and payback',
      layout: 'roi'
    },
    investmentSummary: {
      title: 'Investment Summary',
      description: 'Package options and terms',
      layout: 'investment'
    },
    technicalArchitecture: {
      title: 'Technical Architecture',
      description: 'System design and security',
      layout: 'technical'
    },
    implementationTimeline: {
      title: 'Implementation Plan',
      description: 'Phased rollout approach',
      layout: 'timeline'
    },
    nextSteps: {
      title: 'Next Steps',
      description: 'Moving forward together',
      layout: 'action'
    },
    contact: {
      title: 'Contact Information',
      description: 'Your dedicated team',
      layout: 'contact'
    },
    thankYou: {
      title: 'Thank You',
      description: 'We appreciate your time',
      layout: 'closing'
    },
    
    // Additional McKinsey slides
    matrix: {
      title: '2x2 Strategic Matrix',
      description: 'Strategic positioning analysis',
      layout: 'matrix'
    },
    waterfallChart: {
      title: 'Value Bridge Analysis',
      description: 'Step-by-step value creation',
      layout: 'waterfall'
    },
    kpiDashboard: {
      title: 'Performance Dashboard',
      description: 'Key metrics at a glance',
      layout: 'dashboard'
    },
    riskMatrix: {
      title: 'Risk Assessment',
      description: 'Risk probability and impact analysis',
      layout: 'matrix'
    },
    benchmark: {
      title: 'Benchmarking Analysis',
      description: 'Performance vs industry standards',
      layout: 'comparison'
    },
    stakeholderMap: {
      title: 'Stakeholder Analysis',
      description: 'Influence and interest mapping',
      layout: 'matrix'
    },
    initiativePrioritization: {
      title: 'Initiative Prioritization',
      description: 'Impact vs effort analysis',
      layout: 'matrix'
    },
    hypothesisTree: {
      title: 'Hypothesis Tree',
      description: 'Structured problem solving',
      layout: 'tree'
    },
    decisionTree: {
      title: 'Decision Analysis',
      description: 'Structured decision framework',
      layout: 'strategic'
    },
    orgStructure: {
      title: 'Organization Design',
      description: 'Team structure and capabilities',
      layout: 'hierarchy'
    },
    heatmap: {
      title: 'Heatmap Analysis',
      description: 'Multi-dimensional analysis',
      layout: 'analysis'
    }
  }
  
  return metadata[slideType] || {
    title: slideType.charAt(0).toUpperCase() + slideType.slice(1),
    description: 'Analysis and insights',
    layout: 'standard'
  }
}