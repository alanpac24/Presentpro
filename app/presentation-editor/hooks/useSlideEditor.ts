import { useState, useCallback, useRef, useEffect } from 'react'

interface Slide {
  id: number
  title: string
  type: string
  content: string
}

interface SlideElement {
  id: string
  type: string
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export function useSlideEditor(initialSlides: Slide[] = []) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides)
  const [currentSlideId, setCurrentSlideId] = useState(1)
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [editingElement, setEditingElement] = useState<string | null>(null)
  const [draggedSlide, setDraggedSlide] = useState<number | null>(null)

  // Slide management
  const addSlide = useCallback((type: string = 'content') => {
    const newSlide: Slide = {
      id: Math.max(...slides.map(s => s.id), 0) + 1,
      title: `Slide ${slides.length + 1}`,
      type,
      content: ''
    }
    setSlides([...slides, newSlide])
    setCurrentSlideId(newSlide.id)
  }, [slides])

  const deleteSlide = useCallback((id: number) => {
    if (slides.length <= 1) return
    
    const newSlides = slides.filter(s => s.id !== id)
    setSlides(newSlides)
    
    if (currentSlideId === id) {
      const index = slides.findIndex(s => s.id === id)
      const nextSlide = newSlides[Math.min(index, newSlides.length - 1)]
      setCurrentSlideId(nextSlide.id)
    }
  }, [slides, currentSlideId])

  const updateSlide = useCallback((id: number, updates: Partial<Slide>) => {
    setSlides(slides.map(s => s.id === id ? { ...s, ...updates } : s))
  }, [slides])

  // Element selection
  const selectElement = useCallback((elementId: string, multi = false) => {
    if (multi) {
      setSelectedElements(prev => 
        prev.includes(elementId) 
          ? prev.filter(id => id !== elementId)
          : [...prev, elementId]
      )
    } else {
      setSelectedElements([elementId])
    }
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedElements([])
    setEditingElement(null)
  }, [])

  // Element editing
  const startEditing = useCallback((elementId: string) => {
    setEditingElement(elementId)
    setSelectedElements([elementId])
  }, [])

  const stopEditing = useCallback(() => {
    setEditingElement(null)
  }, [])

  // Drag and drop
  const handleDragStart = useCallback((slideId: number) => {
    setDraggedSlide(slideId)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedSlide(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, targetId: number) => {
    e.preventDefault()
    if (draggedSlide === null || draggedSlide === targetId) return

    const draggedIndex = slides.findIndex(s => s.id === draggedSlide)
    const targetIndex = slides.findIndex(s => s.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newSlides = [...slides]
    const [removed] = newSlides.splice(draggedIndex, 1)
    newSlides.splice(targetIndex, 0, removed)

    setSlides(newSlides)
  }, [slides, draggedSlide])

  // Horizontal scroll
  const scrollRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      
      e.preventDefault()
      element.scrollLeft += e.deltaY
    }

    element.addEventListener('wheel', handleWheel, { passive: false })
    return () => element.removeEventListener('wheel', handleWheel)
  }, [])

  return {
    // State
    slides,
    currentSlideId,
    selectedElements,
    editingElement,
    draggedSlide,
    scrollRef,

    // Actions
    addSlide,
    deleteSlide,
    updateSlide,
    setCurrentSlideId,
    selectElement,
    clearSelection,
    startEditing,
    stopEditing,
    handleDragStart,
    handleDragEnd,
    handleDragOver
  }
}