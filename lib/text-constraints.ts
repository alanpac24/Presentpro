/**
 * Utilities for calculating text constraints based on container dimensions
 */

interface TextConstraints {
  maxCharacters: number
  maxWords: number
  maxLines: number
  charsPerLine: number
}

interface CalculateConstraintsOptions {
  width: number
  height: number
  fontSize: number
  fontFamily?: string
  lineHeight?: number
  padding?: number
}

/**
 * Calculate approximate character width for different font families
 * These are rough estimates - actual width varies by character
 */
const FONT_CHAR_WIDTH_RATIOS: Record<string, number> = {
  'Inter': 0.55,
  'Arial': 0.6,
  'Helvetica': 0.6,
  'Times New Roman': 0.5,
  'Georgia': 0.65,
  'Roboto': 0.58,
  'Open Sans': 0.6,
  'Lato': 0.58,
  'Montserrat': 0.65,
  'Poppins': 0.62,
  'default': 0.6
}

/**
 * Calculate text constraints based on container dimensions
 */
export function calculateTextConstraints({
  width,
  height,
  fontSize,
  fontFamily = 'Inter',
  lineHeight = 1.5,
  padding = 16
}: CalculateConstraintsOptions): TextConstraints {
  // Account for padding
  const effectiveWidth = width - (padding * 2)
  const effectiveHeight = height - (padding * 2)
  
  // Get character width ratio for font
  const charWidthRatio = FONT_CHAR_WIDTH_RATIOS[fontFamily] || FONT_CHAR_WIDTH_RATIOS.default
  
  // Calculate average character width
  const avgCharWidth = fontSize * charWidthRatio
  
  // Calculate line metrics
  const actualLineHeight = fontSize * lineHeight
  const charsPerLine = Math.floor(effectiveWidth / avgCharWidth)
  const maxLines = Math.floor(effectiveHeight / actualLineHeight)
  
  // Calculate totals
  const maxCharacters = charsPerLine * maxLines
  const avgWordLength = 5 // Average English word length
  const maxWords = Math.floor(maxCharacters / (avgWordLength + 1)) // +1 for space
  
  return {
    maxCharacters,
    maxWords,
    maxLines,
    charsPerLine
  }
}

/**
 * Generate a prompt constraint string for OpenAI
 */
export function getTextPromptConstraint(constraints: TextConstraints): string {
  return `Generate text that is approximately ${constraints.maxWords} words or ${constraints.maxCharacters} characters, fitting within ${constraints.maxLines} lines.`
}

/**
 * Truncate text to fit within constraints
 */
export function truncateToFit(text: string, constraints: TextConstraints): string {
  // First check character limit
  if (text.length <= constraints.maxCharacters) {
    return text
  }
  
  // Truncate and add ellipsis
  const truncated = text.substring(0, constraints.maxCharacters - 3) + '...'
  
  // Try to break at word boundary
  const lastSpace = truncated.lastIndexOf(' ')
  if (lastSpace > constraints.maxCharacters * 0.8) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated
}

/**
 * Calculate constraints for different element types
 */
export const ELEMENT_TYPE_CONSTRAINTS = {
  title: { fontSize: 32, lineHeight: 1.3, padding: 20 },
  heading: { fontSize: 24, lineHeight: 1.4, padding: 16 },
  body: { fontSize: 16, lineHeight: 1.5, padding: 16 },
  bullet: { fontSize: 16, lineHeight: 1.8, padding: 16 },
  caption: { fontSize: 14, lineHeight: 1.4, padding: 12 }
}

/**
 * Get constraints for a specific element type
 */
export function getElementTypeConstraints(
  elementType: keyof typeof ELEMENT_TYPE_CONSTRAINTS,
  width: number,
  height: number,
  fontFamily?: string
): TextConstraints {
  const typeConfig = ELEMENT_TYPE_CONSTRAINTS[elementType]
  return calculateTextConstraints({
    width,
    height,
    fontSize: typeConfig.fontSize,
    lineHeight: typeConfig.lineHeight,
    padding: typeConfig.padding,
    fontFamily
  })
}

/**
 * Format text for bullet points
 */
export function formatBulletPoints(points: string[], maxPerPoint: number): string {
  return points
    .map(point => {
      const trimmed = point.substring(0, maxPerPoint)
      return `• ${trimmed}`
    })
    .join('\n')
}

/**
 * Estimate optimal font size for text to fit in container
 */
export function estimateOptimalFontSize(
  text: string,
  width: number,
  height: number,
  options: {
    minFontSize?: number
    maxFontSize?: number
    fontFamily?: string
    lineHeight?: number
    padding?: number
  } = {}
): number {
  const {
    minFontSize = 12,
    maxFontSize = 48,
    fontFamily = 'Inter',
    lineHeight = 1.5,
    padding = 16
  } = options
  
  // Binary search for optimal font size
  let low = minFontSize
  let high = maxFontSize
  let optimal = minFontSize
  
  while (low <= high) {
    const mid = Math.floor((low + high) / 2)
    const constraints = calculateTextConstraints({
      width,
      height,
      fontSize: mid,
      fontFamily,
      lineHeight,
      padding
    })
    
    if (text.length <= constraints.maxCharacters) {
      optimal = mid
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
  
  return optimal
}