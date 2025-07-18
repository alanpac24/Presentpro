import { z } from 'zod'

export const CompanyInfoSchema = z.object({
  name: z.string(),
  website: z.string().url().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  recentNews: z.array(z.string()).optional(),
  fundingInfo: z.string().optional(),
  growthMetrics: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
})

export const ProspectInfoSchema = z.object({
  name: z.string(),
  title: z.string(),
  company: z.string(),
  linkedinUrl: z.string().url().optional(),
  experience: z.string().optional(),
  interests: z.array(z.string()).optional(),
  recentActivity: z.array(z.string()).optional(),
})

export const IndustryInsightsSchema = z.object({
  trends: z.array(z.string()),
  challenges: z.array(z.string()),
  opportunities: z.array(z.string()),
  competitors: z.array(z.string()).optional(),
})

export const ResearchDataSchema = z.object({
  company: CompanyInfoSchema,
  prospect: ProspectInfoSchema,
  industry: IndustryInsightsSchema,
  painPoints: z.array(z.string()),
  opportunities: z.array(z.string()),
})

export type CompanyInfo = z.infer<typeof CompanyInfoSchema>
export type ProspectInfo = z.infer<typeof ProspectInfoSchema>
export type IndustryInsights = z.infer<typeof IndustryInsightsSchema>
export type ResearchData = z.infer<typeof ResearchDataSchema>

/**
 * Mock research service for development
 * In production, this would use web scraping and APIs
 */
export class ResearchService {
  /**
   * Research a company based on their website and name
   */
  async researchCompany(companyName: string, websiteUrl?: string): Promise<CompanyInfo> {
    // In production, this would scrape the website and search for company info
    // For now, return mock data based on company name
    
    const mockCompanyData: Record<string, CompanyInfo> = {
      'Microsoft': {
        name: 'Microsoft Corporation',
        website: 'https://microsoft.com',
        industry: 'Technology',
        size: '221,000+ employees',
        location: 'Redmond, Washington',
        description: 'Leading technology company specializing in software, cloud services, and hardware',
        recentNews: [
          'Microsoft reports Q4 2024 revenue of $65.6 billion, up 16% YoY',
          'Azure cloud revenue grows 30% as AI services drive adoption',
          'Microsoft invests $10 billion in AI infrastructure expansion'
        ],
        fundingInfo: 'Public company (NASDAQ: MSFT), Market cap: $3.1 trillion',
        growthMetrics: [
          'Cloud revenue: +30% YoY',
          'AI services adoption: +150% QoQ',
          'Enterprise customers: 95% of Fortune 500'
        ],
        technologies: ['Azure', 'Microsoft 365', 'Dynamics 365', 'AI/Copilot']
      },
      'Salesforce': {
        name: 'Salesforce, Inc.',
        website: 'https://salesforce.com',
        industry: 'Enterprise Software',
        size: '79,000+ employees',
        location: 'San Francisco, California',
        description: 'Global leader in CRM and enterprise cloud solutions',
        recentNews: [
          'Salesforce launches new AI-powered Sales Cloud features',
          'Company reports 11% revenue growth in latest quarter',
          'Salesforce acquires data analytics startup for $1.9B'
        ],
        fundingInfo: 'Public company (NYSE: CRM), Market cap: $291 billion',
        growthMetrics: [
          'Revenue: $34.9B annual',
          'Customer base: 150,000+ companies',
          'Data Cloud growth: +80% YoY'
        ],
        technologies: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud', 'Einstein AI']
      }
    }

    // Default company data for unknown companies
    const defaultData: CompanyInfo = {
      name: companyName,
      website: websiteUrl,
      industry: 'Technology',
      size: '1,000-5,000 employees',
      location: 'United States',
      description: `${companyName} is a growing company in the technology sector`,
      recentNews: [
        `${companyName} expands operations to meet growing demand`,
        `Company invests in digital transformation initiatives`,
        `${companyName} launches new product line for enterprise customers`
      ],
      fundingInfo: 'Private company',
      growthMetrics: [
        'Revenue growth: +25% YoY',
        'Customer retention: 92%',
        'Market expansion: 3 new regions'
      ],
      technologies: ['Cloud Services', 'Data Analytics', 'AI/ML']
    }

    return mockCompanyData[companyName] || defaultData
  }

