"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Presentation, Download, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PrivateHeader } from "@/components/header"

interface Slide {
  id: string
  title: string
  content?: string
  bullets?: string[]
  speakerNotes?: string
  type?: string
}

export default function PresentationViewerPage() {
  const router = useRouter()
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [presentationTitle, setPresentationTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Load generated presentation on mount
  useEffect(() => {
    const generatedData = sessionStorage.getItem("generatedPresentation")
    if (generatedData) {
      try {
        const { slides: generatedSlides, title } = JSON.parse(generatedData)
        setSlides(generatedSlides)
        setPresentationTitle(title)
        // Keep the data in sessionStorage for potential reloads
      } catch (error) {
        console.error("Error loading presentation:", error)
        router.push("/presentation-planner")
      }
    } else {
      // No presentation data, redirect back
      router.push("/presentation-planner")
    }
    setIsLoading(false)
  }, [router])

  const currentSlide = slides[currentSlideIndex]
  const totalSlides = slides.length

  const goToPrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1)
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious()
    if (e.key === "ArrowRight") goToNext()
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentSlideIndex])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Presentation className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading presentation...</p>
        </div>
      </div>
    )
  }

  if (!currentSlide) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PrivateHeader />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/presentation-planner">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Planner
                </Button>
              </Link>
              <div className="text-gray-600">
                <h1 className="text-lg font-medium text-gray-900">{presentationTitle}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Slide {currentSlideIndex + 1} of {totalSlides}
              </span>
              <Button variant="outline" size="sm" disabled>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white shadow-lg">
          <div className="aspect-[16/9] p-12 flex flex-col">
            {/* Slide Content */}
            <div className="flex-1 flex flex-col">
              {/* Title */}
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
                {currentSlide.title}
              </h2>

              {/* Content */}
              {currentSlide.content && (
                <p className="text-lg text-gray-700 mb-6">{currentSlide.content}</p>
              )}

              {/* Bullets */}
              {currentSlide.bullets && currentSlide.bullets.length > 0 && (
                <ul className="space-y-4 text-lg">
                  {currentSlide.bullets.map((bullet, index) => {
                    // Handle two-column format (separated by |)
                    if (bullet.includes("|")) {
                      const [left, right] = bullet.split("|")
                      return (
                        <li key={index} className="flex justify-between items-start">
                          <span className="text-gray-700 flex-1">{left.trim()}</span>
                          <span className="text-gray-700 flex-1 text-right">{right.trim()}</span>
                        </li>
                      )
                    }
                    return (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-3">•</span>
                        <span className="text-gray-700">{bullet}</span>
                      </li>
                    )
                  })}
                </ul>
              )}

              {/* Chart placeholder for chart slides */}
              {currentSlide.type === "chart" && (
                <div className="mt-6 bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="mb-2">📊</div>
                    <p className="text-sm">Chart visualization would appear here</p>
                  </div>
                </div>
              )}
            </div>

            {/* Speaker Notes */}
            {currentSlide.speakerNotes && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Speaker Notes:</span> {currentSlide.speakerNotes}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={goToPrevious}
            disabled={currentSlideIndex === 0}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          {/* Slide dots */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlideIndex
                    ? "bg-gray-900 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={goToNext}
            disabled={currentSlideIndex === totalSlides - 1}
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Use arrow keys to navigate between slides
        </p>
      </div>
    </div>
  )
}