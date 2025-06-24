# Data Consistency Audit for Supabase Integration

## Overview
This document audits all data fields and types across the application to ensure consistency before Supabase integration.

## 1. User Data Model Issues

### Current State
- **User type** (`/types/user.ts`):
  - firstName, lastName, email, initials, tier, avatar
- **UserSettings type** (`/types/user.ts`):
  - emailNotifications, theme

### Issues Found:
1. **Missing user ID field** - No unique identifier for users
2. **Missing timestamps** - No createdAt, updatedAt fields
3. **Missing authentication fields** - No password hash, auth tokens
4. **Tier field is optional but used everywhere** - Should be required with default value
5. **No user role/permissions field** - Needed for access control

### Recommended User Schema:
```typescript
interface User {
  id: string // UUID
  firstName: string
  lastName: string
  email: string
  initials: string
  tier: 'Free' | 'Pro' | 'Enterprise' // Make required with default
  avatar?: string | null
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}

interface UserSettings {
  id: string
  userId: string // Foreign key
  emailNotifications: boolean
  theme: 'light' | 'dark' | 'system'
  createdAt: Date
  updatedAt: Date
}
```

## 2. Presentation Data Model Issues

### Current State
- No unified Presentation type defined
- Mock data uses different structures in different places
- Presentation metadata scattered across components

### Issues Found:
1. **No presentation ID or user ownership**
2. **Inconsistent status values** - Some use "Published", others use "Draft"
3. **Missing sharing/collaboration fields**
4. **No version control fields**
5. **Category field inconsistent** - Sometimes string, sometimes predefined

### Recommended Presentation Schema:
```typescript
interface Presentation {
  id: string
  userId: string // Owner
  title: string
  description?: string
  thumbnail?: string
  status: 'draft' | 'published' | 'archived'
  category: 'business' | 'education' | 'marketing' | 'sales' | 'other'
  slideCount: number
  isPublic: boolean
  sharedWith: string[] // User IDs
  createdAt: Date
  updatedAt: Date
  lastAccessedAt: Date
}
```

## 3. Slide Data Model Issues

### Current State
- SlideElement interface well-defined
- But no Slide container type
- No slide ordering mechanism

### Issues Found:
1. **No slide ID or presentation relationship**
2. **No slide order/position field**
3. **No slide layout/template field**
4. **No slide notes field**
5. **No slide transitions defined**

### Recommended Slide Schema:
```typescript
interface Slide {
  id: string
  presentationId: string
  order: number
  layout: 'title' | 'content' | 'two-column' | 'blank'
  notes?: string
  transition?: 'none' | 'fade' | 'slide'
  background?: {
    color?: string
    image?: string
    opacity?: number
  }
  createdAt: Date
  updatedAt: Date
}

interface SlideElement {
  id: string
  slideId: string
  // ... existing fields remain the same
  createdAt: Date
  updatedAt: Date
}
```

## 4. Template Data Model Issues

### Current State
- Template structure only exists in mock data
- No formal type definition

### Issues Found:
1. **No template versioning**
2. **Icon field uses component reference** - Can't be stored in DB
3. **No template preview/thumbnail system**
4. **No template ownership** - Who created it?

### Recommended Template Schema:
```typescript
interface Template {
  id: string
  title: string
  category: string
  description: string
  slideCount: number
  rating: number
  useCount: number
  iconName: string // Store icon name as string
  color: string
  tags: string[]
  isPublic: boolean
  createdBy?: string // User ID for custom templates
  thumbnailUrl?: string
  version: string
  createdAt: Date
  updatedAt: Date
}
```

## 5. Chat/AI Interaction Issues

### Current State
- ChatMessage type exists but minimal
- No persistence of chat history

### Issues Found:
1. **No chat session concept** - All messages loose
2. **No user/presentation association**
3. **No AI model version tracking**
4. **No token usage tracking**

### Recommended Chat Schema:
```typescript
interface ChatSession {
  id: string
  presentationId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

interface ChatMessage {
  id: string
  sessionId: string
  type: 'user' | 'ai'
  message: string
  metadata?: {
    model?: string
    tokensUsed?: number
    elementId?: string // If message relates to specific element
  }
  createdAt: Date
}
```

## 6. File/Asset Management Issues

### Current State
- File uploads mentioned but no structure
- No asset management system

### Issues Found:
1. **No file metadata storage**
2. **No file size/type validation**
3. **No file ownership tracking**
4. **No CDN/storage location tracking**

### Recommended File Schema:
```typescript
interface FileAsset {
  id: string
  userId: string
  presentationId?: string
  fileName: string
  fileType: string
  fileSize: number
  storageUrl: string
  thumbnailUrl?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}
```

## 7. Subscription/Billing Issues

### Current State
- User has tier field but no subscription tracking
- Mock stats for usage limits

### Issues Found:
1. **No subscription period tracking**
2. **No usage metrics storage**
3. **No payment history**
4. **No feature flags per tier**

### Recommended Subscription Schema:
```typescript
interface Subscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'cancelled' | 'expired' | 'trial'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelledAt?: Date
  createdAt: Date
  updatedAt: Date
}

interface UsageMetrics {
  id: string
  userId: string
  metric: 'presentations' | 'slides' | 'ai_requests' | 'storage'
  value: number
  period: Date // Month/year
  createdAt: Date
}
```

## 8. General Issues Across All Models

1. **No soft delete mechanism** - Need deletedAt fields
2. **No audit trail** - Who modified what and when
3. **No data validation rules defined**
4. **No indexes defined for common queries**
5. **No cascade delete rules defined**

## 9. Mock Data Inconsistencies

1. **Date formats vary** - Some use "3 days ago", others use actual dates
2. **ID fields are numbers** - Should be UUIDs for Supabase
3. **Image URLs use placeholders** - Need real asset management
4. **Status values inconsistent** - "In Progress" vs "in_progress"

## 10. Component-Database Mismatches

1. **UserDropdown expects different fields than User type**
2. **Dashboard shows stats not stored anywhere**
3. **Presentation editor has no save mechanism**
4. **Templates page shows data not defined in types**

## Recommendations for Supabase Preparation

1. **Create formal type definitions** for all entities
2. **Add UUID generation utility** for IDs
3. **Standardize date handling** with ISO strings
4. **Create data validation schemas** using Zod
5. **Define database relationships** clearly
6. **Add error handling** for database operations
7. **Create mock data factories** that match schemas
8. **Add database migration strategy**
9. **Define Row Level Security policies**
10. **Create database indexes** for common queries

## Next Steps

1. Create a `/types/database.ts` file with all schemas
2. Update existing types to match database schemas
3. Create validation schemas with Zod
4. Update mock data to use consistent formats
5. Add database utility functions
6. Create Supabase table definitions
7. Define RLS policies
8. Create seed data scripts