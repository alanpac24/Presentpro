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
  const [quickPrompt, setQuickPrompt] = useState("")

  const [formData, setFormData] = useState<PresentationData>({
    title: "",
    purpose: "",
    audience: "",
    customAudience: "",
    slideCount: "",
    format: "",
    topic: "",
    keyPoints: [""],
    uploadedFiles: [],
    externalLinks: [],
    templateStyle: "",
    brandColors: [],
    fontStyle: "",
    logo: null,
  })

  const [newKeyPoint, setNewKeyPoint] = useState("")
  const [newLink, setNewLink] = useState({ url: "", note: "" })

  const handleLogout = () => {
    router.push("/signin")
  }

  const handleQuickGenerate = async () => {
    if (!quickPrompt.trim()) return
    sessionStorage.setItem(
      "presentationData",
      JSON.stringify({ type: "quick", prompt: quickPrompt, timestamp: Date.now() }),
    )
    router.push("/presentation-loading")
  }

  const handleDetailedGenerate = async () => {
    sessionStorage.setItem(
      "presentationData",
      JSON.stringify({ type: "detailed", formData: formData, timestamp: Date.now() }),
    )
    router.push("/presentation-loading")
  }

  const addKeyPoint = () => {
    if (newKeyPoint.trim()) {
      setFormData((prev) => ({
        ...prev,
        keyPoints: [...prev.keyPoints.filter((p) => p), newKeyPoint.trim()],
      }))
      setNewKeyPoint("")
    }
  }

  const removeKeyPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, i) => i !== index),
    }))
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
    "h-12 text-base bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 rounded-lg" // Adjusted height to h-12 for consistency
  const labelBaseClass = "text-base font-medium text-gray-900" // Adjusted font size
  const sectionTitleClass = "text-3xl lg:text-4xl font-light text-gray-900 mb-4 tracking-tight"
  const sectionDescriptionClass = "text-lg text-gray-600 font-light mb-8" // Adjusted font size

  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />
      {/* Header Section */}
      <section className="pt-12 pb-16 px-6 lg:px-8 bg-gray-50">
        {" "}
        {/* Adjusted padding */}
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            {" "}
            {/* Adjusted margin */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-gray-700 hover:text-gray-900 mb-8 text-sm font-medium tracking-wide rounded-lg"
            >
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK TO DASHBOARD
              </Link>
            </Button>
            <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium tracking-wide uppercase mb-8 rounded-md">
              {" "}
              {/* Adjusted style */}
              AI-Powered Presentation Creation
            </div>
            <h1 className="text-5xl lg:text-6xl font-light text-gray-900 mb-6 tracking-tight leading-tight">
              {" "}
              {/* Adjusted margin */}
              Create Your
              <span className="block text-gray-600">Perfect Presentation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-4xl leading-relaxed font-light">
              {" "}
              {/* Adjusted margin & font size */}
              Generate professional presentations with AI assistance. Choose between quick generation or detailed
              planning for maximum customization.
            </p>
          </div>
        </div>
      </section>
      {/* Content Section */}
      <section className="py-16 lg:py-20 px-6 lg:px-8">
        {" "}
        {/* Adjusted padding */}
        <div className="max-w-5xl mx-auto">
          <div className="space-y-12">
            {" "}
            {/* Adjusted spacing */}
            <div className="text-center mb-16">
              {" "}
              {/* Adjusted margin */}
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
                {" "}
                {/* Adjusted margin */}
                Quick Start
                <span className="block text-gray-600">with AI Prompt</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
                {" "}
                {/* Adjusted font size */}
                Tell our AI what you want to present, and we'll create a professional presentation tailored to your
                needs.
              </p>
            </div>
            <div className="bg-white p-8 lg:p-12 shadow-sm border border-gray-200 rounded-lg">
              {" "}
              {/* Adjusted padding & rounded */}
              <div className="space-y-8">
                {" "}
                {/* Adjusted spacing */}
                <div className="space-y-3">
                  {" "}
                  {/* Adjusted spacing */}
                  <Label htmlFor="prompt" className={labelBaseClass}>
                    Describe your presentation
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Example: Create a 15-slide presentation about Q4 sales performance for executives, focusing on revenue growth, key wins, and 2024 strategy recommendations..."
                    value={quickPrompt}
                    onChange={(e) => setQuickPrompt(e.target.value)}
                    rows={8} /* Adjusted rows */
                    className={`resize-none text-base bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 rounded-lg p-4`} /* Adjusted style */
                  />
                </div>
                <div className="bg-gray-50 p-6 lg:p-8 rounded-lg">
                  {" "}
                  {/* Adjusted padding & rounded */}
                  <h4 className="text-lg font-medium text-gray-900 mb-6">Best Practices for AI Generation</h4>{" "}
                  {/* Adjusted font & margin */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {" "}
                    {/* Adjusted gap */}
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3 text-base">Include These Details:</h5>{" "}
                      {/* Adjusted font & margin */}
                      <ul className="text-gray-600 space-y-2.5 text-sm">
                        {" "}
                        {/* Adjusted font & spacing */}
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>Target
                          audience
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>Main
                          topic and key points
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
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>Inform,
                          persuade, or educate
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>Context
                          and background
                        </li>
                        <li className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>Desired
                          tone and style
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleQuickGenerate}
                  disabled={!quickPrompt.trim()}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium h-12 text-base tracking-wide rounded-lg" /* Adjusted height & font */
                  size="lg"
                >
                  <Wand2 className="w-5 h-5 mr-2.5" /> {/* Adjusted margin */}
                  GENERATE PRESENTATION
                  <ArrowRight className="w-5 h-5 ml-2.5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center py-12">
            {" "}
            {/* Adjusted padding */}
            <div className="flex items-center space-x-3">
              {" "}
              {/* Adjusted spacing */}
              <div className="h-px bg-gray-200 w-20"></div> {/* Adjusted color & width */}
              <span className="text-gray-500 text-sm font-medium tracking-wide">OR</span> {/* Adjusted font */}
              <div className="h-px bg-gray-200 w-20"></div>
            </div>
          </div>

          <div className="space-y-16">
            {" "}
            {/* Adjusted spacing */}
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 tracking-tight">
                Detailed
                <span className="block text-gray-600">Planning</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
                Customize every aspect of your presentation for maximum impact and precision.
              </p>
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

                <div className="bg-white p-8 lg:p-12 shadow-sm border border-gray-200 rounded-lg">
                  <div className="space-y-8">
                    {/* Specific form fields will go here, matching the section */}
                    {secIndex === 0 && ( // Basics
                      <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {purposeOptions.map((p) => (
                              <Button
                                key={p}
                                variant={formData.purpose === p ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFormData((prev) => ({ ...prev, purpose: p }))}
                                className={`h-11 text-xs font-medium tracking-wide rounded-md ${formData.purpose === p ? "bg-gray-900 hover:bg-gray-800 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
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
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {formatOptions.map((f) => (
                              <Button
                                key={f}
                                variant={formData.format === f ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFormData((prev) => ({ ...prev, format: f }))}
                                className={`h-12 text-xs font-medium tracking-wide rounded-md ${formData.format === f ? "bg-gray-900 hover:bg-gray-800 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
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
                        <div className="space-y-3">
                          <Label className={labelBaseClass}>Key Points to Cover</Label>
                          <div className="space-y-3">
                            {formData.keyPoints
                              .filter((p) => p)
                              .map((point, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <Badge
                                    variant="secondary"
                                    className="flex-shrink-0 bg-gray-200 text-gray-700 text-xs px-2 py-0.5"
                                  >
                                    {index + 1}
                                  </Badge>
                                  <span className="flex-1 text-gray-900 text-sm">{point}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeKeyPoint(index)}
                                    className="text-gray-500 hover:text-gray-700 h-7 w-7 rounded-md"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            <div className="flex items-center space-x-3">
                              <Input
                                placeholder="Add a key point..."
                                value={newKeyPoint}
                                onChange={(e) => setNewKeyPoint(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && addKeyPoint()}
                                className={`${inputBaseClass} h-11 text-sm`}
                              />
                              <Button
                                onClick={addKeyPoint}
                                size="sm"
                                className="h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 rounded-lg text-sm"
                              >
                                <Plus className="w-4 h-4 mr-1.5" />
                                ADD
                              </Button>
                            </div>
                          </div>
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
                              className="border-gray-300 text-gray-700 hover:bg-gray-100 font-medium h-9 px-5 rounded-md text-xs"
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
                                className={`${inputBaseClass} h-11 text-sm`}
                              />
                              <Input
                                placeholder="Add note (optional)..."
                                value={newLink.note}
                                onChange={(e) => setNewLink((prev) => ({ ...prev, note: e.target.value }))}
                                className={`${inputBaseClass} h-11 text-sm`}
                              />
                              <Button
                                onClick={addExternalLink}
                                size="sm"
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-100 font-medium h-10 rounded-lg text-xs"
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                className="border-gray-300 text-gray-700 hover:bg-gray-100 font-medium h-10 rounded-lg text-xs"
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
                              className="border-gray-300 text-gray-700 hover:bg-gray-100 font-medium h-9 px-5 rounded-md text-xs"
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
            <div className="bg-white p-8 lg:p-12 shadow-sm border border-gray-200 text-center rounded-lg">
              <Button
                onClick={handleDetailedGenerate}
                disabled={!formData.title || !formData.topic}
                className="bg-gray-900 hover:bg-gray-800 text-white font-medium h-12 px-10 text-base tracking-wide rounded-lg" /* Adjusted style */
                size="lg"
              >
                <Wand2 className="w-5 h-5 mr-2.5" />
                GENERATE DETAILED PRESENTATION
                <ArrowRight className="w-5 h-5 ml-2.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}