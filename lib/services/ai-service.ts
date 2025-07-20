import OpenAI from 'openai'
import { z } from 'zod'
import { ResearchData } from './research-service'

// Slide content schemas
const SlideContentSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  mainContent: z.array(z.object({
    type: z.enum(['text', 'bullet', 'metric', 'quote']),
    content: z.string(),
    subContent: z.string().optional(),
  })),
  keyInsight: z.string().optional(),
  metrics: z.array(z.object({
    label: z.string(),
    value: z.string(),
    trend: z.string().optional(),
  })).optional(),
})

const ProposalContentSchema = z.object({
  executiveSummary: SlideContentSchema,
  businessUnderstanding: SlideContentSchema,
  problemSolution: SlideContentSchema,
  implementation: SlideContentSchema,
  investment: SlideContentSchema,
})

export type SlideContent = z.infer<typeof SlideContentSchema>
export type ProposalContent = z.infer<typeof ProposalContentSchema>

export interface GenerationOptions {
  product: string
  objective: string
  companyInfo: {
    name: string
    contactName: string
    contactEmail: string
  }
}

export class AIService {
  private openai: OpenAI | null = null

  constructor() {
    // Don't read environment variables in constructor
  }

  private getModel(): string {
    // Read model at runtime
    return process.env.OPENAI_MODEL || 'gpt-4o-mini'
  }

  private hasValidApiKey(): boolean {
    const apiKey = process.env.OPENAI_API_KEY
    return !!(apiKey && apiKey !== 'your-openai-api-key-here' && apiKey.trim().length > 0)
  }

  private getOpenAI(): OpenAI | null {
    // Check API key validity first
    if (!this.hasValidApiKey()) {
      console.log('No valid OpenAI API key found')
      return null
    }

    // Create OpenAI client lazily with runtime environment variable
    if (!this.openai) {
      const apiKey = process.env.OPENAI_API_KEY
      console.log('Creating OpenAI client with API key:', apiKey ? `${apiKey.substring(0, 7)}...` : 'undefined')
      this.openai = new OpenAI({
        apiKey: apiKey,
      })
    }
    return this.openai
  }

