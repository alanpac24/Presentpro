"use client"

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, BarChart3, TrendingUp, Target, Calendar, DollarSign } from 'lucide-react'

interface SlideData {
  id: string
  type: string
  title: string
  subtitle?: string
  content?: string
  bullets?: string[]
  metrics?: Array<{
    label: string
    value: string
    trend?: string
  }>
  chartData?: any
}

interface SlideDeckProps {
  slides: SlideData[]
  companyName?: string
  presenter?: string
}

export function SlideDeckSimple({ slides = [], companyName = "Your Company", presenter = "Sales Team" }: SlideDeckProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Debug logging
  console.log('SlideDeckSimple received slides:', slides)
  
  if (!slides || slides.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <p className="text-gray-600">No slides available. Please generate a presentation first.</p>
      </div>
    )
  }
  
  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
  }
  
  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSlide, slides.length])
  
  const slide = slides[currentSlide]
  if (!slide) {
    return <div className="text-center p-8">No slide data available</div>
  }
  
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="bg-white shadow-xl overflow-hidden">
        <div className="aspect-[16/9] p-8 md:p-12 flex flex-col">
          {/* Slide Header */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {slide.title}
            </h2>
            {slide.subtitle && (
              <p className="text-lg text-gray-600">{slide.subtitle}</p>
            )}
            <div className="w-16 h-1 bg-blue-600 mt-4"></div>
          </div>
          
          {/* Slide Content */}
          <div className="flex-1 overflow-auto">
            {/* Metrics Display */}
            {slide.metrics && slide.metrics.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {slide.metrics.map((metric, idx) => (
                  <div 
                    key={idx} 
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200"
                  >
                    <div className="text-2xl font-bold text-blue-900">{metric.value}</div>
                    <div className="text-sm font-medium text-blue-700">{metric.label}</div>
                    {metric.trend && (
                      <div className="text-xs text-blue-600 mt-1">{metric.trend}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Main Content */}
            {slide.content && (
              <p className="text-gray-700 mb-4 text-base md:text-lg">{slide.content}</p>
            )}
            
            {/* Bullets */}
            {slide.bullets && slide.bullets.length > 0 && (
              <ul className="space-y-3">
                {slide.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-600 mr-3 text-lg">•</span>
                    <span className="text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {/* Simple Chart Placeholder */}
            {slide.chartData && (
              <div className="mt-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Chart: {slide.chartData.datasets?.[0]?.label || 'Data Visualization'}</p>
                    <div className="mt-4 flex justify-center space-x-4">
                      {slide.chartData.labels?.slice(0, 3).map((label: string, idx: number) => (
                        <div key={idx} className="text-sm">
                          <div className="text-gray-500">{label}</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {slide.chartData.datasets?.[0]?.data?.[idx] || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Slide Type Indicator */}
          <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              {slide.type === 'title' && <Target className="w-4 h-4 mr-1" />}
              {slide.type === 'chart' && <BarChart3 className="w-4 h-4 mr-1" />}
              {slide.type === 'conclusion' && <DollarSign className="w-4 h-4 mr-1" />}
              <span className="capitalize">{slide.type} Slide</span>
            </div>
            <div>
              Slide {currentSlide + 1} of {slides.length}
            </div>
          </div>
        </div>
      </Card>
      
      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide
                  ? 'w-8 bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}