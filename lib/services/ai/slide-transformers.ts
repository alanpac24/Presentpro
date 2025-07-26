// Slide data transformation utilities for presentation viewer

export interface SlideTransformer {
  condition: (slide: any, index: number) => boolean
  transform: (slide: any) => { type: string; data: any }
}

// Universal string extraction function
// Handles nested objects, arrays, and various object patterns
function extractString(value: any, fallback: string = ''): string {
  // Handle null/undefined
  if (value === null || value === undefined) {
    return fallback
  }
  
  // Already a string
  if (typeof value === 'string') {
    return value
  }
  
  // Number or boolean - convert to string
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  
  // Handle objects
  if (typeof value === 'object') {
    // Check common object patterns
    if (value.text !== undefined) return extractString(value.text, fallback)
    if (value.value !== undefined) return extractString(value.value, fallback)
    if (value.name !== undefined) return extractString(value.name, fallback)
    if (value.title !== undefined) return extractString(value.title, fallback)
    if (value.content !== undefined) return extractString(value.content, fallback)
    if (value.label !== undefined) return extractString(value.label, fallback)
    
    // Array - join elements
    if (Array.isArray(value)) {
      return value.map(v => extractString(v, '')).filter(Boolean).join(', ') || fallback
    }
    
    // Try to stringify if it's a simple object
    try {
      const str = JSON.stringify(value)
      console.warn(`Field was object, stringified: ${str.substring(0, 100)}...`)
      return fallback // Don't return the stringified object
    } catch (e) {
      console.warn(`Field was non-stringifiable object`)
    }
  }
  
  return fallback
}

// Extract array ensuring all string fields are properly converted
function extractArray(arr: any[], fieldExtractors: Record<string, (item: any) => any> = {}): any[] {
  if (!Array.isArray(arr)) return []
  
  return arr.map(item => {
    if (typeof item === 'string') return item
    if (typeof item !== 'object' || item === null) return String(item)
    
    // Apply field extractors
    const extracted: any = {}
    for (const [field, extractor] of Object.entries(fieldExtractors)) {
      if (item[field] !== undefined) {
        extracted[field] = extractor(item)
      }
    }
    
    // Copy over any fields not in extractors
    for (const [key, value] of Object.entries(item)) {
      if (!(key in extracted)) {
        extracted[key] = typeof value === 'string' ? value : extractString(value)
      }
    }
    
    return extracted
  })
}

