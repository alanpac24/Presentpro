"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, X, GripVertical, Plus } from "lucide-react"
import { useSlideDragAndDrop } from "../hooks/useSlideDragAndDrop"
import { useSlideEditing } from "../hooks/useSlideEditing"
import { useHorizontalScroll } from "../hooks/useHorizontalScroll"

interface Slide {
  id: number
  title: string
  type: string
  content: string
}

interface SlideCarouselProps {
  slides: Slide[]
  currentSlideIndex: number
  onSlideChange: (index: number) => void
  onSlidesReorder?: (slides: Slide[]) => void
  onSlideDelete?: (slideId: number) => void
  onSlideRename?: (slideId: number, newTitle: string) => void
  onSlideAdd?: () => void
  sidebarWidth?: number
}

export function SlideCarousel({ 
  slides, 
  currentSlideIndex, 
  onSlideChange,
  onSlidesReorder,
  onSlideDelete,
  onSlideRename,
  onSlideAdd,
  sidebarWidth = 560
}: SlideCarouselProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [slideWidth, setSlideWidth] = useState(192) // Default to lg size
  
  // Use custom hooks for drag and drop
  const {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    getSlideStyle
  } = useSlideDragAndDrop({
    slides,
    currentSlideIndex,
    onSlideChange,
    onSlidesReorder
  })
  
  // Use custom hook for slide editing
  const {
    editingSlideId,
    editingTitle,
    startEditing,
    saveTitle,
    cancelEditing,
    handleTitleChange,
    handleKeyDown
  } = useSlideEditing({ onSlideRename })
  
  // Use custom hook for horizontal scrolling
  useHorizontalScroll(scrollContainerRef)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const thumbnail = scrollAreaRef.current.querySelector(`[data-slide-index="${currentSlideIndex}"]`)
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [currentSlideIndex])

  // Update slide width based on viewport
  useEffect(() => {
    const updateSlideWidth = () => {
      const width = window.innerWidth
      if (width < 640) {
        setSlideWidth(128) // w-32
      } else if (width < 1024) {
        setSlideWidth(160) // w-40
      } else {
        setSlideWidth(192) // w-48
      }
    }

    updateSlideWidth()
    window.addEventListener('resize', updateSlideWidth)
    return () => window.removeEventListener('resize', updateSlideWidth)
  }, [])


  const handlePrevious = () => onSlideChange(Math.max(0, currentSlideIndex - 1))
  const handleNext = () => onSlideChange(Math.min(slides.length - 1, currentSlideIndex + 1))


  const handleDelete = (e: React.MouseEvent, slideId: number, index: number) => {
    e.stopPropagation()
    if (onSlideDelete && slides.length > 1) {
      onSlideDelete(slideId)
      // Adjust current slide if needed
      if (index < currentSlideIndex || (index === currentSlideIndex && index === slides.length - 1)) {
        onSlideChange(Math.max(0, currentSlideIndex - 1))
      }
    }
  }


  const handleAddSlide = () => {
    if (onSlideAdd) {
      onSlideAdd()
    }
  }


  return (
    <div className="h-32 sm:h-36 bg-gray-50 border-t border-gray-200 flex items-center relative">
      <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handlePrevious} 
          disabled={currentSlideIndex === 0}
          className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleNext} 
          disabled={currentSlideIndex === slides.length - 1}
          className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>

      <div className="flex-1 px-2 sm:px-4 overflow-hidden" ref={scrollContainerRef}>
        <div 
          className="h-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" 
          ref={scrollAreaRef}
          onWheel={(e) => {
            if (scrollAreaRef.current) {
              e.preventDefault()
              e.stopPropagation()
              const scrollAmount = e.deltaY
              scrollAreaRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
              })
            }
          }}
        >
          <div 
            className="slides-container flex items-center gap-2 sm:gap-4 h-full py-2 sm:py-4 px-2 relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {/* Ghost preview of where slide will be placed */}
            {dragState.isDragging && dragState.dropIndicatorIndex !== null && dragState.draggedSlideData && (
              <div
                className="absolute top-2 sm:top-4 pointer-events-none z-20"
                style={{
                  left: dragState.dropIndicatorIndex === 0 
                    ? '8px' 
                    : `${8 + dragState.dropIndicatorIndex * (slideWidth + 16) - (dragState.draggedSlide! < dragState.dropIndicatorIndex ? (slideWidth + 16) : 0)}px`,
                  transition: 'left 200ms ease-out'
                }}
              >
                <Card className="w-32 h-20 sm:w-40 sm:h-24 lg:w-48 lg:h-28 border-2 border-blue-500 bg-blue-50 shadow-lg ghost-preview">
                  <CardContent className="p-2 sm:p-3 lg:p-4 h-full flex flex-col">
                    <div className="text-sm font-semibold text-blue-700 mb-2 opacity-70">
                      {dragState.dropIndicatorIndex === 0 
                        ? 1 
                        : dragState.draggedSlide! < dragState.dropIndicatorIndex 
                          ? dragState.dropIndicatorIndex 
                          : dragState.dropIndicatorIndex + 1}
                    </div>
                    <div className="flex-1 flex items-center">
                      <p className="text-xs font-medium text-blue-700 line-clamp-2 opacity-70">
                        {dragState.draggedSlideData.title}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                {/* Drop indicator line */}
                <div
                  className="absolute top-0 bottom-0 w-[3px] -left-[11px]"
                  style={{
                    background: 'linear-gradient(180deg, #3B82F6 0%, #60A5FA 50%, #3B82F6 100%)',
                    boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
                  }}
                />
              </div>
            )}
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                data-slide-index={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="slide-wrapper relative group"
                style={getSlideStyle(index)}
              >
                <Card
                  className={`slide-card relative flex-shrink-0 w-32 h-20 sm:w-40 sm:h-24 lg:w-48 lg:h-28 cursor-pointer transition-all duration-200 ${
                    index === currentSlideIndex
                      ? "ring-2 ring-gray-900 shadow-lg border-gray-900 transform scale-105 z-10"
                      : "border-gray-200 hover:border-gray-400"
                  } ${dragState.isDragging && index === dragState.draggedSlide ? 'dragging cursor-grabbing' : 'cursor-grab'}`}
                  onClick={() => onSlideChange(index)}
                >
                  <CardContent className="p-2 sm:p-3 lg:p-4 h-full flex flex-col">
                    {/* Drag handle */}
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move">
                      <GripVertical className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                    </div>

                    {/* Delete button */}
                    {slides.length > 1 && (
                      <button
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-0.5 sm:p-1 rounded hover:bg-gray-100"
                        onClick={(e) => handleDelete(e, slide.id, index)}
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 hover:text-red-600 transition-colors" />
                      </button>
                    )}

                    {/* Slide number */}
                    <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                      {index + 1}
                    </div>

                    {/* Slide title */}
                    <div className="flex-1 flex items-center min-h-0">
                      {editingSlideId === slide.id ? (
                        <Input
                          value={editingTitle}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, slide.id)}
                          onBlur={() => saveTitle(slide.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-6 sm:h-7 text-[10px] sm:text-xs px-1 sm:px-2"
                          autoFocus
                        />
                      ) : (
                        <p 
                          className="text-[10px] sm:text-xs font-medium text-gray-900 line-clamp-2 cursor-text hover:bg-gray-100 px-0.5 sm:px-1 py-0.5 rounded"
                          onClick={(e) => startEditing(e, slide)}
                        >
                          {slide.title}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            {/* Add New Slide Button */}
            <button
              onClick={handleAddSlide}
              className="flex-shrink-0 w-32 h-20 sm:w-40 sm:h-24 lg:w-48 lg:h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group"
            >
              <div className="text-center">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-gray-400 mx-auto mb-0.5 sm:mb-1 group-hover:text-gray-600" />
                <span className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-700">Add Slide</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="px-2 sm:px-4 lg:px-6 text-xs sm:text-sm text-gray-600 whitespace-nowrap">
        <span className="font-semibold text-gray-900">{currentSlideIndex + 1}</span>
        <span className="text-gray-400 mx-0.5 sm:mx-1">/</span>
        <span className="font-semibold text-gray-900">{slides.length}</span>
      </div>
    </div>
  )
}