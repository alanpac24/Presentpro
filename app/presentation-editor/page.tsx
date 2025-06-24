"use client"

import { useState, useEffect } from "react"
import { PresentationEditorHeader } from "./components/PresentationEditorHeader"
import { SlideSidebar } from "./components/SlideSidebar"
import { SlideView } from "./components/SlideView"
import { SlideCarousel } from "./components/SlideCarousel"

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
  const [zoom, setZoom] = useState(100)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(400)
  const [isResizing, setIsResizing] = useState(false)

  const currentSlide = slides[currentSlideIndex]

  useEffect(() => {
    const autoSave = () => {
      setIsAutoSaving(true)
      setTimeout(() => setIsAutoSaving(false), 1500)
    }
    const intervalId = setInterval(autoSave, 30000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      // Calculate new width based on mouse position
      const newWidth = Math.max(400, Math.min(800, e.clientX))
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
    setIsAutoSaving(true)
    setTimeout(() => setIsAutoSaving(false), 1500)
  }

  const handleSlidesReorder = (newSlides: typeof mockSlides) => {
    setSlides(newSlides)
    setIsAutoSaving(true)
    setTimeout(() => setIsAutoSaving(false), 1500)
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
    setZoom(Math.max(50, Math.min(200, newZoom)))
    if (newZoom <= 100) setPanOffset({ x: 0, y: 0 })
  }

  const handlePanChange = (deltaX: number, deltaY: number) => {
    if (zoom > 100) {
      setPanOffset((prev) => ({
        x: Math.max(-100, Math.min(100, prev.x + deltaX)),
        y: Math.max(-100, Math.min(100, prev.y + deltaY)),
      }))
    }
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden relative">
      <PresentationEditorHeader
        title={presentationTitle}
        onTitleChange={setPresentationTitle}
        isAutoSaving={isAutoSaving}
      />
      <div className="flex-1 flex overflow-hidden relative">
        <div style={{ width: `${sidebarWidth}px`, flexShrink: 0 }}>
          <SlideSidebar 
            currentSlide={currentSlide} 
            selectedElement={selectedElement} 
            onSlideUpdate={handleSlideUpdate}
            width={sidebarWidth}
            onResizeStart={() => {
              setIsResizing(true)
            }}
          />
        </div>
        <div className="flex-1 flex flex-col" style={{ width: `calc(100% - ${sidebarWidth}px)` }}>
          <SlideView
            slide={currentSlide}
            selectedElement={selectedElement}
            onElementSelect={setSelectedElement}
            zoom={zoom}
            panOffset={panOffset}
            onZoomChange={handleZoomChange}
            onPanChange={handlePanChange}
          />
          <SlideCarousel 
            slides={slides} 
            currentSlideIndex={currentSlideIndex} 
            onSlideChange={handleSlideChange}
            onSlidesReorder={handleSlidesReorder}
            onSlideDelete={handleSlideDelete}
            onSlideRename={handleSlideRename}
            onSlideAdd={handleSlideAdd}
            sidebarWidth={sidebarWidth}
          />
        </div>
      </div>
    </div>
  )
}