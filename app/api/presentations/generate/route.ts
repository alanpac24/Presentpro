import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { aiService } from '@/lib/services/ai-service'

// Request validation schema
const GeneratePresentationSchema = z.object({
  prompt: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate request
    const { prompt } = GeneratePresentationSchema.parse(body)
    
    console.log('Generating presentation for prompt:', prompt)
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      console.warn('OpenAI API key not configured - using enhanced placeholders')
    }
    
    // Extract key information from prompt
    const promptAnalysis = await aiService.analyzePrompt(prompt)
    
    // Generate presentation structure
    const presentationStructure = await aiService.generatePresentationStructure({
      topic: promptAnalysis.topic,
      audience: promptAnalysis.audience,
      purpose: promptAnalysis.purpose,
      slideCount: promptAnalysis.slideCount || 10,
    })
    
    // Generate content for each slide
    const slides = await Promise.all(
      presentationStructure.sections.map(async (section, index) => {
        const slideContent = await aiService.generateSlideContent({
          title: section.title,
          context: section.description,
          slideType: section.slideType,
          slideNumber: index + 1,
          totalSlides: presentationStructure.sections.length,
          mainTopic: promptAnalysis.topic,
        })
        
        return {
          id: `slide-${index + 1}`,
          type: section.slideType,
          title: slideContent.title,
          content: slideContent.content,
          bullets: slideContent.bullets,
          speakerNotes: slideContent.speakerNotes,
          chartData: slideContent.chartData,
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
      slideTypes: ['title', 'bullet', 'twoColumn', 'chart', 'image', 'conclusion'],
      themes: ['professional', 'modern', 'minimal'],
    }
  })
}