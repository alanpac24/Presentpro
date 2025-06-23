"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Edit, Copy, Share, Trash2, Calendar, Clock, Plus, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PrivateHeader } from "@/components/header"

// Extended mock data for presentations
const allPresentations = [
  {
    id: 1,
    title: "Q4 Business Review 2024",
    thumbnail: "/placeholder.svg?height=60&width=80",
    createdDate: "2024-01-15",
    lastModified: "2024-01-20",
    slideCount: 24,
    status: "Recent",
    category: "Business",
  },
  {
    id: 2,
    title: "Product Launch Strategy",
    thumbnail: "/placeholder.svg?height=60&width=80",
    createdDate: "2024-01-12",
    lastModified: "2024-01-18",
    slideCount: 18,
    status: "Draft",
    category: "Strategy",
  },
  {
    id: 3,
    title: "Sales Performance Analysis",
    thumbnail: "/placeholder.svg?height=60&width=80",
    createdDate: "2024-01-10",
    lastModified: "2024-01-16",
    slideCount: 32,
    status: "Completed",
    category: "Sales",
  },
  {
    id: 4,
    title: "Marketing Campaign Proposal",
    thumbnail: "/placeholder.svg?height=60&width=80",
    createdDate: "2024-01-08",
    lastModified: "2024-01-14",
    slideCount: 15,
    status: "Review",
    category: "Marketing",
  },
  // ... (rest of the mock data remains the same)
  {
    id: 5,
    title: "Team Quarterly Goals",
    thumbnail: "/placeholder.svg?height=60&width=80",
    createdDate: "2024-01-05",
    lastModified: "2024-01-12",
    slideCount: 12,
    status: "Completed",
    category: "Management",
  },
  {
    id: 6,
    title: "Financial Report Q3",
    thumbnail: "/placeholder.svg?height=60&width=80",
    createdDate: "2024-01-03",
    lastModified: "2024-01-10",
    slideCount: 28,
    status: "Completed",
    category: "Finance",
  },
  {
    id: 7,
    title: "Customer Success Metrics",
    thumbnail: "/placeholder.svg?height=60&width=80",
    createdDate: "2024-01-01",
    lastModified: "2024-01-08",
    slideCount: 20,
    status: "Draft",
    category: "Customer Success",
  },
  {
    id: 8,
    title: "Competitive Analysis 2024",
    thumbnail: "/placeholder.svg?height=60&width=80",
    createdDate: "2023-12-28",
    lastModified: "2024-01-05",
    slideCount: 35,
    status: "Review",
    category: "Strategy",
  },
]

export default function PresentationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const presentationsPerPage = 10

  const filteredPresentations = allPresentations.filter((presentation) => {
    const matchesSearch = presentation.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || presentation.status.toLowerCase() === statusFilter
    const matchesCategory = categoryFilter === "all" || presentation.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const totalPages = Math.ceil(filteredPresentations.length / presentationsPerPage)
  const currentPresentations = filteredPresentations.slice(
    (currentPage - 1) * presentationsPerPage,
    currentPage * presentationsPerPage,
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Simplified status badge styling to be more neutral, closer to homepage's subtle badges
  const getStatusBadgeStyle = (status: string) => {
    // Using a generic style for all statuses, can be enhanced with icons or subtle color dots if needed
    return "bg-gray-100 text-gray-700 font-medium text-xs"
  }

  const uniqueCategories = [...new Set(allPresentations.map((p) => p.category))]
  const uniqueStatuses = [...new Set(allPresentations.map((p) => p.status))]

  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
          {" "}
          {/* Homepage card style */}
          <CardHeader className="p-6 lg:p-8">
            {" "}
            {/* Adjusted padding */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <CardTitle className="text-xl font-light text-gray-900">
                  Presentations ({filteredPresentations.length})
                </CardTitle>{" "}
                {/* Homepage font style */}
                <CardDescription className="text-gray-600 text-sm font-light">
                  View and manage all your presentations
                </CardDescription>{" "}
                {/* Homepage font style */}
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search presentations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 pl-10 pr-4 w-64 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 rounded-lg text-sm" /* Homepage input style (adjusted height) */
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-11 w-40 bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-0 rounded-lg text-sm">
                    {" "}
                    {/* Homepage select style (adjusted height) */}
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 rounded-lg shadow-sm">
                    <SelectItem value="all">All Status</SelectItem>
                    {uniqueStatuses.map((status) => (
                      <SelectItem key={status} value={status.toLowerCase()} className="text-sm">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-11 w-40 bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-0 rounded-lg text-sm">
                    {" "}
                    {/* Homepage select style (adjusted height) */}
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 rounded-lg shadow-sm">
                    <SelectItem value="all">All Categories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category} className="text-sm">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 lg:p-0">
            {" "}
            {/* Adjusted padding, table will have its own */}
            {filteredPresentations.length === 0 ? (
              <div className="text-center py-12 px-6 lg:px-8">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 mb-4 font-light text-lg">No presentations found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                    setCategoryFilter("all")
                  }}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50 text-sm font-medium tracking-wide px-6 h-10 rounded-lg" /* Homepage outline button style */
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                          Preview
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Modified
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Slides
                        </TableHead>
                        <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </TableHead>
                        <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white divide-y divide-gray-200">
                      {currentPresentations.map((presentation) => (
                        <TableRow key={presentation.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="w-20 h-12 bg-gray-100 rounded-md border border-gray-200 overflow-hidden flex items-center justify-center">
                              <Image
                                src={presentation.thumbnail || "/placeholder.svg?height=48&width=64&query=thumbnail"}
                                alt={presentation.title}
                                width={64}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {presentation.title}
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-700 text-xs font-medium tracking-wide uppercase"
                            >
                              {presentation.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1.5 text-gray-400" />
                              {formatDate(presentation.createdDate)}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                              {formatDate(presentation.lastModified)}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {presentation.slideCount} slides
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <Badge className={`${getStatusBadgeStyle(presentation.status)} px-2.5 py-0.5 rounded-full`}>
                              {presentation.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700 w-8 h-8 p-0 rounded-md"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700 w-8 h-8 p-0 rounded-md"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700 w-8 h-8 p-0 rounded-md"
                              >
                                <Share className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 w-8 h-8 p-0 rounded-md"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1) setCurrentPage(currentPage - 1)
                            }}
                            className={`text-sm font-medium ${currentPage === 1 ? "pointer-events-none text-gray-400" : "text-gray-700 hover:text-gray-900"}`}
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
                              className={`text-sm font-medium rounded-md w-8 h-8 flex items-center justify-center ${currentPage === i + 1 ? "bg-gray-900 text-white hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"}`}
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
                            className={`text-sm font-medium ${currentPage === totalPages ? "pointer-events-none text-gray-400" : "text-gray-700 hover:text-gray-900"}`}
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
    </div>
  )
}