// Define transformation rules for each slide type
export const slideTransformers: SlideTransformer[] = [
  // Title slide (first slide or explicit title type)
  {
    condition: (slide, index) => slide.type === 'title' || index === 0,
    transform: (slide) => ({
      type: 'title',
      data: {
        title: extractString(slide.title || slide.mainTitle, 'Presentation'),
        subtitle: extractString(slide.subtitle || slide.content),
        presenter: extractString(slide.presenter, 'Your Sales Team'),
        company: extractString(slide.company || slide.companyName, 'Target Company'),
        date: extractString(slide.date, new Date().toLocaleDateString())
      }
    })
  },

  // Executive Summary
  {
    condition: (slide) => slide.keyMessage || slide.type === 'executiveSummary',
    transform: (slide) => ({
      type: 'executiveSummary',
      data: {
        title: extractString(slide.title, 'Executive Summary'),
        keyMessage: extractString(slide.keyMessage, 'Key strategic initiative'),
        supportingPoints: extractArray(slide.supportingPoints || [], {
          label: (v) => extractString(v.label || v),
          value: (v) => extractString(v.value || v),
          description: (v) => extractString(v.description || v)
        }),
        recommendation: extractString(slide.recommendation)
      }
    })
  },

  // SWOT Analysis
  {
    condition: (slide) => slide.strengths && slide.weaknesses && slide.opportunities && slide.threats,
    transform: (slide) => ({
      type: 'swotAnalysis',
      data: {
        title: extractString(slide.title, 'SWOT Analysis'),
        subtitle: extractString(slide.subtitle),
        strengths: extractArray(slide.strengths || []).map(s => extractString(s)),
        weaknesses: extractArray(slide.weaknesses || []).map(s => extractString(s)),
        opportunities: extractArray(slide.opportunities || []).map(s => extractString(s)),
        threats: extractArray(slide.threats || []).map(s => extractString(s))
      }
    })
  },

  // Metrics slide
  {
    condition: (slide) => slide.metrics && slide.metrics.length > 0 && !slide.kpis && !slide.status,
    transform: (slide) => ({
      type: 'metrics',
      data: {
        title: extractString(slide.title, 'Key Metrics'),
        subtitle: extractString(slide.subtitle),
        metrics: extractArray(slide.metrics, {
          label: (v) => extractString(v.label || v.name || v),
          value: (v) => extractString(v.value || v),
          trend: (v) => extractString(v.trend),
          color: (v) => v.color || 'blue'
        })
      }
    })
  },

  // Value Proposition
  {
    condition: (slide) => slide.type === 'valueProp' || slide.mainValue,
    transform: (slide) => ({
      type: 'valueProp',
      data: {
        title: extractString(slide.title, 'Value Proposition'),
        subtitle: extractString(slide.subtitle),
        mainValue: extractString(slide.mainValue, 'We deliver measurable business outcomes'),
        valuePillars: extractArray(slide.valuePillars || [], {
          pillar: (v) => extractString(v.pillar || v.name || v),
          description: (v) => extractString(v.description || v),
          metrics: (v) => extractArray(v.metrics || []).map(m => extractString(m))
        }),
        beforeAfter: slide.beforeAfter,
        uniqueSellingPoint: extractString(slide.uniqueSellingPoint)
      }
    })
  },

  // Why Us
  {
    condition: (slide) => slide.type === 'whyUs' || slide.differentiators,
    transform: (slide) => ({
      type: 'whyUs',
      data: {
        title: extractString(slide.title, 'Why Partner With Us'),
        subtitle: extractString(slide.subtitle),
        differentiators: extractArray(slide.differentiators || [], {
          differentiator: (v) => extractString(v.differentiator || v.name || v),
          description: (v) => extractString(v.description || v),
          proof: (v) => extractString(v.proof),
          icon: (v) => extractString(v.icon)
        }),
        clientResults: extractArray(slide.clientResults || [], {
          metric: (v) => extractString(v.metric || v),
          description: (v) => extractString(v.description || v)
        }),
        awards: extractArray(slide.awards || [], {
          award: (v) => extractString(v.award || v.name || v),
          year: (v) => extractString(v.year)
        }),
        partnershipLevel: extractString(slide.partnershipLevel)
      }
    })
  },

  // Why Now
  {
    condition: (slide) => slide.type === 'whyNow' || slide.urgencyFactors,
    transform: (slide) => ({
      type: 'whyNow',
      data: {
        title: extractString(slide.title, 'Why Act Now'),
        subtitle: extractString(slide.subtitle),
        urgencyFactors: extractArray(slide.urgencyFactors || [], {
          factor: (v) => extractString(v.factor || v.name || v),
          impact: (v) => extractString(v.impact || v.description || v),
          timeline: (v) => extractString(v.timeline)
        }),
        opportunities: extractArray(slide.opportunities || [], {
          opportunity: (v) => extractString(v.opportunity || v.name || v),
          benefit: (v) => extractString(v.benefit || v.description || v)
        }),
        costOfDelay: slide.costOfDelay,
        callToAction: extractString(slide.callToAction, 'Start your transformation journey today')
      }
    })
  },

  // Pricing
  {
    condition: (slide) => slide.type === 'pricing' || slide.pricingTiers,
    transform: (slide) => ({
      type: 'pricing',
      data: {
        title: extractString(slide.title, 'Investment Options'),
        subtitle: extractString(slide.subtitle),
        pricingTiers: extractArray(slide.pricingTiers || [], {
          tierName: (v) => extractString(v.tierName || v.name || v),
          price: (v) => extractString(v.price || v),
          description: (v) => extractString(v.description),
          features: (v) => extractArray(v.features || []).map(f => extractString(f)),
          limitations: (v) => extractArray(v.limitations || []).map(l => extractString(l)),
          isRecommended: (v) => !!v.isRecommended
        }),
        volumeDiscounts: slide.volumeDiscounts,
        paymentTerms: slide.paymentTerms,
        customQuote: extractString(slide.customQuote)
      }
    })
  },

  // ROI Calculation
  {
    condition: (slide) => slide.investment && slide.returns,
    transform: (slide) => ({
      type: 'roiCalculation',
      data: {
        title: extractString(slide.title, 'ROI Analysis'),
        subtitle: extractString(slide.subtitle),
        investment: {
          label: extractString(slide.investment.label || 'Initial Investment'),
          value: extractString(slide.investment.value || slide.investment)
        },
        returns: extractArray(slide.returns, {
          year: (v) => extractString(v.year || v),
          value: (v) => extractString(v.value || v)
        }),
        metrics: {
          roi: extractString(slide.metrics?.roi || slide.roi),
          payback: extractString(slide.metrics?.payback || slide.payback),
          npv: extractString(slide.metrics?.npv || slide.npv)
        }
      }
    })
  },

  // ROI (Sales version)
  {
    condition: (slide) => slide.type === 'roi' || slide.totalInvestment,
    transform: (slide) => ({
      type: 'roi',
      data: {
        title: extractString(slide.title, 'Return on Investment'),
        subtitle: extractString(slide.subtitle),
        totalInvestment: {
          software: extractString(slide.totalInvestment?.software || slide.softwareCost),
          implementation: extractString(slide.totalInvestment?.implementation || slide.implementationCost),
          training: extractString(slide.totalInvestment?.training || slide.trainingCost),
          firstYearTotal: extractString(slide.totalInvestment?.firstYearTotal || slide.firstYearTotal)
        },
        annualSavings: extractArray(slide.annualSavings || [], {
          category: (v) => extractString(v.category || v.name || v),
          amount: (v) => extractString(v.amount || v.value || v),
          description: (v) => extractString(v.description)
        }),
        totalAnnualSavings: extractString(slide.totalAnnualSavings),
        paybackPeriod: extractString(slide.paybackPeriod),
        threeYearROI: extractString(slide.threeYearROI),
        netPresentValue: extractString(slide.netPresentValue),
        additionalBenefits: extractArray(slide.additionalBenefits || []).map(b => extractString(b)),
        assumptions: extractArray(slide.assumptions || []).map(a => extractString(a))
      }
    })
  },

  // Solution Overview
  {
    condition: (slide) => slide.type === 'solutionOverview' || slide.solutionStatement,
    transform: (slide) => ({
      type: 'solutionOverview',
      data: {
        title: extractString(slide.title, 'Our Solution'),
        subtitle: extractString(slide.subtitle),
        solutionStatement: extractString(slide.solutionStatement, 'Comprehensive solution tailored to your needs'),
        keyFeatures: extractArray(slide.keyFeatures || slide.features || [], {
          feature: (v) => extractString(v.feature || v.name || v),
          description: (v) => extractString(v.description || v)
        }),
        deploymentModel: extractString(slide.deploymentModel),
        supportModel: extractString(slide.supportModel)
      }
    })
  },

  // Next Steps
  {
    condition: (slide) => slide.type === 'nextSteps' || slide.immediateActions,
    transform: (slide) => ({
      type: 'nextSteps',
      data: {
        title: extractString(slide.title, 'Next Steps'),
        subtitle: extractString(slide.subtitle),
        immediateActions: extractArray(slide.immediateActions || slide.actions || [], {
          action: (v) => extractString(v.action || v.name || v),
          owner: (v) => extractString(v.owner),
          timeline: (v) => extractString(v.timeline)
        }),
        decisionCriteria: extractArray(slide.decisionCriteria || []).map(d => extractString(d)),
        stakeholders: extractArray(slide.stakeholders || []),
        timeline: slide.timeline
      }
    })
  },

  // Chart slide
  {
    condition: (slide) => slide.chartData,
    transform: (slide) => ({
      type: 'chart',
      data: {
        title: extractString(slide.title, 'Data Analysis'),
        subtitle: extractString(slide.subtitle),
        chartType: slide.chartType || 'bar',
        data: slide.chartData
      }
    })
  },

  // Comparison slide
  {
    condition: (slide) => slide.type === 'comparison' && slide.comparisons,
    transform: (slide) => ({
      type: 'comparison',
      data: {
        title: extractString(slide.title, 'Comparison'),
        subtitle: extractString(slide.subtitle),
        leftTitle: extractString(slide.leftTitle, 'Option A'),
        rightTitle: extractString(slide.rightTitle, 'Option B'),
        comparisons: extractArray(slide.comparisons, {
          feature: (v) => extractString(v.feature || v.name || v),
          left: (v) => extractString(v.left || v.optionA || v),
          right: (v) => extractString(v.right || v.optionB || v)
        })
      }
    })
  },

  // Timeline/Roadmap slides
  {
    condition: (slide) => slide.phases && !slide.totalDuration,
    transform: (slide) => ({
      type: 'roadmap',
      data: {
        title: extractString(slide.title, 'Implementation Roadmap'),
        subtitle: extractString(slide.subtitle),
        phases: extractArray(slide.phases, {
          name: (v) => extractString(v.name || v.phase || v),
          duration: (v) => extractString(v.duration || v),
          workstreams: (v) => extractArray(v.workstreams || [], {
            name: (w) => extractString(w.name || w),
            activities: (w) => extractArray(w.activities || []).map(a => extractString(a))
          })
        })
      }
    })
  },

  // Quick Wins
  {
    condition: (slide) => slide.type === 'quickWins' || slide.timeframes,
    transform: (slide) => ({
      type: 'quickWins',
      data: {
        title: extractString(slide.title, 'Quick Wins'),
        subtitle: extractString(slide.subtitle),
        timeframes: extractArray(slide.timeframes || [], {
          period: (v) => extractString(v.period || v.timeframe || v),
          actions: (v) => extractArray(v.actions || [], {
            action: (a) => extractString(a.action || a),
            impact: (a) => extractString(a.impact || a.value),
            owner: (a) => extractString(a.owner)
          })
        })
      }
    })
  },

  // Customer Voice
  {
    condition: (slide) => slide.type === 'customerVoice' || slide.customerQuotes,
    transform: (slide) => ({
      type: 'customerVoice',
      data: {
        title: extractString(slide.title, 'Voice of the Customer'),
        subtitle: extractString(slide.subtitle),
        customerQuotes: extractArray(slide.customerQuotes || []).map(q => extractString(q)),
        painPoints: extractArray(slide.painPoints || [], {
          functionalArea: (v) => extractString(v.functionalArea || v.area),
          challenge: (v) => extractString(v.challenge || v),
          impact: (v) => extractString(v.impact)
        }),
        stakeholders: extractArray(slide.stakeholders || [])
      }
    })
  },

  // Product Deep Dive
  {
    condition: (slide) => slide.type === 'productDeepDive' || slide.coreFeatures,
    transform: (slide) => ({
      type: 'productDeepDive',
      data: {
        title: extractString(slide.title, 'Solution Deep Dive'),
        subtitle: extractString(slide.subtitle),
        coreFeatures: extractArray(slide.coreFeatures || slide.features || [], {
          feature: (v) => extractString(v.feature || v.name || v),
          description: (v) => extractString(v.description || v),
          howItWorks: (v) => extractString(v.howItWorks)
        }),
        businessBenefits: extractArray(slide.businessBenefits || []).map(b => extractString(b)),
        technicalDetails: slide.technicalDetails || { architecture: '', security: '', integrations: [] }
      }
    })
  },

  // Market Sizing
  {
    condition: (slide) => slide.type === 'marketSizing' || slide.tam || slide.sam || slide.som,
    transform: (slide) => ({
      type: 'marketSizing',
      data: {
        title: extractString(slide.title, 'Market Opportunity'),
        subtitle: extractString(slide.subtitle),
        tam: {
          value: extractString(slide.tam?.value || slide.tamValue || '$10B'),
          description: extractString(slide.tam?.description || slide.tamDescription || 'Total Addressable Market')
        },
        sam: {
          value: extractString(slide.sam?.value || slide.samValue || '$3B'),
          description: extractString(slide.sam?.description || slide.samDescription || 'Serviceable Addressable Market')
        },
        som: {
          value: extractString(slide.som?.value || slide.somValue || '$500M'),
          description: extractString(slide.som?.description || slide.somDescription || 'Serviceable Obtainable Market')
        },
        growth: extractString(slide.growth || '15% CAGR')
      }
    })
  },

  // Competitive Landscape
  {
    condition: (slide) => slide.type === 'competitiveLandscape' || (slide.competitors && slide.xAxis && slide.yAxis),
    transform: (slide) => ({
      type: 'competitiveLandscape',
      data: {
        title: extractString(slide.title, 'Competitive Landscape'),
        subtitle: extractString(slide.subtitle),
        xAxis: extractString(slide.xAxis, 'Market Position'),
        yAxis: extractString(slide.yAxis, 'Innovation'),
        competitors: extractArray(Array.isArray(slide.competitors) ? slide.competitors : [], {
          name: (v) => extractString(v.name || v),
          x: (v) => typeof v.x === 'number' ? v.x : 50,
          y: (v) => typeof v.y === 'number' ? v.y : 50,
          size: (v) => v.size || 'medium',
          description: (v) => extractString(v.description),
          isUs: (v) => !!v.isUs
        })
      }
    })
  },

  // Value Chain
  {
    condition: (slide) => slide.type === 'valueChain' || slide.primaryActivities || slide.supportActivities,
    transform: (slide) => ({
      type: 'valueChain',
      data: {
        title: extractString(slide.title, 'Value Chain Analysis'),
        subtitle: extractString(slide.subtitle),
        primaryActivities: extractArray(slide.primaryActivities || [], {
          name: (v) => extractString(v.name || v),
          description: (v) => extractString(v.description || v)
        }),
        supportActivities: extractArray(slide.supportActivities || slide.layers || [], {
          name: (v) => extractString(v.name || v),
          description: (v) => extractString(v.description || v)
        })
      }
    })
  },

  // KPI Dashboard
  {
    condition: (slide) => slide.type === 'kpiDashboard' || (slide.kpis && slide.summary),
    transform: (slide) => ({
      type: 'kpiDashboard',
      data: {
        title: extractString(slide.title, 'KPI Dashboard'),
        subtitle: extractString(slide.subtitle),
        kpis: extractArray(slide.kpis || slide.metrics || [], {
          name: (v) => extractString(v.name || v.metric || v),
          value: (v) => extractString(v.value || v),
          unit: (v) => extractString(v.unit),
          target: (v) => extractString(v.target),
          trend: (v) => extractString(v.trend),
          comparison: (v) => extractString(v.comparison),
          status: (v) => v.status || 'on-track',
          progress: (v) => typeof v.progress === 'number' ? v.progress : 0
        }),
        summary: extractString(slide.summary)
      }
    })
  },

  // Matrix slide
  {
    condition: (slide) => slide.type === 'matrix' || (slide.xAxis && slide.yAxis && slide.quadrants),
    transform: (slide) => ({
      type: 'matrix',
      data: {
        title: extractString(slide.title, 'Strategic Matrix'),
        subtitle: extractString(slide.subtitle),
        xAxis: {
          label: extractString(slide.xAxis?.label || slide.xAxis),
          labels: extractArray(slide.xAxis?.labels || []).map(l => extractString(l))
        },
        yAxis: {
          label: extractString(slide.yAxis?.label || slide.yAxis),
          labels: extractArray(slide.yAxis?.labels || []).map(l => extractString(l))
        },
        quadrants: slide.quadrants,
        items: extractArray(slide.items || [])
      }
    })
  },

  // Timeline slide
  {
    condition: (slide) => slide.type === 'timeline' || (slide.phases && slide.totalDuration),
    transform: (slide) => ({
      type: 'timeline',
      data: {
        title: extractString(slide.title, 'Project Timeline'),
        subtitle: extractString(slide.subtitle),
        phases: extractArray(slide.phases || [], {
          phase: (v) => extractString(v.phase || v.name || v),
          duration: (v) => extractString(v.duration || v),
          activities: (v) => extractArray(v.activities || []).map(a => extractString(a)),
          milestone: (v) => extractString(v.milestone)
        })
      }
    })
  },

  // Generic content slide (with bullets support)
  {
    condition: (slide) => slide.bullets && slide.bullets.length > 0,
    transform: (slide) => ({
      type: 'content',
      data: {
        title: extractString(slide.title, 'Key Points'),
        subtitle: extractString(slide.subtitle),
        content: extractString(slide.content),
        bullets: extractArray(slide.bullets || []).map(b => extractString(b))
      }
    })
  },

  // Default content slide (fallback)
  {
    condition: () => true,
    transform: (slide) => ({
      type: slide.type || 'content',
      data: {
        title: extractString(slide.title, `Slide`),
        subtitle: extractString(slide.subtitle),
        content: extractString(slide.content),
        bullets: slide.bullets ? extractArray(slide.bullets || []).map(b => extractString(b)) : undefined,
        ...slide // Include all other fields as-is
      }
    })
  }
]

export function transformSlide(slide: any, index: number): { type: string; data: any } {
  // Log problematic slides for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log(`Transforming slide ${index + 1}:`, {
      type: slide.type,
      hasTitle: !!slide.title,
      titleType: typeof slide.title,
      keys: Object.keys(slide).slice(0, 10)
    })
  }
  
  // Find the first matching transformer
  const transformer = slideTransformers.find(t => t.condition(slide, index))
  
  if (transformer) {
    try {
      const transformed = transformer.transform(slide)
      
      // Ensure we always have valid data
      if (!transformed.data.title) {
        transformed.data.title = `Slide ${index + 1}`
      }
      
      return transformed
    } catch (error) {
      console.error(`Error transforming slide ${index + 1}:`, error)
      return {
        type: 'content',
        data: {
          title: `Slide ${index + 1}`,
          content: 'Error loading slide content',
          bullets: ['Please try regenerating this slide']
        }
      }
    }
  }
  
  // This should never happen due to the default transformer
  return {
    type: 'content',
    data: {
      title: `Slide ${index + 1}`,
      subtitle: slide.subtitle,
      content: slide.content,
      bullets: slide.bullets
    }
  }
}