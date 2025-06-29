import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// System prompt that defines the assistant's capabilities
const SYSTEM_PROMPT = `You are an AI assistant for a presentation editor. You can help users create and edit slides using the following capabilities:

1. **Text Elements**: Add titles, subtitles, and content text
2. **Shapes**: Add rectangles, circles, triangles, arrows, and custom shapes
3. **Charts**: Create bar, column, line, pie, doughnut, and waterfall charts with smart labels
4. **Tables**: Create and format tables with custom rows and columns
5. **Layout**: Arrange, align, and distribute elements on slides
6. **Styling**: Change colors, fonts, sizes, and other visual properties

When responding to user requests:
- Be specific about what actions you're taking
- Return structured commands that the application can execute
- Ask for clarification when needed
- Suggest improvements or alternatives when appropriate

Available action types:
- addElement: Add a new element to the slide
- updateElement: Update an existing element
- deleteElement: Remove an element
- alignElements: Align selected elements
- distributeElements: Distribute elements evenly

Element types and their properties:
- text: { content, fontSize, fontWeight, color, textAlign }
- shape: { shapeType, backgroundColor, borderColor, borderWidth }
- chart: { chartType, chartData, chartOptions, smartLabels, chartSettings }
- table: { rows, columns, cells }

Return your response in this JSON format:
{
  "message": "A description of what you're doing",
  "actions": [
    {
      "type": "addElement",
      "payload": {
        "elementType": "text|shape|chart|table",
        "position": { "x": 100, "y": 100 },
        "size": { "width": 300, "height": 200 },
        "properties": { ... }
      }
    }
  ]
}`

export async function POST(request: NextRequest) {
  try {
    const { message, currentSlide, elements } = await request.json()

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { 
          role: 'user', 
          content: `Current slide context:
Title: ${currentSlide?.title || 'Untitled'}
Elements: ${JSON.stringify(elements || [], null, 2)}

User request: ${message}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: parseInt(process.env.MAX_TOKENS_PER_REQUEST || '2000'),
    })

    const response = JSON.parse(completion.choices[0].message.content || '{}')
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('AI Assistant error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    )
  }
}