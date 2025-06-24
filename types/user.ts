export interface User {
  firstName: string
  lastName: string
  email: string
  initials: string
  tier?: string
  avatar?: string | null
}

export interface UserSettings {
  emailNotifications: boolean
  theme: 'light' | 'dark' | 'system'
}