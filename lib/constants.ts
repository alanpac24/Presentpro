import { User } from "@/types/user"

export const mockUser: User = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@company.com",
  initials: "JD",
  tier: "Free",
  avatar: null,
}

export const mockStats = {
  presentationsCreated: 2,
  monthlyLimit: 3, // Free tier limit
}

// Presentation limits by tier
export const PRESENTATION_LIMITS = {
  Free: 3,
  Pro: 10,
  Professional: 50,
  Enterprise: Infinity,
}