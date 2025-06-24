// Centralized mock data with consistent structure
// Ready for Supabase integration

import {
  DatabaseUser,
  DatabasePresentation,
  DatabaseTemplate,
  DatabasePlan,
  PresentationStatus,
  PresentationCategory,
  UserTier
} from '@/types/database'

// Generate consistent mock IDs (will be replaced with real UUIDs in production)
const generateMockId = (prefix: string, index: number) => 
  `${prefix}_${index.toString().padStart(8, '0')}`

// Mock Users
export const mockUsers: DatabaseUser[] = [
  {
    id: generateMockId('user', 1),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    initials: 'JD',
    tier: 'Free' as const,
    avatar: null,
    role: 'user',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  }
]

// Mock Presentations with consistent structure
export const mockPresentations: DatabasePresentation[] = [
  {
    id: generateMockId('pres', 1),
    userId: mockUsers[0].id,
    title: 'Q4 Business Review 2024',
    description: 'Quarterly business performance and strategy review',
    thumbnail: '/placeholder.svg?height=120&width=160&text=Q4+Review',
    status: 'published',
    category: 'business',
    slideCount: 24,
    isPublic: false,
    sharedWith: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    lastAccessedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: generateMockId('pres', 2),
    userId: mockUsers[0].id,
    title: 'Product Launch Strategy',
    description: 'New product launch plan and marketing strategy',
    thumbnail: '/placeholder.svg?height=120&width=160&text=Product+Launch',
    status: 'draft',
    category: 'marketing',
    slideCount: 18,
    isPublic: false,
    sharedWith: [],
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    lastAccessedAt: '2024-01-18T16:45:00Z',
  },
  {
    id: generateMockId('pres', 3),
    userId: mockUsers[0].id,
    title: 'Sales Training Deck',
    description: 'Comprehensive sales team training materials',
    thumbnail: '/placeholder.svg?height=120&width=160&text=Sales+Training',
    status: 'published',
    category: 'sales',
    slideCount: 32,
    isPublic: true,
    sharedWith: [],
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-12T13:20:00Z',
    lastAccessedAt: '2024-01-19T10:15:00Z',
  },
  {
    id: generateMockId('pres', 4),
    userId: mockUsers[0].id,
    title: 'Team Workshop',
    description: 'Interactive team building workshop presentation',
    thumbnail: '/placeholder.svg?height=120&width=160&text=Workshop',
    status: 'draft',
    category: 'education',
    slideCount: 28,
    isPublic: false,
    sharedWith: [],
    createdAt: '2024-01-08T13:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
    lastAccessedAt: '2024-01-16T11:00:00Z',
  },
]

