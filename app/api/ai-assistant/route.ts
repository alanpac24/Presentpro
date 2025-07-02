import { NextRequest, NextResponse } from 'next/server'

// Mock AI responses for testing
const mockResponses = [
  {
    message: "I'll help you add that to your slide. What specific content would you like to include?",
    actions: []
  },
  {
    message: "I've added a text element to your slide. You can now edit it by clicking on it.",
    actions: [
      {
        type: 'addElement',
        payload: {
          elementType: 'text',
          position: { x: 100, y: 100 },
          size: { width: 300, height: 100 },
          properties: {
            content: 'New text element',
            fontSize: 16,
            color: '#000000',
            textAlign: 'left'
          }
        }
      }
    ]
  },
  {
    message: "I've created a bar chart for you. Double-click on it to edit the data.",
    actions: [
      {
        type: 'addElement',
        payload: {
          elementType: 'chart',
          position: { x: 150, y: 150 },
          size: { width: 400, height: 300 },
          properties: {
            chartType: 'bar',
            chartData: {
              data: [
                { category: 'Q1', value: 45 },
                { category: 'Q2', value: 52 },
                { category: 'Q3', value: 48 },
                { category: 'Q4', value: 61 }
              ]
            }
          }
        }
      }
    ]
  },
  {
    message: "I've added a table to your slide. You can edit cells by double-clicking on them.",
    actions: [
      {
        type: 'addElement',
        payload: {
          elementType: 'table',
          position: { x: 100, y: 100 },
          size: { width: 400, height: 200 },
          properties: {
            rows: 3,
            columns: 3
          }
        }
      }
    ]
  },
  {
    message: "I've added a shape to your slide. You can resize and move it as needed.",
    actions: [
      {
        type: 'addElement',
        payload: {
          elementType: 'shape',
          position: { x: 200, y: 200 },
          size: { width: 150, height: 150 },
          properties: {
            shapeType: 'rectangle',
            backgroundColor: '#3b82f6',
            borderColor: '#1e40af',
            borderWidth: 2
          }
        }
      }
    ]
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, currentSlide, elements } = body

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Simple keyword-based response selection for testing
    const lowerMessage = message.toLowerCase()
    let response = mockResponses[0] // Default response

    if (lowerMessage.includes('chart') || lowerMessage.includes('graph')) {
      response = mockResponses[2]
    } else if (lowerMessage.includes('table')) {
      response = mockResponses[3]
    } else if (lowerMessage.includes('shape') || lowerMessage.includes('rectangle') || lowerMessage.includes('circle')) {
      response = mockResponses[4]
    } else if (lowerMessage.includes('text') || lowerMessage.includes('title') || lowerMessage.includes('add')) {
      response = mockResponses[1]
    }

    // TODO: When OpenAI is configured, replace mock with actual API call:
    // const completion = await openai.chat.completions.create({ ... })

    return NextResponse.json(response)
  } catch (error) {
    console.error('AI Assistant mock error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        message: 'Sorry, I encountered an error. Please try again.'
      },
      { status: 500 }
    )
  }
}