  /**
   * Research a prospect based on their LinkedIn profile
   */
  async researchProspect(
    name: string,
    title: string,
    company: string,
    linkedinUrl?: string
  ): Promise<ProspectInfo> {
    // In production, this would use LinkedIn API or scraping
    // For now, return mock data based on title
    
    const roleBasedData: Record<string, Partial<ProspectInfo>> = {
      'VP': {
        experience: '15+ years in enterprise sales and business development',
        interests: ['Digital transformation', 'Revenue growth', 'Team leadership', 'Strategic partnerships'],
        recentActivity: [
          'Posted about Q4 sales achievements',
          'Attended SaaStr Annual conference',
          'Shared article on AI in sales'
        ]
      },
      'Director': {
        experience: '10+ years in product management and strategy',
        interests: ['Product innovation', 'Customer success', 'Agile methodologies', 'Market analysis'],
        recentActivity: [
          'Launched new product feature announcement',
          'Spoke at ProductCon 2024',
          'Published thought leadership on product-market fit'
        ]
      },
      'Manager': {
        experience: '7+ years in operations and process improvement',
        interests: ['Operational efficiency', 'Team development', 'Process automation', 'Data analytics'],
        recentActivity: [
          'Completed executive leadership program',
          'Implemented new team workflow',
          'Shared insights on remote team management'
        ]
      }
    }

    const defaultProspectData: ProspectInfo = {
      name,
      title,
      company,
      linkedinUrl,
      experience: '10+ years of industry experience',
      interests: ['Innovation', 'Leadership', 'Technology', 'Business Growth'],
      recentActivity: [
        'Active in industry discussions',
        'Regular thought leadership posts',
        'Engaged with technology trends'
      ]
    }

    // Find matching role data based on title
    const roleKey = Object.keys(roleBasedData).find(key => title.includes(key))
    const roleData = roleKey ? roleBasedData[roleKey] : {}

    return {
      ...defaultProspectData,
      ...roleData
    }
  }

  /**
   * Get industry insights and trends
   */
  async getIndustryInsights(industry: string): Promise<IndustryInsights> {
    // In production, this would aggregate data from multiple sources
    // For now, return relevant insights based on industry
    
    const industryData: Record<string, IndustryInsights> = {
      'Technology': {
        trends: [
          'AI and automation driving 40% efficiency gains',
          'Cloud migration accelerating - 85% of enterprises by 2025',
          'Cybersecurity spending increasing 15% annually',
          'Remote work tools market growing 25% YoY'
        ],
        challenges: [
          'Talent shortage - 3.5M unfilled tech positions',
          'Rising infrastructure costs',
          'Data privacy regulations compliance',
          'Integration complexity across systems'
        ],
        opportunities: [
          'AI-powered automation market: $15B by 2025',
          'Edge computing adoption in enterprises',
          'Sustainable technology initiatives',
          'Low-code/no-code platform adoption'
        ],
        competitors: ['Microsoft', 'Google', 'Amazon', 'Salesforce', 'Oracle']
      },
      'Finance': {
        trends: [
          'Digital banking adoption up 200% since 2020',
          'Blockchain integration in payment systems',
          'ESG investing growing 35% annually',
          'Open banking APIs transforming services'
        ],
        challenges: [
          'Regulatory compliance costs increasing',
          'Cybersecurity threats targeting financial data',
          'Legacy system modernization',
          'Customer retention in digital age'
        ],
        opportunities: [
          'Embedded finance market: $230B by 2025',
          'AI-driven risk assessment',
          'Cryptocurrency integration',
          'Personalized financial services'
        ],
        competitors: ['JPMorgan', 'Bank of America', 'Wells Fargo', 'Citi', 'Goldman Sachs']
      }
    }

    const defaultInsights: IndustryInsights = {
      trends: [
        'Digital transformation accelerating across all sectors',
        'AI and automation becoming standard',
        'Customer experience as key differentiator',
        'Sustainability initiatives driving decisions'
      ],
      challenges: [
        'Keeping pace with technological change',
        'Talent acquisition and retention',
        'Data security and privacy',
        'Operational efficiency'
      ],
      opportunities: [
        'Process automation potential',
        'Data-driven decision making',
        'New market expansion',
        'Partnership opportunities'
      ],
      competitors: ['Industry Leader 1', 'Industry Leader 2', 'Industry Leader 3']
    }

    return industryData[industry] || defaultInsights
  }

