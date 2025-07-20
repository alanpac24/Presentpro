"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Presentation, Download, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { PrivateHeader } from "@/components/header"
import { SlideDeckPro } from "@/components/SlideDeckPro"

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
          // Map slide types to our component types
          let componentType = slide.type || 'content'
          if (componentType === 'bullet') componentType = 'content'
          if (componentType === 'twoColumn') componentType = 'comparison'
          if (componentType === 'conclusion') componentType = 'content'
          
          // Prepare data based on slide type
          let slideData: any = {
            title: slide.title || `Slide ${index + 1}`,
            subtitle: slide.subtitle,
            content: slide.content,
            bullets: slide.bullets
          }
          
          // Type-specific data transformations
          if (componentType === 'title' || index === 0) {
            componentType = 'title'
            slideData = {
              title: slide.title,
              subtitle: slide.content,
              presenter: 'Your Sales Team',
              company: 'Target Company',
              date: new Date().toLocaleDateString()
            }
          } else if (slide.metrics && slide.metrics.length > 0) {
            componentType = 'metrics'
            slideData = {
              title: slide.title,
              subtitle: slide.subtitle,
              metrics: slide.metrics
            }
          } else if (slide.chartData) {
            componentType = 'chart'
            slideData = {
              title: slide.title,
              subtitle: slide.subtitle,
              chartType: 'bar',
              data: slide.chartData
            }
          } else if (componentType === 'comparison' && slide.bullets) {
            // Transform bullets into comparison format
            const comparisons = slide.bullets.map((bullet: string) => {
              if (bullet.includes('|')) {
                const [left, right] = bullet.split('|')
                const feature = left.includes(':') ? left.split(':')[0] : 'Feature'
                return {
                  feature: feature.trim(),
                  left: left.includes(':') ? left.split(':')[1].trim() : left.trim(),
                  right: right.trim()
                }
              }
              return { feature: bullet, left: '', right: '' }
            })
            
            slideData = {
              title: slide.title,
              subtitle: slide.subtitle,
              leftTitle: 'Traditional',
              rightTitle: 'Modern',
              comparisons
            }
          } else if (slide.keyMessage) {
            // Executive Summary format
            componentType = 'executiveSummary'
            slideData = {
              title: slide.title,
              keyMessage: slide.keyMessage,
              supportingPoints: slide.supportingPoints || [],
              recommendation: slide.recommendation || ''
            }
          } else if (slide.xAxis && slide.yAxis && slide.quadrants) {
            // Matrix format
            componentType = 'matrix'
            slideData = {
              title: slide.title,
              subtitle: slide.subtitle,
              xAxis: slide.xAxis,
              yAxis: slide.yAxis,
              quadrants: slide.quadrants
            }
          } else if (slide.investment && slide.returns) {
            // ROI Calculation format
            componentType = 'roiCalculation'
            slideData = {
              title: slide.title,
              subtitle: slide.subtitle,
              investment: slide.investment,
              returns: slide.returns,
              metrics: slide.metrics
            }
          } else if (slide.phases) {
            // Roadmap format
            componentType = 'roadmap'
            slideData = {
              title: slide.title,
              subtitle: slide.subtitle,
              phases: slide.phases
            }
          } else if (slide.timeframes) {
            // Quick Wins format
            componentType = 'quickWins'
            slideData = {
              title: slide.title,
              subtitle: slide.subtitle,
              timeframes: slide.timeframes
            }
          } else if (slide.competitors && slide.xAxis && slide.yAxis) {
            // Competitive Landscape format
            componentType = 'competitiveLandscape'
            slideData = {
              title: slide.title,
              subtitle: slide.subtitle,
              xAxis: slide.xAxis,
              yAxis: slide.yAxis,
              competitors: slide.competitors
            }
          } else if (slide.strengths && slide.weaknesses && slide.opportunities && slide.threats) {
            // SWOT Analysis format
            componentType = 'swotAnalysis'
            slideData = {
              title: slide.title,
              subtitle: slide.subtitle,
              strengths: slide.strengths,
              weaknesses: slide.weaknesses,
              opportunities: slide.opportunities,
              threats: slide.threats
            }
          } else if (slide.summary && slide.metrics && slide.metrics.some((m: any) => m.status)) {
            // KPI Dashboard format
            componentType = 'kpiDashboard'
            slideData = {
              title: slide.title,
              subtitle: slide.subtitle,
              kpis: slide.metrics,
              summary: slide.summary
            }
          } else if (slide.primaryActivities || slide.supportActivities || slide.layers) {
            // Value Chain format
            componentType = 'valueChain'
            slideData = {
              title: slide.title,
              subtitle: slide.subtitle,
              primaryActivities: slide.primaryActivities || [],
              supportActivities: slide.supportActivities || slide.layers || []
            }
          }
          
          return {
            id: slide.id || `slide-${index}`,
            type: componentType,
            data: slideData
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