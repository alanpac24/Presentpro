import { useState, useCallback } from "react"

interface Slide {
  id: number
  title: string
  type: string
  content: string
}

interface DragAndDropState {
  draggedSlide: number | null
  dragOverIndex: number | null
  isDragging: boolean
  draggedElement: HTMLElement | null
  dropIndicatorIndex: number | null
  draggedSlideData: Slide | null
}

interface UseSlideDragAndDropProps {
  slides: Slide[]
  currentSlideIndex: number
  onSlideChange: (index: number) => void
  onSlidesReorder?: (slides: Slide[]) => void
}

export function useSlideDragAndDrop({
  slides,
  currentSlideIndex,
  onSlideChange,
  onSlidesReorder
}: UseSlideDragAndDropProps) {
  const [dragState, setDragState] = useState<DragAndDropState>({
    draggedSlide: null,
    dragOverIndex: null,
    isDragging: false,
    draggedElement: null,
    dropIndicatorIndex: null,
    draggedSlideData: null
  })

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragState({
      draggedSlide: index,
      draggedSlideData: slides[index],
      isDragging: true,
      draggedElement: e.currentTarget as HTMLElement,
      dragOverIndex: null,
      dropIndicatorIndex: null
    })
    
    e.dataTransfer.effectAllowed = "move"
    
    // Create custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement
    dragImage.style.transform = "rotate(2deg) scale(1.05)"
    dragImage.style.opacity = "0.9"
    dragImage.style.position = "absolute"
    dragImage.style.top = "-1000px"
    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    setTimeout(() => document.body.removeChild(dragImage), 0)
  }, [slides])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    
    if (dragState.draggedSlide === null) return
    
    // Calculate if we should insert before or after based on mouse position
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const insertBefore = x < rect.width / 2
    
    let newIndex = insertBefore ? index : index + 1
    if (dragState.draggedSlide < index && insertBefore) newIndex = index
    if (dragState.draggedSlide > index && !insertBefore) newIndex = index + 1
    
    if (newIndex !== dragState.dropIndicatorIndex) {
      setDragState(prev => ({
        ...prev,
        dropIndicatorIndex: newIndex,
        dragOverIndex: index
      }))
    }
  }, [dragState.draggedSlide, dragState.dropIndicatorIndex])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Check if we're actually leaving the slides container
    const relatedTarget = e.relatedTarget as HTMLElement
    const slidesContainer = e.currentTarget.closest('.slides-container')
    
    if (!relatedTarget || !slidesContainer?.contains(relatedTarget)) {
      setDragState(prev => ({
        ...prev,
        dragOverIndex: null,
        dropIndicatorIndex: null
      }))
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    
    if (dragState.draggedSlide === null || dragState.dropIndicatorIndex === null || !onSlidesReorder) return

    // Add drop animation class
    const droppedElement = document.querySelector(`[data-slide-index="${dragState.draggedSlide}"]`)
    droppedElement?.classList.add('drop-success')

    const newSlides = [...slides]
    const [removed] = newSlides.splice(dragState.draggedSlide, 1)
    
    // Adjust drop index if dragging to the right
    let adjustedIndex = dragState.dropIndicatorIndex
    if (dragState.draggedSlide < dragState.dropIndicatorIndex) {
      adjustedIndex = dragState.dropIndicatorIndex - 1
    }
    
    newSlides.splice(adjustedIndex, 0, removed)
    
    // Delay the reorder to show the drop animation
    setTimeout(() => {
      onSlidesReorder(newSlides)
      
      // Update current slide index if needed
      if (currentSlideIndex === dragState.draggedSlide) {
        onSlideChange(adjustedIndex)
      } else if (dragState.draggedSlide < currentSlideIndex && adjustedIndex >= currentSlideIndex) {
        onSlideChange(currentSlideIndex - 1)
      } else if (dragState.draggedSlide > currentSlideIndex && adjustedIndex <= currentSlideIndex) {
        onSlideChange(currentSlideIndex + 1)
      }
    }, 150)

    // Reset drag state
    setDragState({
      draggedSlide: null,
      dragOverIndex: null,
      dropIndicatorIndex: null,
      isDragging: false,
      draggedElement: null,
      draggedSlideData: null
    })
  }, [dragState, slides, currentSlideIndex, onSlidesReorder, onSlideChange])

  const handleDragEnd = useCallback(() => {
    setDragState({
      draggedSlide: null,
      draggedSlideData: null,
      dragOverIndex: null,
      dropIndicatorIndex: null,
      isDragging: false,
      draggedElement: null
    })
  }, [])

  const getSlideStyle = useCallback((index: number) => {
    if (!dragState.isDragging || dragState.draggedSlide === null) return {}
    
    if (index === dragState.draggedSlide) {
      return {
        opacity: 0.2,
        transform: 'scale(0.95)',
        filter: 'grayscale(100%)',
        zIndex: 50,
        transition: 'none'
      }
    }
    
    return {}
  }, [dragState.isDragging, dragState.draggedSlide])

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    getSlideStyle
  }
}