  /**
   * Identify pain points based on company and industry data
   */
  async identifyPainPoints(
    company: CompanyInfo,
    industry: IndustryInsights
  ): Promise<string[]> {
    // Analyze company size, industry challenges, and growth metrics
    const painPoints: string[] = []

    // Size-based pain points
    if (company.size?.includes('000+')) {
      painPoints.push('Managing complex operations across multiple departments')
      painPoints.push('Ensuring consistent processes at scale')
      painPoints.push('Data silos preventing unified insights')
    } else {
      painPoints.push('Limited resources for technology initiatives')
      painPoints.push('Manual processes limiting growth potential')
      painPoints.push('Competing with larger enterprises')
    }

    // Industry-specific pain points
    if (industry.challenges.length > 0) {
      painPoints.push(...industry.challenges.slice(0, 2))
    }

    // Growth-related pain points
    if (company.growthMetrics?.some(metric => metric.includes('+25%') || metric.includes('+30%'))) {
      painPoints.push('Scaling operations to match rapid growth')
      painPoints.push('Maintaining quality while expanding')
    }

    return painPoints.slice(0, 4) // Return top 4 pain points
  }

  /**
   * Identify opportunities based on research data
   */
  async identifyOpportunities(
    company: CompanyInfo,
    industry: IndustryInsights,
    painPoints: string[]
  ): Promise<string[]> {
    const opportunities: string[] = []

    // Technology adoption opportunities
    if (!company.technologies?.includes('AI')) {
      opportunities.push('Leverage AI to automate repetitive tasks and improve efficiency')
    }

    // Growth opportunities
    if (company.growthMetrics?.some(metric => metric.includes('revenue'))) {
      opportunities.push('Accelerate revenue growth through improved sales processes')
    }

    // Industry trend opportunities
    industry.trends.slice(0, 2).forEach(trend => {
      opportunities.push(`Capitalize on ${trend.toLowerCase()}`)
    })

    // Pain point resolution opportunities
    painPoints.slice(0, 2).forEach(pain => {
      opportunities.push(`Address ${pain.toLowerCase()} with targeted solutions`)
    })

    return opportunities.slice(0, 5) // Return top 5 opportunities
  }

  /**
   * Perform complete research on a company and prospect
   */
  async performResearch(
    companyName: string,
    websiteUrl: string | undefined,
    prospectName: string,
    prospectTitle: string,
    linkedinUrl?: string
  ): Promise<ResearchData> {
    // Perform parallel research
    const [company, prospect] = await Promise.all([
      this.researchCompany(companyName, websiteUrl),
      this.researchProspect(prospectName, prospectTitle, companyName, linkedinUrl)
    ])

    // Get industry insights
    const industry = await this.getIndustryInsights(company.industry || 'Technology')

    // Identify pain points and opportunities
    const [painPoints, opportunities] = await Promise.all([
      this.identifyPainPoints(company, industry),
      this.identifyOpportunities(company, industry, [])
    ])

    return {
      company,
      prospect,
      industry,
      painPoints,
      opportunities
    }
  }
}

// Export singleton instance
export const researchService = new ResearchService()