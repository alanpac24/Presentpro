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
  private openai: OpenAI
  private model: string

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    this.model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
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
      const completion = await this.openai.chat.completions.create({
        model: this.model,
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
}

// Export singleton instance
export const aiService = new AIService()