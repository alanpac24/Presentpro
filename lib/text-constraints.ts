/**
 * Simple text constraints for different element types
 */

export interface TextConstraints {
  minLength: number
  maxLength: number
  maxLines: number
  recommendedLength: number
}

export const TEXT_CONSTRAINTS: Record<string, TextConstraints> = {
  title: {
    minLength: 3,
    maxLength: 100,
    maxLines: 2,
    recommendedLength: 50
  },
  text: {
    minLength: 10,
    maxLength: 500,
    maxLines: 10,
    recommendedLength: 150
  },
  bullet: {
    minLength: 5,
    maxLength: 200,
    maxLines: 1,
    recommendedLength: 50
  }
}

/**
 * Get constraints for an element type
 */
export function getConstraints(elementType: string): TextConstraints {
  return TEXT_CONSTRAINTS[elementType] || TEXT_CONSTRAINTS.text
}

/**
 * Validate text against constraints
 */
export function validateText(text: string, elementType: string): {
  valid: boolean
  message?: string
} {
  const constraints = getConstraints(elementType)
  
  if (text.length < constraints.minLength) {
    return {
      valid: false,
      message: `Text must be at least ${constraints.minLength} characters`
    }
  }
  
  if (text.length > constraints.maxLength) {
    return {
      valid: false,
      message: `Text must be less than ${constraints.maxLength} characters`
    }
  }
  
  const lines = text.split('\n').length
  if (lines > constraints.maxLines) {
    return {
      valid: false,
      message: `Text must have at most ${constraints.maxLines} lines`
    }
  }
  
  return { valid: true }
}

/**
 * Truncate text to fit constraints
 */
export function truncateText(text: string, elementType: string): string {
  const constraints = getConstraints(elementType)
  
  if (text.length <= constraints.maxLength) {
    return text
  }
  
  return text.substring(0, constraints.maxLength - 3) + '...'
}