  /**
   * Generate personalized proposal content based on research
   */
  async generateProposalContent(
    research: ResearchData,
    options: GenerationOptions
  ): Promise<ProposalContent> {
    const prompt = this.buildProposalPrompt(research, options)
    
    try {
      const openaiClient = this.getOpenAI()
      if (!openaiClient) {
        console.log('OpenAI client not available, using fallback content')
        return this.getFallbackContent(research, options)
      }

      const completion = await openaiClient.chat.completions.create({
        model: this.getModel(),
        messages: [
          {
            role: 'system',
            content: 'You are an expert sales consultant creating McKinsey-style proposals. Generate compelling, data-driven content that is personalized and persuasive.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      })

      const content = completion.choices[0]?.message?.content
      if (!content) throw new Error('No content generated')

      const parsed = JSON.parse(content)
      return ProposalContentSchema.parse(parsed)
    } catch (error) {
      console.error('AI generation error:', error)
      // Return fallback content
      return this.getFallbackContent(research, options)
    }
  }

  /**
   * Build the prompt for proposal generation
   */
  private buildProposalPrompt(research: ResearchData, options: GenerationOptions): string {
    return `Generate a personalized 5-slide sales proposal for ${research.company.name} targeting ${research.prospect.name}, ${research.prospect.title}.

Company Research:
- Company: ${research.company.name}
- Industry: ${research.company.industry}
- Size: ${research.company.size}
- Recent News: ${research.company.recentNews?.join('; ')}
- Growth Metrics: ${research.company.growthMetrics?.join('; ')}

Prospect Info:
- Name: ${research.prospect.name}
- Title: ${research.prospect.title}
- Interests: ${research.prospect.interests?.join(', ')}

Our Product: ${options.product}
Sales Objective: ${options.objective}

Industry Context:
- Trends: ${research.industry.trends.slice(0, 3).join('; ')}
- Challenges: ${research.industry.challenges.slice(0, 3).join('; ')}

Company Pain Points: ${research.painPoints.join('; ')}
Opportunities: ${research.opportunities.join('; ')}

Create content for 5 slides following this EXACT JSON structure:

{
  "executiveSummary": {
    "title": "We can help [Company] achieve [specific measurable benefit] while [additional value]",
    "subtitle": "Prepared for [Name], [Title] | [Date]",
    "mainContent": [
      {
        "type": "metric",
        "content": "[Primary value proposition with specific percentage or dollar amount]",
        "subContent": "Projected annual savings"
      },
      {
        "type": "text",
        "content": "Executive Summary",
        "subContent": "Challenge: [Their specific challenge]\nSolution: [Our specific solution]\nInvestment: [Price range]\nROI: [Specific percentage]"
      },
      {
        "type": "text",
        "content": "Why This Matters Now",
        "subContent": "[2-3 urgency factors specific to their situation]"
      }
    ],
    "keyInsight": "[One powerful insight about their business]"
  },
  "businessUnderstanding": {
    "title": "We understand [Company]'s specific challenges and growth trajectory",
    "subtitle": "Your current position and market dynamics",
    "mainContent": [
      {
        "type": "text",
        "content": "Company Overview",
        "subContent": "[Brief description incorporating their recent news and growth]"
      },
      {
        "type": "bullet",
        "content": "Key Challenges We've Identified",
        "subContent": "• [Challenge 1 specific to them]\n• [Challenge 2 specific to them]\n• [Challenge 3 specific to them]"
      },
      {
        "type": "text",
        "content": "Market Context",
        "subContent": "[Industry trend relevant to them] positions [Company] for [opportunity]"
      }
    ],
    "keyInsight": "Based on your [specific metric/news], we see immediate opportunity for [specific improvement]"
  },
  "problemSolution": {
    "title": "[Their specific problem] solved with [our solution category]",
    "subtitle": "How we address your unique requirements",
    "mainContent": [
      {
        "type": "metric",
        "content": "[Impressive metric 1]",
        "subContent": "[What this metric means]"
      },
      {
        "type": "metric",
        "content": "[Impressive metric 2]",
        "subContent": "[What this metric means]"
      },
      {
        "type": "metric",
        "content": "[Impressive metric 3]",
        "subContent": "[What this metric means]"
      },
      {
        "type": "text",
        "content": "Your Current Pain Points",
        "subContent": "[List their specific pain points we're solving]"
      },
      {
        "type": "text",
        "content": "Our Solution Architecture",
        "subContent": "[How our solution specifically addresses their needs]"
      },
      {
        "type": "quote",
        "content": "Similar company in [their industry] achieved [specific result]",
        "subContent": "- [Client name or 'Fortune 500 company']"
      }
    ]
  },
  "implementation": {
    "title": "Proven implementation methodology with measurable outcomes",
    "subtitle": "Your path to success with clear milestones",
    "mainContent": [
      {
        "type": "text",
        "content": "Phase 1: Discovery & Setup (Weeks 1-2)",
        "subContent": "• Stakeholder alignment\n• Current state analysis\n• Success criteria definition"
      },
      {
        "type": "text",
        "content": "Phase 2: Configuration & Integration (Weeks 3-4)",
        "subContent": "• System configuration\n• Data migration\n• Initial testing"
      },
      {
        "type": "text",
        "content": "Phase 3: Launch & Training (Weeks 5-6)",
        "subContent": "• User training\n• Go-live support\n• Performance monitoring"
      },
      {
        "type": "text",
        "content": "Phase 4: Optimization (Ongoing)",
        "subContent": "• Performance tuning\n• Feature expansion\n• ROI tracking"
      }
    ],
    "metrics": [
      {
        "label": "Time to Value",
        "value": "2 weeks",
        "trend": "3x faster than alternatives"
      },
      {
        "label": "User Adoption",
        "value": "95%",
        "trend": "Industry-leading"
      },
      {
        "label": "Success Rate",
        "value": "99.5%",
        "trend": "Across all deployments"
      }
    ]
  },
  "investment": {
    "title": "Clear ROI with immediate action plan",
    "subtitle": "Your investment and expected returns",
    "mainContent": [
      {
        "type": "metric",
        "content": "[Specific ROI percentage]",
        "subContent": "Expected ROI within 12 months"
      },
      {
        "type": "text",
        "content": "Investment Summary",
        "subContent": "Setup: [Price]\nMonthly: [Price]\nTotal Year 1: [Price]\nProjected Savings: [Amount]"
      },
      {
        "type": "text",
        "content": "What You Get",
        "subContent": "• [Deliverable 1]\n• [Deliverable 2]\n• [Deliverable 3]\n• [Deliverable 4]"
      },
      {
        "type": "text",
        "content": "Implementation Timeline",
        "subContent": "Week 1: Contract & kickoff\nWeek 2-3: Setup & configuration\nWeek 4: Training & go-live\nWeek 5+: Ongoing optimization"
      },
      {
        "type": "text",
        "content": "Next Steps",
        "subContent": "1. Schedule technical deep-dive (This week)\n2. Align stakeholders (Next week)\n3. Begin pilot program ([Specific date])"
      }
    ],
    "keyInsight": "Every day of delay costs [Company] approximately [calculated daily cost based on their metrics]"
  }
}

Make it highly personalized using the research data. Include specific metrics, company details, and industry context. Be conversational yet professional.`
  }

  /**
   * Generate fallback content if AI fails
   */
  private getFallbackContent(research: ResearchData, options: GenerationOptions): ProposalContent {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    
    return {
      executiveSummary: {
        title: `We can help ${research.company.name} achieve 30% efficiency gains while reducing operational costs`,
        subtitle: `Prepared for ${research.prospect.name}, ${research.prospect.title} | ${today}`,
        mainContent: [
          {
            type: 'metric',
            content: '$2.5M',
            subContent: 'Projected annual savings'
          },
          {
            type: 'text',
            content: 'Executive Summary',
            subContent: `Challenge: ${research.painPoints[0]}\nSolution: ${options.product}\nInvestment: $50K-$150K\nROI: 250% Year 1`
          },
          {
            type: 'text',
            content: 'Why This Matters Now',
            subContent: research.industry.trends.slice(0, 2).join('\n')
          }
        ],
        keyInsight: `Based on ${research.company.name}'s growth trajectory, immediate action could accelerate results by 6 months`
      },
      businessUnderstanding: {
        title: `We understand ${research.company.name}'s specific challenges and growth trajectory`,
        subtitle: 'Your current position and market dynamics',
        mainContent: [
          {
            type: 'text',
            content: 'Company Overview',
            subContent: research.company.description || `${research.company.name} is a leader in ${research.company.industry}`
          },
          {
            type: 'bullet',
            content: 'Key Challenges We\'ve Identified',
            subContent: research.painPoints.slice(0, 3).map(p => `• ${p}`).join('\n')
          },
          {
            type: 'text',
            content: 'Market Context',
            subContent: research.industry.trends[0]
          }
        ]
      },
      problemSolution: {
        title: 'Your operational challenges solved with intelligent automation',
        subtitle: 'How we address your unique requirements',
        mainContent: [
          {
            type: 'metric',
            content: '80%',
            subContent: 'Process automation'
          },
          {
            type: 'metric',
            content: '2 min',
            subContent: 'Average response time'
          },
          {
            type: 'metric',
            content: '24/7',
            subContent: 'Availability'
          },
          {
            type: 'text',
            content: 'Your Current Pain Points',
            subContent: research.painPoints.slice(0, 2).join('\n')
          },
          {
            type: 'text',
            content: 'Our Solution Architecture',
            subContent: `${options.product} directly addresses these challenges through intelligent automation and real-time insights`
          },
          {
            type: 'quote',
            content: 'Similar company achieved 40% efficiency improvement in 90 days',
            subContent: '- Fortune 500 Technology Company'
          }
        ]
      },
      implementation: {
        title: 'Proven implementation methodology with measurable outcomes',
        subtitle: 'Your path to success with clear milestones',
        mainContent: [
          {
            type: 'text',
            content: 'Phase 1: Discovery & Setup (Weeks 1-2)',
            subContent: '• Stakeholder alignment\n• Current state analysis\n• Success criteria definition'
          },
          {
            type: 'text',
            content: 'Phase 2: Configuration & Integration (Weeks 3-4)',
            subContent: '• System configuration\n• Data migration\n• Initial testing'
          },
          {
            type: 'text',
            content: 'Phase 3: Launch & Training (Weeks 5-6)',
            subContent: '• User training\n• Go-live support\n• Performance monitoring'
          },
          {
            type: 'text',
            content: 'Phase 4: Optimization (Ongoing)',
            subContent: '• Performance tuning\n• Feature expansion\n• ROI tracking'
          }
        ],
        metrics: [
          {
            label: 'Time to Value',
            value: '2 weeks',
            trend: '3x faster than alternatives'
          },
          {
            label: 'User Adoption',
            value: '95%',
            trend: 'Industry-leading'
          },
          {
            label: 'Success Rate',
            value: '99.5%',
            trend: 'Across all deployments'
          }
        ]
      },
      investment: {
        title: 'Clear ROI with immediate action plan',
        subtitle: 'Your investment and expected returns',
        mainContent: [
          {
            type: 'metric',
            content: '250%',
            subContent: 'Expected ROI within 12 months'
          },
          {
            type: 'text',
            content: 'Investment Summary',
            subContent: 'Setup: $25,000\nMonthly: $10,000\nTotal Year 1: $145,000\nProjected Savings: $362,500'
          },
          {
            type: 'text',
            content: 'What You Get',
            subContent: '• Full platform access\n• Dedicated success manager\n• 24/7 support\n• Quarterly business reviews'
          },
          {
            type: 'text',
            content: 'Implementation Timeline',
            subContent: 'Week 1: Contract & kickoff\nWeek 2-3: Setup & configuration\nWeek 4: Training & go-live\nWeek 5+: Ongoing optimization'
          },
          {
            type: 'text',
            content: 'Next Steps',
            subContent: '1. Schedule technical deep-dive (This week)\n2. Align stakeholders (Next week)\n3. Begin pilot program (Month start)'
          }
        ],
        keyInsight: `Every day of delay costs ${research.company.name} approximately $7,000 in missed efficiency gains`
      }
    }
  }

  /**
   * Generate a compelling email subject line
   */
  async generateEmailSubject(company: string, objective: string): Promise<string> {
    const subjects = [
      `${company}: Unlock 30% efficiency gains with AI-powered automation`,
      `Personalized proposal for ${company} - ${objective}`,
      `${company}: Your path to $2.5M in annual savings`,
      `Quick win opportunity for ${company} - ${objective}`,
      `${company}: Address your top 3 operational challenges`
    ]
    
    return subjects[Math.floor(Math.random() * subjects.length)]
  }

  /**
   * Generate email body content
   */
  async generateEmailBody(
    prospect: string,
    company: string,
    keyValue: string,
    senderName: string
  ): Promise<string> {
    return `Hi ${prospect},

I hope this email finds you well. I've been following ${company}'s impressive growth trajectory and recent developments in your industry.

Based on my research, I've identified several opportunities where we could help ${company} ${keyValue}.

I've attached a personalized proposal that outlines:
• How similar companies in your industry achieved 30-40% efficiency gains
• A specific implementation plan tailored to ${company}'s needs
• Clear ROI projections based on your current scale

The proposal is just 5 slides and takes less than 5 minutes to review.

Would you be open to a brief 20-minute call next week to discuss how we can help ${company} accelerate its growth?

Best regards,
${senderName}`
  }

  /**
   * Analyze a presentation prompt to extract key information
   */
  async analyzePrompt(prompt: string): Promise<{
    topic: string
    audience: string
    purpose: string
    slideCount?: number
    salesStage?: string
    industry?: string
  }> {
    // Simple extraction logic - in production, this would use AI
    const lowerPrompt = prompt.toLowerCase()
    
    // Extract slide count if mentioned
    const slideMatch = prompt.match(/(\d+)\s*slide/i)
    const slideCount = slideMatch ? parseInt(slideMatch[1]) : undefined
    
    // Determine purpose
    let purpose = 'inform'
    if (lowerPrompt.includes('sales') || lowerPrompt.includes('pitch')) purpose = 'persuade'
    if (lowerPrompt.includes('training') || lowerPrompt.includes('teach')) purpose = 'educate'
    if (lowerPrompt.includes('review') || lowerPrompt.includes('report')) purpose = 'report'
    if (lowerPrompt.includes('proposal') || lowerPrompt.includes('rfp')) purpose = 'proposal'
    
    // Determine audience
    let audience = 'general'
    if (lowerPrompt.includes('executive') || lowerPrompt.includes('board')) audience = 'executives'
    if (lowerPrompt.includes('team') || lowerPrompt.includes('staff')) audience = 'team'
    if (lowerPrompt.includes('client') || lowerPrompt.includes('customer')) audience = 'clients'
    if (lowerPrompt.includes('investor') || lowerPrompt.includes('vc')) audience = 'investors'
    
    // Determine sales stage if applicable
    let salesStage = undefined
    if (purpose === 'persuade' || lowerPrompt.includes('sales')) {
      if (lowerPrompt.includes('discovery') || lowerPrompt.includes('initial')) salesStage = 'discovery'
      else if (lowerPrompt.includes('demo') || lowerPrompt.includes('demonstration')) salesStage = 'demo'
      else if (lowerPrompt.includes('proposal') || lowerPrompt.includes('quote')) salesStage = 'proposal'
      else if (lowerPrompt.includes('close') || lowerPrompt.includes('final')) salesStage = 'closing'
    }
    
    // Detect industry keywords
    let industry = undefined
    if (lowerPrompt.includes('software') || lowerPrompt.includes('saas')) industry = 'software'
    else if (lowerPrompt.includes('finance') || lowerPrompt.includes('banking')) industry = 'finance'
    else if (lowerPrompt.includes('healthcare') || lowerPrompt.includes('medical')) industry = 'healthcare'
    else if (lowerPrompt.includes('retail') || lowerPrompt.includes('ecommerce')) industry = 'retail'
    else if (lowerPrompt.includes('manufacturing') || lowerPrompt.includes('industrial')) industry = 'manufacturing'
    
    // Extract topic (first 50 chars of prompt as fallback)
    const topic = prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt
    
    return {
      topic,
      audience,
      purpose,
      slideCount,
      salesStage,
      industry
    }
  }

  /**
   * Generate presentation structure based on analysis
   */
  async generatePresentationStructure(params: {
    topic: string
    audience: string
    purpose: string
    slideCount: number
    salesStage?: string
    industry?: string
  }): Promise<{
    title: string
    sections: Array<{
      title: string
      description: string
      slideType: string
      layout: string
    }>
  }> {
    const { topic, audience, purpose, slideCount, salesStage, industry } = params
    
    // Generate title
    const title = topic.length > 50 ? topic.substring(0, 47) + '...' : topic
    
    // Generate sections based on purpose
    const sections = []
    
    // Always start with title slide
    sections.push({
      title: 'Title Slide',
      description: title,
      slideType: 'title',
      layout: 'center'
    })
    
    // Sales-specific presentations
    if (purpose === 'persuade' && salesStage) {
      switch (salesStage) {
        case 'discovery':
          sections.push(
            {
              title: 'Executive Summary',
              description: 'Understanding your challenges and opportunities',
              slideType: 'executiveSummary',
              layout: 'executive'
            },
            {
              title: 'Current State Analysis',
              description: 'Your business landscape and pain points',
              slideType: 'swotAnalysis',
              layout: 'matrix'
            },
            {
              title: 'Industry Benchmarks',
              description: 'How you compare to best-in-class',
              slideType: 'benchmark',
              layout: 'comparison'
            },
            {
              title: 'Opportunity Areas',
              description: 'Where we can create value together',
              slideType: 'matrix',
              layout: 'strategic'
            },
            {
              title: 'Next Steps',
              description: 'Proposed engagement approach',
              slideType: 'processFlow',
              layout: 'timeline'
            }
          )
          break
          
        case 'demo':
          sections.push(
            {
              title: 'Your Challenges',
              description: 'Key problems we\'ll address',
              slideType: 'content',
              layout: 'bullets'
            },
            {
              title: 'Solution Overview',
              description: 'How our platform solves your needs',
              slideType: 'valueChain',
              layout: 'process'
            },
            {
              title: 'Live Demonstration',
              description: 'See the solution in action',
              slideType: 'content',
              layout: 'demo'
            },
            {
              title: 'ROI Analysis',
              description: 'Expected returns and payback',
              slideType: 'roiCalculation',
              layout: 'financial'
            },
            {
              title: 'Success Stories',
              description: 'Similar companies achieving results',
              slideType: 'metrics',
              layout: 'kpis'
            },
            {
              title: 'Implementation Plan',
              description: 'Your path to success',
              slideType: 'roadmap',
              layout: 'gantt'
            }
          )
          break
          
        case 'proposal':
          sections.push(
            {
              title: 'Executive Summary',
              description: 'Proposal overview and key benefits',
              slideType: 'executiveSummary',
              layout: 'executive'
            },
            {
              title: 'Understanding Your Needs',
              description: 'Business requirements and objectives',
              slideType: 'content',
              layout: 'bullets'
            },
            {
              title: 'Proposed Solution',
              description: 'Comprehensive approach to your challenges',
              slideType: 'processFlow',
              layout: 'solution'
            },
            {
              title: 'Why Choose Us',
              description: 'Competitive advantages and differentiators',
              slideType: 'competitiveLandscape',
              layout: 'positioning'
            },
            {
              title: 'Implementation Roadmap',
              description: 'Detailed project timeline',
              slideType: 'roadmap',
              layout: 'gantt'
            },
            {
              title: 'Quick Wins',
              description: 'Immediate value delivery',
              slideType: 'quickWins',
              layout: 'timeline'
            },
            {
              title: 'Investment & ROI',
              description: 'Pricing and expected returns',
              slideType: 'costBenefit',
              layout: 'financial'
            },
            {
              title: 'Risk Mitigation',
              description: 'Ensuring project success',
              slideType: 'riskMatrix',
              layout: 'matrix'
            },
            {
              title: 'Next Steps',
              description: 'Moving forward together',
              slideType: 'content',
              layout: 'action'
            }
          )
          break
          
        default:
          // Generic sales presentation
          sections.push(
            {
              title: 'Market Opportunity',
              description: 'Industry trends and growth potential',
              slideType: 'marketSizing',
              layout: 'funnel'
            },
            {
              title: 'The Challenge',
              description: 'Problems facing your industry',
              slideType: 'content',
              layout: 'bullets'
            },
            {
              title: 'Our Solution',
              description: 'How we address these challenges',
              slideType: 'matrix',
              layout: 'solution'
            },
            {
              title: 'ROI & Benefits',
              description: 'Financial and operational impact',
              slideType: 'roiCalculation',
              layout: 'financial'
            },
            {
              title: 'Implementation',
              description: 'Getting started quickly',
              slideType: 'quickWins',
              layout: 'timeline'
            }
          )
      }
    } else if (purpose === 'persuade') {
      // Non-sales persuasive presentation (investors, internal, etc.)
      sections.push(
        {
          title: 'Executive Summary',
          description: 'Key messages and recommendations',
          slideType: 'executiveSummary',
          layout: 'executive'
        },
        {
          title: 'Market Analysis',
          description: 'Current landscape and opportunities',
          slideType: 'competitiveLandscape',
          layout: 'market'
        },
        {
          title: 'Strategic Options',
          description: 'Paths forward evaluation',
          slideType: 'matrix',
          layout: 'strategic'
        },
        {
          title: 'Financial Projections',
          description: 'Expected outcomes and returns',
          slideType: 'waterfallChart',
          layout: 'financial'
        },
        {
          title: 'Implementation Plan',
          description: 'Execution roadmap',
          slideType: 'roadmap',
          layout: 'gantt'
        },
        {
          title: 'Key Success Factors',
          description: 'Critical elements for success',
          slideType: 'kpiDashboard',
          layout: 'metrics'
        }
      )
    } else if (purpose === 'report') {
      // Status reports and updates
      sections.push(
        {
          title: 'Executive Dashboard',
          description: 'Key metrics overview',
          slideType: 'kpiDashboard',
          layout: 'dashboard'
        },
        {
          title: 'Performance Analysis',
          description: 'Results vs targets',
          slideType: 'heatmap',
          layout: 'analysis'
        },
        {
          title: 'Progress Update',
          description: 'Milestone achievements',
          slideType: 'roadmap',
          layout: 'status'
        },
        {
          title: 'Challenges & Risks',
          description: 'Issues requiring attention',
          slideType: 'riskMatrix',
          layout: 'matrix'
        },
        {
          title: 'Next Period Focus',
          description: 'Upcoming priorities',
          slideType: 'initiativePrioritization',
          layout: 'planning'
        }
      )
    } else {
      // Default informational structure with McKinsey components
      sections.push(
        {
          title: 'Executive Summary',
          description: 'Key points overview',
          slideType: 'executiveSummary',
          layout: 'executive'
        },
        {
          title: 'Situation Analysis',
          description: 'Current state assessment',
          slideType: 'swotAnalysis',
          layout: 'analysis'
        },
        {
          title: 'Key Findings',
          description: 'Data-driven insights',
          slideType: 'metrics',
          layout: 'insights'
        },
        {
          title: 'Recommendations',
          description: 'Strategic actions',
          slideType: 'matrix',
          layout: 'strategic'
        },
        {
          title: 'Implementation',
          description: 'Next steps and timeline',
          slideType: 'processFlow',
          layout: 'action'
        }
      )
    }
    
    // Adjust sections to match requested slide count
    while (sections.length < slideCount && sections.length < 20) {
      // Add relevant supporting slides based on context
      if (purpose === 'persuade' && sections.length < slideCount) {
        const additionalSlides = [
          { title: 'Stakeholder Impact', description: 'Key stakeholder benefits', slideType: 'stakeholderMap', layout: 'matrix' },
          { title: 'Decision Framework', description: 'Evaluation criteria', slideType: 'decisionTree', layout: 'framework' },
          { title: 'Competitive Analysis', description: 'Market positioning', slideType: 'benchmark', layout: 'comparison' },
          { title: 'Financial Details', description: 'Detailed cost breakdown', slideType: 'costBenefit', layout: 'financial' }
        ]
        const nextSlide = additionalSlides[sections.length % additionalSlides.length]
        sections.splice(sections.length - 1, 0, nextSlide)
      } else {
        const coreSection = sections[Math.floor(sections.length / 2)]
        sections.splice(Math.floor(sections.length / 2), 0, {
          ...coreSection,
          title: `${coreSection.title} (Continued)`,
        })
      }
    }
    
    while (sections.length > slideCount && sections.length > 3) {
      sections.splice(Math.floor(sections.length / 2), 1)
    }
    
    return { title, sections }
  }

  /**
   * Generate content for a specific slide
   */
  async generateSlideContent(params: {
    title: string
    context: string
    slideType: string
    slideNumber: number
    totalSlides: number
    mainTopic: string
  }): Promise<{
    title: string
    content: string
    bullets?: string[]
    speakerNotes?: string
    chartData?: any
    metrics?: Array<{
      label: string
      value: string
      trend?: string
    }>
  }> {
    const { title, context, slideType, slideNumber, mainTopic } = params
    
    // Check if we have a valid API key
    if (!this.hasValidApiKey()) {
      console.log('No valid OpenAI API key found, using placeholder content')
      return this.generatePlaceholderContent(params)
    }
    
    const openaiClient = this.getOpenAI()
    if (!openaiClient) {
      console.log('Failed to create OpenAI client, using placeholder content')
      return this.generatePlaceholderContent(params)
    }
    
    console.log('Using OpenAI API for slide generation')
    
    try {
      // Generate prompts based on slide type
      let systemPrompt = 'You are an expert presentation designer creating professional business slides.'
      let userPrompt = ''
      
      switch (slideType) {
        case 'title':
          userPrompt = `Create a compelling title slide for a presentation about "${mainTopic}". 
            Return a JSON object with:
            - content: A powerful subtitle or tagline (1 sentence)
            - speakerNotes: Opening remarks to grab attention (2-3 sentences)`
          break
          
        case 'bullet':
          userPrompt = `Create content for a slide titled "${title}" about "${context}" in a presentation on "${mainTopic}".
            Return a JSON object with:
            - bullets: An array of 4-5 key bullet points (each 1-2 lines, specific and actionable)
            - speakerNotes: What to say when presenting this slide (2-3 sentences)`
          break
          
        case 'twoColumn':
          userPrompt = `Create a comparison slide titled "${title}" about "${context}" for a presentation on "${mainTopic}".
            Return a JSON object with:
            - content: Brief intro to the comparison (1 sentence)
            - bullets: An array of 4-5 comparisons in format "Option A: description|Option B: description"
            - speakerNotes: Key message about the comparison (2-3 sentences)`
          break
          
        case 'chart':
          userPrompt = `Create data visualization content for a slide titled "${title}" about "${context}" in a presentation on "${mainTopic}".
            Return a JSON object with:
            - content: What the chart/data shows (1-2 sentences)
            - chartData: Object with "labels" array and "datasets" array containing label, data array, borderColor, backgroundColor
            - metrics: Array of 3 key metrics objects with "label", "value", and "trend" properties
            - speakerNotes: Key insights from the data (2-3 sentences)`
          break
          
        case 'conclusion':
          userPrompt = `Create a conclusion slide titled "${title}" for a presentation about "${mainTopic}".
            Return a JSON object with:
            - content: Summary statement (1 sentence)
            - bullets: Array of 4 key takeaways or next steps
            - speakerNotes: Closing remarks and call to action (2-3 sentences)`
          break
          
        case 'executiveSummary':
          userPrompt = `Create an executive summary slide titled "${title}" about "${context}" for "${mainTopic}".
            Return a JSON object with:
            - keyMessage: The main value proposition or finding (1-2 sentences)
            - supportingPoints: Array of 3 objects with "label", "value", and "description" properties
            - recommendation: Clear next step or action (1 sentence)
            - speakerNotes: Opening statement to frame the discussion (2-3 sentences)`
          break
          
        case 'matrix':
          userPrompt = `Create a 2x2 strategic matrix slide titled "${title}" about "${context}" for "${mainTopic}".
            Return a JSON object with:
            - xAxis: Label for horizontal axis
            - yAxis: Label for vertical axis
            - quadrants: Array of 4 objects with "label", "items" (array of 2-3 items), and "color" (green/blue/yellow/red)
            - speakerNotes: Key insights from the matrix (2-3 sentences)`
          break
          
        case 'roiCalculation':
          userPrompt = `Create an ROI calculation slide titled "${title}" about "${context}" for "${mainTopic}".
            Return a JSON object with:
            - investment: Object with "label" and "value" (e.g., "$100K")
            - returns: Array of 3-5 objects with "year" and "value"
            - metrics: Object with "roi" (percentage), "payback" (timeframe), and optionally "npv"
            - speakerNotes: Financial justification (2-3 sentences)`
          break
          
        case 'roadmap':
          userPrompt = `Create an implementation roadmap slide titled "${title}" about "${context}" for "${mainTopic}".
            Return a JSON object with:
            - phases: Array of 3-4 phase objects, each with:
              - name: Phase name
              - duration: Timeframe
              - workstreams: Array of workstream objects with "name" and "activities" (array of 2-3 activities)
            - speakerNotes: Implementation approach overview (2-3 sentences)`
          break
          
        case 'quickWins':
          userPrompt = `Create a quick wins slide titled "${title}" about "${context}" for "${mainTopic}".
            Return a JSON object with:
            - timeframes: Array of timeframe objects (30/60/90 days), each with:
              - period: Time period label
              - actions: Array of 2-3 action objects with "action", "impact", and "owner"
            - speakerNotes: Immediate value delivery message (2-3 sentences)`
          break
          
        case 'competitiveLandscape':
          userPrompt = `Create a competitive landscape slide titled "${title}" about "${context}" for "${mainTopic}".
            Return a JSON object with:
            - xAxis: Competitive dimension label
            - yAxis: Market dimension label
            - competitors: Array of 5-6 competitor objects with "name", "x" (0-100), "y" (0-100), "size" (small/medium/large), and "isUs" (boolean)
            - speakerNotes: Competitive positioning insight (2-3 sentences)`
          break
          
        case 'swotAnalysis':
          userPrompt = `Create a SWOT analysis slide titled "${title}" about "${context}" for "${mainTopic}".
            Return a JSON object with:
            - strengths: Array of 4 internal strengths
            - weaknesses: Array of 4 internal weaknesses
            - opportunities: Array of 4 external opportunities
            - threats: Array of 4 external threats
            - speakerNotes: Strategic implications (2-3 sentences)`
          break
          
        case 'metrics':
        case 'kpiDashboard':
          userPrompt = `Create a KPI dashboard slide titled "${title}" about "${context}" for "${mainTopic}".
            Return a JSON object with:
            - metrics: Array of 4-6 metric objects with "label", "value", "trend", and optional "color" (blue/green/orange/red)
            - summary: Overall performance statement (1 sentence)
            - speakerNotes: Key performance insights (2-3 sentences)`
          break
          
        case 'content':
        case 'bullet':
          userPrompt = `Create content for a slide titled "${title}" about "${context}" in a presentation on "${mainTopic}".
            Return a JSON object with:
            - bullets: An array of 4-5 key bullet points (each 1-2 lines, specific and actionable)
            - speakerNotes: What to say when presenting this slide (2-3 sentences)`
          break
          
        default:
          userPrompt = `Create content for a slide titled "${title}" about "${context}" in a presentation on "${mainTopic}".
            Return a JSON object with appropriate content, bullets (if needed), and speakerNotes.`
      }
      
      // Call OpenAI
      const completion = await openaiClient.chat.completions.create({
        model: this.getModel(),
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
      
      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}')
      
      // Merge AI response with required fields
      return {
        title,
        content: aiResponse.content || '',
        bullets: aiResponse.bullets,
        speakerNotes: aiResponse.speakerNotes || '',
        chartData: aiResponse.chartData || (slideType === 'chart' ? {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Performance',
            data: [65, 72, 78, 85, 92, 98],
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          }]
        } : undefined),
        metrics: aiResponse.metrics
      }
      
    } catch (error) {
      console.error('Error generating AI content:', error)
      console.error('Error details:', error instanceof Error ? error.message : 'Unknown error')
      // Fallback to placeholder content
      return this.generatePlaceholderContent(params)
    }
  }
  
  /**
   * Generate better placeholder content when AI is not available
   */
  private generatePlaceholderContent(params: {
    title: string
    context: string
    slideType: string
    mainTopic: string
  }) {
    const { title, context, slideType, mainTopic } = params
    
    const templates = {
      title: {
        content: mainTopic,
        speakerNotes: `Welcome everyone. Today we'll explore ${mainTopic} and its impact on your business.`
      },
      bullet: {
        bullets: [
          `Understanding the core aspects of ${context}`,
          `Key benefits and value propositions for your organization`,
          `Implementation strategies and best practices`,
          `Measuring success and ROI`,
          `Next steps and action items`
        ],
        speakerNotes: `This slide covers the essential elements of ${title}. Each point addresses a critical aspect of our solution.`
      },
      twoColumn: {
        content: 'Comparing traditional vs. modern approaches',
        bullets: [
          'Speed: Weeks of setup|Speed: Minutes to deploy',
          'Cost: High upfront investment|Cost: Pay-as-you-go model',
          'Flexibility: Limited customization|Flexibility: Fully adaptable',
          'Support: Business hours only|Support: 24/7 availability',
          'Scale: Manual scaling required|Scale: Automatic scaling'
        ],
        speakerNotes: 'This comparison clearly shows the advantages of adopting a modern solution.'
      },
      chart: {
        content: 'Performance metrics showing significant growth',
        chartData: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1 Next', 'Q2 Next'],
          datasets: [{
            label: 'Growth Trajectory',
            data: [45, 52, 67, 78, 92, 110],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          }]
        },
        metrics: [
          { label: 'Growth Rate', value: '144%', trend: 'Year over year' },
          { label: 'Efficiency Gain', value: '+40%', trend: 'vs. baseline' },
          { label: 'ROI Timeline', value: '6 months', trend: 'Payback period' }
        ],
        speakerNotes: 'As you can see, the growth trajectory demonstrates strong momentum and validates our approach.'
      },
      conclusion: {
        content: 'Your path to success starts here',
        bullets: [
          `${mainTopic} provides immediate value and long-term benefits`,
          'Implementation can begin within days, not months',
          'Our team is ready to support your transformation',
          'Schedule a follow-up meeting to discuss next steps'
        ],
        speakerNotes: 'In summary, we\'re excited to partner with you on this journey. Let\'s schedule time to discuss how we can get started.'
      }
    }
    
    const template = templates[slideType as keyof typeof templates] || templates.bullet
    
    return {
      title,
      content: 'content' in template ? template.content || '' : '',
      bullets: 'bullets' in template ? template.bullets : undefined,
      speakerNotes: template.speakerNotes || `This slide covers important aspects of ${title}.`,
      chartData: 'chartData' in template ? template.chartData : undefined,
      metrics: 'metrics' in template ? template.metrics : undefined
    }
  }
}

// Export a function to get the AI service instance
// This ensures environment variables are available when the service is created
let aiServiceInstance: AIService | null = null

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    aiServiceInstance = new AIService()
  }
  return aiServiceInstance
}