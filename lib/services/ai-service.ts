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
        max_tokens: 2000,
      })

      const content = completion.choices[0]?.message?.content
      if (!content) throw new Error('No content generated')

      // Parse the AI response
      try {
        const parsed = JSON.parse(content)
        
        // Validate with Zod schema
        return ProposalContentSchema.parse(parsed)
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError)
        return this.getFallbackContent(research, options)
      }
    } catch (error) {
      console.error('AI generation error:', error)
      return this.getFallbackContent(research, options)
    }
  }

  /**
   * Build a comprehensive prompt for proposal generation
   */
  private buildProposalPrompt(research: ResearchData, options: GenerationOptions): string {
    const { company, prospect, industry, painPoints } = research
    const { product, objective, companyInfo } = options
    
    return `Generate a personalized sales proposal for ${company.name} in JSON format matching this exact structure:

{
  "executiveSummary": {
    "title": "We can help ${company.name} achieve 30% efficiency gains while reducing operational costs",
    "subtitle": "Prepared for ${prospect.name}, ${prospect.title} | [Current Date]",
    "mainContent": [
      {
        "type": "metric",
        "content": "[Specific projected annual savings]",
        "subContent": "Projected annual savings"
      },
      {
        "type": "text",
        "content": "Executive Summary",
        "subContent": "Challenge: [Specific challenge from pain points]\nSolution: ${product}\nInvestment: [Price range]\nROI: [Specific percentage] Year 1"
      },
      {
        "type": "text",
        "content": "Why This Matters Now",
        "subContent": "[Two relevant industry trends]"
      }
    ],
    "keyInsight": "Based on ${company.name}'s [specific metric], immediate action could [specific benefit]"
  },
  "businessUnderstanding": {
    "title": "We understand ${company.name}'s specific challenges and growth trajectory",
    "subtitle": "Your current position and market dynamics",
    "mainContent": [
      {
        "type": "text",
        "content": "Company Overview",
        "subContent": "${company.description || company.name + ' overview'}"
      },
      {
        "type": "bullet",
        "content": "Key Challenges We've Identified",
        "subContent": "• [Pain point 1]\n• [Pain point 2]\n• [Pain point 3]"
      },
      {
        "type": "text",
        "content": "Market Context",
        "subContent": "[Relevant industry trend]"
      }
    ]
  },
  "problemSolution": {
    "title": "[Specific operational challenge] solved with intelligent automation",
    "subtitle": "How we address your unique requirements",
    "mainContent": [
      {
        "type": "metric",
        "content": "[Percentage]",
        "subContent": "Process automation"
      },
      {
        "type": "metric",
        "content": "[Time]",
        "subContent": "Average response time"
      },
      {
        "type": "metric",
        "content": "24/7",
        "subContent": "Availability"
      },
      {
        "type": "text",
        "content": "Your Current Pain Points",
        "subContent": "[Top 2 pain points]"
      },
      {
        "type": "text",
        "content": "Our Solution Architecture",
        "subContent": "${product} directly addresses these challenges through [specific capabilities]"
      },
      {
        "type": "quote",
        "content": "Similar company achieved [specific metric] improvement in [timeframe]",
        "subContent": "- [Industry] Company"
      }
    ]
  },
  "implementation": {
    "title": "${company.name}'s path to [specific outcome]",
    "subtitle": "Phased approach designed for your organization",
    "mainContent": [
      {
        "type": "text",
        "content": "Phase 1: Foundation (Weeks 1-4)",
        "subContent": "• Initial setup and configuration\n• Team onboarding\n• Quick win identification"
      },
      {
        "type": "text",
        "content": "Phase 2: Optimization (Weeks 5-8)",
        "subContent": "• Process automation\n• Custom workflows\n• Performance tuning"
      },
      {
        "type": "text",
        "content": "Phase 3: Scale (Weeks 9-12)",
        "subContent": "• Full deployment\n• Advanced features\n• Continuous improvement"
      },
      {
        "type": "metric",
        "content": "[Number]",
        "subContent": "Days to first value"
      }
    ],
    "keyInsight": "Your team can start seeing results within [timeframe]"
  },
  "investment": {
    "title": "Investment that delivers [X]x ROI within 12 months",
    "subtitle": "Flexible pricing tailored to ${company.name}",
    "mainContent": [
      {
        "type": "metric",
        "content": "[X]x",
        "subContent": "Expected ROI within 12 months"
      },
      {
        "type": "text",
        "content": "Investment Summary",
        "subContent": "Setup: [Amount]\nMonthly: [Amount]\nTotal Year 1: [Amount]\nProjected Savings: [Amount]"
      },
      {
        "type": "text",
        "content": "What You Get",
        "subContent": "• Full platform access\n• Dedicated success manager\n• 24/7 support\n• Quarterly business reviews"
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
        title: `${research.company.name}'s path to operational excellence`,
        subtitle: 'Phased approach designed for your organization',
        mainContent: [
          {
            type: 'text',
            content: 'Phase 1: Foundation (Weeks 1-4)',
            subContent: '• Initial setup and configuration\n• Team onboarding (10-15 users)\n• Quick win identification'
          },
          {
            type: 'text',
            content: 'Phase 2: Optimization (Weeks 5-8)',
            subContent: '• Process automation setup\n• Custom workflow creation\n• Performance baseline establishment'
          },
          {
            type: 'text',
            content: 'Phase 3: Scale (Weeks 9-12)',
            subContent: '• Full team deployment\n• Advanced feature activation\n• Continuous improvement cycles'
          },
          {
            type: 'metric',
            content: '14',
            subContent: 'Days to first value'
          }
        ],
        keyInsight: 'Your team can start seeing measurable results within 2 weeks of deployment'
      },
      investment: {
        title: 'Investment that delivers 2.5x ROI within 12 months',
        subtitle: `Flexible pricing tailored to ${research.company.name}`,
        mainContent: [
          {
            type: 'metric',
            content: '2.5x',
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
   * Analyze a presentation prompt to extract key information using AI
   */
  async analyzePrompt(prompt: string): Promise<{
    topic: string
    audience: string
    purpose: string
    slideCount?: number
    salesStage?: string
    industry?: string
    companyName?: string
    challenges?: string[]
    competitors?: string[]
    budget?: string
    timeline?: string
  }> {
    try {
      const openaiClient = this.getOpenAI()
      
      if (!openaiClient) {
        console.log('analyzePrompt: No OpenAI client, using fallback')
        // Fallback to keyword extraction if no OpenAI
        return this.analyzePromptFallback(prompt)
      }

      console.log('analyzePrompt: Using OpenAI for prompt analysis')
      const systemPrompt = `You are an expert at analyzing business presentation requests. Extract key information from the user's prompt and return it as structured JSON.

Focus on identifying:
- The main topic and purpose
- Target audience (executives, team, clients, investors)
- Sales stage if applicable (discovery, demo, proposal, closing)
- Industry context
- Company names mentioned
- Specific challenges or pain points
- Competitors mentioned
- Budget or pricing references
- Timeline or urgency indicators
- Number of slides requested

Return JSON with these fields:
{
  "topic": "clear, concise topic description",
  "audience": "executives|team|clients|investors|general",
  "purpose": "inform|persuade|educate|report|proposal",
  "slideCount": number or null,
  "salesStage": "discovery|demo|proposal|closing" or null,
  "industry": "software|finance|healthcare|retail|manufacturing|other" or null,
  "companyName": "extracted company name" or null,
  "challenges": ["challenge1", "challenge2"] or [],
  "competitors": ["competitor1", "competitor2"] or [],
  "budget": "budget range or amount" or null,
  "timeline": "timeline or urgency" or null
}`

      const completion = await openaiClient.chat.completions.create({
        model: this.getModel(),
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' }
      })

      const content = completion.choices[0]?.message?.content
      if (!content) throw new Error('No content generated')

      const analysis = JSON.parse(content)
      
      // Ensure required fields have defaults
      return {
        topic: analysis.topic || prompt.substring(0, 50) + '...',
        audience: analysis.audience || 'general',
        purpose: analysis.purpose || 'inform',
        slideCount: analysis.slideCount,
        salesStage: analysis.salesStage,
        industry: analysis.industry,
        companyName: analysis.companyName,
        challenges: analysis.challenges || [],
        competitors: analysis.competitors || [],
        budget: analysis.budget,
        timeline: analysis.timeline
      }
    } catch (error) {
      console.error('AI analysis error:', error)
      // Fallback to keyword extraction
      return this.analyzePromptFallback(prompt)
    }
  }

  /**
   * Fallback prompt analysis using keyword extraction
   */
  private analyzePromptFallback(prompt: string): any {
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
      industry,
      companyName: undefined,
      challenges: [],
      competitors: [],
      budget: undefined,
      timeline: undefined
    }
  }

  /**
   * Score slides based on context relevance
   */
  private scoreSlides(params: {
    prompt?: string
    salesStage?: string
    industry?: string
    companyName?: string
    challenges?: string[]
    competitors?: string[]
    budget?: string
    timeline?: string
  }): Record<string, number> {
    const scores: Record<string, number> = {
      executiveSummary: 0,
      matrix: 0,
      swotAnalysis: 0,
      valueChain: 0,
      competitiveLandscape: 0,
      benchmark: 0,
      hypothesisTree: 0,
      processFlow: 0,
      marketSizing: 0,
      roiCalculation: 0,
      costBenefit: 0,
      waterfallChart: 0,
      quickWins: 0,
      roadmap: 0,
      riskMatrix: 0,
      kpiDashboard: 0,
      stakeholderMap: 0,
      initiativePrioritization: 0,
      heatmap: 0,
      decisionTree: 0,
      orgStructure: 0,
      metrics: 0,
      content: 0,
      // Sales-oriented slides
      cover: 0,
      agenda: 0,
      customerVoice: 0,
      industryTrends: 0,
      businessImpact: 0,
      solutionOverview: 0,
      productDeepDive: 0,
      caseStudy: 0,
      whyUs: 0,
      whyNow: 0,
      valueProp: 0,
      pricing: 0,
      roi: 0,
      investmentSummary: 0,
      technicalArchitecture: 0,
      implementationTimeline: 0,
      nextSteps: 0,
      contact: 0,
      thankYou: 0,
    }

    const { prompt = '', salesStage, industry, challenges, competitors, budget, timeline } = params
    const lowerPrompt = prompt.toLowerCase()

    // Executive summary scores
    if (salesStage === 'proposal' || salesStage === 'closing') scores.executiveSummary += 50
    if (lowerPrompt.includes('executive') || lowerPrompt.includes('summary')) scores.executiveSummary += 30

    // Competitive analysis scores
    if (competitors && competitors.length > 0) {
      scores.competitiveLandscape += 50 + (competitors.length * 10)
      scores.benchmark += 20
    }
    if (lowerPrompt.includes('compete') || lowerPrompt.includes('differentiat')) scores.competitiveLandscape += 30
    if (lowerPrompt.includes('benchmark')) scores.benchmark += 40

    // Financial analysis scores
    if (budget) {
      scores.roiCalculation += 50
      scores.costBenefit += 40
      scores.waterfallChart += 20
    }
    if (lowerPrompt.includes('roi') || lowerPrompt.includes('return')) scores.roiCalculation += 40
    if (lowerPrompt.includes('cost') || lowerPrompt.includes('invest')) scores.costBenefit += 30
    if (lowerPrompt.includes('financial')) {
      scores.roiCalculation += 20
      scores.costBenefit += 20
      scores.waterfallChart += 30
    }

    // Timeline and urgency scores
    if (timeline && (timeline.toLowerCase().includes('urgent') || timeline.toLowerCase().includes('quick'))) {
      scores.quickWins += 60
      scores.roadmap += 30
    }
    if (lowerPrompt.includes('quick win') || lowerPrompt.includes('immediate')) scores.quickWins += 50
    if (lowerPrompt.includes('timeline') || lowerPrompt.includes('roadmap')) scores.roadmap += 40

    // Challenge analysis scores
    if (challenges && challenges.length > 0) {
      scores.swotAnalysis += 40 + (challenges.length * 10)
      scores.hypothesisTree += 35
      scores.riskMatrix += 25
    }
    if (lowerPrompt.includes('challenge') || lowerPrompt.includes('problem')) {
      scores.swotAnalysis += 30
      scores.hypothesisTree += 40
    }
    if (lowerPrompt.includes('risk')) scores.riskMatrix += 50

    // Process and operational scores
    if (lowerPrompt.includes('process') || lowerPrompt.includes('workflow')) {
      scores.processFlow += 50
      scores.valueChain += 40
    }
    if (lowerPrompt.includes('operation') || lowerPrompt.includes('efficien')) scores.valueChain += 35

    // Market and industry scores
    if (industry) {
      scores.marketSizing += 40
      scores.benchmark += 20
    }
    if (lowerPrompt.includes('market') || lowerPrompt.includes('industry')) scores.marketSizing += 35
    if (lowerPrompt.includes('growth') || lowerPrompt.includes('opportunity')) scores.marketSizing += 25

    // Implementation scores
    if (salesStage === 'proposal' || salesStage === 'demo') {
      scores.roadmap += 30
      scores.initiativePrioritization += 25
    }
    if (lowerPrompt.includes('implement') || lowerPrompt.includes('deploy')) {
      scores.roadmap += 40
      scores.initiativePrioritization += 35
    }

    // KPI and metrics scores
    if (lowerPrompt.includes('kpi') || lowerPrompt.includes('metric') || lowerPrompt.includes('measure')) {
      scores.kpiDashboard += 50
      scores.metrics += 40
    }

    // Stakeholder scores
    if (lowerPrompt.includes('stakeholder') || lowerPrompt.includes('buy-in')) scores.stakeholderMap += 50
    if (salesStage === 'proposal' && challenges && challenges.length > 2) scores.stakeholderMap += 25

    // Sales-oriented slide scoring
    // Cover and contact slides
    if (salesStage === 'proposal' || salesStage === 'closing') {
      scores.cover += 80
      scores.contact += 70
      scores.thankYou += 60
    }
    
    // Agenda slide
    if (salesStage === 'proposal' || salesStage === 'demo') scores.agenda += 70
    if (lowerPrompt.includes('agenda') || lowerPrompt.includes('overview')) scores.agenda += 40
    
    // Customer voice and understanding
    if (salesStage === 'discovery' || salesStage === 'proposal') {
      scores.customerVoice += 60
      scores.businessImpact += 50
    }
    if (challenges && challenges.length > 0) {
      scores.customerVoice += 40 + (challenges.length * 10)
      scores.businessImpact += 45 + (challenges.length * 10)
    }
    
    // Industry and market analysis
    if (industry) {
      scores.industryTrends += 50
      scores.businessImpact += 30
    }
    if (lowerPrompt.includes('trend') || lowerPrompt.includes('market')) scores.industryTrends += 40
    
    // Solution and product slides
    if (salesStage === 'demo' || salesStage === 'proposal') {
      scores.solutionOverview += 70
      scores.productDeepDive += 60
      scores.caseStudy += 50
    }
    if (lowerPrompt.includes('solution') || lowerPrompt.includes('product')) {
      scores.solutionOverview += 50
      scores.productDeepDive += 40
    }
    if (lowerPrompt.includes('case study') || lowerPrompt.includes('success')) scores.caseStudy += 60
    
    // Value proposition slides
    if (salesStage === 'proposal' || salesStage === 'closing') {
      scores.whyUs += 55
      scores.whyNow += 60
      scores.valueProp += 65
    }
    if (timeline && (timeline.toLowerCase().includes('urgent') || timeline.toLowerCase().includes('asap'))) {
      scores.whyNow += 70
    }
    
    // Pricing and commercial slides
    if (budget || salesStage === 'proposal' || salesStage === 'closing') {
      scores.pricing += 60
      scores.roi += 55
      scores.investmentSummary += 50
    }
    if (lowerPrompt.includes('price') || lowerPrompt.includes('cost')) {
      scores.pricing += 50
      scores.investmentSummary += 40
    }
    
    // Technical slides
    if (lowerPrompt.includes('technical') || lowerPrompt.includes('architecture')) {
      scores.technicalArchitecture += 60
    }
    if (salesStage === 'demo') scores.technicalArchitecture += 30
    
    // Implementation timeline
    if (timeline || lowerPrompt.includes('implement') || lowerPrompt.includes('rollout')) {
      scores.implementationTimeline += 50
    }
    if (salesStage === 'proposal') scores.implementationTimeline += 40
    
    // Next steps
    if (salesStage === 'proposal' || salesStage === 'closing') {
      scores.nextSteps += 70
    }
    if (lowerPrompt.includes('next') || lowerPrompt.includes('action')) scores.nextSteps += 40

    return scores
  }

  /**
   * Get alternative slide groups
   */
  private getSlideAlternatives(): Record<string, string[]> {
    return {
      analysis: ['swotAnalysis', 'hypothesisTree', 'riskMatrix', 'businessImpact'],
      financial: ['roiCalculation', 'costBenefit', 'waterfallChart', 'roi', 'pricing', 'investmentSummary'],
      strategic: ['valueChain', 'processFlow', 'initiativePrioritization', 'valueProp'],
      competitive: ['competitiveLandscape', 'benchmark', 'matrix', 'whyUs'],
      timeline: ['roadmap', 'quickWins', 'timeline', 'implementationTimeline', 'whyNow'],
      metrics: ['kpiDashboard', 'metrics', 'heatmap', 'businessImpact'],
      customer: ['customerVoice', 'caseStudy', 'industryTrends'],
      solution: ['solutionOverview', 'productDeepDive', 'technicalArchitecture'],
      action: ['nextSteps', 'contact', 'whyNow']
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
    companyName?: string
    challenges?: string[]
    competitors?: string[]
    budget?: string
    timeline?: string
  }): Promise<{
    title: string
    sections: Array<{
      title: string
      description: string
      slideType: string
      layout: string
    }>
  }> {
    const { topic, audience, purpose, slideCount, salesStage, industry, companyName, challenges, competitors, budget, timeline } = params
    
    // Generate title
    const title = topic.length > 50 ? topic.substring(0, 47) + '...' : topic
    
    // Generate sections based on purpose
    const sections = []
    
    // Always start with title slide unless we have a cover slide in the recipe
    const templateRecipes = this.getTemplateRecipes(salesStage || 'general')
    const selectedRecipe = templateRecipes[Math.floor(Math.random() * templateRecipes.length)]
    const hasCoverSlide = selectedRecipe.includes('cover')
    
    if (!hasCoverSlide) {
      sections.push({
        title: 'Title Slide',
        description: title,
        slideType: 'title',
        layout: 'center'
      })
    }

    // Get slide scores based on context
    const slideScores = this.scoreSlides({
      prompt: topic,
      salesStage,
      industry,
      companyName,
      challenges,
      competitors,
      budget,
      timeline
    })

    // Recipe is already selected above, no need to select again
    
    // Build slide list based on recipe and scores
    const slideCandidates = this.buildSlideCandidates(
      selectedRecipe,
      slideScores,
      { companyName, challenges, competitors, budget, timeline, industry }
    )
    
    // Determine optimal slide count
    const targetSlideCount = this.determineSlideCount(slideCount, salesStage, slideCandidates.length)
    
    // Select and order slides
    const selectedSlides = this.selectAndOrderSlides(slideCandidates, targetSlideCount, slideScores)
    
    // Add selected slides to sections
    sections.push(...selectedSlides)
    
    return {
      title,
      sections
    }
  }

  /**
   * Get template recipes for each sales stage
   */
  private getTemplateRecipes(salesStage: string): string[][] {
    switch (salesStage) {
      case 'discovery':
        return [
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
        ]
      
      case 'demo':
        return [
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
        ]
      
      case 'proposal':
        return [
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
        ]
      
      case 'closing':
        return [
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
        ]
      
      default:
        return [
          // Generic sales presentations
          ['marketSizing', 'content', 'matrix', 'roiCalculation', 'quickWins'],
          ['executiveSummary', 'swotAnalysis', 'valueChain', 'metrics', 'roadmap'],
          ['content', 'competitiveLandscape', 'processFlow', 'costBenefit', 'initiativePrioritization'],
          // Sales-oriented generic
          ['cover', 'agenda', 'businessImpact', 'solutionOverview', 'valueProp', 'pricing', 'nextSteps', 'contact'],
          ['cover', 'industryTrends', 'customerVoice', 'solutionOverview', 'caseStudy', 'roi', 'nextSteps']
        ]
    }
  }

  /**
   * Build slide candidates based on recipe and context
   */
  private buildSlideCandidates(
    recipe: string[],
    slideScores: Record<string, number>,
    context: {
      companyName?: string
      challenges?: string[]
      competitors?: string[]
      budget?: string
      timeline?: string
      industry?: string
    }
  ): Array<{
    title: string
    description: string
    slideType: string
    layout: string
    score: number
  }> {
    const { companyName, challenges, competitors, budget, timeline, industry } = context
    const alternatives = this.getSlideAlternatives()
    const candidates: any[] = []
    
    recipe.forEach((slideType, index) => {
      // Sometimes substitute with alternatives for variety
      let selectedSlideType = slideType
      
      // 30% chance to use an alternative if available
      if (Math.random() < 0.3) {
        for (const [group, types] of Object.entries(alternatives)) {
          if (types.includes(slideType)) {
            const alternativeTypes = types.filter(t => t !== slideType)
            if (alternativeTypes.length > 0) {
              selectedSlideType = alternativeTypes[Math.floor(Math.random() * alternativeTypes.length)]
              break
            }
          }
        }
      }
      
      // Generate slide metadata based on type
      const slideMetadata = this.getSlideMetadata(selectedSlideType, { companyName, challenges, competitors, budget, timeline, industry })
      
      candidates.push({
        ...slideMetadata,
        slideType: selectedSlideType,
        score: slideScores[selectedSlideType] || 0,
        originalIndex: index
      })
    })
    
    // Add context-specific slides that scored high but aren't in the recipe
    const highScoringSlides = Object.entries(slideScores)
      .filter(([type, score]) => score > 40 && !candidates.some(c => c.slideType === type))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
    
    highScoringSlides.forEach(([slideType]) => {
      const slideMetadata = this.getSlideMetadata(slideType, context)
      candidates.push({
        ...slideMetadata,
        slideType,
        score: slideScores[slideType],
        isBonus: true
      })
    })
    
    return candidates
  }

  /**
   * Get slide metadata
   */
  private getSlideMetadata(
    slideType: string,
    context: {
      companyName?: string
      challenges?: string[]
      competitors?: string[]
      budget?: string
      timeline?: string
      industry?: string
    }
  ): { title: string; description: string; layout: string } {
    const { companyName = 'your organization', industry = 'your industry' } = context
    
    const metadata: Record<string, { title: string; description: string; layout: string }> = {
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
        description: 'Success metrics and targets',
        layout: 'dashboard'
      },
      kpiDashboard: {
        title: 'Performance Dashboard',
        description: 'Real-time metrics and tracking',
        layout: 'dashboard'
      },
      benchmark: {
        title: 'Industry Benchmarks',
        description: 'Performance vs best-in-class',
        layout: 'comparison'
      },
      hypothesisTree: {
        title: 'Root Cause Analysis',
        description: 'Systematic problem breakdown',
        layout: 'analysis'
      },
      riskMatrix: {
        title: 'Risk Assessment',
        description: 'Risk mitigation strategies',
        layout: 'matrix'
      },
      stakeholderMap: {
        title: 'Stakeholder Alignment',
        description: 'Key stakeholder engagement plan',
        layout: 'network'
      },
      matrix: {
        title: 'Strategic Options',
        description: 'Decision framework and priorities',
        layout: 'strategic'
      },
      initiativePrioritization: {
        title: 'Initiative Prioritization',
        description: 'High-impact opportunities',
        layout: 'planning'
      },
      content: {
        title: 'Key Points',
        description: 'Important details and context',
        layout: 'content'
      },
      waterfallChart: {
        title: 'Value Breakdown',
        description: 'Component-by-component analysis',
        layout: 'financial'
      },
      heatmap: {
        title: 'Performance Heatmap',
        description: 'Multi-dimensional analysis',
        layout: 'analysis'
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
      }
    }
    
    return metadata[slideType] || {
      title: slideType.charAt(0).toUpperCase() + slideType.slice(1),
      description: 'Analysis and insights',
      layout: 'standard'
    }
  }

  /**
   * Determine optimal slide count
   */
  private determineSlideCount(requestedCount: number, salesStage?: string, candidateCount?: number): number {
    // Base counts by stage
    const stageCounts: Record<string, { min: number; max: number }> = {
      discovery: { min: 6, max: 8 },
      demo: { min: 8, max: 12 },
      proposal: { min: 10, max: 15 },
      closing: { min: 5, max: 7 },
      general: { min: 7, max: 10 }
    }
    
    const stage = salesStage || 'general'
    const { min, max } = stageCounts[stage] || stageCounts.general
    
    // If user requested specific count, use it but keep within reasonable bounds
    if (requestedCount > 0) {
      return Math.max(min, Math.min(requestedCount, 20))
    }
    
    // Otherwise, vary between min and max for variety
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Select and order slides based on scores and context
   */
  private selectAndOrderSlides(
    candidates: Array<{
      title: string
      description: string
      slideType: string
      layout: string
      score: number
      originalIndex?: number
      isBonus?: boolean
    }>,
    targetCount: number,
    slideScores: Record<string, number>
  ): Array<{
    title: string
    description: string
    slideType: string
    layout: string
  }> {
    // Separate core recipe slides from bonus slides
    const recipeSlides = candidates.filter(c => !c.isBonus)
    const bonusSlides = candidates.filter(c => c.isBonus)
    
    // Sort recipe slides by score while maintaining some original order
    recipeSlides.sort((a, b) => {
      // High scoring slides move up, but not too far from original position
      const scoreWeight = 0.7
      const orderWeight = 0.3
      
      const aScore = a.score * scoreWeight - (a.originalIndex || 0) * orderWeight * 10
      const bScore = b.score * scoreWeight - (b.originalIndex || 0) * orderWeight * 10
      
      return bScore - aScore
    })
    
    // Take slides up to target count
    let selectedSlides = recipeSlides.slice(0, targetCount - 1) // -1 for title slide
    
    // Add high-scoring bonus slides if there's room
    const remainingSlots = targetCount - 1 - selectedSlides.length
    if (remainingSlots > 0 && bonusSlides.length > 0) {
      selectedSlides = selectedSlides.concat(bonusSlides.slice(0, remainingSlots))
    }
    
    // Ensure logical flow by reordering certain slide types
    const flowOrder = [
      'cover',
      'agenda',
      'executiveSummary',
      'customerVoice',
      'industryTrends',
      'marketSizing',
      'businessImpact',
      'swotAnalysis',
      'hypothesisTree',
      'competitiveLandscape',
      'benchmark',
      'solutionOverview',
      'productDeepDive',
      'valueChain',
      'processFlow',
      'content',
      'caseStudy',
      'whyUs',
      'valueProp',
      'whyNow',
      'pricing',
      'roiCalculation',
      'roi',
      'costBenefit',
      'investmentSummary',
      'technicalArchitecture',
      'quickWins',
      'roadmap',
      'implementationTimeline',
      'kpiDashboard',
      'metrics',
      'riskMatrix',
      'stakeholderMap',
      'initiativePrioritization',
      'nextSteps',
      'contact',
      'thankYou'
    ]
    
    // Sort by flow order with some randomness
    selectedSlides.sort((a, b) => {
      const aIndex = flowOrder.indexOf(a.slideType)
      const bIndex = flowOrder.indexOf(b.slideType)
      
      // Add small random factor to vary order slightly
      const aOrder = (aIndex === -1 ? 999 : aIndex) + Math.random() * 2
      const bOrder = (bIndex === -1 ? 999 : bIndex) + Math.random() * 2
      
      return aOrder - bOrder
    })
    
    // Remove score and other internal properties
    return selectedSlides.map(({ title, description, slideType, layout }) => ({
      title,
      description,
      slideType,
      layout
    }))
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
    companyName?: string
    challenges?: string[]
    industry?: string
    competitors?: string[]
    budget?: string
    timeline?: string
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
    // Additional fields for McKinsey slides
    subtitle?: string
    keyMessage?: string
    supportingPoints?: any[]
    recommendation?: string
    strengths?: string[]
    weaknesses?: string[]
    opportunities?: string[]
    threats?: string[]
    xAxis?: { label: string; low: string; high: string }
    yAxis?: { label: string; low: string; high: string }
    quadrants?: any[]
    investment?: any
    returns?: any[]
    phases?: any[]
    timeframes?: any[]
    steps?: any[]
    kpis?: any[]
    summary?: string
    layers?: any[]
    marketSize?: any
    segments?: any[]
    categoryData?: any[]
    risks?: any[]
    options?: any[]
    stakeholders?: any[]
    cost?: any
    benefits?: any[]
    initiatives?: any[]
    hypothesis?: any
    branches?: any[]
    decision?: any
    competitors?: any[]
    primaryActivities?: string[]
  }> {
    const { title, context, slideType, slideNumber, mainTopic, companyName, challenges, industry, competitors, budget, timeline } = params
    
    // Check if we have a valid API key
    if (!this.hasValidApiKey()) {
      console.log('generateSlideContent: No valid OpenAI API key found, using placeholder content')
      return this.generatePlaceholderContent(params)
    }
    
    const openaiClient = this.getOpenAI()
    if (!openaiClient) {
      console.log('generateSlideContent: Failed to create OpenAI client, using placeholder content')
      return this.generatePlaceholderContent(params)
    }
    
    console.log(`generateSlideContent: Using OpenAI API for ${slideType} slide generation`)
    
    try {
      // Generate prompts based on slide type with context
      const systemPrompt = this.getSlideSystemPrompt(slideType)
      const userPrompt = this.getSlideUserPrompt(params)
      
      const completion = await openaiClient.chat.completions.create({
        model: this.getModel(),
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      })

      const content = completion.choices[0]?.message?.content
      if (!content) throw new Error('No content generated')

      console.log(`generateSlideContent: Received response for ${slideType}`)
      const parsed = JSON.parse(content)
      
      // Ensure title is included
      return {
        title: parsed.title || title,
        ...parsed
      }
    } catch (error) {
      console.error(`Slide generation error for ${slideType}:`, error)
      if (error instanceof Error) {
        console.error('Error details:', error.message)
      }
      return this.generatePlaceholderContent(params)
    }
  }

  /**
   * Get system prompt for specific slide type
   */
  private getSlideSystemPrompt(slideType: string): string {
    const prompts: Record<string, string> = {
      executiveSummary: 'You are creating an executive summary slide. Generate a compelling key message, 3 supporting points with metrics, and a clear recommendation. Be concise and impactful.',
      swotAnalysis: 'You are creating a SWOT analysis slide. Generate 3-4 items for each category (Strengths, Weaknesses, Opportunities, Threats). Be specific and relevant to the company context.',
      competitiveLandscape: 'You are creating a competitive landscape slide. Position competitors on a 2x2 matrix with relevant axes. Include the company being presented to and mark them distinctly.',
      roiCalculation: 'You are creating an ROI calculation slide. Include investment amount, returns over 3 years, and key metrics (ROI %, payback period, NPV if relevant).',
      quickWins: 'You are creating a quick wins slide. Organize actions by timeframe (30 days, 60 days, 90 days) with specific actions and their impact.',
      valueChain: 'You are creating a value chain slide. Include 4-5 primary activities and 3-4 support activities relevant to the business.',
      roadmap: 'You are creating an implementation roadmap. Include 3-4 phases with duration, key workstreams, and activities for each phase.',
      // Sales-oriented slides
      customerVoice: 'Create a customer voice slide. Generate customerQuotes array with relevant pain points, and painPoints array with functionalArea, challenge, and impact.',
      whyUs: 'Create a why us slide. Generate differentiators array with differentiator, description, and proof. Include clientResults and awards if relevant.',
      whyNow: 'Create a why now slide. Generate urgencyFactors array with factor, impact, and timeline. Include opportunities and costOfDelay.',
      valueProp: 'Create a value proposition slide. Generate mainValue statement and valuePillars array with pillar, description, and metrics.',
      pricing: 'Create a pricing slide. Generate pricingTiers array with tierName, price, features, and mark one as isRecommended.',
      roi: 'Create ROI slide. Generate totalInvestment object, annualSavings array, and calculate paybackPeriod and threeYearROI.',
      solutionOverview: 'Create solution overview. Generate keyFeatures array with feature and description for each.',
      productDeepDive: 'Create product deep dive. Generate coreFeatures array, businessBenefits array, and technicalDetails object.',
      nextSteps: 'Create next steps slide. Generate immediateActions array with action, owner, and timeline.',
      // Add more as needed
      default: 'You are creating a business presentation slide. Generate relevant content based on the context provided. Be professional, concise, and data-driven.'
    }
    
    return prompts[slideType] || prompts.default
  }

  /**
   * Get user prompt for slide generation
   */
  private getSlideUserPrompt(params: any): string {
    const { title, context, slideType, companyName, challenges, industry, competitors, budget, timeline } = params
    
    let prompt = `Create content for a ${slideType} slide with title: "${title}".\n\n`
    prompt += `Context: ${context}\n\n`
    
    if (companyName) prompt += `Company: ${companyName}\n`
    if (industry) prompt += `Industry: ${industry}\n`
    if (challenges && challenges.length > 0) prompt += `Challenges: ${challenges.join(', ')}\n`
    if (competitors && competitors.length > 0) prompt += `Competitors: ${competitors.join(', ')}\n`
    if (budget) prompt += `Budget: ${budget}\n`
    if (timeline) prompt += `Timeline: ${timeline}\n`
    
    prompt += '\nGenerate appropriate content in JSON format for this slide type. Include all required fields based on the slide type.'
    
    // Add specific format hints for certain slide types
    if (slideType === 'customerVoice') {
      prompt += '\nFormat: { "customerQuotes": ["quote1", "quote2"], "painPoints": [{"functionalArea": "area", "challenge": "challenge", "impact": "High"}] }'
    } else if (slideType === 'roi') {
      prompt += '\nFormat: { "totalInvestment": {"software": "$X", "implementation": "$Y", "training": "$Z"}, "annualSavings": [{"category": "cat", "amount": "$X", "description": "desc"}], "paybackPeriod": "X months", "threeYearROI": "X%" }'
    }
    
    return prompt
  }

  /**
   * Generate placeholder content when AI is not available
   */
  private generatePlaceholderContent(params: any): any {
    const { title, slideType, companyName = 'Your Company', industry = 'your industry' } = params
    
    // Return type-specific placeholder content
    const placeholders: Record<string, any> = {
      executiveSummary: {
        title,
        keyMessage: `Transform ${companyName}'s operations with strategic initiatives`,
        supportingPoints: [
          { label: 'Cost Reduction', value: '30%', description: 'Through process optimization' },
          { label: 'Revenue Growth', value: '25%', description: 'New market opportunities' },
          { label: 'Time to Market', value: '40% faster', description: 'Streamlined workflows' }
        ],
        recommendation: 'Proceed with phased implementation starting Q1'
      },
      swotAnalysis: {
        title,
        subtitle: `Strategic assessment for ${companyName}`,
        strengths: ['Market leadership', 'Strong brand recognition', 'Talented workforce', 'Robust technology stack'],
        weaknesses: ['Legacy systems', 'Complex processes', 'Limited digital presence'],
        opportunities: ['Digital transformation', 'New market segments', 'Strategic partnerships'],
        threats: ['Increasing competition', 'Market disruption', 'Regulatory changes']
      },
      competitiveLandscape: {
        title,
        subtitle: `${industry} competitive positioning`,
        xAxis: 'Market Share',
        yAxis: 'Innovation Capability',
        competitors: params.competitors && params.competitors.length > 0 ? [
          { name: companyName, x: 65, y: 70, size: 'large', isUs: true },
          ...params.competitors.slice(0, 3).map((comp: string, i: number) => ({
            name: comp,
            x: [80, 45, 30][i],
            y: [60, 85, 40][i],
            size: ['large', 'medium', 'small'][i]
          }))
        ] : [
          { name: companyName, x: 65, y: 70, size: 'large', isUs: true },
          { name: 'Competitor A', x: 80, y: 60, size: 'large' },
          { name: 'Competitor B', x: 45, y: 85, size: 'medium' },
          { name: 'Competitor C', x: 30, y: 40, size: 'small' }
        ]
      },
      roiCalculation: {
        title,
        subtitle: 'Financial projections and returns',
        investment: { label: 'Initial Investment', value: '$500,000' },
        returns: [
          { year: 'Year 1', value: '$650,000' },
          { year: 'Year 2', value: '$1,200,000' },
          { year: 'Year 3', value: '$1,800,000' }
        ],
        metrics: {
          roi: '260%',
          payback: '11 months',
          npv: '$2.1M'
        }
      },
      quickWins: {
        title,
        subtitle: 'Immediate value delivery roadmap',
        timeframes: [
          {
            period: '30 Days',
            actions: [
              { action: 'Process audit completion', impact: 'Identify $200K savings' },
              { action: 'Quick automation wins', impact: '20% efficiency gain' }
            ]
          },
          {
            period: '60 Days',
            actions: [
              { action: 'Team training completion', impact: 'Full adoption readiness' },
              { action: 'Phase 1 deployment', impact: 'First ROI realization' }
            ]
          },
          {
            period: '90 Days',
            actions: [
              { action: 'Full system integration', impact: 'Seamless operations' },
              { action: 'Performance optimization', impact: '35% total improvement' }
            ]
          }
        ]
      },
      // Sales-oriented placeholder content
      cover: {
        proposalTitle: title,
        clientName: companyName,
        vendorName: 'Your Company',
        proposalDate: new Date().toLocaleDateString(),
        salesRepName: 'Your Name',
        salesRepTitle: 'Account Executive',
        proposalSubtitle: 'Transforming Your Business Through Innovation'
      },
      agenda: {
        title: 'Meeting Agenda',
        agendaSections: [
          { section: 'Understanding Your Challenges', estimatedTime: '10 min' },
          { section: 'Our Solution Approach', estimatedTime: '15 min' },
          { section: 'Value Proposition & ROI', estimatedTime: '10 min' },
          { section: 'Implementation Plan', estimatedTime: '10 min' },
          { section: 'Next Steps', estimatedTime: '5 min' }
        ]
      },
      customerVoice: {
        title: 'What We Heard',
        subtitle: 'Understanding your unique challenges',
        customerQuotes: params.challenges && params.challenges.length > 0 ? params.challenges.map((c: string) => `"${c}"`) : [
          'We need to streamline our operations and reduce manual processes',
          'Our current system cannot scale with our growth plans',
          'Integration between systems is causing data silos'
        ],
        painPoints: params.challenges && params.challenges.length > 0 ? params.challenges.map((c: string, i: number) => ({
          functionalArea: ['Operations', 'IT', 'Finance', 'Sales'][i % 4],
          challenge: c,
          impact: i === 0 ? 'Critical' : 'High'
        })) : [
          { functionalArea: 'Operations', challenge: 'Manual processes taking 40% of team time', impact: 'High' },
          { functionalArea: 'IT', challenge: 'Legacy systems limiting innovation', impact: 'Critical' }
        ]
      },
      industryTrends: {
        title: 'Industry Landscape',
        subtitle: `Key trends shaping ${industry}`,
        trends: [
          { trend: 'Digital Transformation Acceleration', impact: '85% of companies increasing digital investments', statistic: '85%', source: 'Gartner 2024' },
          { trend: 'AI and Automation Adoption', impact: 'Automation can reduce costs by 30-40%', statistic: '30-40%', source: 'McKinsey' }
        ]
      },
      businessImpact: {
        title: 'Business Impact Analysis',
        subtitle: 'Current state vs. desired outcomes',
        kpis: [
          { name: 'Process Efficiency', current: '60%', ideal: '90%', improvement: '50%', cost: '$2M annually' },
          { name: 'Time to Market', current: '6 months', ideal: '2 months', improvement: '67%' }
        ]
      },
      solutionOverview: {
        title: 'Our Solution',
        solutionName: 'Enterprise Platform',
        tagline: 'Unified, scalable, intelligent',
        keyFeatures: [
          { feature: 'Process Automation', description: 'Automate 80% of manual tasks' },
          { feature: 'Real-time Analytics', description: 'Make data-driven decisions instantly' },
          { feature: 'Seamless Integration', description: 'Connect all your systems effortlessly' }
        ]
      },
      productDeepDive: {
        title: 'Solution Deep Dive',
        productName: 'Enterprise Solution Suite',
        coreFeatures: [
          { feature: 'Workflow Automation', description: 'Visual workflow builder with AI assistance', howItWorks: 'Drag-and-drop interface with pre-built templates' },
          { feature: 'Advanced Analytics', description: 'Real-time dashboards and predictive insights', howItWorks: 'ML-powered analytics engine' }
        ],
        businessBenefits: ['50% reduction in operational costs', '3x faster time to market', '99.9% system uptime'],
        technicalDetails: { architecture: 'Cloud-native microservices', security: 'SOC2 Type II certified' }
      },
      caseStudy: {
        title: 'Success Story',
        customerName: 'Fortune 500 Retailer',
        challenge: 'Manual inventory management causing $5M in annual losses',
        solution: 'Implemented our AI-powered inventory optimization system',
        metrics: [
          { metric: '$3.2M', value: 'Annual savings', improvement: '+64%' },
          { metric: '85%', value: 'Inventory accuracy', improvement: '+40%' },
          { metric: '2 weeks', value: 'Implementation time' }
        ],
        quote: 'This solution transformed our operations and delivered ROI in just 3 months',
        quoteAuthor: 'Jane Smith',
        quoteTitle: 'COO'
      },
      whyUs: {
        title: 'Why Partner With Us',
        subtitle: 'Your trusted transformation partner',
        differentiators: [
          { differentiator: 'Industry Leadership', description: '15 years of proven success', proof: '#1 in Gartner Magic Quadrant' },
          { differentiator: 'Expert Team', description: '500+ certified professionals', proof: '98% customer satisfaction' }
        ],
        clientResults: [
          { metric: '250+', description: 'Enterprise clients' },
          { metric: '$1B+', description: 'Value delivered' }
        ]
      },
      whyNow: {
        title: 'Why Act Now',
        subtitle: 'The cost of waiting',
        urgencyFactors: [
          { 
            factor: params.timeline && params.timeline.toLowerCase().includes('urgent') ? 'Urgent Timeline' : 'Competitive Pressure', 
            impact: params.timeline || 'Competitors gaining 20% efficiency advantage', 
            timeline: params.timeline || 'Immediate' 
          },
          { factor: 'Market Changes', impact: 'New regulations requiring compliance by Q3', timeline: 'Q3 2024' }
        ],
        opportunities: [
          { opportunity: 'Early Adopter Pricing', benefit: '30% discount for Q1 sign-ups', expiryDate: 'March 31, 2024' }
        ],
        costOfDelay: { monthlyCost: '$200K', yearlyCost: '$2.4M' },
        lostOpportunities: params.challenges ? params.challenges.slice(0, 2).map((c: string) => `Lost revenue from ${c}`) : []
      },
      valueProp: {
        title: 'Value Proposition',
        mainValue: `Transform ${companyName} into a digital leader with 3x ROI in 12 months`,
        valuePillars: [
          { pillar: 'Operational Excellence', description: 'Automate and optimize all core processes', metrics: ['50% cost reduction', '80% faster processing'] },
          { pillar: 'Innovation Enablement', description: 'Build on modern, scalable platform', metrics: ['10x scalability', 'API-first architecture'] }
        ]
      },
      pricing: {
        title: 'Investment Options',
        subtitle: 'Flexible pricing to meet your needs',
        pricingTiers: [
          { tierName: 'Professional', price: '$50K', billingPeriod: 'per year', features: ['Core features', 'Standard support', 'Up to 100 users'] },
          { tierName: 'Enterprise', price: '$150K', billingPeriod: 'per year', features: ['All features', 'Priority support', 'Unlimited users'], isRecommended: true }
        ]
      },
      roi: {
        title: 'Return on Investment',
        subtitle: 'Your financial benefits',
        totalInvestment: { 
          software: params.budget || '$150K', 
          implementation: params.budget ? `${Math.round(parseInt(params.budget.replace(/[^0-9]/g, '')) * 0.33)}` : '$50K', 
          training: '$25K', 
          firstYearTotal: params.budget || '$225K' 
        },
        annualSavings: params.challenges && params.challenges.length > 0 ? 
          params.challenges.slice(0, 3).map((c: string, i: number) => ({
            category: c,
            amount: ['$500K', '$300K', '$200K'][i] || '$100K',
            description: `Addressing ${c}`
          })) : [
          { category: 'Labor Cost Reduction', amount: '$500K', description: 'Automation of manual tasks' },
          { category: 'Efficiency Gains', amount: '$300K', description: 'Faster processing and decisions' }
        ],
        totalAnnualSavings: '$800K',
        paybackPeriod: '3.4 months',
        threeYearROI: '356%'
      },
      investmentSummary: {
        title: 'Investment Summary',
        packages: [
          {
            packageName: 'Enterprise Package',
            totalPrice: '$225K',
            includedItems: ['Software licenses', 'Implementation services', 'Training & certification', '24/7 support'],
            contractLength: '3 years'
          }
        ]
      },
      technicalArchitecture: {
        title: 'Technical Architecture',
        architectureLayers: [
          { layer: 'Presentation Layer', description: 'React-based responsive UI', technologies: ['React', 'TypeScript'] },
          { layer: 'Application Layer', description: 'Microservices architecture', technologies: ['Node.js', 'Python'] }
        ],
        keyFeatures: ['Auto-scaling', 'Multi-region deployment', '99.99% uptime SLA'],
        securityMeasures: ['End-to-end encryption', 'SOC2 compliance', 'Regular security audits']
      },
      implementationTimeline: {
        title: 'Implementation Plan',
        totalDuration: '12 weeks',
        phases: [
          { phase: 'Discovery & Planning', duration: '2 weeks', deliverables: ['Requirements document', 'Project plan'] },
          { phase: 'Implementation', duration: '8 weeks', deliverables: ['System configuration', 'Integrations'] },
          { phase: 'Go-Live', duration: '2 weeks', deliverables: ['Training complete', 'Production launch'] }
        ]
      },
      nextSteps: {
        title: 'Next Steps',
        immediateActions: [
          { action: 'Schedule technical deep-dive', timeline: 'This week' },
          { action: 'Align stakeholders', timeline: 'Next week' },
          { action: 'Sign contract', timeline: 'By March 31' }
        ]
      },
      contact: {
        title: 'Contact Information',
        companyName: 'Your Company',
        teamContacts: [
          { name: 'John Doe', title: 'Account Executive', email: 'john@company.com', phone: '555-0100' }
        ]
      },
      thankYou: {
        title: 'Thank You',
        messages: ['We appreciate your time today', 'Looking forward to partnering with you'],
        contactPrompt: 'Questions? Reach out anytime:',
        contactInfo: { email: 'sales@company.com' }
      },
      // Add more placeholder types as needed
      default: {
        title,
        content: `Strategic insights for ${companyName}`,
        bullets: [
          'Key finding 1 with supporting data',
          'Key finding 2 with measurable impact',
          'Key finding 3 with actionable recommendations'
        ]
      }
    }
    
    return placeholders[slideType] || placeholders.default
  }
}

// Factory function to ensure environment variables are available
export function getAIService(): AIService {
  return new AIService()
}