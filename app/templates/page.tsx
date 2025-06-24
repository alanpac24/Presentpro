"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Presentation, ArrowLeft, ArrowRight, Search, Filter, Star, Clock, TrendingUp, 
  Users, Briefcase, GraduationCap, BarChart, Lightbulb, Target,
  Heart, Globe, Palette, Megaphone, FileText
} from "lucide-react"
import { PublicHeader } from "@/components/public-header"
import Image from "next/image"

// Define gradient classes to ensure Tailwind includes them
const gradientClasses = {
  blue: "from-blue-400 to-blue-600",
  purple: "from-purple-400 to-purple-600",
  green: "from-green-400 to-green-600",
  orange: "from-orange-400 to-orange-600",
  yellow: "from-yellow-400 to-yellow-600",
  red: "from-red-400 to-red-600",
  indigo: "from-indigo-400 to-indigo-600",
  pink: "from-pink-400 to-pink-600"
}

const templates = [
  {
    id: 1,
    title: "Modern Business Pitch",
    category: "Business",
    description: "Professional template for investor pitches and business proposals",
    slides: 15,
    preview: "/placeholder.svg?height=400&width=600&text=Business+Pitch",
    slideContent: [
      "Title & Company Overview",
      "Problem Statement",
      "Market Opportunity",
      "Solution Overview",
      "Product Demo",
      "Business Model",
      "Go-to-Market Strategy",
      "Competitive Analysis",
      "Team & Advisors",
      "Financial Projections",
      "Milestones & Roadmap",
      "Use of Funds",
      "Investment Ask",
      "Vision & Impact",
      "Contact Information"
    ]
  },
  {
    id: 2,
    title: "Creative Portfolio",
    category: "Creative",
    description: "Showcase your work with style and visual impact",
    slides: 12,
    preview: "/placeholder.svg?height=400&width=600&text=Portfolio",
    slideContent: [
      "Introduction & Personal Brand",
      "Skills & Expertise",
      "Featured Project 1",
      "Featured Project 2",
      "Featured Project 3",
      "Case Study Deep Dive",
      "Process & Methodology",
      "Client Testimonials",
      "Awards & Recognition",
      "Services Offered",
      "Pricing Structure",
      "Contact & Next Steps"
    ]
  },
  {
    id: 3,
    title: "Educational Workshop",
    category: "Education",
    description: "Engage students with interactive learning materials",
    slides: 20,
    preview: "/placeholder.svg?height=400&width=600&text=Workshop",
    slideContent: [
      "Welcome & Introduction",
      "Learning Objectives",
      "Agenda Overview",
      "Module 1: Foundation",
      "Interactive Exercise 1",
      "Module 2: Core Concepts",
      "Case Study Analysis",
      "Group Discussion",
      "Module 3: Advanced Topics",
      "Hands-on Activity",
      "Real-world Applications",
      "Q&A Session",
      "Key Takeaways",
      "Resources & References",
      "Next Steps & Homework"
    ]
  },
  {
    id: 4,
    title: "Sales Performance",
    category: "Sales",
    description: "Data-driven templates for sales reports and analytics",
    slides: 18,
    preview: "/placeholder.svg?height=400&width=600&text=Sales+Report",
    slideContent: [
      "Executive Summary",
      "Sales Overview Dashboard",
      "Revenue Performance",
      "Sales by Region",
      "Product Performance",
      "Customer Segments",
      "Sales Team Performance",
      "Pipeline Analysis",
      "Win/Loss Analysis",
      "Customer Acquisition Cost",
      "Lifetime Value Metrics",
      "Competitive Landscape",
      "Market Trends",
      "Challenges & Solutions",
      "Action Plan",
      "Next Quarter Targets"
    ]
  },
  {
    id: 5,
    title: "Startup Pitch Deck",
    category: "Business",
    description: "Get funding with a compelling startup story",
    slides: 16,
    preview: "/placeholder.svg?height=400&width=600&text=Startup+Pitch",
    slideContent: [
      "Title & Tagline",
      "The Problem",
      "Our Solution",
      "Market Size & Opportunity",
      "Product Overview",
      "Technology & Innovation",
      "Business Model",
      "Marketing & Sales Strategy",
      "Competition",
      "Competitive Advantages",
      "Team",
      "Traction & Milestones",
      "Financial Projections",
      "Funding Ask & Use",
      "Vision & Exit Strategy",
      "Thank You & Contact"
    ]
  },
  {
    id: 6,
    title: "Marketing Campaign",
    category: "Marketing",
    description: "Launch successful campaigns with persuasive presentations",
    slides: 14,
    preview: "/placeholder.svg?height=400&width=600&text=Marketing+Campaign",
    slideContent: [
      "Campaign Overview",
      "Campaign Objectives",
      "Target Audience",
      "Market Research Insights",
      "Campaign Strategy",
      "Creative Concept",
      "Channel Strategy",
      "Content Calendar",
      "Budget Allocation",
      "KPIs & Metrics",
      "Timeline & Milestones",
      "Risk Assessment",
      "Expected ROI",
      "Next Steps"
    ]
  },
  {
    id: 7,
    title: "Team Meeting",
    category: "Business",
    description: "Keep your team aligned with clear meeting presentations",
    slides: 10,
    preview: "/placeholder.svg?height=400&width=600&text=Team+Meeting",
    slideContent: [
      "Meeting Agenda",
      "Previous Action Items",
      "Project Updates",
      "Key Achievements",
      "Challenges & Blockers",
      "Resource Allocation",
      "Timeline Review",
      "Decisions Needed",
      "Action Items",
      "Next Meeting"
    ]
  },
  {
    id: 8,
    title: "Product Launch",
    category: "Marketing",
    description: "Create excitement for your new product release",
    slides: 22,
    preview: "/placeholder.svg?height=400&width=600&text=Product+Launch",
    slideContent: [
      "Product Unveiling",
      "Market Need",
      "Product Vision",
      "Key Features",
      "User Benefits",
      "Technical Specifications",
      "Design Philosophy",
      "User Experience",
      "Pricing Strategy",
      "Launch Timeline",
      "Marketing Plan",
      "Distribution Channels",
      "Partner Ecosystem",
      "Customer Support",
      "Success Metrics",
      "Roadmap",
      "Call to Action"
    ]
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
      if (sortBy === "popular") return a.id - b.id // Default order
      if (sortBy === "slides") return b.slides - a.slides
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

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-light text-gray-900 mb-4">Choose Your Template</h1>
          <p className="text-xl text-gray-600 font-light">Start with a professionally designed template and make it your own</p>
        </div>

        {/* Horizontal Categories */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white border border-gray-200 rounded-lg shadow-sm p-1">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.name
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div>
            {/* Search Bar */}
            <div className="relative mb-10 max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-white border-gray-200 rounded-lg text-base shadow-sm focus:shadow-md"
              />
            </div>

            {/* Templates Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredTemplates.map((template) => {
                return (
                  <Card
                    key={template.id}
                    className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group relative"
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className="relative h-64 sm:h-72 overflow-hidden">
                      <Image
                        src={template.preview}
                        alt={template.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Hover overlay with slide outline */}
                      <div className="absolute inset-0 bg-gray-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 overflow-y-auto">
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Presentation Outline</h4>
                        <div className="space-y-2">
                          {template.slideContent.map((slide, idx) => (
                            <div key={idx} className="flex items-start text-xs">
                              <span className="text-gray-400 mr-3 font-mono text-[10px] mt-0.5">
                                {(idx + 1).toString().padStart(2, '0')}
                              </span>
                              <span className="text-gray-200 leading-relaxed">{slide}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <CardHeader className="p-8">
                      <CardTitle className="text-gray-900 text-xl font-medium mb-3">{template.title}</CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <FileText className="w-4 h-4 mr-2" />
                          <span className="font-medium">{template.slides} Slides</span>
                        </div>
                      </div>
                    </CardContent>
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
      </main>
    </div>
  )
}