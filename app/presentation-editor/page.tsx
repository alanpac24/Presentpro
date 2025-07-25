"use client"

import { useState, useEffect, useRef } from "react"
import { PresentationEditorHeader } from "./components/PresentationEditorHeader"
import { AIAssistant } from "./components/AIAssistant"
import { SlideView } from "./components/SlideView"
import { SlideCarousel } from "./components/SlideCarousel"
import { useEditUsage } from "@/hooks/useEditUsage"
import { EditUsageToast } from "@/components/edit-usage-toast"
import { EditLimitModal } from "@/components/edit-limit-modal"
import { VersionHistoryModal } from "@/components/version-history-modal"

const mockSlides = [
  {
    id: 1,
    title: "Executive Summary",
    type: "title",
    content: "# Q4 Performance Overview\n\nKey highlights and strategic insights.",
  },
  {
    id: 2,
    title: "Market Analysis",
    type: "content",
    content: "## Market Trends\n\n• Revenue growth of 23% YoY\n• Market share increased to 15.2%",
  },
  {
    id: 3,
    title: "Revenue Growth",
    type: "chart",
    content: "## Financial Performance\n\nConsistent growth across all quarters.",
  },
  {
    id: 4,
    title: "Go-to-Market Strategy",
    type: "strategy",
    content: "## Strategic Approach\n\n• Target enterprise customers\n• Expand international presence",
  },
  {
    id: 5,
    title: "Timeline & Milestones",
    type: "timeline",
    content: "## Project Timeline\n\nKey milestones for the upcoming quarter.",
  },
]

