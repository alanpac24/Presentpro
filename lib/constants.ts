import { User } from "@/types/user"

export const mockUser: User & {
  lastActive?: string
  presentationsCreated?: number
  totalSlides?: number
  totalViews?: number
} = {
  name: "John Doe",
  email: "john.doe@company.com",
  initials: "JD",
  tier: "Free",
  avatar: null,
  phone: "+1 (555) 123-4567",
  company: "Acme Corporation",
  location: "San Francisco, CA",
  website: "johndoe.com",
  bio: "Product designer passionate about creating intuitive user experiences and beautiful presentations.",
  joinDate: "January 2024",
  lastActive: "2 hours ago",
  presentationsCreated: 47,
  totalSlides: 892,
  totalViews: 15234,
}

export const mockStats = {
  presentationsCreated: 2,
  monthlyLimit: 3,
}