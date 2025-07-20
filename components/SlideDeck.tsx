"use client"

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, BarChart3, TrendingUp, Target, Users, Calendar, DollarSign } from 'lucide-react'
import { BarChart } from '@/components/charts/BarChart'
import { LineChart } from '@/components/charts/LineChart'
import { MetricBox } from '@/components/slide-elements/MetricBox'

interface SlideData {
  id: string
  type: 'title' | 'situation' | 'complication' | 'resolution' | 'implementation' | 'investment'
  title: string
  subtitle?: string
  content?: string
  bullets?: string[]
  metrics?: Array<{
    label: string
    value: string
    trend?: string
  }>
  chartData?: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor?: string
      backgroundColor?: string
    }>
  }
  timeline?: Array<{
    phase: string
    duration: string
    activities: string[]
  }>
  investment?: {
    initial: string
    monthly: string
    total: string
    roi: string
    payback: string
  }
}

interface SlideDeckProps {
  slides: SlideData[]
  companyName?: string
  presenter?: string
}

export function SlideDeck({ slides, companyName = "Your Company", presenter = "Sales Team" }: SlideDeckProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }
  
  const slide = slides[currentSlide]
  
  const renderSlideContent = () => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-2 text-blue-600">
              <Target className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="text-2xl text-gray-600 mb-8">{slide.subtitle}</p>
            )}
            <div className="mt-auto flex flex-col items-center">
              <p className="text-gray-500">Prepared for {companyName}</p>
              <p className="text-gray-400">By {presenter}</p>
            </div>
          </div>
        )
        
      case 'situation':
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
              <div className="w-16 h-1 bg-blue-600"></div>
            </div>
            
            {slide.metrics && (
              <div className="grid grid-cols-3 gap-6 mb-8">
                {slide.metrics.map((metric, idx) => (
                  <MetricBox
                    key={idx}
                    value={metric.value}
                    label={metric.label}
                    trend={metric.trend}
                    color={idx === 0 ? 'blue' : idx === 1 ? 'green' : 'orange'}
                  />
                ))}
              </div>
            )}
            
            {slide.content && (
              <p className="text-lg text-gray-700 mb-6">{slide.content}</p>
            )}
            
            {slide.bullets && (
              <ul className="space-y-4">
                {slide.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
        
      case 'complication':
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
              <div className="w-16 h-1 bg-red-600"></div>
            </div>
            
            {slide.chartData && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <BarChart data={slide.chartData} width={600} height={300} />
              </div>
            )}
            
            {slide.content && (
              <p className="text-lg text-gray-700 mb-6">{slide.content}</p>
            )}
            
            {slide.bullets && (
              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-lg">
                <h3 className="font-semibold text-red-900 mb-3">Key Challenges:</h3>
                <ul className="space-y-3">
                  {slide.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-red-600 mr-3">▪</span>
                      <span className="text-gray-700">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
        
      case 'resolution':
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
              <div className="w-16 h-1 bg-green-600"></div>
            </div>
            
            {slide.content && (
              <p className="text-lg text-gray-700 mb-6">{slide.content}</p>
            )}
            
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Our Solution
                </h3>
                {slide.bullets && (
                  <ul className="space-y-3">
                    {slide.bullets.slice(0, Math.ceil(slide.bullets.length / 2)).map((bullet, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Expected Outcomes
                </h3>
                {slide.bullets && (
                  <ul className="space-y-3">
                    {slide.bullets.slice(Math.ceil(slide.bullets.length / 2)).map((bullet, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-600 mr-2">▸</span>
                        <span className="text-gray-700">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            {slide.chartData && (
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <LineChart data={slide.chartData} width={600} height={250} />
              </div>
            )}
          </div>
        )
        
      case 'implementation':
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
              <div className="w-16 h-1 bg-blue-600"></div>
            </div>
            
            {slide.timeline && (
              <div className="space-y-6">
                {slide.timeline.map((phase, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="flex flex-col items-center mr-6">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      {idx < slide.timeline!.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{phase.phase}</h3>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {phase.duration}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {phase.activities.map((activity, actIdx) => (
                          <li key={actIdx} className="text-gray-700 flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
        
      case 'investment':
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">{slide.title}</h2>
              <div className="w-16 h-1 bg-green-600"></div>
            </div>
            
            {slide.investment && (
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-sm text-gray-500 mb-1">Initial Investment</h3>
                    <p className="text-3xl font-bold text-gray-900">{slide.investment.initial}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-sm text-gray-500 mb-1">Monthly Cost</h3>
                    <p className="text-3xl font-bold text-gray-900">{slide.investment.monthly}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-sm text-gray-500 mb-1">Total First Year</h3>
                    <p className="text-3xl font-bold text-gray-900">{slide.investment.total}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                    <h3 className="text-sm text-gray-500 mb-1">Expected ROI</h3>
                    <p className="text-3xl font-bold text-green-600">{slide.investment.roi}</p>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                    <h3 className="text-sm text-gray-500 mb-1">Payback Period</h3>
                    <p className="text-3xl font-bold text-blue-600">{slide.investment.payback}</p>
                  </div>
                </div>
              </div>
            )}
            
            {slide.bullets && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  What's Included
                </h3>
                <ul className="grid grid-cols-2 gap-4">
                  {slide.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span className="text-gray-700">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
        
      default:
        return null
    }
  }
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="bg-white shadow-2xl">
        <div className="aspect-[16/10] p-12">
          {renderSlideContent()}
        </div>
      </Card>
      
      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          size="lg"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="transition-all"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentSlide
                  ? 'w-8 bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          size="lg"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="transition-all"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
      
      {/* Slide counter */}
      <div className="text-center mt-4 text-gray-500">
        Slide {currentSlide + 1} of {slides.length}
      </div>
    </div>
  )
}