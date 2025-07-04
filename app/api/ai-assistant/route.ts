import { NextRequest, NextResponse } from 'next/server'
import { parseIntent, generateResponse, generateSampleContent } from '@/lib/simple-ai-utils'

export async function POST(request: NextRequest) {
  try {
    const { message, currentSlide, elements } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Parse user intent
    const intent = parseIntent(message)
    const response = generateResponse(intent)

    // Generate actions based on intent
    const actions = []
    
    if (intent.action === 'add' && intent.target) {
      const content = intent.content || generateSampleContent(intent.target)
      
      actions.push({
        type: 'add_element',
        elementType: intent.target,
        content: content,
        position: { x: 100, y: 100 },
        size: intent.target === 'title' 
          ? { width: 600, height: 60 }
          : { width: 400, height: 100 }
      })
    }

    return NextResponse.json({
      message: response,
      actions: actions,
      success: true
    })

  } catch (error) {
    console.error('AI Assistant error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: 'Sorry, I encountered an error. Please try again.'
      },
      { status: 500 }
    )
  }
}