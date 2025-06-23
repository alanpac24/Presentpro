export interface User {
  name: string
  email: string
  initials: string
  tier?: string
  avatar?: string | null
  position?: string
  company?: string
  bio?: string
  phone?: string
  location?: string
  website?: string
  joinDate?: string
}

export interface UserSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  autoSave: boolean
  darkMode: boolean
  language: string
  theme: string
}