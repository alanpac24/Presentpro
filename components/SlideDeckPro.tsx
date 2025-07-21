"use client"

import React, { useState, useEffect, Component, ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { slideComponents, SlideType } from '@/components/slides'

// Error boundary component
class ErrorBoundary extends Component<
  { children: ReactNode; slideNumber: number; slideType: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error in Slide {this.props.slideNumber}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Unable to render {this.props.slideType} slide
            </p>
            <p className="text-xs text-gray-500">
              {this.state.error?.message || 'Unknown error'}
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

interface SlideData {
  id: string
  type: SlideType
  data: any // This will be typed based on the slide type
}

interface SlideDeckProProps {
  slides: SlideData[]
  className?: string
}

export function SlideDeckPro({ slides = [], className = '' }: SlideDeckProProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Debug logging
  console.log('SlideDeckPro received slides:', slides)
  
  if (!slides || slides.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-lg shadow">
        <p className="text-gray-600 text-lg">No slides available. Please generate a presentation first.</p>
      </div>
    )
  }
  
  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide(prev => prev + 1)
        setIsTransitioning(false)
      }, 150)
    }
  }
  
  const prevSlide = () => {
    if (currentSlide > 0) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide(prev => prev - 1)
        setIsTransitioning(false)
      }, 150)
    }
  }
  
  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide(index)
        setIsTransitioning(false)
      }, 150)
    }
  }
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key >= '1' && e.key <= '9') {
        const slideIndex = parseInt(e.key) - 1
        if (slideIndex < slides.length) goToSlide(slideIndex)
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSlide, slides.length])
  
  const slide = slides[currentSlide]
  if (!slide) return null
  
  // Get the appropriate component for this slide type
  const SlideComponent = slideComponents[slide.type] || slideComponents.content
  
  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <Card className="bg-white shadow-2xl overflow-hidden">
        <div 
          className={`aspect-[16/9] p-8 md:p-12 transition-opacity duration-150 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <ErrorBoundary slideNumber={currentSlide + 1} slideType={slide.type}>
            <SlideComponent 
              id={slide.id}
              data={slide.data}
              className="slide-enter"
            />
          </ErrorBoundary>
        </div>
      </Card>
      
      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 px-4">
        <Button
          variant="outline"
          size="lg"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="transition-all hover:scale-105"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>
        
        {/* Slide indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all ${
                idx === currentSlide
                  ? 'w-8 h-2 bg-blue-600 rounded-full'
                  : 'w-2 h-2 bg-gray-300 hover:bg-gray-400 rounded-full'
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
          className="transition-all hover:scale-105"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
      
      {/* Slide info */}
      <div className="text-center mt-4 text-sm text-gray-500">
        Slide {currentSlide + 1} of {slides.length} • {slide.type} • Use arrow keys to navigate
      </div>
    </div>
  )
}