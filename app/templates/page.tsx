"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Presentation, ArrowLeft, Search, Filter, Star, Clock, TrendingUp, 
  Users, Briefcase, GraduationCap, BarChart, Lightbulb, Target,
  Heart, Globe, Palette, Megaphone
} from "lucide-react"
import { PublicHeader } from "@/components/public-header"

const templates = [
  {
    id: 1,
    title: "Modern Business Pitch",
    category: "Business",
    description: "Professional template for investor pitches and business proposals",
    slides: 15,
    rating: 4.8,
    uses: 2340,
    icon: Briefcase,
    color: "blue",
    tags: ["Professional", "Minimal", "Charts"]
  },
  {
    id: 2,
    title: "Creative Portfolio",
    category: "Creative",
    description: "Showcase your work with style and visual impact",
    slides: 12,
    rating: 4.9,
    uses: 1856,
    icon: Palette,
    color: "purple",
    tags: ["Portfolio", "Visual", "Modern"]
  },
  {
    id: 3,
    title: "Educational Workshop",
    category: "Education",
    description: "Engage students with interactive learning materials",
    slides: 20,
    rating: 4.7,
    uses: 3210,
    icon: GraduationCap,
    color: "green",
    tags: ["Interactive", "Educational", "Clear"]
  },
  {
    id: 4,
    title: "Sales Performance",
    category: "Sales",
    description: "Data-driven templates for sales reports and analytics",
    slides: 18,
    rating: 4.6,
    uses: 1523,
    icon: BarChart,
    color: "orange",
    tags: ["Data", "Analytics", "Results"]
  },
  {
    id: 5,
    title: "Startup Pitch Deck",
    category: "Business",
    description: "Get funding with a compelling startup story",
    slides: 16,
    rating: 4.9,
    uses: 4120,
    icon: Lightbulb,
    color: "yellow",
    tags: ["Startup", "Pitch", "Innovation"]
  },
  {
    id: 6,
    title: "Marketing Campaign",
    category: "Marketing",
    description: "Launch successful campaigns with persuasive presentations",
    slides: 14,
    rating: 4.7,
    uses: 2890,
    icon: Megaphone,
    color: "red",
    tags: ["Marketing", "Campaign", "Branding"]
  },
  {
    id: 7,
    title: "Team Meeting",
    category: "Business",
    description: "Keep your team aligned with clear meeting presentations",
    slides: 10,
    rating: 4.5,
    uses: 5230,
    icon: Users,
    color: "indigo",
    tags: ["Team", "Meeting", "Simple"]
  },
  {
    id: 8,
    title: "Product Launch",
    category: "Marketing",
    description: "Create excitement for your new product release",
    slides: 22,
    rating: 4.8,
    uses: 1780,
    icon: Target,
    color: "pink",
    tags: ["Product", "Launch", "Exciting"]
  }
]

const categories = [
  { name: "All", count: templates.length },
  { name: "Business", count: 3 },
  { name: "Creative", count: 1 },
  { name: "Education", count: 1 },
  { name: "Sales", count: 1 },
  { name: "Marketing", count: 2 }
]

export default function TemplatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("popular")

  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "popular") return b.uses - a.uses
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "recent") return b.id - a.id
      return 0
    })

  const handleTemplateSelect = (templateId: number) => {
    // In a real app, this would pass the template ID to the presentation planner
    router.push(`/presentation-planner?template=${templateId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-4">Choose Your Template</h1>
          <p className="text-lg text-gray-600 font-light">Start with a professionally designed template and make it your own</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.name
                        ? "bg-gray-900 text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className={`text-xs ${
                      selectedCategory === category.name ? "text-gray-300" : "text-gray-500"
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="recent">Recently Added</option>
              </select>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white border-gray-200"
              />
            </div>

            {/* Templates Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const Icon = template.icon
                return (
                  <Card
                    key={template.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className={`h-32 bg-gradient-to-br from-${template.color}-400 to-${template.color}-600 flex items-center justify-center`}>
                      <Icon className="w-16 h-16 text-white opacity-80" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {template.slides} slides
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{template.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">{template.uses.toLocaleString()} uses</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                        Use This Template
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No templates found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}