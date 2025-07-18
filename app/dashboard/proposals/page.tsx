"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  MoreVertical,
  Upload,
  Download,
  Send,
  Edit,
  Copy,
  Trash2,
  Filter,
  ChevronUp,
  ChevronDown,
  FileUp,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  ArrowUpDown,
  Sparkles,
  Building,
  User,
  FileText,
  Loader2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { PrivateHeader } from "@/components/header"
import { cn } from "@/lib/utils"

type Proposal = {
  id: number
  companyName: string
  contactName: string
  contactTitle: string
  contactEmail: string
  proposalType: string
  status: "draft" | "sent" | "viewed" | "accepted" | "rejected"
  sentDate: string | null
  lastModified: string
  openRate: number
  slideCount: number
  value: number
}

const mockProposals: Proposal[] = [
  {
    id: 1,
    companyName: "Microsoft",
    contactName: "Sarah Chen",
    contactTitle: "VP of Sales",
    contactEmail: "sarah.chen@microsoft.com",
    proposalType: "Cold Outreach",
    status: "sent",
    sentDate: "2024-01-20",
    lastModified: "2024-01-20",
    openRate: 0,
    slideCount: 24,
    value: 250000,
  },
  {
    id: 2,
    companyName: "Salesforce",
    contactName: "Michael Johnson",
    contactTitle: "Head of Product",
    contactEmail: "mjohnson@salesforce.com",
    proposalType: "Discovery Follow-up",
    status: "viewed",
    sentDate: "2024-01-18",
    lastModified: "2024-01-18",
    openRate: 85,
    slideCount: 18,
    value: 175000,
  },
  {
    id: 3,
    companyName: "Google",
    contactName: "Emily Davis",
    contactTitle: "Engineering Director",
    contactEmail: "emily.davis@google.com",
    proposalType: "Enterprise Solution",
    status: "accepted",
    sentDate: "2024-01-15",
    lastModified: "2024-01-15",
    openRate: 100,
    slideCount: 32,
    value: 500000,
  },
  {
    id: 4,
    companyName: "Amazon",
    contactName: "David Park",
    contactTitle: "Product Manager",
    contactEmail: "dpark@amazon.com",
    proposalType: "Platform Integration",
    status: "draft",
    sentDate: null,
    lastModified: "2024-01-22",
    openRate: 0,
    slideCount: 28,
    value: 325000,
  },
  {
    id: 5,
    companyName: "Apple",
    contactName: "Lisa Wang",
    contactTitle: "Senior VP",
    contactEmail: "lwang@apple.com",
    proposalType: "Strategic Partnership",
    status: "rejected",
    sentDate: "2024-01-10",
    lastModified: "2024-01-10",
    openRate: 100,
    slideCount: 45,
    value: 750000,
  },
]

