export interface User {
  id?: string // Preparing for Supabase integration
  firstName: string
  lastName: string
  email: string
  initials: string
  tier: 'Free' | 'Pro' | 'Professional' | 'Enterprise'
  avatar?: string | null
  createdAt?: Date // Preparing for Supabase
  updatedAt?: Date // Preparing for Supabase
}

export interface UserSettings {
  emailNotifications: boolean
  theme: 'light' | 'dark' | 'system'
}