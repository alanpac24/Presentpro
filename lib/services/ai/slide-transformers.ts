// Slide data transformation utilities for presentation viewer

export interface SlideTransformer {
  condition: (slide: any, index: number) => boolean
  transform: (slide: any) => { type: string; data: any }
}

// Define transformation rules for each slide type
export const slideTransformers: SlideTransformer[] = [
  // Title slide (first slide or explicit title type)
  {
    condition: (slide, index) => slide.type === 'title' || index === 0,
    transform: (slide) => ({
      type: 'title',
      data: {
        title: slide.title,
        subtitle: slide.content || slide.subtitle,
        presenter: slide.presenter || 'Your Sales Team',
        company: slide.company || 'Target Company',
        date: slide.date || new Date().toLocaleDateString()
      }
    })
  },

  // Executive Summary
  {
    condition: (slide) => slide.keyMessage || slide.type === 'executiveSummary',
    transform: (slide) => ({
      type: 'executiveSummary',
      data: {
        title: slide.title,
        keyMessage: slide.keyMessage,
        supportingPoints: slide.supportingPoints || [],
        recommendation: slide.recommendation || ''
      }
    })
  },

  // Metrics slide
  {
    condition: (slide) => slide.metrics && slide.metrics.length > 0 && !slide.kpis && !slide.status,
    transform: (slide) => ({
      type: 'metrics',
      data: {
        title: slide.title,
        subtitle: slide.subtitle,
        metrics: slide.metrics
      }
    })
  },

  // Chart slide
  {
    condition: (slide) => slide.chartData,
    transform: (slide) => ({
      type: 'chart',
      data: {
        title: slide.title,
        subtitle: slide.subtitle,
        chartType: slide.chartType || 'bar',
        data: slide.chartData
      }
    })
  },

  // Matrix slide
  {
    condition: (slide) => slide.xAxis && slide.yAxis && slide.quadrants,
    transform: (slide) => ({
      type: 'matrix',
      data: {
        title: slide.title,
        subtitle: slide.subtitle,
        xAxis: slide.xAxis,
        yAxis: slide.yAxis,
        quadrants: slide.quadrants
      }
    })
  },

  // ROI Calculation (old format)
  {
    condition: (slide) => slide.investment && slide.returns,
    transform: (slide) => ({
      type: 'roiCalculation',
      data: {
        title: slide.title,
        subtitle: slide.subtitle,
        investment: slide.investment,
        returns: slide.returns,
        metrics: slide.metrics
      }
    })
  },

  // Roadmap
  {
    condition: (slide) => slide.phases && !slide.totalDuration,
    transform: (slide) => ({
      type: 'roadmap',
      data: {
        title: slide.title,
        subtitle: slide.subtitle,
        phases: slide.phases
      }
    })
  },

  // Quick Wins
  {
    condition: (slide) => slide.timeframes,
    transform: (slide) => ({
      type: 'quickWins',
      data: {
        title: slide.title,
        subtitle: slide.subtitle,
        timeframes: slide.timeframes
      }
    })
  },

  // Competitive Landscape
  {
    condition: (slide) => slide.competitors && slide.xAxis && slide.yAxis,
    transform: (slide) => ({
      type: 'competitiveLandscape',
      data: {
        title: slide.title,
        subtitle: slide.subtitle,
        xAxis: slide.xAxis,
        yAxis: slide.yAxis,
        competitors: slide.competitors
      }
    })
  },

  // SWOT Analysis
  {
    condition: (slide) => slide.strengths && slide.weaknesses && slide.opportunities && slide.threats,
    transform: (slide) => ({
      type: 'swotAnalysis',
      data: {
        title: slide.title,
        subtitle: slide.subtitle,
        strengths: slide.strengths,
        weaknesses: slide.weaknesses,
        opportunities: slide.opportunities,
        threats: slide.threats
      }
    })
  },

  // KPI Dashboard
  {
    condition: (slide) => slide.summary && slide.metrics && slide.metrics.some((m: any) => m.status),
    transform: (slide) => ({
      type: 'kpiDashboard',
      data: {
        title: slide.title,
        subtitle: slide.subtitle,
        kpis: slide.metrics,
        summary: slide.summary
      }
    })
  },

  // Value Chain
  {
    condition: (slide) => slide.primaryActivities || slide.supportActivities || slide.layers,
    transform: (slide) => ({
      type: 'valueChain',
      data: {
        title: slide.title,
        subtitle: slide.subtitle,
        primaryActivities: slide.primaryActivities || [],
        supportActivities: slide.supportActivities || slide.layers || []
      }
    })
  },

  // Sales-oriented slides
  {
    condition: (slide) => slide.type === 'cover',
    transform: (slide) => ({
      type: 'cover',
      data: {
        title: slide.title,
        proposalTitle: slide.proposalTitle || slide.title,
        clientName: slide.clientName || 'Client Name',
        vendorName: slide.vendorName || 'Your Company',
        proposalDate: slide.proposalDate || new Date().toLocaleDateString(),
        salesRepName: slide.salesRepName || 'Your Name',
        salesRepTitle: slide.salesRepTitle || 'Title',
        ...slide
      }
    })
  },

  // Comparison slide (for backward compatibility)
  {
    condition: (slide) => slide.type === 'comparison' && slide.bullets,
    transform: (slide) => ({
      type: 'comparison',
      data: {
        title: slide.title,
        subtitle: slide.subtitle,
        leftTitle: 'Traditional',
        rightTitle: 'Modern',
        comparisons: slide.bullets.map((bullet: string) => {
          if (bullet.includes('|')) {
            const [left, right] = bullet.split('|')
            const feature = left.includes(':') ? left.split(':')[0] : 'Feature'
            return {
              feature: feature.trim(),
              left: left.includes(':') ? left.split(':')[1].trim() : left.trim(),
              right: right.trim()
            }
          }
          return { feature: bullet, left: '', right: '' }
        })
      }
    })
  },

  // Market Sizing
  {
    condition: (slide) => slide.type === 'marketSizing' || slide.tam || slide.sam || slide.som,
    transform: (slide) => ({
      type: 'marketSizing',
      data: {
        title: slide.title || 'Market Opportunity',
        subtitle: slide.subtitle || 'Addressable market analysis',
        tam: slide.tam || { value: slide.tamValue || '$10B', description: slide.tamDescription || 'Total Addressable Market' },
        sam: slide.sam || { value: slide.samValue || '$3B', description: slide.samDescription || 'Serviceable Addressable Market' },
        som: slide.som || { value: slide.somValue || '$500M', description: slide.somDescription || 'Serviceable Obtainable Market' },
        growth: slide.growth || '15% CAGR'
      }
    })
  },

  // ValueProp
  {
    condition: (slide) => slide.type === 'valueProp',
    transform: (slide) => ({
      type: 'valueProp',
      data: {
        title: slide.title || 'Value Proposition',
        subtitle: slide.subtitle || 'Your transformation journey',
        mainValue: slide.mainValue || 'We deliver measurable business outcomes through innovative solutions',
        valuePillars: slide.valuePillars || [
          { 
            pillar: 'Efficiency', 
            description: 'Streamline operations and reduce costs',
            metrics: ['30% time savings', '25% cost reduction']
          },
          { 
            pillar: 'Growth', 
            description: 'Expand market reach and revenue',
            metrics: ['40% revenue growth', 'New market entry']
          },
          { 
            pillar: 'Innovation', 
            description: 'Stay ahead with cutting-edge technology',
            metrics: ['First-to-market advantage', 'Future-ready platform']
          }
        ],
        beforeAfter: slide.beforeAfter,
        uniqueSellingPoint: slide.uniqueSellingPoint
      }
    })
  },

  // WhyUs
  {
    condition: (slide) => slide.type === 'whyUs',
    transform: (slide) => ({
      type: 'whyUs',
      data: {
        title: slide.title || 'Why Partner With Us',
        subtitle: slide.subtitle || 'Our unique differentiators',
        differentiators: slide.differentiators || [
          {
            differentiator: 'Proven Track Record',
            description: 'Successfully delivered 500+ transformations',
            proof: '95% client satisfaction rate'
          },
          {
            differentiator: 'Industry Expertise',
            description: 'Deep domain knowledge and best practices',
            proof: '20+ years of experience'
          }
        ],
        clientResults: slide.clientResults || [],
        awards: slide.awards || [],
        partnershipLevel: slide.partnershipLevel
      }
    })
  },

  // WhyNow
  {
    condition: (slide) => slide.type === 'whyNow',
    transform: (slide) => ({
      type: 'whyNow',
      data: {
        title: slide.title || 'Why Act Now',
        subtitle: slide.subtitle || 'The urgency and opportunity',
        urgencyFactors: slide.urgencyFactors || [
          {
            factor: 'Market Dynamics',
            impact: 'Competitors are already moving ahead',
            timeline: 'Next 6 months critical'
          },
          {
            factor: 'Cost of Delay',
            impact: 'Every month of delay costs opportunity',
            timeline: 'Immediate action needed'
          }
        ],
        opportunities: slide.opportunities || [
          {
            opportunity: 'First Mover Advantage',
            benefit: 'Capture market share before competitors'
          }
        ],
        costOfDelay: slide.costOfDelay,
        callToAction: slide.callToAction || 'Start your transformation journey today'
      }
    })
  },

  // Pricing
  {
    condition: (slide) => slide.type === 'pricing',
    transform: (slide) => ({
      type: 'pricing',
      data: {
        title: slide.title || 'Investment Options',
        subtitle: slide.subtitle || 'Flexible pricing to meet your needs',
        pricingTiers: slide.pricingTiers || [
          {
            tierName: 'Starter',
            price: '$X/month',
            description: 'For small teams',
            features: ['Core features', 'Basic support'],
            limitations: ['Limited users']
          },
          {
            tierName: 'Professional',
            price: '$XX/month',
            description: 'For growing businesses',
            features: ['All features', 'Priority support', 'Advanced analytics'],
            isRecommended: true
          },
          {
            tierName: 'Enterprise',
            price: 'Custom',
            description: 'For large organizations',
            features: ['Unlimited everything', 'Dedicated support', 'Custom features']
          }
        ],
        volumeDiscounts: slide.volumeDiscounts,
        paymentTerms: slide.paymentTerms,
        customQuote: slide.customQuote
      }
    })
  },

  // Agenda
  {
    condition: (slide) => slide.type === 'agenda',
    transform: (slide) => ({
      type: 'agenda',
      data: {
        title: slide.title || 'Meeting Agenda',
        agendaSections: slide.agendaSections || slide.sections || [
          { section: 'Understanding Your Needs', estimatedTime: '10 min' },
          { section: 'Our Solution Approach', estimatedTime: '20 min' },
          { section: 'Value & Investment', estimatedTime: '15 min' },
          { section: 'Next Steps', estimatedTime: '5 min' }
        ]
      }
    })
  },

  // BusinessImpact
  {
    condition: (slide) => slide.type === 'businessImpact',
    transform: (slide) => ({
      type: 'businessImpact',
      data: {
        title: slide.title || 'Business Impact Analysis',
        subtitle: slide.subtitle || 'Current state vs. desired outcomes',
        kpis: slide.kpis || [
          {
            name: 'Operational Efficiency',
            current: '60%',
            ideal: '90%',
            improvement: '50%'
          }
        ]
      }
    })
  },

  // NextSteps
  {
    condition: (slide) => slide.type === 'nextSteps',
    transform: (slide) => ({
      type: 'nextSteps',
      data: {
        title: slide.title || 'Next Steps',
        subtitle: slide.subtitle || 'Moving forward together',
        immediateActions: slide.immediateActions || slide.actions || [
          { action: 'Schedule follow-up meeting', owner: 'Both', timeline: 'This week' },
          { action: 'Share detailed proposal', owner: 'Us', timeline: '2 days' },
          { action: 'Internal review', owner: 'You', timeline: '1 week' }
        ],
        decisionCriteria: slide.decisionCriteria || [],
        stakeholders: slide.stakeholders || [],
        timeline: slide.timeline
      }
    })
  },

  // SolutionOverview
  {
    condition: (slide) => slide.type === 'solutionOverview',
    transform: (slide) => ({
      type: 'solutionOverview',
      data: {
        title: slide.title || 'Our Solution',
        subtitle: slide.subtitle || 'How we address your specific needs',
        solutionStatement: slide.solutionStatement || 'Comprehensive solution tailored to your needs',
        keyFeatures: slide.keyFeatures || slide.features || [
          { feature: 'Scalable Architecture', description: 'Grows with your business' },
          { feature: 'User-Friendly Interface', description: 'Minimal training required' },
          { feature: 'Advanced Analytics', description: 'Data-driven insights' }
        ],
        deploymentModel: slide.deploymentModel,
        supportModel: slide.supportModel
      }
    })
  },

  // ProductDeepDive
  {
    condition: (slide) => slide.type === 'productDeepDive',
    transform: (slide) => ({
      type: 'productDeepDive',
      data: {
        title: slide.title || 'Solution Deep Dive',
        subtitle: slide.subtitle || 'Detailed capabilities and features',
        coreFeatures: slide.coreFeatures || slide.features || [],
        businessBenefits: slide.businessBenefits || [],
        technicalDetails: slide.technicalDetails || { architecture: '', security: '', integrations: [] }
      }
    })
  },

  // ROI Slide
  {
    condition: (slide) => slide.type === 'roi',
    transform: (slide) => ({
      type: 'roi',
      data: {
        title: slide.title || 'Return on Investment',
        subtitle: slide.subtitle || 'Financial benefits and payback',
        totalInvestment: slide.totalInvestment || {
          software: slide.softwareCost || '$50,000',
          implementation: slide.implementationCost || '$25,000',
          training: slide.trainingCost || '$10,000',
          firstYearTotal: slide.firstYearTotal || '$85,000'
        },
        annualSavings: slide.annualSavings || [
          { category: 'Operational Efficiency', amount: '$50,000/year' },
          { category: 'Time Savings', amount: '$30,000/year' },
          { category: 'Error Reduction', amount: '$20,000/year' }
        ],
        totalAnnualSavings: slide.totalAnnualSavings || '$100,000',
        paybackPeriod: slide.paybackPeriod || '10 months',
        threeYearROI: slide.threeYearROI || '253%',
        netPresentValue: slide.netPresentValue,
        additionalBenefits: slide.additionalBenefits || [],
        assumptions: slide.assumptions || []
      }
    })
  },

  // Other sales slides with simpler structures
  {
    condition: (slide) => ['customerVoice', 'industryTrends', 'caseStudy', 'investmentSummary', 
                          'technicalArchitecture', 'implementationTimeline', 'contact', 'thankYou'].includes(slide.type),
    transform: (slide) => ({
      type: slide.type,
      data: {
        title: slide.title || slide.type.charAt(0).toUpperCase() + slide.type.slice(1).replace(/([A-Z])/g, ' $1').trim(),
        subtitle: slide.subtitle,
        ...slide
      }
    })
  },

  // Default content slide
  {
    condition: () => true,
    transform: (slide) => ({
      type: slide.type || 'content',
      data: {
        title: slide.title || `Slide`,
        subtitle: slide.subtitle,
        content: slide.content,
        bullets: slide.bullets,
        ...slide
      }
    })
  }
]

export function transformSlide(slide: any, index: number): { type: string; data: any } {
  // Find the first matching transformer
  const transformer = slideTransformers.find(t => t.condition(slide, index))
  
  if (transformer) {
    return transformer.transform(slide)
  }
  
  // Fallback to content slide
  return {
    type: 'content',
    data: {
      title: slide.title || `Slide ${index + 1}`,
      subtitle: slide.subtitle,
      content: slide.content,
      bullets: slide.bullets
    }
  }
}