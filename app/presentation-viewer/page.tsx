"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Presentation, Download, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PrivateHeader } from "@/components/header"
import { SlideDeck } from "@/components/SlideDeck"

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
        
        // Transform slides to match SlideDeck format
        const transformedSlides = generatedSlides.map((slide: any, index: number) => {
          // Map slide types to McKinsey framework
          let mappedType = slide.type
          if (index === 0 || slide.type === 'title') {
            mappedType = 'title'
          } else if (slide.title?.toLowerCase().includes('challenge') || 
                     slide.title?.toLowerCase().includes('problem')) {
            mappedType = 'complication'
          } else if (slide.title?.toLowerCase().includes('solution') || 
                     slide.title?.toLowerCase().includes('approach')) {
            mappedType = 'resolution'
          } else if (slide.title?.toLowerCase().includes('implement') || 
                     slide.title?.toLowerCase().includes('timeline')) {
            mappedType = 'implementation'
          } else if (slide.title?.toLowerCase().includes('investment') || 
                     slide.title?.toLowerCase().includes('next') ||
                     slide.type === 'conclusion') {
            mappedType = 'investment'
          } else if (slide.type === 'chart' || slide.metrics) {
            mappedType = 'situation'
          } else {
            mappedType = 'situation' // default
          }
          
          // Transform timeline data for implementation slides
          let timeline = undefined
          if (mappedType === 'implementation' && slide.bullets) {
            timeline = slide.bullets.reduce((acc: any[], bullet: string, idx: number) => {
              if (bullet.includes('Phase') || bullet.includes('Week')) {
                acc.push({
                  phase: bullet.split(':')[0] || `Phase ${idx + 1}`,
                  duration: "2-4 weeks",
                  activities: []
                })
              } else if (acc.length > 0) {
                acc[acc.length - 1].activities.push(bullet)
              }
              return acc
            }, [])
          }
          
          // Extract investment data from conclusion slides
          let investment = undefined
          if (mappedType === 'investment') {
            investment = {
              initial: "$50,000",
              monthly: "$10,000",
              total: "$170,000",
              roi: "300%",
              payback: "4 months"
            }
            
            // Try to extract actual values from content or bullets
            if (slide.content?.includes('$') || slide.bullets?.some((b: string) => b.includes('$'))) {
              // Parse investment data from slide content
              const allText = slide.content + ' ' + (slide.bullets?.join(' ') || '')
              const dollarMatches = allText.match(/\$[\d,]+/g) || []
              const percentMatches = allText.match(/\d+%/g) || []
              
              if (dollarMatches.length > 0) investment.initial = dollarMatches[0]
              if (dollarMatches.length > 1) investment.monthly = dollarMatches[1]
              if (dollarMatches.length > 2) investment.total = dollarMatches[2]
              if (percentMatches.length > 0) investment.roi = percentMatches[0]
            }
          }
          
          return {
            id: slide.id,
            type: mappedType,
            title: slide.title,
            subtitle: slide.content,
            content: slide.content,
            bullets: slide.bullets,
            metrics: slide.metrics,
            chartData: slide.chartData,
            timeline: timeline,
            investment: investment
          }
        })
        
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
        <SlideDeck 
          slides={slides}
          companyName="Target Company"
          presenter="Your Sales Team"
        />
      </div>
    </div>
  )
}