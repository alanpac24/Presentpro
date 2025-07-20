"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Upload,
  LinkIcon,
  X,
  Plus,
  Wand2,
  ArrowRight,
  Presentation,
  User,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PrivateHeader } from "@/components/header"
import { mockUser } from "@/lib/constants"

interface PresentationData {
  title: string
  purpose: string
  audience: string
  customAudience: string
  slideCount: string
  format: string
  topic: string
  keyPoints: string[]
  uploadedFiles: File[]
  externalLinks: { url: string; note: string }[]
  templateStyle: string
  brandColors: string[]
  fontStyle: string
  logo: File | null
}

const purposeOptions = ["Inform", "Persuade", "Educate", "Align", "Recommend", "Report", "Pitch"]
const audienceOptions = [
  "C-level Executives",
  "Team Leads",
  "Internal Staff",
  "Clients",
  "Investors",
  "Board",
  "Cross-functional Team",
  "Other",
]
const slideCountOptions = ["5", "10", "15", "20", "25", "30", "Let AI Decide"]
const formatOptions = [
  "To Be Read",
  "Presenter Talking Points",
  "Executive Summary",
  "Data-Heavy Report",
  "Visual Story",
  "Workshop Deck",
]
const templateStyles = [
  "Corporate",
  "Minimalist",
  "Creative",
  "Client-Branded",
  "Modern Professional",
  "Dark Mode",
  "Presentation Zen",
]
const fontStyles = ["Default Corporate", "Modern Sans-serif", "Classic Serif", "Custom Upload"]

