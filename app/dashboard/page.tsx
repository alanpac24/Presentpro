"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Edit,
  Copy,
  Share,
  Trash2,
  Calendar,
  Clock,
  FileSlidersIcon as Slides,
  ArrowRight,
} from "lucide-react"
import Image from "next/image"
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
    status: "Recent",
  },
  {
    id: 2,
    title: "Product Launch Strategy",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Product+Launch",
    createdDate: "2024-01-12",
    lastModified: "2024-01-18",
    slideCount: 18,
    status: "Draft",
  },
  {
    id: 3,
    title: "Sales Performance Analysis",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Sales+Analysis",
    createdDate: "2024-01-10",
    lastModified: "2024-01-16",
    slideCount: 32,
    status: "Completed",
  },
  {
    id: 4,
    title: "Marketing Campaign Proposal",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Marketing",
    createdDate: "2024-01-08",
    lastModified: "2024-01-14",
    slideCount: 15,
    status: "Review",
  },
  {
    id: 5,
    title: "Team Quarterly Goals",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Team+Goals",
    createdDate: "2024-01-05",
    lastModified: "2024-01-12",
    slideCount: 12,
    status: "Completed",
  },
  {
    id: 6,
    title: "Financial Report Q3",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Financial",
    createdDate: "2024-01-03",
    lastModified: "2024-01-10",
    slideCount: 28,
    status: "Completed",
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
    popular: true,
  },
  {
    id: 2,
    title: "Sales Pitch Deck",
    description: "High-converting sales presentation",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Sales+Pitch",
    category: "Sales",
    slideCount: 18,
    popular: false,
  },
  {
    id: 3,
    title: "Product Roadmap",
    description: "Strategic product planning template",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Roadmap",
    category: "Strategy",
    slideCount: 20,
    popular: true,
  },
  {
    id: 4,
    title: "Financial Report",
    description: "Professional financial presentation",
    thumbnail: "/placeholder.svg?height=120&width=160&text=Financial",
    category: "Finance",
    slideCount: 28,
    popular: false,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Recent":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Draft":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Review":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />

      {/* Hero Section */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-light text-gray-900 mb-4">
                Welcome back, <span className="font-medium">{mockUser.name.split(" ")[0]}</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                Create professional presentations that drive results. Start with a template or build from scratch.
              </p>
            </div>
            <Card className="w-full max-w-xs rounded-2xl shadow-sm border-gray-200">
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentPresentations.map((presentation) => (
                      <Card
                        key={presentation.id}
                        className="group hover:shadow-lg transition-all duration-300 border border-gray-200 shadow-sm"
                      >
                        <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                          <Image
                            src={presentation.thumbnail || "/placeholder.svg"}
                            alt={presentation.title}
                            width={160}
                            height={120}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-medium text-gray-900 line-clamp-2 flex-1 text-lg">
                              {presentation.title}
                            </h3>
                            <Badge className={`ml-3 text-xs border ${getStatusColor(presentation.status)}`}>
                              {presentation.status}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm text-gray-500 mb-6">
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

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                              >
                                <Share className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 rounded-md"
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">Start with a Template</h2>
            <p className="text-lg text-gray-600">Choose from our professional templates to get started quickly</p>
          </div>

          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {mockTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg border ${
                      selectedTemplate === template.id
                        ? "ring-2 ring-gray-900 border-gray-900"
                        : "border-gray-200 shadow-sm"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="relative">
                      <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                        <Image
                          src={template.thumbnail || "/placeholder.svg"}
                          alt={template.title}
                          width={160}
                          height={120}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {template.popular && (
                        <Badge className="absolute top-3 right-3 bg-amber-500 text-white text-xs border-0">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-medium text-gray-900 mb-2">{template.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{template.slideCount} slides</span>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-0">
                          {template.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-center mt-12 space-x-6">
                <Button
                  onClick={() => handleCreatePresentation()}
                  variant="outline"
                  className="flex items-center space-x-2 px-8 h-11 text-sm font-medium tracking-wide border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                >
                  <Plus className="w-5 h-5" />
                  <span>Start from Scratch</span>
                </Button>
                <Button
                  onClick={() => handleCreatePresentation(selectedTemplate || undefined)}
                  disabled={!selectedTemplate}
                  className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-8 h-11 text-sm font-medium tracking-wide rounded-md"
                >
                  <Plus className="w-5 h-5" />
                  <span>Use Selected Template</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}