// Utility functions to map between application types and database types
import { User } from '@/types/user'
import { DatabaseUser, DatabasePresentation, DatabaseSlideElement } from '@/types/database'

// User mappers
export function mapDatabaseUserToUser(dbUser: DatabaseUser): User {
  return {
    firstName: dbUser.firstName,
    lastName: dbUser.lastName,
    email: dbUser.email,
    initials: dbUser.initials,
    tier: dbUser.tier,
    avatar: dbUser.avatar,
  }
}

export function mapUserToDatabaseUser(
  user: User,
  additionalData?: {
    id?: string
    role?: 'user' | 'admin'
    createdAt?: string
    updatedAt?: string
  }
): DatabaseUser {
  const now = new Date().toISOString()
  return {
    id: additionalData?.id || generateUUID(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    initials: user.initials,
    tier: (user.tier as 'Free' | 'Pro' | 'Enterprise') || 'Free',
    avatar: user.avatar,
    role: additionalData?.role || 'user',
    createdAt: additionalData?.createdAt || now,
    updatedAt: additionalData?.updatedAt || now,
  }
}

// Presentation mappers
export function mapMockPresentationToDatabasePresentation(
  mockPresentation: any,
  userId: string
): DatabasePresentation {
  const now = new Date().toISOString()
  return {
    id: generateUUID(),
    userId,
    title: mockPresentation.title,
    description: mockPresentation.description,
    thumbnail: mockPresentation.thumbnail,
    status: normalizeStatus(mockPresentation.status),
    category: normalizeCategory(mockPresentation.category),
    slideCount: mockPresentation.slideCount,
    isPublic: false,
    sharedWith: [],
    createdAt: normalizeDateString(mockPresentation.createdDate) || now,
    updatedAt: normalizeDateString(mockPresentation.lastModified) || now,
    lastAccessedAt: now,
  }
}

// SlideElement mappers
export function mapSlideElementToDatabaseSlideElement(
  element: any,
  slideId: string
): DatabaseSlideElement {
  const now = new Date().toISOString()
  return {
    id: element.id || generateUUID(),
    slideId,
    type: element.type,
    content: element.content,
    position: element.position,
    size: element.size,
    style: element.style,
    shapeType: element.shapeType,
    rotation: element.rotation,
    lineOrientation: element.lineOrientation,
    zIndex: element.zIndex,
    createdAt: now,
    updatedAt: now,
  }
}

// Helper functions
function generateUUID(): string {
  // Simple UUID v4 generator (for demo purposes)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function normalizeStatus(status: string): 'draft' | 'published' | 'archived' {
  const normalized = status.toLowerCase().replace(/\s+/g, '')
  switch (normalized) {
    case 'published':
      return 'published'
    case 'archived':
      return 'archived'
    case 'draft':
    case 'inprogress':
    case 'editing':
    default:
      return 'draft'
  }
}

function normalizeCategory(category: string): 'business' | 'education' | 'marketing' | 'sales' | 'other' {
  const normalized = category.toLowerCase()
  switch (normalized) {
    case 'business':
      return 'business'
    case 'education':
      return 'education'
    case 'marketing':
      return 'marketing'
    case 'sales':
      return 'sales'
    default:
      return 'other'
  }
}

function normalizeDateString(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined
  
  // Handle relative dates like "3 days ago"
  if (dateStr.includes('ago')) {
    const match = dateStr.match(/(\d+)\s*(day|hour|minute|second)s?\s*ago/)
    if (match) {
      const [, amount, unit] = match
      const date = new Date()
      switch (unit) {
        case 'day':
          date.setDate(date.getDate() - parseInt(amount))
          break
        case 'hour':
          date.setHours(date.getHours() - parseInt(amount))
          break
        case 'minute':
          date.setMinutes(date.getMinutes() - parseInt(amount))
          break
        case 'second':
          date.setSeconds(date.getSeconds() - parseInt(amount))
          break
      }
      return date.toISOString()
    }
  }
  
  // Try to parse as date
  try {
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date.toISOString()
    }
  } catch (e) {
    // Fallback to current date
  }
  
  return new Date().toISOString()
}

// Validation helpers
export function validateDatabaseUser(user: any): user is DatabaseUser {
  return (
    typeof user.id === 'string' &&
    typeof user.firstName === 'string' &&
    typeof user.lastName === 'string' &&
    typeof user.email === 'string' &&
    typeof user.initials === 'string' &&
    ['Free', 'Pro', 'Enterprise'].includes(user.tier) &&
    ['user', 'admin'].includes(user.role) &&
    typeof user.createdAt === 'string' &&
    typeof user.updatedAt === 'string'
  )
}

export function validateDatabasePresentation(presentation: any): presentation is DatabasePresentation {
  return (
    typeof presentation.id === 'string' &&
    typeof presentation.userId === 'string' &&
    typeof presentation.title === 'string' &&
    ['draft', 'published', 'archived'].includes(presentation.status) &&
    ['business', 'education', 'marketing', 'sales', 'other'].includes(presentation.category) &&
    typeof presentation.slideCount === 'number' &&
    typeof presentation.isPublic === 'boolean' &&
    Array.isArray(presentation.sharedWith) &&
    typeof presentation.createdAt === 'string' &&
    typeof presentation.updatedAt === 'string' &&
    typeof presentation.lastAccessedAt === 'string'
  )
}