export default function PresentationPlannerPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"quick" | "detailed">("quick")
  const [quickPrompt, setQuickPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const [formData, setFormData] = useState<PresentationData>({
    title: "",
    purpose: "",
    audience: "",
    customAudience: "",
    slideCount: "",
    format: "",
    topic: "",
    keyPoints: [],
    uploadedFiles: [],
    externalLinks: [],
    templateStyle: "",
    brandColors: [],
    fontStyle: "",
    logo: null,
  })

  const [newLink, setNewLink] = useState({ url: "", note: "" })

  const handleLogout = () => {
    router.push("/signin")
  }

  const handleQuickGenerate = async () => {
    if (!quickPrompt.trim()) return
    
    // Show loading state
    setIsGenerating(true)
    
    try {
      // Call API to generate presentation content
      const response = await fetch("/api/presentations/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: quickPrompt }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Store generated presentation data
        sessionStorage.setItem(
          "generatedPresentation",
          JSON.stringify({
            slides: result.data.slides,
            title: result.data.title,
            timestamp: Date.now()
          })
        )
        
        // Route directly to presentation editor
        router.push("/presentation-editor")
      } else {
        console.error("Generation failed:", result.error)
        // You might want to show an error toast here
      }
    } catch (error) {
      console.error("Error generating presentation:", error)
      // You might want to show an error toast here
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDetailedGenerate = async () => {
    sessionStorage.setItem(
      "presentationData",
      JSON.stringify({ type: "detailed", formData: formData, timestamp: Date.now() }),
    )
    router.push("/outline-editor")
  }


  const addExternalLink = () => {
    if (newLink.url.trim()) {
      setFormData((prev) => ({
        ...prev,
        externalLinks: [...prev.externalLinks, { ...newLink }],
      }))
      setNewLink({ url: "", note: "" })
    }
  }

  const removeExternalLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: prev.externalLinks.filter((_, i) => i !== index),
    }))
  }

  const handleColorChange = (color: string, index: number) => {
    setFormData((prev) => {
      const newColors = [...prev.brandColors]
      newColors[index] = color
      return { ...prev, brandColors: newColors }
    })
  }

  const addColor = () => {
    if (formData.brandColors.length < 3) {
      setFormData((prev) => ({
        ...prev,
        brandColors: [...prev.brandColors, "#000000"],
      }))
    }
  }

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      brandColors: prev.brandColors.filter((_, i) => i !== index),
    }))
  }

  const inputBaseClass =
    "h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 rounded-lg"
  const labelBaseClass = "text-sm sm:text-base font-medium text-gray-900"
  const sectionTitleClass = "text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-3 sm:mb-4 tracking-tight"
  const sectionDescriptionClass = "text-sm sm:text-base lg:text-lg text-gray-600 font-light mb-6 sm:mb-8"

  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />
      {/* Header Section */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-3 sm:mb-4">
                Create Your
                <span className="block text-gray-600 font-medium">Perfect Presentation</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-xl">
                Generate professional presentations with AI assistance. Choose between quick generation or detailed
                planning for maximum customization.
              </p>
            </div>
            {/* Mode Toggle */}
            <div className="flex justify-center lg:justify-end">
              <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
                <button
                  onClick={() => setMode("quick")}
                  className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-md transition-all ${
                    mode === "quick"
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Quick Start
                </button>
                <button
                  onClick={() => setMode("detailed")}
                  className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium rounded-md transition-all ${
                    mode === "detailed"
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Detailed Planning
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Content Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {mode === "quick" ? (
          <div className="space-y-12">
            {" "}
            {/* Adjusted spacing */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-6 sm:mb-8 tracking-tight">
                Quick Start with AI Prompt
              </h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-6 sm:p-8 shadow-sm border border-gray-200 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="prompt" className={labelBaseClass}>
                      Describe your presentation
                    </Label>
                    <Textarea
                      id="prompt"
                      placeholder="Example: Create a 15-slide presentation about Q4 sales performance for executives, focusing on revenue growth, key wins, and 2024 strategy recommendations..."
                      value={quickPrompt}
                      onChange={(e) => setQuickPrompt(e.target.value)}
                      rows={4}
                      className={`resize-none text-base bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 rounded-lg p-4 mt-2`}
                    />
                  </div>
                  <div className="text-center pt-2">
                    <Button
                      onClick={handleQuickGenerate}
                      disabled={!quickPrompt.trim() || isGenerating}
                      className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-medium h-12 sm:h-14 px-6 sm:px-8 text-sm rounded-xl transition-all duration-200 hover:shadow-lg"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          Generate Presentation
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                    {!quickPrompt.trim() && !isGenerating && (
                      <p className="text-xs text-gray-500 mt-4">Enter a description above to generate your presentation</p>
                    )}
                    {isGenerating && (
                      <p className="text-xs text-gray-500 mt-4">Creating your AI-powered presentation...</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-gray-50 p-6 sm:p-8 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-6">Best Practices for AI Generation</h4>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3 text-base">Include These Details:</h5>
                    <ul className="text-gray-600 space-y-2.5 text-sm">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                        Target audience
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                        Main topic and key points
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                        Presentation length (slides)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3 text-base">Specify Purpose:</h5>
                    <ul className="text-gray-600 space-y-2.5 text-sm">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                        Inform, persuade, or educate
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                        Context and background
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                        Desired tone and style
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ) : (
          <div className="space-y-12 sm:space-y-14 lg:space-y-16">
            {/* Adjusted spacing */}
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 mb-6 sm:mb-8 tracking-tight">
                Detailed Planning
              </h2>
            </div>
            {/* Sections: Basics, Content, Style & Branding */}
            {[
              { title: "Basics", description: "Define the core elements of your presentation" },
              { title: "Content Strategy", description: "Define your key messages and supporting materials" },
              { title: "Style & Branding", description: "Customize the visual appearance and brand elements" },
            ].map((section, secIndex) => (
              <div key={secIndex} className="space-y-8">
                <div>
                  <h3 className={sectionTitleClass}>
                    Presentation <span className="text-gray-600">{section.title}</span>
                  </h3>
                  <p className={sectionDescriptionClass}>{section.description}</p>
                </div>

                <div className="bg-white p-6 sm:p-8 lg:p-10 xl:p-12 shadow-sm border border-gray-200 rounded-lg">
                  <div className="space-y-8">
                    {/* Specific form fields will go here, matching the section */}
                    {secIndex === 0 && ( // Basics
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="title" className={labelBaseClass}>
                              Presentation Title
                            </Label>
                            <Input
                              id="title"
                              placeholder="e.g. Q3 Performance Overview"
                              value={formData.title}
                              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                              className={inputBaseClass}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className={labelBaseClass}>Number of Slides</Label>
                            <Select
                              value={formData.slideCount}
                              onValueChange={(value) => setFormData((prev) => ({ ...prev, slideCount: value }))}
                            >
                              <SelectTrigger className={inputBaseClass}>
                                <SelectValue placeholder="Select slide count" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 rounded-lg shadow-sm">
                                {slideCountOptions.map((o) => (
                                  <SelectItem key={o} value={o}>
                                    {o}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className={labelBaseClass}>Purpose / Goal</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
                            {purposeOptions.map((p) => (
                              <Button
                                key={p}
                                variant={formData.purpose === p ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFormData((prev) => ({ ...prev, purpose: p }))}
                                className={`h-9 sm:h-10 md:h-11 px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-wide rounded-md ${formData.purpose === p ? "bg-gray-900 hover:bg-gray-800 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                              >
                                {p}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className={labelBaseClass}>Audience</Label>
                          <Select
                            value={formData.audience}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, audience: value }))}
                          >
                            <SelectTrigger className={inputBaseClass}>
                              <SelectValue placeholder="Select your audience" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200 rounded-lg shadow-sm">
                              {audienceOptions.map((o) => (
                                <SelectItem key={o} value={o}>
                                  {o}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {formData.audience === "Other" && (
                            <Input
                              placeholder="Specify your audience"
                              value={formData.customAudience}
                              onChange={(e) => setFormData((prev) => ({ ...prev, customAudience: e.target.value }))}
                              className={inputBaseClass}
                            />
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label className={labelBaseClass}>Presentation Format</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                            {formatOptions.map((f) => (
                              <Button
                                key={f}
                                variant={formData.format === f ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFormData((prev) => ({ ...prev, format: f }))}
                                className={`h-10 sm:h-11 md:h-12 px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-wide rounded-md ${formData.format === f ? "bg-gray-900 hover:bg-gray-800 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                              >
                                {f}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    {secIndex === 1 && ( // Content
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="topic" className={labelBaseClass}>
                            Topic / Subject Area
                          </Label>
                          <Input
                            id="topic"
                            placeholder="e.g. Customer Insights Summary"
                            value={formData.topic}
                            onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
                            className={inputBaseClass}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="keyPoints" className={labelBaseClass}>
                            Key Points to Cover
                          </Label>
                          <Textarea
                            id="keyPoints"
                            placeholder="Enter each key point on a new line. For example:
• Revenue growth metrics for Q4
• Customer acquisition cost analysis
• Market expansion opportunities
• Team performance highlights"
                            value={formData.keyPoints.join('\n')}
                            onChange={(e) => {
                              const text = e.target.value
                              // Split by newlines but keep empty lines to preserve user formatting
                              const points = text.split('\n')
                              setFormData(prev => ({ ...prev, keyPoints: points }))
                            }}
                            rows={6}
                            className={`resize-y text-base bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 rounded-lg p-4 overflow-y-auto whitespace-pre-wrap`}
                            style={{ minHeight: '150px', maxHeight: '400px' }}
                          />
                          <p className="text-xs text-gray-500">Enter each key point on a new line</p>
                        </div>
                        <Separator className="bg-gray-100" />
                        <div className="space-y-2">
                          <Label className={labelBaseClass}>Upload Reference Files</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:border-gray-400 transition-colors">
                            <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                            <h4 className="text-base font-medium text-gray-900 mb-1">
                              Drop files here or click to upload
                            </h4>
                            <p className="text-gray-600 text-xs mb-3">Supports .pdf, .pptx, .xlsx, .csv</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-300 text-gray-700 hover:bg-gray-100 font-medium h-8 sm:h-9 px-4 sm:px-5 rounded-md text-xs"
                            >
                              CHOOSE FILES
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label className={labelBaseClass}>External Links</Label>
                          <div className="space-y-3">
                            {formData.externalLinks.map((link, index) => (
                              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <LinkIcon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                                <div className="flex-1 space-y-1">
                                  <p className="font-medium text-gray-900 text-sm break-all">{link.url}</p>
                                  {link.note && <p className="text-gray-600 text-xs">{link.note}</p>}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeExternalLink(index)}
                                  className="text-gray-500 hover:text-gray-700 h-7 w-7 rounded-md"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            <div className="space-y-2">
                              <Input
                                placeholder="Enter URL..."
                                value={newLink.url}
                                onChange={(e) => setNewLink((prev) => ({ ...prev, url: e.target.value }))}
                                className={inputBaseClass}
                              />
                              <Input
                                placeholder="Add note (optional)..."
                                value={newLink.note}
                                onChange={(e) => setNewLink((prev) => ({ ...prev, note: e.target.value }))}
                                className={inputBaseClass}
                              />
                              <Button
                                onClick={addExternalLink}
                                size="sm"
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-100 font-medium h-9 sm:h-10 px-4 sm:px-5 rounded-lg text-xs sm:text-sm"
                              >
                                <Plus className="w-4 h-4 mr-1.5" />
                                ADD LINK
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {secIndex === 2 && ( // Style & Branding
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2">
                            <Label className={labelBaseClass}>Template Style</Label>
                            <Select
                              value={formData.templateStyle}
                              onValueChange={(value) => setFormData((prev) => ({ ...prev, templateStyle: value }))}
                            >
                              <SelectTrigger className={inputBaseClass}>
                                <SelectValue placeholder="Select template style" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 rounded-lg shadow-sm">
                                {templateStyles.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className={labelBaseClass}>Font Style</Label>
                            <Select
                              value={formData.fontStyle}
                              onValueChange={(value) => setFormData((prev) => ({ ...prev, fontStyle: value }))}
                            >
                              <SelectTrigger className={inputBaseClass}>
                                <SelectValue placeholder="Select font style" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-200 rounded-lg shadow-sm">
                                {fontStyles.map((f) => (
                                  <SelectItem key={f} value={f}>
                                    {f}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className={labelBaseClass}>Brand Colors (up to 3)</Label>
                          <div className="flex items-center space-x-4">
                            {formData.brandColors.map((color, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="color"
                                  value={color}
                                  onChange={(e) => handleColorChange(e.target.value, index)}
                                  className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeColor(index)}
                                  className="text-gray-500 hover:text-gray-700 h-7 w-7 rounded-md"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            {formData.brandColors.length < 3 && (
                              <Button
                                onClick={addColor}
                                variant="outline"
                                size="sm"
                                className="border-gray-300 text-gray-700 hover:bg-gray-100 font-medium h-9 sm:h-10 px-4 sm:px-5 rounded-lg text-xs sm:text-sm"
                              >
                                <Plus className="w-4 h-4 mr-1.5" />
                                ADD COLOR
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className={labelBaseClass}>Logo / Watermark</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:border-gray-400 transition-colors">
                            <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                            <h4 className="text-base font-medium text-gray-900 mb-1">Upload your logo</h4>
                            <p className="text-gray-600 text-xs mb-3">PNG or SVG format recommended</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-300 text-gray-700 hover:bg-gray-100 font-medium h-8 sm:h-9 px-4 sm:px-5 rounded-md text-xs"
                            >
                              CHOOSE LOGO
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-white p-6 sm:p-8 lg:p-10 xl:p-12 shadow-sm border border-gray-200 text-center rounded-lg">
              <div className="max-w-md mx-auto">
                <p className="text-gray-600 mb-6">Ready to create your presentation?</p>
                <Button
                  onClick={handleDetailedGenerate}
                  disabled={!formData.title || !formData.topic}
                  className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-medium h-12 sm:h-14 px-6 sm:px-8 text-sm rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  Generate Presentation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                {(!formData.title || !formData.topic) && (
                  <p className="text-xs text-gray-500 mt-4">Please fill in the presentation title and topic to continue</p>
                )}
              </div>
            </div>
          </div>
          )}
        </div>
      </section>
    </div>
  )
}