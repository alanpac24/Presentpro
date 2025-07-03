import OpenAI from 'openai'
import { calculateTextConstraints, getTextPromptConstraint } from './text-constraints'

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ParsedIntent {
  action: 'add' | 'update' | 'delete' | 'select'
  elementType: 'text' | 'chart' | 'table' | 'shape' | 'title' | 'bullet'
  parameters: {
    content?: string
    chartType?: string
    rows?: number
    columns?: number
    shapeType?: string
    position?: { x: number; y: number }
    size?: { width: number; height: number }
    style?: Record<string, any>
    dataPoints?: number
  }
  confidence: number
}

export interface GenerateContentOptions {
  elementType: string
  constraints?: {
    width: number
    height: number
    fontSize: number
  }
  context?: {
    slideType: string
    existingContent?: string[]
    topic?: string
  }
}

/**
 * Analyze user intent from natural language
 */
export async function analyzeIntent(message: string): Promise<ParsedIntent> {
  const systemPrompt = `You are an AI assistant that helps users create presentations. 
Analyze the user's request and return a JSON object with:
- action: one of "add", "update", "delete", "select"
- elementType: one of "text", "chart", "table", "shape", "title", "bullet"
- parameters: relevant parameters for the action
- confidence: a number between 0 and 1

Examples:
"Add a title saying Q4 Results" -> {"action": "add", "elementType": "title", "parameters": {"content": "Q4 Results"}, "confidence": 0.95}
"Create a bar chart with 5 data points" -> {"action": "add", "elementType": "chart", "parameters": {"chartType": "bar", "dataPoints": 5}, "confidence": 0.9}
"Insert a 3x4 table" -> {"action": "add", "elementType": "table", "parameters": {"rows": 3, "columns": 4}, "confidence": 0.95}`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 200
    })

    const result = response.choices[0]?.message?.content
    if (!result) throw new Error('No response from OpenAI')

    return JSON.parse(result) as ParsedIntent
  } catch (error) {
    console.error('Error analyzing intent:', error)
    // Fallback to basic pattern matching
    return fallbackIntentParser(message)
  }
}

/**
 * Generate appropriate content based on intent and constraints
 */
export async function generateContent(
  intent: ParsedIntent,
  options: GenerateContentOptions
): Promise<any> {
  const { elementType, constraints, context } = options

  switch (elementType) {
    case 'text':
    case 'title':
    case 'bullet':
      return generateTextContent(intent, constraints, context)
    
    case 'chart':
      return generateChartData(intent, context)
    
    case 'table':
      return generateTableContent(intent, context)
    
    default:
      return null
  }
}

/**
 * Generate text content with size constraints
 */
async function generateTextContent(
  intent: ParsedIntent,
  constraints?: { width: number; height: number; fontSize: number },
  context?: { slideType: string; existingContent?: string[]; topic?: string }
): Promise<string> {
  // If content is already provided, use it
  if (intent.parameters.content) {
    return intent.parameters.content
  }

  let prompt = ''
  let textConstraint = ''

  // Calculate text constraints if dimensions provided
  if (constraints) {
    const textLimits = calculateTextConstraints({
      width: constraints.width,
      height: constraints.height,
      fontSize: constraints.fontSize
    })
    textConstraint = getTextPromptConstraint(textLimits)
  }

  // Build prompt based on element type
  switch (intent.elementType) {
    case 'title':
      prompt = `Generate a professional presentation title about ${context?.topic || 'business performance'}. ${textConstraint} Make it concise and impactful.`
      break
    
    case 'bullet':
      prompt = `Generate 3-5 bullet points about ${context?.topic || 'key points'}. ${textConstraint} Each point should be concise and actionable.`
      break
    
    default:
      prompt = `Generate professional presentation text about ${context?.topic || 'the topic'}. ${textConstraint} Make it clear and business-appropriate.`
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a professional presentation content writer. Generate concise, impactful content.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    })

    return response.choices[0]?.message?.content || 'Generated content'
  } catch (error) {
    console.error('Error generating text:', error)
    return getDefaultContent(intent.elementType)
  }
}

/**
 * Generate chart data
 */
