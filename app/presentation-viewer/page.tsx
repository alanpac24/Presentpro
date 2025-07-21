"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Presentation, Download, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PrivateHeader } from "@/components/header"
import { SlideDeckPro } from "@/components/SlideDeckPro"
import { transformSlide } from "@/lib/services/ai/slide-transformers"

export default function PresentationViewerPage() {
  const router = useRouter()
  const [slides, setSlides] = useState<any[]>([])
  const [presentationTitle, setPresentationTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Load generated presentation on mount
  useEffect(() => {
    const generatedData = sessionStorage.getItem("generatedPresentation")
    if (generatedData) {
      try {
        const { slides: generatedSlides, title } = JSON.parse(generatedData)
        console.log('Generated slides:', generatedSlides)
        
        // Transform slides to component-based format
        const transformedSlides = generatedSlides.map((slide: any, index: number) => {
          const { type, data } = transformSlide(slide, index)
          
          return {
            id: slide.id || `slide-${index}`,
            type,
            data
          }
        })
        
        console.log('Transformed slides:', transformedSlides)
        setSlides(transformedSlides)
        setPresentationTitle(title)
      } catch (error) {
        console.error("Error loading presentation:", error)
        router.push("/presentation-planner")
      }
    } else {
      router.push("/presentation-planner")
    }
    setIsLoading(false)
  }, [router])

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

  if (!slides || slides.length === 0) {
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
              <Button variant="outline" size="sm" disabled>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <SlideDeckPro slides={slides} />
      </div>
    </div>
  )
}