"use client"

import React from 'react'
import { SlideDeckPro } from '@/components/SlideDeckPro'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Sample data for all McKinsey-style slides
const mckinseySlidesDemo = [
  {
    id: 'slide-1',
    type: 'title' as const,
    data: {
      title: 'Digital Transformation Strategy',
      subtitle: 'Accelerating Growth Through Innovation',
      presenter: 'McKinsey & Company',
      company: 'Fortune 500 Client',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
  },
  {
    id: 'slide-2',
    type: 'executiveSummary' as const,
    data: {
      title: 'Executive Summary',
      keyMessage: 'Digital transformation can deliver $50M in annual value through operational efficiency and new revenue streams',
      supportingPoints: [
        {
          label: 'Cost Reduction',
          value: '$20M',
          description: 'Through process automation and optimization'
        },
        {
          label: 'Revenue Growth',
          value: '$30M',
          description: 'From new digital channels and services'
        },
        {
          label: 'Time to Market',
          value: '50% Faster',
          description: 'Accelerated product development cycles'
        }
      ],
      recommendation: 'Immediate action on quick wins while planning for comprehensive transformation'
    }
  },
  {
    id: 'slide-3',
    type: 'matrix' as const,
    data: {
      title: 'Strategic Options Assessment',
      subtitle: 'Evaluating transformation approaches',
      xAxis: 'Implementation Complexity',
      yAxis: 'Business Impact',
      quadrants: [
        {
          label: 'Quick Wins',
          items: ['Process Automation', 'Digital Marketing', 'Self-Service Portal'],
          color: 'green'
        },
        {
          label: 'Strategic Initiatives',
          items: ['Platform Modernization', 'AI Integration', 'New Business Model'],
          color: 'blue'
        },
        {
          label: 'Nice to Have',
          items: ['UI Refresh', 'Minor Optimizations'],
          color: 'gray'
        },
        {
          label: 'Complex/Low ROI',
          items: ['Full System Rewrite', 'Custom Solutions'],
          color: 'red'
        }
      ]
    }
  },
  {
    id: 'slide-4',
    type: 'waterfallChart' as const,
    data: {
      title: 'Value Creation Bridge',
      subtitle: 'From current state to future potential',
      startValue: 100,
      startLabel: 'Current Revenue',
      endLabel: 'Future Revenue',
      bars: [
        { label: 'Process Efficiency', value: 15 },
        { label: 'New Digital Products', value: 25 },
        { label: 'Customer Experience', value: 20 },
        { label: 'Market Expansion', value: 18 },
        { label: 'Cost Optimization', value: -8 },
        { label: 'Investment Required', value: -20 }
      ]
    }
  },
  {
    id: 'slide-5',
    type: 'swotAnalysis' as const,
    data: {
      title: 'SWOT Analysis',
      subtitle: 'Current competitive position',
      strengths: [
        'Strong brand recognition',
        'Established customer base',
        'Financial resources',
        'Domain expertise'
      ],
      weaknesses: [
        'Legacy technology stack',
        'Slow decision making',
        'Limited digital skills',
        'Organizational silos'
      ],
      opportunities: [
        'Digital market growth',
        'Customer demand for online',
        'Emerging technologies',
        'Partnership potential'
      ],
      threats: [
        'Digital-native competitors',
        'Changing regulations',
        'Cybersecurity risks',
        'Market disruption'
      ]
    }
  },
  {
    id: 'slide-6',
    type: 'valueChain' as const,
    data: {
      title: 'Digital Value Chain Optimization',
      subtitle: 'End-to-end transformation opportunities',
      primaryActivities: [
        {
          name: 'Inbound Logistics',
          description: 'AI-powered inventory'
        },
        {
          name: 'Operations',
          description: 'Automated workflows'
        },
        {
          name: 'Outbound Logistics',
          description: 'Smart routing'
        },
        {
          name: 'Marketing & Sales',
          description: 'Personalization engine'
        },
        {
          name: 'Service',
          description: '24/7 digital support'
        }
      ],
      supportActivities: [
        {
          name: 'Infrastructure',
          description: 'Cloud platform'
        },
        {
          name: 'HR Management',
          description: 'Digital skills'
        },
        {
          name: 'Technology',
          description: 'AI/ML capabilities'
        },
        {
          name: 'Procurement',
          description: 'E-procurement'
        }
      ]
    }
  },
  {
    id: 'slide-7',
    type: 'roadmap' as const,
    data: {
      title: 'Implementation Roadmap',
      subtitle: '18-month transformation journey',
      phases: [
        {
          name: 'Foundation',
          duration: 'Months 1-3',
          workstreams: [
            {
              name: 'Technology',
              activities: ['Cloud migration planning', 'Architecture design']
            },
            {
              name: 'Organization',
              activities: ['Team formation', 'Skills assessment']
            },
            {
              name: 'Process',
              activities: ['Current state mapping', 'Quick wins identification']
            }
          ]
        },
        {
          name: 'Build',
          duration: 'Months 4-9',
          workstreams: [
            {
              name: 'Technology',
              activities: ['Platform deployment', 'API development']
            },
            {
              name: 'Organization',
              activities: ['Training programs', 'Change management']
            },
            {
              name: 'Process',
              activities: ['Process redesign', 'Pilot programs']
            }
          ]
        },
        {
          name: 'Scale',
          duration: 'Months 10-15',
          workstreams: [
            {
              name: 'Technology',
              activities: ['Full rollout', 'Integration completion']
            },
            {
              name: 'Organization',
              activities: ['Center of Excellence', 'Culture transformation']
            },
            {
              name: 'Process',
              activities: ['Process optimization', 'Continuous improvement']
            }
          ]
        },
        {
          name: 'Optimize',
          duration: 'Months 16-18',
          workstreams: [
            {
              name: 'Technology',
              activities: ['AI/ML deployment', 'Advanced analytics']
            },
            {
              name: 'Organization',
              activities: ['Innovation labs', 'Digital leadership']
            },
            {
              name: 'Process',
              activities: ['Automation at scale', 'New operating model']
            }
          ]
        }
      ]
    }
  },
  {
    id: 'slide-8',
    type: 'roiCalculation' as const,
    data: {
      title: 'ROI Analysis',
      subtitle: 'Financial projections and payback',
      investment: {
        label: 'Total Investment',
        value: '$15M'
      },
      returns: [
        { year: 'Year 1', value: '$8M' },
        { year: 'Year 2', value: '$18M' },
        { year: 'Year 3', value: '$28M' },
        { year: 'Year 4', value: '$35M' },
        { year: 'Year 5', value: '$42M' }
      ],
      metrics: {
        roi: '180%',
        payback: '1.8 years',
        npv: '$45M'
      }
    }
  },
  {
    id: 'slide-9',
    type: 'quickWins' as const,
    data: {
      title: 'Quick Wins Roadmap',
      subtitle: 'Immediate actions for early value',
      timeframes: [
        {
          period: '30 days',
          actions: [
            {
              action: 'Deploy chatbot for customer service',
              impact: '$500K annual savings',
              owner: 'Digital Team'
            },
            {
              action: 'Launch self-service portal',
              impact: '20% call reduction',
              owner: 'Customer Service'
            }
          ]
        },
        {
          period: '60 days',
          actions: [
            {
              action: 'Automate invoice processing',
              impact: '80% faster processing',
              owner: 'Finance'
            },
            {
              action: 'Digital marketing campaign',
              impact: '30% lead increase',
              owner: 'Marketing'
            }
          ]
        },
        {
          period: '90 days',
          actions: [
            {
              action: 'Mobile app MVP launch',
              impact: 'New revenue channel',
              owner: 'Product Team'
            },
            {
              action: 'Data analytics dashboard',
              impact: 'Real-time insights',
              owner: 'Analytics Team'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'slide-10',
    type: 'marketSizing' as const,
    data: {
      title: 'Market Opportunity',
      subtitle: 'Addressable market analysis',
      tam: {
        value: '$850B',
        description: 'Global digital transformation market'
      },
      sam: {
        value: '$125B',
        description: 'Enterprise segment in target regions'
      },
      som: {
        value: '$12.5B',
        description: 'Achievable market share in 5 years'
      },
      growth: '15% CAGR'
    }
  },
  {
    id: 'slide-11',
    type: 'heatmap' as const,
    data: {
      title: 'Digital Maturity Assessment',
      subtitle: 'Current state across business units',
      columns: ['Strategy', 'Technology', 'Process', 'People', 'Culture'],
      rows: [
        {
          label: 'Sales & Marketing',
          values: [
            { value: 85, label: 'Advanced' },
            { value: 70, label: 'Good' },
            { value: 60, label: 'Moderate' },
            { value: 45, label: 'Basic' },
            { value: 40, label: 'Basic' }
          ]
        },
        {
          label: 'Operations',
          values: [
            { value: 60, label: 'Moderate' },
            { value: 75, label: 'Good' },
            { value: 80, label: 'Advanced' },
            { value: 65, label: 'Good' },
            { value: 55, label: 'Moderate' }
          ]
        },
        {
          label: 'Finance',
          values: [
            { value: 70, label: 'Good' },
            { value: 85, label: 'Advanced' },
            { value: 75, label: 'Good' },
            { value: 70, label: 'Good' },
            { value: 65, label: 'Good' }
          ]
        },
        {
          label: 'HR',
          values: [
            { value: 55, label: 'Moderate' },
            { value: 40, label: 'Basic' },
            { value: 35, label: 'Basic' },
            { value: 50, label: 'Moderate' },
            { value: 60, label: 'Moderate' }
          ]
        }
      ]
    }
  },
  {
    id: 'slide-12',
    type: 'competitiveLandscape' as const,
    data: {
      title: 'Competitive Positioning',
      subtitle: 'Market position analysis',
      xAxis: 'Digital Capabilities',
      yAxis: 'Market Share',
      competitors: [
        { name: 'Us', x: 65, y: 45, size: 'medium', isUs: true },
        { name: 'Leader A', x: 85, y: 75, size: 'large', description: 'Market leader' },
        { name: 'Leader B', x: 80, y: 65, size: 'large', description: 'Strong digital player' },
        { name: 'Competitor C', x: 45, y: 55, size: 'medium', description: 'Traditional player' },
        { name: 'Startup D', x: 70, y: 25, size: 'small', description: 'Digital native' },
        { name: 'Competitor E', x: 35, y: 35, size: 'medium', description: 'Struggling' }
      ]
    }
  },
  {
    id: 'slide-13',
    type: 'processFlow' as const,
    data: {
      title: 'Digital Transformation Process',
      subtitle: 'End-to-end implementation approach',
      steps: [
        {
          name: 'Assess',
          description: 'Current state analysis',
          duration: '4 weeks',
          subSteps: ['Stakeholder interviews', 'Process mapping', 'Tech audit']
        },
        {
          name: 'Design',
          description: 'Future state blueprint',
          duration: '6 weeks',
          subSteps: ['Architecture design', 'Operating model', 'Roadmap']
        },
        {
          name: 'Build',
          description: 'Solution development',
          duration: '16 weeks',
          subSteps: ['Platform setup', 'Integration', 'Testing']
        },
        {
          name: 'Deploy',
          description: 'Rollout and adoption',
          duration: '8 weeks',
          subSteps: ['Pilot launch', 'Training', 'Full deployment']
        },
        {
          name: 'Optimize',
          description: 'Continuous improvement',
          duration: 'Ongoing',
          subSteps: ['Performance monitoring', 'Enhancements', 'Scaling']
        }
      ],
      metrics: {
        totalTime: '34 weeks',
        efficiency: '+45%',
        costSaving: '$5M/year'
      }
    }
  },
  {
    id: 'slide-14',
    type: 'kpiDashboard' as const,
    data: {
      title: 'Performance Dashboard',
      subtitle: 'Key metrics tracking',
      kpis: [
        {
          name: 'Digital Revenue',
          value: '42%',
          unit: 'of total',
          target: '50%',
          trend: '+8% YoY',
          status: 'on-track',
          progress: 84
        },
        {
          name: 'Customer Satisfaction',
          value: '4.6',
          unit: '/5.0',
          target: '4.5',
          trend: '+0.3 pts',
          status: 'on-track',
          progress: 92
        },
        {
          name: 'Process Automation',
          value: '65%',
          unit: 'automated',
          target: '80%',
          trend: '+15% QoQ',
          status: 'at-risk',
          progress: 81
        },
        {
          name: 'Time to Market',
          value: '12',
          unit: 'weeks',
          target: '8 weeks',
          trend: '-4 weeks',
          status: 'at-risk',
          progress: 67
        },
        {
          name: 'Cost Reduction',
          value: '$8.5M',
          unit: 'saved',
          target: '$10M',
          trend: '+$2M QoQ',
          status: 'on-track',
          progress: 85
        },
        {
          name: 'Employee Digital Skills',
          value: '72%',
          unit: 'certified',
          target: '90%',
          trend: '+12%',
          status: 'at-risk',
          progress: 80
        }
      ],
      summary: 'Overall performance is strong with 3 of 6 KPIs on track. Focus needed on automation and time to market.'
    }
  },
  {
    id: 'slide-15',
    type: 'riskMatrix' as const,
    data: {
      title: 'Risk Assessment',
      subtitle: 'Transformation risks and mitigation',
      risks: [
        {
          name: 'Legacy System Integration',
          description: 'Complexity of integrating with existing systems',
          impact: 'High',
          likelihood: 'High',
          mitigation: 'Phased migration approach with fallback options'
        },
        {
          name: 'Change Resistance',
          description: 'Employee pushback on new processes',
          impact: 'High',
          likelihood: 'Medium',
          mitigation: 'Comprehensive change management program'
        },
        {
          name: 'Budget Overrun',
          description: 'Project costs exceeding approved budget',
          impact: 'Medium',
          likelihood: 'Medium',
          mitigation: 'Contingency fund and regular cost reviews'
        },
        {
          name: 'Skill Gaps',
          description: 'Lack of required technical expertise',
          impact: 'Medium',
          likelihood: 'High',
          mitigation: 'Training programs and external partnerships'
        },
        {
          name: 'Cybersecurity',
          description: 'Increased vulnerability during transition',
          impact: 'High',
          likelihood: 'Low',
          mitigation: 'Security-first design and continuous monitoring'
        }
      ]
    }
  },
  {
    id: 'slide-16',
    type: 'content' as const,
    data: {
      title: 'Next Steps',
      bullets: [
        'Secure executive sponsorship and budget approval',
        'Form transformation office and governance structure',
        'Launch quick wins within 30 days',
        'Begin foundation phase activities',
        'Schedule weekly steering committee meetings'
      ]
    }
  }
]

export default function DemoMcKinseyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            McKinsey-Style Presentation Components Demo
          </h1>
          <p className="text-gray-600">
            Showcasing all professional slide templates for AI-powered presentations
          </p>
        </div>

        <SlideDeckPro slides={mckinseySlidesDemo} />

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Available McKinsey-Style Slide Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-900">Executive Summary</h3>
              <p className="text-gray-600">Key messages with supporting points</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">2x2 Matrix</h3>
              <p className="text-gray-600">Strategic option evaluation</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Waterfall Chart</h3>
              <p className="text-gray-600">Value bridges and incremental changes</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">SWOT Analysis</h3>
              <p className="text-gray-600">Comprehensive position assessment</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Value Chain</h3>
              <p className="text-gray-600">Process optimization opportunities</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">ROI Calculation</h3>
              <p className="text-gray-600">Financial projections and payback</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Roadmap</h3>
              <p className="text-gray-600">Phased implementation timeline</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Quick Wins</h3>
              <p className="text-gray-600">30-60-90 day action plan</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Market Sizing</h3>
              <p className="text-gray-600">TAM/SAM/SOM analysis</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Heatmap</h3>
              <p className="text-gray-600">Multi-dimensional assessment</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Competitive Landscape</h3>
              <p className="text-gray-600">Market positioning map</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Process Flow</h3>
              <p className="text-gray-600">Step-by-step workflow</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">KPI Dashboard</h3>
              <p className="text-gray-600">Performance metrics tracking</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Risk Matrix</h3>
              <p className="text-gray-600">Impact vs likelihood assessment</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Benchmark</h3>
              <p className="text-gray-600">Industry comparison analysis</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Stakeholder Map</h3>
              <p className="text-gray-600">Influence and interest grid</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Cost-Benefit</h3>
              <p className="text-gray-600">Investment analysis</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Initiative Prioritization</h3>
              <p className="text-gray-600">Effort vs impact matrix</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Hypothesis Tree</h3>
              <p className="text-gray-600">Problem-solving framework</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Decision Tree</h3>
              <p className="text-gray-600">Choice analysis</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Org Structure</h3>
              <p className="text-gray-600">Reporting hierarchy</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Total: 27 McKinsey-style slide templates</strong> ready for AI-powered presentation generation. 
              These professional templates cover strategic analysis, financial modeling, implementation planning, and organizational design.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}