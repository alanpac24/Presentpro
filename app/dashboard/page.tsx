"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Presentation,
  Search,
  User,
  Settings,
  LogOut,
  Plus,
  Copy,
  Share,
  Trash2,
  Calendar,
  Clock,
  FileSlidersIcon as Slides,
  ArrowRight,
  FileText,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PrivateHeader } from "@/components/header"
import { mockUser, mockStats } from "@/lib/constants"

const mockPresentations = [
  {
    id: 1,
    title: "Q4 Business Review 2024",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Q4+Review",
    createdDate: "2024-01-15",
    lastModified: "2024-01-20",
    slideCount: 24,
  },
  {
    id: 2,
    title: "Product Launch Strategy",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Product+Launch",
    createdDate: "2024-01-12",
    lastModified: "2024-01-18",
    slideCount: 18,
  },
  {
    id: 3,
    title: "Sales Performance Analysis",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Sales+Analysis",
    createdDate: "2024-01-10",
    lastModified: "2024-01-16",
    slideCount: 32,
  },
  {
    id: 4,
    title: "Marketing Campaign Proposal",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Marketing",
    createdDate: "2024-01-08",
    lastModified: "2024-01-14",
    slideCount: 15,
  },
  {
    id: 5,
    title: "Team Quarterly Goals",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Team+Goals",
    createdDate: "2024-01-05",
    lastModified: "2024-01-12",
    slideCount: 12,
  },
  {
    id: 6,
    title: "Financial Report Q3",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Financial",
    createdDate: "2024-01-03",
    lastModified: "2024-01-10",
    slideCount: 28,
  },
]