export default function PresentationEditorPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [slides, setSlides] = useState(mockSlides)
  const [presentationTitle, setPresentationTitle] = useState("Q4 Performance Overview")
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [zoom, setZoom] = useState(150)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(400)
  const [isResizing, setIsResizing] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [currentElements, setCurrentElements] = useState<any[]>([])
  const [pendingAIAction, setPendingAIAction] = useState<any>(null)
  const [isLoadingGenerated, setIsLoadingGenerated] = useState(true)
  
  // Edit usage tracking
  const {
    usage,
    limit,
    remaining,
    showToast,
    showModal,
    incrementUsage,
    dismissModal,
    userTier,
    isUnlimited
  } = useEditUsage()

  const currentSlide = slides.length > 0 && currentSlideIndex >= 0 && currentSlideIndex < slides.length 
    ? slides[currentSlideIndex]
    : null
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState(Date.now())

  // Load AI-generated presentation if available
  useEffect(() => {
    const generatedData = sessionStorage.getItem("generatedPresentation")
    if (generatedData) {
      try {
        const { slides: generatedSlides, title } = JSON.parse(generatedData)
        
        // Transform generated slides to match our format
        const formattedSlides = generatedSlides.map((slide: any, index: number) => ({
          id: index + 1,
          title: slide.title,
          type: slide.type || "content",
          content: formatSlideContent(slide),
        }))
        
        setSlides(formattedSlides)
        setPresentationTitle(title)
        
        // Clear the session storage
        sessionStorage.removeItem("generatedPresentation")
      } catch (error) {
        console.error("Error loading generated presentation:", error)
      }
    }
    setIsLoadingGenerated(false)
  }, [])

  // Helper function to format slide content
  const formatSlideContent = (slide: any) => {
    let content = `## ${slide.title}\n\n`
    
    if (slide.content) {
      content += slide.content + '\n\n'
    }
    
    if (slide.bullets && slide.bullets.length > 0) {
      content += slide.bullets.map((bullet: string) => `• ${bullet}`).join('\n')
    }
    
    if (slide.speakerNotes) {
      content += `\n\n---\n**Speaker Notes:** ${slide.speakerNotes}`
    }
    
    return content
  }

  // Auto-save when there are changes
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const timeoutId = setTimeout(() => {
      // Perform auto-save
      setIsAutoSaving(true)
      setHasUnsavedChanges(false)
      setLastSavedAt(Date.now())
      
      // Simulate save completion
      setTimeout(() => setIsAutoSaving(false), 1500)
    }, 2000) // Save 2 seconds after last change

    return () => clearTimeout(timeoutId)
  }, [hasUnsavedChanges, slides, presentationTitle])

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarWidth(0) // Hide sidebar on mobile
      } else if (window.innerWidth < 1024) {
        setSidebarWidth(320) // Smaller sidebar on tablet
      } else {
        setSidebarWidth(400) // Default on desktop
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      // Calculate new width based on mouse position
      const minWidth = window.innerWidth < 1024 ? 280 : 400
      const maxWidth = window.innerWidth < 1024 ? 400 : 800
      const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX))
      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      // Set cursor and disable text selection for entire document
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])


  const handleSlideChange = (index: number) => {
    setCurrentSlideIndex(index)
    setSelectedElement(null)
    setZoom(100)
    setPanOffset({ x: 0, y: 0 })
  }

  const handleSlideUpdate = (slideId: number, updates: Partial<(typeof mockSlides)[0]>) => {
    setSlides((prev) => prev.map((slide) => (slide.id === slideId ? { ...slide, ...updates } : slide)))
    setHasUnsavedChanges(true)
  }

  const handleSlidesReorder = (newSlides: typeof mockSlides) => {
    setSlides(newSlides)
    setHasUnsavedChanges(true)
  }

  const handleSlideDelete = (slideId: number) => {
    setSlides((prev) => prev.filter((slide) => slide.id !== slideId))
    setIsAutoSaving(true)
    setTimeout(() => setIsAutoSaving(false), 1500)
  }

  const handleSlideRename = (slideId: number, newTitle: string) => {
    setSlides((prev) => prev.map((slide) => 
      slide.id === slideId ? { ...slide, title: newTitle } : slide
    ))
    setIsAutoSaving(true)
    setTimeout(() => setIsAutoSaving(false), 1500)
  }

  const handleSlideAdd = () => {
    // Check edit limit
    if (!incrementUsage()) {
      return // Edit blocked
    }
    
    const newSlide = {
      id: Math.max(...slides.map(s => s.id)) + 1,
      title: `Slide ${slides.length + 1}`,
      type: "content" as const,
      content: "## New Slide\\n\\nClick to add content",
    }
    setSlides((prev) => [...prev, newSlide])
    setCurrentSlideIndex(slides.length)
    setIsAutoSaving(true)
    setTimeout(() => setIsAutoSaving(false), 1500)
  }

  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.max(75, Math.min(300, newZoom)))
    if (newZoom <= 150) setPanOffset({ x: 0, y: 0 })
  }

  const handlePanChange = (deltaX: number, deltaY: number) => {
    if (zoom > 150) {
      setPanOffset((prev) => ({
        x: Math.max(-100, Math.min(100, prev.x + deltaX)),
        y: Math.max(-100, Math.min(100, prev.y + deltaY)),
      }))
    }
  }

  // currentSlide is already defined above

  return (
    <div className="fixed inset-0 bg-white flex flex-col overflow-hidden">
      <PresentationEditorHeader
        title={presentationTitle}
        onTitleChange={setPresentationTitle}
        isAutoSaving={isAutoSaving}
        onVersionHistory={() => setShowVersionHistory(true)}
      />
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        {!isMobile && (
          <div style={{ width: `${sidebarWidth}px`, flexShrink: 0 }} className="overflow-hidden">
            <AIAssistant 
              currentSlide={currentSlide} 
              elements={currentElements}
              onAction={(action) => {
                // Handle AI actions - pass to SlideView
                if (action && action.type) {
                  setPendingAIAction(action)
                }
              }}
              width={sidebarWidth}
              onResizeStart={() => {
                setIsResizing(true)
              }}
              onSlideUpdate={handleSlideUpdate}
            />
          </div>
        )}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <SlideView
            slide={currentSlide}
            selectedElement={selectedElement}
            onElementSelect={setSelectedElement}
            zoom={zoom}
            panOffset={panOffset}
            onZoomChange={handleZoomChange}
            onPanChange={handlePanChange}
            incrementUsage={incrementUsage}
            onElementsChange={setCurrentElements}
            pendingAIAction={pendingAIAction}
            onAIActionComplete={() => setPendingAIAction(null)}
          />
          <SlideCarousel 
            slides={slides} 
            currentSlideIndex={currentSlideIndex} 
            onSlideChange={handleSlideChange}
            onSlidesReorder={handleSlidesReorder}
            onSlideDelete={handleSlideDelete}
            onSlideRename={handleSlideRename}
            onSlideAdd={handleSlideAdd}
            sidebarWidth={0}
          />
        </div>
      </div>
      
      {showToast && (
        <EditUsageToast 
          show={showToast}
          usage={usage}
          limit={limit}
          remaining={remaining}
        />
      )}
      
      <EditLimitModal
        show={showModal}
        onDismiss={dismissModal}
        userTier={userTier || "Free"}
        usage={usage}
        limit={limit}
      />
      
      <VersionHistoryModal
        open={showVersionHistory}
        onOpenChange={setShowVersionHistory}
        presentationTitle={presentationTitle}
        versions={[]}
        onRestore={(versionId) => {
          // TODO: Implement version restore functionality
          setShowVersionHistory(false)
        }}
        onPreview={(versionId) => {
          // TODO: Implement version preview functionality
        }}
      />
    </div>
  )
}