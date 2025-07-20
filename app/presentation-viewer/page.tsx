"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Presentation, Download, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PrivateHeader } from "@/components/header"
import { BarChart } from "@/components/charts/BarChart"
import { LineChart } from "@/components/charts/LineChart"
import { MetricBox } from "@/components/slide-elements/MetricBox"
import { ComparisonTable } from "@/components/slide-elements/ComparisonTable"

interface Slide {
  id: string
  title: string
  content?: string
  bullets?: string[]
  speakerNotes?: string
  type?: string
  chartData?: any
  metrics?: Array<{
    label: string
    value: string
    trend?: string
  }>
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

              {/* Metrics Row (if present) */}
              {currentSlide.metrics && currentSlide.metrics.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {currentSlide.metrics.map((metric, index) => (
                    <MetricBox
                      key={index}
                      value={metric.value}
                      label={metric.label}
                      trend={metric.trend}
                      color={index === 0 ? "blue" : index === 1 ? "green" : "orange"}
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              {currentSlide.content && (
                <p className="text-lg text-gray-700 mb-6">{currentSlide.content}</p>
              )}

              {/* Two Column Comparison */}
              {currentSlide.type === "twoColumn" && currentSlide.bullets && (
                <div className="mb-8">
                  <ComparisonTable
                    data={currentSlide.bullets.map(bullet => {
                      if (bullet.includes("|")) {
                        const [feature, ...rest] = bullet.split(":")
                        const [option1, option2] = rest.join(":").split("|")
                        return {
                          feature: feature.trim(),
                          option1: option1?.trim() || "",
                          option2: option2?.trim() || ""
                        }
                      }
                      return { feature: bullet, option1: "", option2: "" }
                    })}
                  />
                </div>
              )}

              {/* Regular Bullets */}
              {currentSlide.type !== "twoColumn" && currentSlide.bullets && currentSlide.bullets.length > 0 && (
                <div className="space-y-4 text-lg">
                  {currentSlide.bullets.map((bullet, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4 flex-shrink-0" />
                      <span className="text-gray-700">{bullet}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Chart visualization */}
              {currentSlide.type === "chart" && currentSlide.chartData && (
                <div className="mt-6 bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                  {currentSlide.chartData.type === "line" ? (
                    <LineChart data={currentSlide.chartData} width={500} height={300} />
                  ) : (
                    <BarChart data={currentSlide.chartData} width={500} height={300} />
                  )}
                </div>
              )}

              {/* Title Slide Special Layout */}
              {currentSlide.type === "title" && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    {currentSlide.content && (
                      <p className="text-2xl text-gray-600 font-light">{currentSlide.content}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Conclusion Slide with Action Items */}
              {currentSlide.type === "conclusion" && currentSlide.bullets && (
                <div className="bg-blue-50 rounded-lg p-8 mt-4">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Next Steps</h3>
                  <div className="space-y-3">
                    {currentSlide.bullets.map((bullet, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{bullet}</span>
                      </div>
                    ))}
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