/**
 * Simplified AI utilities without external dependencies
 */

export interface SimpleIntent {
  action: 'add' | 'update' | 'delete' | 'help'
  target?: string
  content?: string
}

/**
 * Simple pattern-based intent parser
 */
export function parseIntent(message: string): SimpleIntent {
  const lower = message.toLowerCase().trim()
  
  // Add patterns
  if (lower.includes('add') || lower.includes('create') || lower.includes('insert')) {
    return {
      action: 'add',
      target: extractTarget(lower),
      content: extractContent(message)
    }
  }
  
  // Update patterns
  if (lower.includes('update') || lower.includes('change') || lower.includes('edit')) {
    return {
      action: 'update',
      target: extractTarget(lower),
      content: extractContent(message)
    }
  }
  
  // Delete patterns
  if (lower.includes('delete') || lower.includes('remove')) {
    return {
      action: 'delete',
      target: extractTarget(lower)
    }
  }
  
  // Default to help
  return { action: 'help' }
}

/**
 * Extract target element from message
 */
function extractTarget(message: string): string {
  const targets = ['title', 'text', 'bullet', 'chart', 'table', 'shape', 'image']
  
  for (const target of targets) {
    if (message.includes(target)) {
      return target
    }
  }
  
  // Check for bullet points
  if (message.includes('bullet') || message.includes('list')) {
    return 'bullet'
  }
  
  return 'text' // default
}

/**
 * Extract content from message
 */
function extractContent(message: string): string {
  // Try to extract quoted content
  const quotedMatch = message.match(/["']([^"']+)["']/)
  if (quotedMatch) {
    return quotedMatch[1]
  }
  
  // Try to extract content after common keywords
  const patterns = [
    /(?:saying|with text|with content|titled?)\s+(.+)/i,
    /(?:add|create|insert)\s+(?:a\s+)?(?:\w+\s+)+(.+)/i
  ]
  
  for (const pattern of patterns) {
    const match = message.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  
  return ''
}

/**
 * Generate simple responses without AI
 */
export function generateResponse(intent: SimpleIntent): string {
  switch (intent.action) {
    case 'add':
      if (intent.target && intent.content) {
        return `Added ${intent.target} with content: "${intent.content}"`
      }
      return `Please specify what to add and its content`
      
    case 'update':
      if (intent.target) {
        return `Select the ${intent.target} you want to update`
      }
      return `Please specify what to update`
      
    case 'delete':
      if (intent.target) {
        return `Select the ${intent.target} you want to delete`
      }
      return `Please specify what to delete`
      
    case 'help':
    default:
      return `I can help you:
• Add elements (e.g., "Add title saying Q4 Results")
• Update elements (e.g., "Update the selected text")
• Delete elements (e.g., "Delete the chart")

Try: "Add bullet points with quarterly goals"`
  }
}

/**
 * Generate sample content based on type
 */
export function generateSampleContent(type: string, context?: any): string {
  const samples: Record<string, string[]> = {
    title: [
      'Q4 Business Review',
      'Strategic Initiative Update',
      'Market Analysis',
      'Project Roadmap'
    ],
    text: [
      'Key insights from our analysis show significant growth potential',
      'Our strategic approach focuses on three core pillars',
      'Market trends indicate a shift towards digital solutions',
      'Implementation timeline spans across four quarters'
    ],
    bullet: [
      '• Increase market share by 15%\n• Launch new product line\n• Expand into 3 new regions',
      '• Streamline operations\n• Reduce costs by 20%\n• Improve efficiency metrics',
      '• Customer satisfaction: 95%\n• Revenue growth: 25% YoY\n• Team expansion: 30 new hires'
    ]
  }
  
  const contentArray = samples[type] || samples.text
  return contentArray[Math.floor(Math.random() * contentArray.length)]
}