// Mock Templates with consistent structure
export const mockTemplates: DatabaseTemplate[] = [
  {
    id: generateMockId('tmpl', 1),
    title: 'Modern Business Pitch',
    category: 'business',
    description: 'Professional template for investor pitches and business proposals',
    slideCount: 15,
    rating: 4.8,
    useCount: 2340,
    iconName: 'Briefcase',
    color: 'blue',
    tags: ['Professional', 'Minimal', 'Charts'],
    isPublic: true,
    thumbnailUrl: '/placeholder.svg?height=200&width=300&text=Business+Pitch',
    version: '1.0.0',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: generateMockId('tmpl', 2),
    title: 'Creative Portfolio',
    category: 'creative',
    description: 'Showcase your work with style and visual impact',
    slideCount: 12,
    rating: 4.9,
    useCount: 1856,
    iconName: 'Palette',
    color: 'purple',
    tags: ['Portfolio', 'Visual', 'Modern'],
    isPublic: true,
    thumbnailUrl: '/placeholder.svg?height=200&width=300&text=Portfolio',
    version: '1.0.0',
    createdAt: '2023-12-05T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: generateMockId('tmpl', 3),
    title: 'Educational Workshop',
    category: 'education',
    description: 'Engage students with interactive learning materials',
    slideCount: 20,
    rating: 4.7,
    useCount: 3210,
    iconName: 'GraduationCap',
    color: 'green',
    tags: ['Education', 'Interactive', 'Learning'],
    isPublic: true,
    thumbnailUrl: '/placeholder.svg?height=200&width=300&text=Education',
    version: '1.0.0',
    createdAt: '2023-12-10T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: generateMockId('tmpl', 4),
    title: 'Sales Presentation',
    category: 'sales',
    description: 'Convert prospects with compelling sales presentations',
    slideCount: 16,
    rating: 4.6,
    useCount: 2890,
    iconName: 'TrendingUp',
    color: 'orange',
    tags: ['Sales', 'Conversion', 'Business'],
    isPublic: true,
    thumbnailUrl: '/placeholder.svg?height=200&width=300&text=Sales',
    version: '1.0.0',
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
  },
  {
    id: generateMockId('tmpl', 5),
    title: 'Marketing Campaign',
    category: 'marketing',
    description: 'Launch successful marketing campaigns with impact',
    slideCount: 18,
    rating: 4.8,
    useCount: 2156,
    iconName: 'Megaphone',
    color: 'pink',
    tags: ['Marketing', 'Campaign', 'Strategy'],
    isPublic: true,
    thumbnailUrl: '/placeholder.svg?height=200&width=300&text=Marketing',
    version: '1.0.0',
    createdAt: '2023-12-20T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z',
  },
]

// Mock Plans with consistent structure
export const mockPlans: DatabasePlan[] = [
  {
    id: generateMockId('plan', 1),
    name: 'Free',
    price: 0,
    interval: 'monthly',
    features: {
      presentations: 3,
      slidesPerPresentation: 10,
      aiRequests: 50,
      storage: 100, // MB
      customTemplates: false,
      collaboration: false,
      analytics: false,
      priority_support: false,
    },
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: generateMockId('plan', 2),
    name: 'Pro',
    price: 2900, // $29 in cents
    interval: 'monthly',
    features: {
      presentations: -1, // unlimited
      slidesPerPresentation: 100,
      aiRequests: 1000,
      storage: 5000, // 5GB
      customTemplates: true,
      collaboration: true,
      analytics: true,
      priority_support: false,
    },
    stripeProductId: 'prod_mock_pro',
    stripePriceId: 'price_mock_pro_monthly',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: generateMockId('plan', 3),
    name: 'Enterprise',
    price: 9900, // $99 in cents
    interval: 'monthly',
    features: {
      presentations: -1, // unlimited
      slidesPerPresentation: -1, // unlimited
      aiRequests: -1, // unlimited
      storage: -1, // unlimited
      customTemplates: true,
      collaboration: true,
      analytics: true,
      priority_support: true,
    },
    stripeProductId: 'prod_mock_enterprise',
    stripePriceId: 'price_mock_enterprise_monthly',
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

// Usage statistics
export const mockUsageStats = {
  presentationsCreated: mockPresentations.filter(p => p.userId === mockUsers[0].id).length,
  monthlyLimit: mockPlans[0].features.presentations,
  aiRequestsUsed: 23,
  aiRequestsLimit: mockPlans[0].features.aiRequests,
  storageUsed: 45, // MB
  storageLimit: mockPlans[0].features.storage,
}

// Helper function to get user's presentations
export function getUserPresentations(userId: string): DatabasePresentation[] {
  return mockPresentations.filter(p => p.userId === userId)
}

// Helper function to get recent presentations
export function getRecentPresentations(limit: number = 6): DatabasePresentation[] {
  return [...mockPresentations]
    .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime())
    .slice(0, limit)
}

// Helper function to get popular templates
export function getPopularTemplates(limit: number = 6): DatabaseTemplate[] {
  return [...mockTemplates]
    .sort((a, b) => b.useCount - a.useCount)
    .slice(0, limit)
}

// Helper function to format dates consistently
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }
}