async function generateChartData(
  intent: ParsedIntent,
  context?: { slideType: string; topic?: string }
): Promise<any> {
  const chartType = intent.parameters.chartType || 'bar'
  const dataPoints = intent.parameters.dataPoints || 5

  const prompt = `Generate realistic data for a ${chartType} chart about ${context?.topic || 'business metrics'} with ${dataPoints} data points.
Return JSON in this format:
{
  "data": [
    {"category": "Label", "value": number}
  ]
}`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        { role: 'system', content: 'Generate realistic business data for charts. Return valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 300
    })

    const result = response.choices[0]?.message?.content
    return result ? JSON.parse(result) : getDefaultChartData(chartType)
  } catch (error) {
    console.error('Error generating chart data:', error)
    return getDefaultChartData(chartType)
  }
}

/**
 * Generate table content
 */
async function generateTableContent(
  intent: ParsedIntent,
  context?: { slideType: string; topic?: string }
): Promise<string[][]> {
  const rows = intent.parameters.rows || 3
  const columns = intent.parameters.columns || 3

  const prompt = `Generate a ${rows}x${columns} table about ${context?.topic || 'data comparison'}.
Return as JSON array of arrays, with the first row being headers.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        { role: 'system', content: 'Generate concise table data. Return valid JSON array of arrays.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 400
    })

    const result = response.choices[0]?.message?.content
    if (result) {
      const parsed = JSON.parse(result)
      return parsed.data || parsed.table || parsed
    }
  } catch (error) {
    console.error('Error generating table:', error)
  }

  // Fallback to empty table
  return Array(rows).fill(null).map(() => Array(columns).fill(''))
}

/**
 * Fallback intent parser using pattern matching
 */
function fallbackIntentParser(message: string): ParsedIntent {
  const lower = message.toLowerCase()
  
  // Detect action
  let action: ParsedIntent['action'] = 'add'
  if (lower.includes('delete') || lower.includes('remove')) action = 'delete'
  else if (lower.includes('update') || lower.includes('change')) action = 'update'
  else if (lower.includes('select')) action = 'select'

  // Detect element type
  let elementType: ParsedIntent['elementType'] = 'text'
  if (lower.includes('chart') || lower.includes('graph')) elementType = 'chart'
  else if (lower.includes('table')) elementType = 'table'
  else if (lower.includes('shape') || lower.includes('rectangle') || lower.includes('circle')) elementType = 'shape'
  else if (lower.includes('title')) elementType = 'title'
  else if (lower.includes('bullet') || lower.includes('list')) elementType = 'bullet'

  // Extract parameters
  const parameters: ParsedIntent['parameters'] = {}
  
  // Extract numbers for table dimensions
  const numbers = message.match(/\d+/g)
  if (elementType === 'table' && numbers && numbers.length >= 2) {
    parameters.rows = parseInt(numbers[0])
    parameters.columns = parseInt(numbers[1])
  }
  
  // Extract chart type
  if (elementType === 'chart') {
    if (lower.includes('bar')) parameters.chartType = 'bar'
    else if (lower.includes('line')) parameters.chartType = 'line'
    else if (lower.includes('pie')) parameters.chartType = 'pie'
  }

  // Extract quoted content
  const quoted = message.match(/"([^"]+)"|'([^']+)'/)
  if (quoted) {
    parameters.content = quoted[1] || quoted[2]
  }

  return {
    action,
    elementType,
    parameters,
    confidence: 0.6
  }
}

/**
 * Get default content for element types
 */
function getDefaultContent(elementType: string): string {
  switch (elementType) {
    case 'title':
      return 'Presentation Title'
    case 'bullet':
      return '• First point\n• Second point\n• Third point'
    default:
      return 'Add your content here'
  }
}

/**
 * Get default chart data
 */
function getDefaultChartData(chartType: string): any {
  switch (chartType) {
    case 'pie':
      return {
        data: [
          { category: 'Category A', value: 35 },
          { category: 'Category B', value: 25 },
          { category: 'Category C', value: 20 },
          { category: 'Category D', value: 15 },
          { category: 'Category E', value: 5 }
        ]
      }
    case 'line':
      return {
        data: [
          { category: 'Jan', value: 12 },
          { category: 'Feb', value: 19 },
          { category: 'Mar', value: 15 },
          { category: 'Apr', value: 25 },
          { category: 'May', value: 22 }
        ]
      }
    default:
      return {
        data: [
          { category: 'Item 1', value: 120 },
          { category: 'Item 2', value: 95 },
          { category: 'Item 3', value: 140 },
          { category: 'Item 4', value: 110 }
        ]
      }
  }
}