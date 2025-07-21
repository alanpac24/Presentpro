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