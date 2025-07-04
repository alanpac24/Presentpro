"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  ArrowRight,
  RefreshCw,
  GripVertical,
  Layout,
  MoreVertical,
  Copy,
  MoveUp,
  MoveDown,
  Wand2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PrivateHeader } from "@/components/header"

type SlideLayoutType = "title" | "bullet" | "two-panel" | "three-panel" | "chart" | "table" | "image-text"

interface OutlineSection {
  id: string
  title: string
  content: string
  slideCount: number
  slideLayout: SlideLayoutType
}

interface OutlineData {
  title: string
  sections: OutlineSection[]
}

const slideLayouts = {
  title: "Title Slide",
  bullet: "Bullet Points",
  "two-panel": "Two Panel",
  "three-panel": "Three Panel",
  chart: "Chart/Graph",
  table: "Table/Matrix",
  "image-text": "Image + Text",
}

const initialOutline: OutlineData = {
  title: "Luxury Travel Market Analysis",
  sections: [
    {
      id: "1",
      title: "Executive Summary",
      content: "Overview of key findings and strategic recommendations",
      slideCount: 2,
      slideLayout: "bullet",
    },
    {
      id: "2",
      title: "Market Overview",
      content: "Current state of the luxury travel industry and growth projections",
      slideCount: 3,
      slideLayout: "chart",
    },
    {
      id: "3",
      title: "Competitive Landscape",
      content: "Analysis of key players and market positioning",
      slideCount: 2,
      slideLayout: "table",
    },
    {
      id: "4",
      title: "Customer Insights",
      content: "Deep dive into luxury traveler preferences and behaviors",
      slideCount: 3,
      slideLayout: "two-panel",
    },
    {
      id: "5",
      title: "Technology Trends",
      content: "AI-powered personalization and booking experiences",
      slideCount: 2,
      slideLayout: "image-text",
    },
    {
      id: "6",
      title: "Strategic Recommendations",
      content: "Actionable insights and next steps",
      slideCount: 2,
      slideLayout: "bullet",
    },
  ],
}

