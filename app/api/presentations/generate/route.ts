import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAIService } from '@/lib/services/ai-service'

// Request validation schema
const GeneratePresentationSchema = z.object({
  prompt: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate request
    const { prompt } = GeneratePresentationSchema.parse(body)
    
    console.log('=== Presentation Generation Request ===')
    console.log('Prompt:', prompt)
    console.log('Environment check:')
    console.log('- OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)
    console.log('- OPENAI_API_KEY value:', process.env.OPENAI_API_KEY ? `${process.env.OPENAI_API_KEY.substring(0, 7)}...` : 'undefined')
    console.log('- OPENAI_MODEL:', process.env.OPENAI_MODEL || 'not set')
    console.log('- NODE_ENV:', process.env.NODE_ENV)
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      console.warn('OpenAI API key not configured - using enhanced placeholders')
    } else {
      console.log('OpenAI API key is configured')
    }
    
    // Get AI service instance (this ensures env vars are available)
    const aiService = getAIService()
    
    // Extract key information from prompt
    const promptAnalysis = await aiService.analyzePrompt(prompt)
    
    // Generate presentation structure with all extracted information
    const presentationStructure = await aiService.generatePresentationStructure({
      topic: promptAnalysis.topic,
      audience: promptAnalysis.audience,
      purpose: promptAnalysis.purpose,
      slideCount: promptAnalysis.slideCount || 10,
      salesStage: promptAnalysis.salesStage,
      industry: promptAnalysis.industry,
      companyName: promptAnalysis.companyName,
      challenges: promptAnalysis.challenges,
      competitors: promptAnalysis.competitors,
      budget: promptAnalysis.budget,
      timeline: promptAnalysis.timeline,
    })
    
    // Generate content for each slide with context
    const slides = await Promise.all(
      presentationStructure.sections.map(async (section, index) => {
        const slideContent = await aiService.generateSlideContent({
          title: section.title,
          context: section.description,
          slideType: section.slideType,
          slideNumber: index + 1,
          totalSlides: presentationStructure.sections.length,
          mainTopic: promptAnalysis.topic,
          companyName: promptAnalysis.companyName,
          challenges: promptAnalysis.challenges,
          industry: promptAnalysis.industry,
          competitors: promptAnalysis.competitors,
          budget: promptAnalysis.budget,
          timeline: promptAnalysis.timeline,
        })
        
        return {
          // Include all McKinsey-specific fields first
          ...slideContent,
          // Then override with specific values
          id: `slide-${index + 1}`,
          type: section.slideType,
          layout: section.layout,
        }
      })
    )
    
    // Return the generated presentation
    return NextResponse.json({
      success: true,
      data: {
        title: presentationStructure.title,
        slides: slides,
        metadata: {
          generatedAt: new Date().toISOString(),
          slideCount: slides.length,
          estimatedDuration: slides.length * 2, // 2 minutes per slide estimate
          theme: 'professional',
        }
      }
    })
  } catch (error) {
    console.error('Presentation generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data', 
          details: error.errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate presentation' 
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check service status
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'presentation-generator',
    version: '1.0.0',
    features: {
      aiGeneration: true,
      promptAnalysis: true,
      slideTypes: [
        'title', 'content', 'bullet', 'twoColumn', 'chart', 'metrics', 'comparison', 'timeline',
        'executiveSummary', 'matrix', 'waterfallChart', 'swotAnalysis', 'valueChain', 
        'roiCalculation', 'roadmap', 'quickWins', 'marketSizing', 'heatmap', 
        'competitiveLandscape', 'processFlow', 'kpiDashboard', 'riskMatrix', 
        'benchmark', 'stakeholderMap', 'costBenefit', 'initiativePrioritization',
        'hypothesisTree', 'decisionTree', 'orgStructure'
      ],
      themes: ['professional', 'modern', 'minimal'],
    }
  })
}