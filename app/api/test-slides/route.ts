import { NextRequest, NextResponse } from 'next/server'
import { transformSlide } from '@/lib/services/ai/slide-transformers'

// Test data that simulates problematic AI responses
const testSlides = [
  // Title slide with object fields
  {
    type: 'title',
    title: { text: 'Strategic Sales Presentation' },
    subtitle: { value: 'Transforming Your Business' },
    presenter: { name: 'John Smith' },
    company: { name: 'Acme Corp' },
    date: '2024-01-15'
  },
  // Executive Summary with nested objects
  {
    type: 'executiveSummary',
    title: 'Executive Summary',
    keyMessage: { text: 'We will transform your operations' },
    supportingPoints: [
      {
        label: { text: 'Cost Reduction' },
        value: { number: '30%' },
        description: { content: 'Through automation' }
      },
      {
        label: 'Revenue Growth',
        value: '25%',
        description: 'New markets'
      }
    ],
    recommendation: { text: 'Proceed with implementation' }
  },
  // Value Prop with various formats
  {
    type: 'valueProp',
    title: 'Our Value Proposition',
    mainValue: { text: 'Deliver measurable outcomes' },
    valuePillars: [
      {
        pillar: { name: 'Efficiency' },
        description: 'Streamline operations',
        metrics: [{ value: '30% faster' }, '20% cost reduction']
      },
      {
        pillar: 'Growth',
        description: { text: 'Expand market reach' },
        metrics: ['40% revenue increase']
      }
    ]
  },
  // Why Us with arrays
  {
    type: 'whyUs',
    title: { text: 'Why Partner With Us' },
    differentiators: [
      {
        differentiator: { name: 'Proven Track Record' },
        description: { content: 'Successfully delivered 500+ projects' },
        proof: '95% satisfaction rate'
      },
      {
        differentiator: 'Industry Expertise',
        description: 'Deep domain knowledge',
        proof: { text: '20+ years experience' }
      }
    ],
    clientResults: [
      {
        metric: { value: '3x ROI' },
        description: 'Average client return'
      }
    ]
  },
  // Pricing with mixed formats
  {
    type: 'pricing',
    title: 'Investment Options',
    pricingTiers: [
      {
        tierName: { text: 'Starter' },
        price: '$999/mo',
        features: ['Basic features', { text: 'Email support' }],
        isRecommended: false
      },
      {
        tierName: 'Professional',
        price: { amount: '$2999/mo' },
        features: [{ value: 'All features' }, 'Priority support'],
        isRecommended: true
      }
    ]
  },
  // Generic content slide
  {
    title: 'Key Benefits',
    bullets: [
      { text: 'Increase productivity' },
      'Reduce costs',
      { value: 'Improve quality' }
    ],
    content: { text: 'Our solution provides these benefits' }
  }
]

export async function GET(req: NextRequest) {
  try {
    console.log('=== Testing Slide Transformations ===')
    
    const results = testSlides.map((slide, index) => {
      console.log(`\nTesting slide ${index + 1}:`, slide.type || 'content')
      
      try {
        const transformed = transformSlide(slide, index)
        
        // Check for any remaining objects in string fields
        const issues: string[] = []
        
        function checkForObjects(obj: any, path: string = '') {
          if (obj === null || obj === undefined) return
          
          for (const [key, value] of Object.entries(obj)) {
            const currentPath = path ? `${path}.${key}` : key
            
            // Skip known non-string fields
            if (['id', 'type', 'layout', 'data', 'chartData', 'beforeAfter', 'costOfDelay', 'volumeDiscounts', 'paymentTerms', 'timeline', 'stakeholders'].includes(key)) {
              continue
            }
            
            // Check if this should be a string but isn't
            if (['title', 'subtitle', 'content', 'keyMessage', 'recommendation', 'mainValue', 'callToAction', 'presenter', 'company', 'date'].includes(key)) {
              if (typeof value !== 'string' && value !== undefined) {
                issues.push(`${currentPath} is ${typeof value} instead of string: ${JSON.stringify(value)}`)
              }
            }
            
            // Recursively check objects and arrays
            if (typeof value === 'object' && value !== null) {
              if (Array.isArray(value)) {
                value.forEach((item, idx) => {
                  if (typeof item === 'object' && item !== null) {
                    checkForObjects(item, `${currentPath}[${idx}]`)
                  }
                })
              } else {
                checkForObjects(value, currentPath)
              }
            }
          }
        }
        
        checkForObjects(transformed.data)
        
        return {
          index: index + 1,
          originalType: slide.type || 'content',
          transformedType: transformed.type,
          success: issues.length === 0,
          issues,
          sample: {
            title: transformed.data.title,
            subtitle: transformed.data.subtitle,
            hasProperData: true
          }
        }
      } catch (error) {
        return {
          index: index + 1,
          originalType: slide.type || 'content',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          issues: ['Transformation failed']
        }
      }
    })
    
    const allPassed = results.every(r => r.success)
    
    return NextResponse.json({
      success: allPassed,
      message: allPassed ? 'All slides transformed successfully!' : 'Some slides have issues',
      totalSlides: results.length,
      passedSlides: results.filter(r => r.success).length,
      failedSlides: results.filter(r => !r.success).length,
      results
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}