const mockTemplates = [
  {
    id: 1,
    title: "Executive Business Review",
    description: "Comprehensive quarterly review template",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Business+Review",
    category: "Business",
    slideCount: 25,
    slideContent: [
      "Title & Agenda",
      "Executive Summary",
      "Company Overview",
      "Key Performance Indicators",
      "Financial Performance",
      "Revenue Analysis",
      "Cost Structure",
      "Market Analysis",
      "Competitive Landscape",
      "Product Performance",
      "Customer Insights",
      "Sales Pipeline",
      "Marketing Initiatives",
      "Operational Efficiency",
      "Team Performance",
      "Strategic Initiatives",
      "Risk Assessment",
      "Opportunities",
      "Challenges",
      "Action Plan",
      "Timeline & Milestones",
      "Resource Requirements",
      "Next Steps",
      "Q&A",
      "Appendix"
    ]
  },
  {
    id: 2,
    title: "Sales Pitch Deck",
    description: "High-converting sales presentation",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Sales+Pitch",
    category: "Sales",
    slideCount: 18,
    slideContent: [
      "Title Slide",
      "Problem Statement",
      "Market Opportunity",
      "Our Solution",
      "Value Proposition",
      "Product Demo",
      "Key Features",
      "Benefits Overview",
      "Customer Success Stories",
      "Case Study 1",
      "Case Study 2",
      "ROI Analysis",
      "Implementation Process",
      "Pricing Options",
      "Comparison Chart",
      "Why Choose Us",
      "Next Steps",
      "Contact Information"
    ]
  },
  {
    id: 3,
    title: "Product Roadmap",
    description: "Strategic product planning template",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Roadmap",
    category: "Product",
    slideCount: 20,
    slideContent: [
      "Product Vision",
      "Executive Summary",
      "Product Strategy",
      "Market Analysis",
      "User Research Insights",
      "Current State",
      "Future State Vision",
      "Q1 Initiatives",
      "Q2 Initiatives",
      "Q3 Initiatives",
      "Q4 Initiatives",
      "Feature Prioritization",
      "Technical Architecture",
      "Dependencies",
      "Resource Planning",
      "Risk Mitigation",
      "Success Metrics",
      "Stakeholder Alignment",
      "Communication Plan",
      "Questions & Discussion"
    ]
  },
  {
    id: 4,
    title: "Financial Report",
    description: "Professional financial presentation",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Financial",
    category: "Finance",
    slideCount: 28,
    slideContent: [
      "Financial Overview",
      "Executive Summary",
      "Revenue Summary",
      "Revenue by Segment",
      "Revenue by Region",
      "Year-over-Year Growth",
      "Expense Analysis",
      "Operating Expenses",
      "Capital Expenditures",
      "Profit & Loss Statement",
      "Balance Sheet",
      "Cash Flow Statement",
      "Key Financial Ratios",
      "Budget vs Actual",
      "Variance Analysis",
      "Forecast Update",
      "Investment Portfolio",
      "Debt Analysis",
      "Working Capital",
      "Tax Summary",
      "Audit Findings",
      "Risk Assessment",
      "Compliance Status",
      "Strategic Initiatives",
      "Financial Projections",
      "Recommendations",
      "Q&A Session",
      "Appendices"
    ]
  },
  {
    id: 5,
    title: "Marketing Campaign",
    description: "Campaign strategy and results",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Marketing",
    category: "Marketing",
    slideCount: 22,
    slideContent: [
      "Campaign Overview",
      "Campaign Objectives",
      "Target Audience",
      "Market Research",
      "Competitive Analysis",
      "Campaign Strategy",
      "Creative Concept",
      "Channel Strategy",
      "Digital Marketing Plan",
      "Social Media Strategy",
      "Content Calendar",
      "Budget Allocation",
      "Timeline & Phases",
      "Launch Plan",
      "Performance Metrics",
      "Analytics Dashboard",
      "ROI Analysis",
      "A/B Test Results",
      "Lessons Learned",
      "Optimization Plan",
      "Next Steps",
      "Appendix"
    ]
  },
  {
    id: 6,
    title: "Project Proposal",
    description: "Detailed project plan and timeline",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Project",
    category: "Business",
    slideCount: 16,
    slideContent: [
      "Project Title",
      "Executive Summary",
      "Project Background",
      "Problem Statement",
      "Proposed Solution",
      "Project Objectives",
      "Scope & Deliverables",
      "Timeline Overview",
      "Milestone Schedule",
      "Resource Requirements",
      "Budget Breakdown",
      "Risk Analysis",
      "Success Criteria",
      "Stakeholder Map",
      "Communication Plan",
      "Next Steps"
    ]
  },
  {
    id: 7,
    title: "Team All-Hands",
    description: "Company updates and announcements",
    thumbnail: "/placeholder.svg?height=120&width=160&text=All+Hands",
    category: "Business",
    slideCount: 30,
    slideContent: [
      "Welcome & Agenda",
      "Company Mission & Vision",
      "CEO Update",
      "Company Performance",
      "Financial Highlights",
      "Key Achievements",
      "Product Updates",
      "Engineering Progress",
      "Sales Performance",
      "Marketing Initiatives",
      "Customer Success Stories",
      "New Team Members",
      "Team Spotlight",
      "Culture & Values",
      "Employee Recognition",
      "Upcoming Events",
      "Office Updates",
      "Policy Changes",
      "Benefits Update",
      "Learning & Development",
      "Diversity & Inclusion",
      "Sustainability Efforts",
      "Strategic Priorities",
      "OKR Progress",
      "Challenges Ahead",
      "Innovation Pipeline",
      "Partner Updates",
      "Industry Trends",
      "Q&A Session",
      "Closing Remarks"
    ]
  },
  {
    id: 8,
    title: "Investor Pitch",
    description: "Fundraising deck for investors",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Investor",
    category: "Finance",
    slideCount: 20,
    slideContent: [
      "Title & Vision",
      "The Problem",
      "Market Opportunity",
      "Our Solution",
      "Product Overview",
      "Unique Value Prop",
      "Business Model",
      "Market Strategy",
      "Traction & Metrics",
      "Customer Testimonials",
      "Revenue Projections",
      "Unit Economics",
      "Competition Analysis",
      "Competitive Advantage",
      "Team & Advisors",
      "Funding History",
      "Use of Funds",
      "Investment Ask",
      "Exit Strategy",
      "Contact Info"
    ]
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [templateSearchQuery, setTemplateSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [operationError, setOperationError] = useState<string | null>(null)
  const presentationsPerPage = 6

  // Filter presentations based on search
  const filteredPresentations = mockPresentations.filter((presentation) =>
    presentation.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredPresentations.length / presentationsPerPage)
  const currentPresentations = filteredPresentations.slice(
    (currentPage - 1) * presentationsPerPage,
    currentPage * presentationsPerPage,
  )

  const handleLogout = () => {
    router.push("/signin")
  }

  const handleCreatePresentation = (templateId?: number) => {
    router.push("/presentation-planner")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }


  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />

      {/* Hero Section */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-3 sm:mb-4">
                Welcome back, <span className="font-medium">{mockUser.firstName}</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-xl">
                Create professional presentations that drive results. Start with a template or build from scratch.
              </p>
            </div>
            <Card className="w-full max-w-sm lg:max-w-xs rounded-2xl shadow-sm border-gray-200 self-center lg:self-auto">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-5">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Plan</p>
                  <p className="text-2xl font-medium text-gray-800 mt-1">{mockUser.tier} Tier</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="46"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-gray-900"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 46}
                        strokeDashoffset={
                          2 * Math.PI * 46 -
                          (mockStats.presentationsCreated / mockStats.monthlyLimit) * (2 * Math.PI * 46)
                        }
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="46"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {mockStats.presentationsCreated}
                        <span className="text-lg text-gray-500 font-medium">/{mockStats.monthlyLimit}</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-600">presentations</p>
                    <p className="text-sm text-gray-600">this month</p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/upgrade")}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg"
                >
                  Upgrade <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {operationError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
            <p className="text-red-800">{operationError}</p>
            <button
              onClick={() => setOperationError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Recent Presentations Section */}
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-3xl font-light text-gray-900 mb-4">Recent Presentations</h2>
              <p className="text-lg text-gray-600">Your latest presentation projects</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search presentations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 w-80 h-12 text-base bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 rounded-lg"
              />
            </div>
          </div>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-8">
              {currentPresentations.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg mb-6">No presentations found matching your search.</p>
                  <Button variant="outline" onClick={() => setSearchQuery("")} className="px-6 py-3 rounded-lg">
                    Clear Search
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {currentPresentations.map((presentation) => (
                      <Card
                        key={presentation.id}
                        className="group card-hover border border-gray-200 shadow-sm"
                      >
                        <Link href="/presentation-editor" className="block">
                          <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100 cursor-pointer">
                            <Image
                              src={presentation.thumbnail || "/placeholder.svg"}
                              alt={presentation.title}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </Link>
                        <CardContent className="p-4 sm:p-6">
                          <div className="mb-3 sm:mb-4">
                            <h3 className="font-medium text-gray-900 line-clamp-2 text-base sm:text-lg">
                              {presentation.title}
                            </h3>
                          </div>

                          <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              Created {formatDate(presentation.createdDate)}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Modified {formatDate(presentation.lastModified)}
                            </div>
                            <div className="flex items-center">
                              <Slides className="w-4 h-4 mr-2" />
                              {presentation.slideCount} slides
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                title="Duplicate presentation"
                                onClick={() => {
                                  // TODO: Implement duplicate presentation feature
                                  setOperationError("Duplicate feature coming soon!")
                                  setTimeout(() => setOperationError(null), 3000)
                                }}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                                title="Share presentation"
                                onClick={() => {
                                  // TODO: Implement share presentation feature
                                  setOperationError("Share feature coming soon!")
                                  setTimeout(() => setOperationError(null), 3000)
                                }}
                              >
                                <Share className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 rounded-md"
                                title="Delete presentation"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this presentation?")) {
                                    // TODO: Implement delete presentation feature
                                    setOperationError("Delete feature coming soon!")
                                    setTimeout(() => setOperationError(null), 3000)
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) setCurrentPage(currentPage - 1)
                              }}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                          {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i + 1}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault()
                                  setCurrentPage(i + 1)
                                }}
                                isActive={currentPage === i + 1}
                              >
                                {i + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              href="#"
                              onClick={(e) => {
                                e.preventDefault()
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                              }}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Templates Section */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 sm:mb-12">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-3xl font-light text-gray-900 mb-3 sm:mb-4">Start with a Template</h2>
              <p className="text-base sm:text-lg text-gray-600">Choose from our professional templates to get started quickly</p>
            </div>

            {/* Template Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search templates..."
                value={templateSearchQuery}
                onChange={(e) => setTemplateSearchQuery(e.target.value)}
                className="pl-12 w-80 h-12 text-base bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 rounded-lg"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {["All", "Business", "Sales", "Marketing", "Finance", "Product"].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {mockTemplates
                  .filter((template) => {
                    const matchesSearch = template.title.toLowerCase().includes(templateSearchQuery.toLowerCase()) ||
                                        template.description.toLowerCase().includes(templateSearchQuery.toLowerCase())
                    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
                    return matchesSearch && matchesCategory
                  })
                  .map((template) => (
                  <Card
                    key={template.id}
                    className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group relative"
                    onClick={() => router.push("/presentation-editor")}
                  >
                    <div className="relative h-64 sm:h-72 overflow-hidden">
                      <Image
                        src={template.thumbnail || "/placeholder.svg"}
                        alt={template.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Hover overlay with slide outline */}
                      <div className="absolute inset-0 bg-gray-900/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 overflow-y-auto">
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Presentation Outline</h4>
                        <div className="space-y-2">
                          {template.slideContent?.map((slide, idx) => (
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
                          <span className="font-medium">{template.slideCount} Slides</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-center mt-12">
                <Link
                  href="/templates"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center space-x-2 group"
                >
                  <span>See more templates</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}