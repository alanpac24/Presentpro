// Database types for Supabase integration
// This file defines all the types that will map to database tables

// User related types
export interface DatabaseUser {
  id: string // UUID
  firstName: string
  lastName: string
  email: string
  initials: string
  tier: 'Free' | 'Pro' | 'Enterprise'
  avatar?: string | null
  role: 'user' | 'admin'
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
  deletedAt?: string | null // Soft delete
}

export interface DatabaseUserSettings {
  id: string
  userId: string // Foreign key to users.id
  emailNotifications: boolean
  theme: 'light' | 'dark' | 'system'
  createdAt: string
  updatedAt: string
}

// Presentation related types
export interface DatabasePresentation {
  id: string
  userId: string // Foreign key to users.id
  title: string
  description?: string | null
  thumbnail?: string | null
  status: 'draft' | 'published' | 'archived'
  category: 'business' | 'education' | 'marketing' | 'sales' | 'other'
  slideCount: number
  isPublic: boolean
  sharedWith: string[] // Array of user IDs
  templateId?: string | null // If created from template
  createdAt: string
  updatedAt: string
  lastAccessedAt: string
  deletedAt?: string | null
}

// Slide related types
export interface DatabaseSlide {
  id: string
  presentationId: string // Foreign key to presentations.id
  order: number
  layout: 'title' | 'content' | 'two-column' | 'blank' | 'custom'
  notes?: string | null
  transition: 'none' | 'fade' | 'slide' | 'zoom'
  background?: {
    color?: string
    image?: string
    opacity?: number
  } | null
  createdAt: string
  updatedAt: string
}

export interface DatabaseSlideElement {
  id: string
  slideId: string // Foreign key to slides.id
  type: 'title' | 'text' | 'shape' | 'chart' | 'timeline' | 'image'
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  style: {
    fontSize: number
    fontWeight: string
    fontStyle: string
    textDecoration: string
    color: string
    backgroundColor: string
    borderColor: string
    borderWidth: number
    textAlign: 'left' | 'center' | 'right' | 'justify'
    fontFamily: string
    opacity: number
    borderRadius: number
    lineStyle?: 'solid' | 'dashed' | 'dotted'
    lineThickness?: number
  }
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow' | null
  rotation?: number
  lineOrientation?: 'horizontal' | 'vertical' | 'diagonal-up' | 'diagonal-down' | null
  zIndex: number
  createdAt: string
  updatedAt: string
}

// Template related types
export interface DatabaseTemplate {
  id: string
  title: string
  category: 'business' | 'education' | 'marketing' | 'sales' | 'creative' | 'other'
  description: string
  slideCount: number
  rating: number
  useCount: number
  iconName: string // Store icon name as string instead of component
  color: string
  tags: string[]
  isPublic: boolean
  createdBy?: string | null // User ID for custom templates
  thumbnailUrl?: string | null
  version: string
  createdAt: string
  updatedAt: string
}

// Chat/AI related types
export interface DatabaseChatSession {
  id: string
  presentationId: string // Foreign key to presentations.id
  userId: string // Foreign key to users.id
  createdAt: string
  updatedAt: string
}

export interface DatabaseChatMessage {
  id: string
  sessionId: string // Foreign key to chat_sessions.id
  type: 'user' | 'ai'
  message: string
  metadata?: {
    model?: string
    tokensUsed?: number
    elementId?: string // If message relates to specific element
  } | null
  createdAt: string
}

// File/Asset related types
export interface DatabaseFileAsset {
  id: string
  userId: string // Foreign key to users.id
  presentationId?: string | null // Foreign key to presentations.id
  fileName: string
  fileType: string
  fileSize: number // in bytes
  storageUrl: string
  thumbnailUrl?: string | null
  metadata?: Record<string, any> | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

// Subscription/Billing related types
export interface DatabaseSubscription {
  id: string
  userId: string // Foreign key to users.id
  planId: string // Foreign key to plans.id
  status: 'active' | 'cancelled' | 'expired' | 'trial'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelledAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface DatabasePlan {
  id: string
  name: string
  price: number // in cents
  interval: 'monthly' | 'yearly'
  features: {
    presentations: number // -1 for unlimited
    slidesPerPresentation: number // -1 for unlimited
    aiRequests: number // -1 for unlimited
    storage: number // in MB, -1 for unlimited
    customTemplates: boolean
    collaboration: boolean
    analytics: boolean
    priority_support: boolean
  }
  stripeProductId?: string | null
  stripePriceId?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DatabaseUsageMetrics {
  id: string
  userId: string // Foreign key to users.id
  metric: 'presentations' | 'slides' | 'ai_requests' | 'storage'
  value: number
  period: string // YYYY-MM format
  createdAt: string
}

// Activity/Audit related types
export interface DatabaseActivityLog {
  id: string
  userId: string // Foreign key to users.id
  action: string // e.g., 'created_presentation', 'updated_slide', etc.
  resourceType: 'presentation' | 'slide' | 'template' | 'user' | 'subscription'
  resourceId: string
  metadata?: Record<string, any> | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: string
}

// Sharing/Collaboration types
export interface DatabaseShare {
  id: string
  presentationId: string // Foreign key to presentations.id
  sharedBy: string // Foreign key to users.id
  sharedWith: string // Foreign key to users.id or email
  permission: 'view' | 'edit' | 'admin'
  expiresAt?: string | null
  createdAt: string
  updatedAt: string
}

// Helper types for database operations
export type DatabaseRow<T> = T & {
  id: string
  createdAt: string
  updatedAt: string
}

export type DatabaseInsert<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
export type DatabaseUpdate<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>

// Enum types for consistency
export const UserTier = {
  FREE: 'Free',
  PRO: 'Pro',
  ENTERPRISE: 'Enterprise'
} as const

export const PresentationStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
} as const

export const PresentationCategory = {
  BUSINESS: 'business',
  EDUCATION: 'education',
  MARKETING: 'marketing',
  SALES: 'sales',
  OTHER: 'other'
} as const