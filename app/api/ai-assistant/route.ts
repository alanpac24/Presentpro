import { NextRequest, NextResponse } from 'next/server'
import { analyzeIntent, generateContent } from '@/lib/ai-utils'
import { calculateTextConstraints, getElementTypeConstraints } from '@/lib/text-constraints'

// Mock AI responses for testing (fallback when OpenAI is unavailable)
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

    // Check if OpenAI is configured
    const useOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here'
    
    if (useOpenAI) {
      try {
        // Analyze user intent
        const intent = await analyzeIntent(message)
        
        // Generate action based on intent
        const actions = []
        let responseMessage = ''
        
        switch (intent.action) {
          case 'add':
            // Calculate default position to avoid overlapping
            const defaultPosition = calculateDefaultPosition(elements)
            
            // Determine element size based on type
            const elementSize = getDefaultElementSize(intent.elementType)
            
            // Generate content if needed
            let content = intent.parameters.content
            
            if (intent.elementType === 'text' || intent.elementType === 'title' || intent.elementType === 'bullet') {
              if (!content) {
                const constraints = calculateTextConstraints({
                  width: elementSize.width,
                  height: elementSize.height,
                  fontSize: intent.elementType === 'title' ? 32 : 16
                })
                
                content = await generateContent(intent, {
                  elementType: intent.elementType,
                  constraints: {
                    width: elementSize.width,
                    height: elementSize.height,
                    fontSize: intent.elementType === 'title' ? 32 : 16
                  },
                  context: {
                    slideType: currentSlide?.type || 'content',
                    topic: message
                  }
                })
              }
            }
            
            // Create action based on element type
            if (intent.elementType === 'chart') {
              const chartData = await generateContent(intent, {
                elementType: 'chart',
                context: {
                  slideType: currentSlide?.type || 'content',
                  topic: message
                }
              })
              
              actions.push({
                type: 'addElement',
                payload: {
                  elementType: 'chart',
                  position: defaultPosition,
                  size: elementSize,
                  properties: {
                    chartType: intent.parameters.chartType || 'bar',
                    chartData: chartData
                  }
                }
              })
              responseMessage = `I've created a ${intent.parameters.chartType || 'bar'} chart for you. Double-click to edit the data.`
            } else if (intent.elementType === 'table') {
              const rows = intent.parameters.rows || 3
              const columns = intent.parameters.columns || 3
              
              actions.push({
                type: 'addElement',
                payload: {
                  elementType: 'table',
                  position: defaultPosition,
                  size: elementSize,
                  properties: {
                    rows,
                    columns
                  }
                }
              })
              responseMessage = `I've added a ${rows}x${columns} table. Double-click cells to edit.`
            } else if (intent.elementType === 'shape') {
              actions.push({
                type: 'addElement',
                payload: {
                  elementType: 'shape',
                  position: defaultPosition,
                  size: elementSize,
                  properties: {
                    shapeType: intent.parameters.shapeType || 'rectangle',
                    backgroundColor: '#3b82f6',
                    borderColor: '#1e40af',
                    borderWidth: 2
                  }
                }
              })
              responseMessage = `I've added a ${intent.parameters.shapeType || 'rectangle'} shape.`
            } else {
              // Text, title, or bullet
              actions.push({
                type: 'addElement',
                payload: {
                  elementType: 'text',
                  position: defaultPosition,
                  size: elementSize,
                  properties: {
                    content: content || 'New text element',
                    fontSize: intent.elementType === 'title' ? 32 : 16,
                    fontWeight: intent.elementType === 'title' ? '700' : '400',
                    color: '#000000',
                    textAlign: intent.elementType === 'title' ? 'center' : 'left'
                  }
                }
              })
              responseMessage = `I've added ${intent.elementType === 'title' ? 'a title' : intent.elementType === 'bullet' ? 'bullet points' : 'text'} to your slide.`
            }
            break
            
          case 'update':
            responseMessage = "To update an element, please select it first and tell me what changes you'd like."
            break
            
          case 'delete':
            responseMessage = "To delete an element, please select it and press the Delete key."
            break
            
          default:
            responseMessage = "I can help you add text, charts, tables, and shapes to your slides. What would you like to create?"
        }
        
        return NextResponse.json({
          message: responseMessage,
          actions: actions
        })
        
      } catch (openAIError) {
        console.error('OpenAI error:', openAIError)
        // Fall back to mock responses
      }
    }
    
    // Fallback to mock responses
    const lowerMessage = message.toLowerCase()
    let response = mockResponses[0]

    if (lowerMessage.includes('chart') || lowerMessage.includes('graph')) {
      response = mockResponses[2]
    } else if (lowerMessage.includes('table')) {
      response = mockResponses[3]
    } else if (lowerMessage.includes('shape') || lowerMessage.includes('rectangle') || lowerMessage.includes('circle')) {
      response = mockResponses[4]
    } else if (lowerMessage.includes('text') || lowerMessage.includes('title') || lowerMessage.includes('add')) {
      response = mockResponses[1]
    }

    return NextResponse.json(response)
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

// Helper function to calculate default position for new elements
function calculateDefaultPosition(existingElements: any[]): { x: number; y: number } {
  // Start with default position
  let x = 100
  let y = 100
  
  // If there are existing elements, try to find a clear spot
  if (existingElements && existingElements.length > 0) {
    // Simple algorithm: place new element to the right of the last element
    const lastElement = existingElements[existingElements.length - 1]
    if (lastElement && lastElement.position) {
      x = lastElement.position.x + (lastElement.size?.width || 200) + 50
      y = lastElement.position.y
      
      // Wrap to next row if too far right
      if (x > 600) {
        x = 100
        y = lastElement.position.y + (lastElement.size?.height || 100) + 50
      }
    }
  }
  
  return { x, y }
}

// Helper function to get default element size based on type
function getDefaultElementSize(elementType: string): { width: number; height: number } {
  switch (elementType) {
    case 'title':
      return { width: 600, height: 80 }
    case 'chart':
      return { width: 400, height: 300 }
    case 'table':
      return { width: 400, height: 200 }
    case 'shape':
      return { width: 150, height: 150 }
    case 'bullet':
      return { width: 400, height: 150 }
    default:
      return { width: 300, height: 100 }
  }
}