const SlideLayoutPreview = ({ layout }: { layout: SlideLayoutType }) => {
  switch (layout) {
    case "title":
      return (
        <div className="w-16 h-12 bg-white border border-gray-300 rounded p-1 flex flex-col justify-center items-center">
          <div className="w-10 h-1.5 bg-gray-300 rounded mb-1"></div>
          <div className="w-6 h-0.5 bg-gray-200 rounded"></div>
        </div>
      )
    case "bullet":
      return (
        <div className="w-16 h-12 bg-white border border-gray-300 rounded p-1">
          <div className="w-8 h-1 bg-gray-300 rounded mb-1"></div>
          <div className="flex flex-col space-y-0.5">
            <div className="w-6 h-0.5 bg-gray-200 rounded"></div>
            <div className="w-5 h-0.5 bg-gray-200 rounded"></div>
            <div className="w-6 h-0.5 bg-gray-200 rounded"></div>
          </div>
        </div>
      )
    case "two-panel":
      return (
        <div className="w-16 h-12 bg-white border border-gray-300 rounded p-1">
          <div className="w-8 h-1 bg-gray-300 rounded mb-1"></div>
          <div className="flex space-x-1">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      )
    case "three-panel":
      return (
        <div className="w-16 h-12 bg-white border border-gray-300 rounded p-1">
          <div className="w-8 h-1 bg-gray-300 rounded mb-1"></div>
          <div className="flex space-x-0.5">
            <div className="w-4 h-6 bg-gray-200 rounded"></div>
            <div className="w-4 h-6 bg-gray-200 rounded"></div>
            <div className="w-4 h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      )
    case "chart":
      return (
        <div className="w-16 h-12 bg-white border border-gray-300 rounded p-1">
          <div className="w-8 h-1 bg-gray-300 rounded mb-1"></div>
          <div className="w-12 h-6 bg-gray-200 rounded flex items-end justify-center p-1">
            <div className="flex items-end space-x-0.5">
              <div className="w-0.5 h-2 bg-gray-400 rounded"></div>
              <div className="w-0.5 h-3 bg-gray-400 rounded"></div>
              <div className="w-0.5 h-1.5 bg-gray-400 rounded"></div>
              <div className="w-0.5 h-2.5 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>
      )
    case "table":
      return (
        <div className="w-16 h-12 bg-white border border-gray-300 rounded p-1">
          <div className="w-8 h-1 bg-gray-300 rounded mb-1"></div>
          <div className="grid grid-cols-3 gap-0.5">
            <div className="w-3 h-1 bg-gray-300 rounded"></div>
            <div className="w-3 h-1 bg-gray-300 rounded"></div>
            <div className="w-3 h-1 bg-gray-300 rounded"></div>
            <div className="w-3 h-0.5 bg-gray-200 rounded"></div>
            <div className="w-3 h-0.5 bg-gray-200 rounded"></div>
            <div className="w-3 h-0.5 bg-gray-200 rounded"></div>
            <div className="w-3 h-0.5 bg-gray-200 rounded"></div>
            <div className="w-3 h-0.5 bg-gray-200 rounded"></div>
            <div className="w-3 h-0.5 bg-gray-200 rounded"></div>
          </div>
        </div>
      )
    case "image-text":
      return (
        <div className="w-16 h-12 bg-white border border-gray-300 rounded p-1">
          <div className="w-8 h-1 bg-gray-300 rounded mb-1"></div>
          <div className="flex space-x-1">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="flex flex-col space-y-0.5 flex-1">
              <div className="w-4 h-0.5 bg-gray-200 rounded"></div>
              <div className="w-3 h-0.5 bg-gray-200 rounded"></div>
              <div className="w-5 h-0.5 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      )
    default:
      return (
        <div className="w-16 h-12 bg-white border border-gray-300 rounded p-1">
          <div className="w-12 h-8 bg-gray-200 rounded"></div>
        </div>
      )
  }
}

export default function OutlineEditorPage() {
  const router = useRouter()
  const [outline, setOutline] = useState<OutlineData>(initialOutline)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [regeneratePrompt, setRegeneratePrompt] = useState("")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  // Load presentation data from sessionStorage and generate appropriate outline
  useEffect(() => {
    const storedData = sessionStorage.getItem("presentationData")
    if (storedData) {
      const data = JSON.parse(storedData)
      
      // Generate outline based on the presentation data
      if (data.type === "quick") {
        // For quick generation, create a simple outline based on the prompt
        setOutline({
          title: data.prompt.slice(0, 50) + (data.prompt.length > 50 ? "..." : ""),
          sections: [
            {
              id: "1",
              title: "Introduction",
              content: "Opening remarks and context setting",
              slideCount: 1,
              slideLayout: "title",
            },
            {
              id: "2",
              title: "Main Content",
              content: "Core presentation content based on your request",
              slideCount: 3,
              slideLayout: "bullet",
            },
            {
              id: "3",
              title: "Analysis",
              content: "Detailed analysis and insights",
              slideCount: 2,
              slideLayout: "chart",
            },
            {
              id: "4",
              title: "Recommendations",
              content: "Key recommendations and action items",
              slideCount: 2,
              slideLayout: "two-panel",
            },
            {
              id: "5",
              title: "Conclusion",
              content: "Summary and next steps",
              slideCount: 1,
              slideLayout: "bullet",
            },
          ],
        })
      } else if (data.type === "detailed") {
        // For detailed planning, create a more comprehensive outline
        const formData = data.formData
        const slideCount = formData.slideCount === "Let AI Decide" ? 15 : parseInt(formData.slideCount) || 10
        
        // Generate sections based on purpose and slide count
        const sections: OutlineSection[] = []
        
        // Always start with a title slide
        sections.push({
          id: "1",
          title: "Title Slide",
          content: formData.title,
          slideCount: 1,
          slideLayout: "title",
        })
        
        // Add sections based on purpose
        if (formData.purpose === "Sales Pitch") {
          sections.push(
            {
              id: "2",
              title: "Problem Statement",
              content: "Current challenges and pain points",
              slideCount: 2,
              slideLayout: "bullet",
            },
            {
              id: "3",
              title: "Our Solution",
              content: "How we solve the identified problems",
              slideCount: 3,
              slideLayout: "two-panel",
            },
            {
              id: "4",
              title: "Value Proposition",
              content: "Key benefits and ROI",
              slideCount: 2,
              slideLayout: "chart",
            },
            {
              id: "5",
              title: "Case Studies",
              content: "Success stories and testimonials",
              slideCount: 2,
              slideLayout: "image-text",
            }
          )
        } else if (formData.purpose === "Training") {
          sections.push(
            {
              id: "2",
              title: "Learning Objectives",
              content: "What participants will learn",
              slideCount: 1,
              slideLayout: "bullet",
            },
            {
              id: "3",
              title: "Core Concepts",
              content: "Fundamental knowledge and principles",
              slideCount: Math.floor(slideCount * 0.4),
              slideLayout: "two-panel",
            },
            {
              id: "4",
              title: "Practical Examples",
              content: "Real-world applications",
              slideCount: Math.floor(slideCount * 0.3),
              slideLayout: "image-text",
            },
            {
              id: "5",
              title: "Exercises",
              content: "Hands-on practice activities",
              slideCount: 2,
              slideLayout: "bullet",
            }
          )
        } else {
          // Generic structure for other purposes
          sections.push(
            {
              id: "2",
              title: "Executive Summary",
              content: "Overview of key points",
              slideCount: 2,
              slideLayout: "bullet",
            },
            {
              id: "3",
              title: "Background & Context",
              content: "Setting the stage",
              slideCount: 2,
              slideLayout: "two-panel",
            },
            {
              id: "4",
              title: "Main Analysis",
              content: formData.topic || "Core content and insights",
              slideCount: Math.floor(slideCount * 0.4),
              slideLayout: "chart",
            },
            {
              id: "5",
              title: "Recommendations",
              content: "Strategic recommendations",
              slideCount: 2,
              slideLayout: "bullet",
            }
          )
        }
        
        // Add conclusion
        sections.push({
          id: (sections.length + 1).toString(),
          title: "Next Steps",
          content: "Action plan and timeline",
          slideCount: 1,
          slideLayout: "bullet",
        })
        
        setOutline({
          title: formData.title,
          sections: sections,
        })
      }
    }
  }, [])

  const handleLogout = () => {
    router.push("/signin")
  }

  const updateSection = (sectionId: string, updates: Partial<OutlineSection>) => {
    setOutline((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === sectionId ? { ...section, ...updates } : section)),
    }))
  }

  const deleteSection = (sectionId: string) => {
    setOutline((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }))
  }

  const duplicateSection = (sectionId: string) => {
    const sectionToDuplicate = outline.sections.find((section) => section.id === sectionId)
    if (sectionToDuplicate) {
      const newSection: OutlineSection = {
        ...sectionToDuplicate,
        id: Date.now().toString(),
        title: `${sectionToDuplicate.title} (Copy)`,
      }
      const sectionIndex = outline.sections.findIndex((section) => section.id === sectionId)
      const newSections = [...outline.sections]
      newSections.splice(sectionIndex + 1, 0, newSection)
      setOutline((prev) => ({ ...prev, sections: newSections }))
    }
  }

  const addSection = () => {
    const newSection: OutlineSection = {
      id: Date.now().toString(),
      title: "New Section",
      content: "Section description",
      slideCount: 1,
      slideLayout: "bullet",
    }
    setOutline((prev) => ({ ...prev, sections: [...prev.sections, newSection] }))
  }

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...outline.sections]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex >= 0 && targetIndex < newSections.length) {
      ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]
      setOutline((prev) => ({ ...prev, sections: newSections }))
    }
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", "")
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null) return

    const newSections = [...outline.sections]
    const draggedSection = newSections[draggedIndex]

    // Remove the dragged section
    newSections.splice(draggedIndex, 1)

    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex
    newSections.splice(insertIndex, 0, draggedSection)

    setOutline((prev) => ({ ...prev, sections: newSections }))
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const regenerateOutline = async () => {
    if (!regeneratePrompt.trim()) return

    setIsRegenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const regeneratedSections: OutlineSection[] = [
      {
        id: "regen-1",
        title: "Introduction",
        content: "Opening section based on your prompt",
        slideCount: 1,
        slideLayout: "title",
      },
      {
        id: "regen-2",
        title: "Main Analysis",
        content: "Core content addressing your requirements",
        slideCount: 3,
        slideLayout: "chart",
      },
      {
        id: "regen-3",
        title: "Key Findings",
        content: "Primary insights from analysis",
        slideCount: 2,
        slideLayout: "bullet",
      },
      {
        id: "regen-4",
        title: "Recommendations",
        content: "Strategic recommendations and next steps",
        slideCount: 2,
        slideLayout: "two-panel",
      },
    ]

    setOutline((prev) => ({
      ...prev,
      sections: regeneratedSections,
    }))

    setIsRegenerating(false)
    setRegeneratePrompt("")
  }

  const generatePresentation = () => {
    sessionStorage.setItem(
      "presentationData",
      JSON.stringify({ type: "outline", outline: outline, timestamp: Date.now() }),
    )
    router.push("/presentation-loading")
  }

  const calculateTotalSlides = () => {
    return outline.sections.reduce((total, section) => total + section.slideCount, 0)
  }

  const getSlideNumbers = (sectionIndex: number) => {
    let startSlide = 1
    for (let i = 0; i < sectionIndex; i++) {
      startSlide += outline.sections[i].slideCount
    }
    const endSlide = startSlide + outline.sections[sectionIndex].slideCount - 1
    return startSlide === endSlide ? `${startSlide}` : `${startSlide}-${endSlide}`
  }

  const labelBaseClass = "text-sm sm:text-base font-medium text-gray-900"
  const inputBaseClass =
    "h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:ring-0 rounded-lg"

  return (
    <div className="min-h-screen bg-white">
      <PrivateHeader />
      
      {/* Header Section */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8 sm:py-12">
          <Link href="/presentation-planner" className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Planner
          </Link>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light mb-2">Outline Editor</h1>
              <p className="text-gray-600">Review and customize your presentation structure</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{calculateTotalSlides()} slides</span>
              <Button onClick={generatePresentation} className="bg-gray-900 hover:bg-gray-800">
                <ArrowRight className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-6">

          <div className="space-y-8">
            {/* Regenerate Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                <span className="font-medium">Regenerate Outline</span>
              </div>
              <Textarea
                value={regeneratePrompt}
                onChange={(e) => setRegeneratePrompt(e.target.value)}
                placeholder="Describe what you want to change..."
                rows={3}
                className="mb-4"
              />
              <Button onClick={regenerateOutline} disabled={!regeneratePrompt.trim() || isRegenerating} variant="outline">
                {isRegenerating ? "Regenerating..." : "Regenerate"}
              </Button>
            </div>

            {/* Title */}
            <div className="mb-6">
              <Input
                value={outline.title}
                onChange={(e) => setOutline((prev) => ({ ...prev, title: e.target.value }))}
                className="text-xl font-light border-0 px-0 focus-visible:ring-0"
                placeholder="Presentation Title"
              />
            </div>

            {/* Sections */}
            <div className="space-y-4">
              {outline.sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 bg-white ${
                    dragOverIndex === index ? "border-blue-400 bg-blue-50" : ""
                  } ${draggedIndex === index ? "opacity-50 scale-95" : ""}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                >
                  {editingSection === section.id ? (
                    <div className="space-y-3">
                      <Input
                        value={section.title}
                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                        placeholder="Section title"
                      />
                      <Textarea
                        value={section.content}
                        onChange={(e) => updateSection(section.id, { content: e.target.value })}
                        placeholder="Section description"
                        rows={2}
                      />
                      <div className="flex items-center space-x-3">
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          value={section.slideCount}
                          onChange={(e) =>
                            updateSection(section.id, { slideCount: Number.parseInt(e.target.value) || 1 })
                          }
                          className="w-20"
                          placeholder="Slides"
                        />
                        <Button size="sm" onClick={() => setEditingSection(null)}>
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                  <div className="flex items-start justify-between">
                    {/* Left: Slide Numbers and Drag Handle */}
                    <div className="flex items-start space-x-3">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[40px] text-center">
                          {getSlideNumbers(index)}
                        </div>
                        <div
                          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded transition-colors"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <GripVertical className="w-3 h-3 text-gray-400" />
                        </div>
                      </div>

                      {/* Middle: Section Content */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-base font-medium">{section.title}</h3>
                          <span className="text-xs text-gray-500">
                            {section.slideCount} slide{section.slideCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{section.content}</p>
                      </div>
                    </div>

                    {/* Right: Slide Layout and Actions */}
                    <div className="flex items-center space-x-3">
                      {/* Slide Layout Preview */}
                      <div className="flex items-center space-x-2">
                        <SlideLayoutPreview layout={section.slideLayout} />
                        <div className="text-xs text-gray-600">{slideLayouts[section.slideLayout]}</div>
                      </div>

                      {/* Actions Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setEditingSection(section.id)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit Section
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateSection(section.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate Section
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => moveSection(index, "up")} disabled={index === 0}>
                            <MoveUp className="mr-2 h-4 w-4" />
                            Move Up
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => moveSection(index, "down")}
                            disabled={index === outline.sections.length - 1}
                          >
                            <MoveDown className="mr-2 h-4 w-4" />
                            Move Down
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <Layout className="mr-2 h-4 w-4" />
                              Change Layout
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="w-48">
                              {Object.entries(slideLayouts).map(([key, label]) => (
                                <DropdownMenuItem
                                  key={key}
                                  onClick={() => updateSection(section.id, { slideLayout: key as SlideLayoutType })}
                                  className={section.slideLayout === key ? "bg-gray-100" : ""}
                                >
                                  <div className="flex items-center space-x-2">
                                    <SlideLayoutPreview layout={key as SlideLayoutType} />
                                    <span>{label}</span>
                                  </div>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteSection(section.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Section
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  )}
                </div>
              ))}

              <Button variant="outline" onClick={addSection} className="w-full h-12 border-dashed bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}