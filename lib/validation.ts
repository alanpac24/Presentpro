// Input validation utilities to prevent XSS and ensure data integrity

/**
 * Sanitizes a string input by escaping HTML characters
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\//g, "&#x2F;")
}

/**
 * Validates and sanitizes a presentation title
 */
export function validatePresentationTitle(title: string): { 
  isValid: boolean; 
  sanitized: string; 
  error?: string 
} {
  const trimmed = title.trim()
  
  if (!trimmed) {
    return { isValid: false, sanitized: "", error: "Title cannot be empty" }
  }
  
  if (trimmed.length > 100) {
    return { isValid: false, sanitized: trimmed, error: "Title must be 100 characters or less" }
  }
  
  if (trimmed.length < 3) {
    return { isValid: false, sanitized: trimmed, error: "Title must be at least 3 characters" }
  }
  
  const sanitized = sanitizeInput(trimmed)
  return { isValid: true, sanitized }
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters")
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validates and sanitizes markdown content
 */
export function validateMarkdownContent(content: string, maxLength = 10000): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  if (content.length > maxLength) {
    return { 
      isValid: false, 
      sanitized: content, 
      error: `Content exceeds maximum length of ${maxLength} characters` 
    }
  }
  
  // Basic sanitization for markdown - preserve formatting but escape script tags
  const sanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    
  return { isValid: true, sanitized }
}