import { User } from "@/types/user"

// Re-export app constants
export * from './app-constants'

// Function to get stored tier from localStorage
function getStoredTier(): "Free" | "Pro" | "Professional" | "Enterprise" {
  if (typeof window === 'undefined') return 'Free'
  
  try {
    const storedTier = localStorage.getItem('presentpro_user_tier')
    if (storedTier && ['Free', 'Pro', 'Professional', 'Enterprise'].includes(storedTier)) {
      return storedTier as "Free" | "Pro" | "Professional" | "Enterprise"
    }
  } catch (error) {
    console.error('Error reading tier from localStorage:', error)
  }
  
  return 'Free'
}

// Function to update tier in localStorage
export function updateUserTier(newTier: string) {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('presentpro_user_tier', newTier)
    mockUser.tier = newTier as "Free" | "Pro" | "Professional" | "Enterprise"
  } catch (error) {
    console.error('Error updating tier in localStorage:', error)
  }
}

export const mockUser: User = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@company.com",
  initials: "JD",
  tier: getStoredTier(),
  avatar: null,
}

export const mockStats = {
  presentationsCreated: 2,
  monthlyLimit: 3, // Free tier limit
}

// Presentation limits by tier (moved to app-constants as PLAN_LIMITS)
export const PRESENTATION_LIMITS = {
  Free: 3,
  Pro: 10,
  Professional: 50,
  Enterprise: Infinity,
} as const

// Edit limits by tier (moved to app-constants as PLAN_LIMITS)
export const EDIT_LIMITS = {
  Free: 5,
  Pro: 150,
  Professional: 500,
  Enterprise: Infinity,
} as const