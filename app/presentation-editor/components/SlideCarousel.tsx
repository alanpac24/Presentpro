"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SlideCarouselProps {
  slides: any[]
  currentSlideIndex: number
  onSlideChange: (index: number) => void
}

export function SlideCarousel({ slides, currentSlideIndex, onSlideChange }: SlideCarouselProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const thumbnail = scrollAreaRef.current.querySelector(`[data-slide-index="${currentSlideIndex}"]`)
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [currentSlideIndex])

  const handlePrevious = () => onSlideChange(Math.max(0, currentSlideIndex - 1))
  const handleNext = () => onSlideChange(Math.min(slides.length - 1, currentSlideIndex + 1))

  return (
    <div className="h-24 bg-gray-50 border-t border-gray-200 flex items-center ml-80">
      <div className="flex items-center space-x-2 px-4">
        <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentSlideIndex === 0}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleNext} disabled={currentSlideIndex === slides.length - 1}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 px-4 overflow-hidden">
        <ScrollArea className="w-full" ref={scrollAreaRef}>
          <div className="flex space-x-3 py-3">
            {slides.map((slide, index) => (
              <Card
                key={slide.id}
                data-slide-index={index}
                className={`flex-shrink-0 w-32 h-20 cursor-pointer transition-all duration-200 hover:shadow-md rounded-lg ${
                  index === currentSlideIndex
                    ? "ring-2 ring-gray-900 shadow-md border-gray-900"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onSlideChange(index)}
              >
                <CardContent className="p-2 h-full flex flex-col justify-between">
                  <span className="text-xs font-medium text-gray-700">{index + 1}</span>
                  <div className="text-[10px] text-gray-600 leading-tight overflow-hidden">
                    <p className="font-medium text-gray-900 truncate">{slide.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="h-1" />
        </ScrollArea>
      </div>

      <div className="px-6 text-sm text-gray-600">
        <span className="font-medium text-gray-900">{currentSlideIndex + 1}</span>
        <span className="text-gray-400"> / </span>
        <span className="font-medium text-gray-900">{slides.length}</span>
      </div>
    </div>
  )
}