export default function ProposalsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [proposals, setProposals] = useState(mockProposals)
  const [selectedProposals, setSelectedProposals] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<keyof Proposal>("lastModified")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvPreview, setCsvPreview] = useState<string[][]>([])
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [generateForm, setGenerateForm] = useState({
    companyName: "",
    companyWebsite: "",
    contactName: "",
    contactTitle: "",
    contactEmail: "",
    linkedinUrl: "",
    productDescription: "",
    salesObjective: "demo" as const,
    yourName: "John Doe",
    yourEmail: "john@salespro.ai",
    yourCompany: "SalesPro",
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStatus, setGenerationStatus] = useState("")

  const statusColors = {
    draft: "bg-gray-100 text-gray-700",
    sent: "bg-blue-100 text-blue-700",
    viewed: "bg-purple-100 text-purple-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  }

  const statusIcons = {
    draft: <Clock className="w-3 h-3" />,
    sent: <Mail className="w-3 h-3" />,
    viewed: <Mail className="w-3 h-3" />,
    accepted: <CheckCircle className="w-3 h-3" />,
    rejected: <XCircle className="w-3 h-3" />,
  }

  const handleSort = (field: keyof Proposal) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredProposals = proposals
    .filter((proposal) => {
      const matchesSearch = 
        proposal.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.proposalType.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || proposal.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (aValue === null) return 1
      if (bValue === null) return -1
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProposals(filteredProposals.map(p => p.id))
    } else {
      setSelectedProposals([])
    }
  }

  const handleSelectProposal = (proposalId: number, checked: boolean) => {
    if (checked) {
      setSelectedProposals([...selectedProposals, proposalId])
    } else {
      setSelectedProposals(selectedProposals.filter(id => id !== proposalId))
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setCsvFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const rows = text.split("\n").map(row => row.split(","))
        setCsvPreview(rows.slice(0, 5))
      }
      reader.readAsText(file)
      setShowUploadDialog(true)
    }
  }

  const handleDownloadTemplate = () => {
    const csvContent = `Company Name,Contact Name,Contact Title,Contact Email,Proposal Type,Value
Acme Corp,John Smith,CEO,john@acme.com,Enterprise Solution,100000
Tech Inc,Jane Doe,CTO,jane@techinc.com,Platform Integration,150000`
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "proposal_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleGenerateProposal = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationStatus("Researching company...")

    try {
      // Simulate progress updates
      const progressSteps = [
        { progress: 20, status: "Researching company..." },
        { progress: 40, status: "Analyzing prospect..." },
        { progress: 60, status: "Generating content with AI..." },
        { progress: 80, status: "Creating PDF slides..." },
        { progress: 90, status: "Preparing email..." },
      ]

      for (const step of progressSteps) {
        setGenerationProgress(step.progress)
        setGenerationStatus(step.status)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Make API call
      const response = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generateForm),
      })

      const result = await response.json()

      if (result.success) {
        setGenerationProgress(100)
        setGenerationStatus("Proposal generated successfully!")

        // Download PDF
        const pdfData = atob(result.data.pdf.base64)
        const pdfArray = new Uint8Array(pdfData.length)
        for (let i = 0; i < pdfData.length; i++) {
          pdfArray[i] = pdfData.charCodeAt(i)
        }
        const pdfBlob = new Blob([pdfArray], { type: "application/pdf" })
        const pdfUrl = URL.createObjectURL(pdfBlob)
        const a = document.createElement("a")
        a.href = pdfUrl
        a.download = result.data.pdf.filename
        a.click()
        URL.revokeObjectURL(pdfUrl)

        // Add to proposals list
        const newProposal: Proposal = {
          id: proposals.length + 1,
          companyName: generateForm.companyName,
          contactName: generateForm.contactName,
          contactTitle: generateForm.contactTitle,
          contactEmail: generateForm.contactEmail,
          proposalType: "AI Generated",
          status: "draft",
          sentDate: null,
          lastModified: new Date().toISOString().split("T")[0],
          openRate: 0,
          slideCount: 5,
          value: 150000,
        }
        setProposals([newProposal, ...proposals])

        // Close dialog
        setTimeout(() => {
          setShowGenerateDialog(false)
          setIsGenerating(false)
          setGenerationProgress(0)
          setGenerationStatus("")
          // Reset form
          setGenerateForm({
            companyName: "",
            companyWebsite: "",
            contactName: "",
            contactTitle: "",
            contactEmail: "",
            linkedinUrl: "",
            productDescription: "",
            salesObjective: "demo",
            yourName: "John Doe",
            yourEmail: "john@salespro.ai",
            yourCompany: "SalesPro",
          })
        }, 2000)
      } else {
        setGenerationStatus("Generation failed: " + result.error)
        setIsGenerating(false)
      }
    } catch (error) {
      setGenerationStatus("Error: " + (error as Error).message)
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PrivateHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Sales Proposals</h1>
          <p className="text-gray-600">Manage and track your sales proposals in one place</p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="border-b bg-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search proposals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-[300px]"
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Status: {statusFilter === "all" ? "All" : statusFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
                      Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("sent")}>
                      Sent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("viewed")}>
                      Viewed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("accepted")}>
                      Accepted
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                      Rejected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadTemplate}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CSV
                </Button>

                <Button
                  size="sm"
                  onClick={() => setShowGenerateDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Generate
                </Button>

                <Button
                  size="sm"
                  onClick={() => router.push("/presentation-planner")}
                  className="bg-gray-900 hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Proposal
                </Button>
              </div>
            </div>

            {selectedProposals.length > 0 && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700 font-medium">
                  {selectedProposals.length} selected
                </span>
                <div className="flex items-center gap-2 ml-4">
                  <Button size="sm" variant="outline" className="h-8">
                    <Send className="w-3 h-3 mr-1" />
                    Send
                  </Button>
                  <Button size="sm" variant="outline" className="h-8">
                    <Copy className="w-3 h-3 mr-1" />
                    Duplicate
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-red-600 hover:text-red-700">
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProposals.length === filteredProposals.length && filteredProposals.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("companyName")}>
                    <div className="flex items-center gap-1">
                      Company
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("proposalType")}>
                    <div className="flex items-center gap-1">
                      Type
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("value")}>
                    <div className="flex items-center gap-1">
                      Value
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("sentDate")}>
                    <div className="flex items-center gap-1">
                      Sent Date
                      <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProposals.map((proposal) => (
                  <TableRow key={proposal.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedProposals.includes(proposal.id)}
                        onCheckedChange={(checked) => handleSelectProposal(proposal.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{proposal.companyName}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{proposal.contactName}</div>
                        <div className="text-sm text-gray-500">{proposal.contactTitle}</div>
                        <div className="text-sm text-gray-500">{proposal.contactEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{proposal.proposalType}</TableCell>
                    <TableCell>
                      <Badge className={cn(statusColors[proposal.status], "gap-1")}>
                        {statusIcons[proposal.status]}
                        {proposal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(proposal.value)}</TableCell>
                    <TableCell>{formatDate(proposal.sentDate)}</TableCell>
                    <TableCell>
                      {proposal.status !== "draft" && (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${proposal.openRate}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{proposal.openRate}%</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push("/presentation-editor")}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {proposal.status === "draft" && (
                            <DropdownMenuItem>
                              <Send className="w-4 h-4 mr-2" />
                              Send
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Upload CSV File</DialogTitle>
            <DialogDescription>
              Preview your CSV data before importing proposals
            </DialogDescription>
          </DialogHeader>
          
          {csvFile && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <FileUp className="w-5 h-5 text-gray-600" />
                <span className="font-medium">{csvFile.name}</span>
                <span className="text-sm text-gray-500">({csvPreview.length - 1} rows)</span>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {csvPreview[0]?.map((header, idx) => (
                        <TableHead key={idx} className="text-xs">
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {csvPreview.slice(1).map((row, idx) => (
                      <TableRow key={idx}>
                        {row.map((cell, cellIdx) => (
                          <TableCell key={cellIdx} className="text-sm">
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                  Cancel
                </Button>
                <Button className="bg-gray-900 hover:bg-gray-800">
                  Import Proposals
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Generate Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate AI-Powered Sales Proposal</DialogTitle>
            <DialogDescription>
              Enter prospect information to generate a personalized McKinsey-style proposal
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Company Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={generateForm.companyName}
                    onChange={(e) => setGenerateForm({ ...generateForm, companyName: e.target.value })}
                    placeholder="Microsoft"
                    disabled={isGenerating}
                  />
                </div>
                <div>
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    type="url"
                    value={generateForm.companyWebsite}
                    onChange={(e) => setGenerateForm({ ...generateForm, companyWebsite: e.target.value })}
                    placeholder="https://microsoft.com"
                    disabled={isGenerating}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-4 h-4" />
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={generateForm.contactName}
                    onChange={(e) => setGenerateForm({ ...generateForm, contactName: e.target.value })}
                    placeholder="Sarah Chen"
                    disabled={isGenerating}
                  />
                </div>
                <div>
                  <Label htmlFor="contactTitle">Contact Title *</Label>
                  <Input
                    id="contactTitle"
                    value={generateForm.contactTitle}
                    onChange={(e) => setGenerateForm({ ...generateForm, contactTitle: e.target.value })}
                    placeholder="VP of Sales"
                    disabled={isGenerating}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generateForm.contactEmail}
                    onChange={(e) => setGenerateForm({ ...generateForm, contactEmail: e.target.value })}
                    placeholder="sarah.chen@microsoft.com"
                    disabled={isGenerating}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    value={generateForm.linkedinUrl}
                    onChange={(e) => setGenerateForm({ ...generateForm, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/sarahchen"
                    disabled={isGenerating}
                  />
                </div>
              </div>
            </div>

            {/* Proposal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Proposal Details
              </h3>
              <div>
                <Label htmlFor="productDescription">Your Product/Service Description *</Label>
                <Textarea
                  id="productDescription"
                  value={generateForm.productDescription}
                  onChange={(e) => setGenerateForm({ ...generateForm, productDescription: e.target.value })}
                  placeholder="AI-powered sales automation platform that helps teams close more deals faster..."
                  rows={3}
                  disabled={isGenerating}
                />
              </div>
              <div>
                <Label htmlFor="salesObjective">Sales Objective *</Label>
                <select
                  id="salesObjective"
                  value={generateForm.salesObjective}
                  onChange={(e) => setGenerateForm({ ...generateForm, salesObjective: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isGenerating}
                >
                  <option value="demo">Schedule Demo</option>
                  <option value="pilot">Start Pilot Program</option>
                  <option value="close">Close Deal</option>
                  <option value="discovery">Discovery Call</option>
                  <option value="renewal">Renewal Discussion</option>
                </select>
              </div>
            </div>

            {/* Generation Progress */}
            {isGenerating && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600">{generationStatus}</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowGenerateDialog(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateProposal}
              disabled={
                isGenerating ||
                !generateForm.companyName ||
                !generateForm.contactName ||
                !generateForm.contactTitle ||
                !generateForm.contactEmail ||
                !generateForm.productDescription
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Proposal
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}