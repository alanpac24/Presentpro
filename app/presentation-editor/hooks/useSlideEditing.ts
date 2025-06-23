import { useState, useCallback } from "react"

interface Slide {
  id: number
  title: string
  type: string
  content: string
}

interface UseSlideEditingProps {
  onSlideRename?: (slideId: number, newTitle: string) => void
}

export function useSlideEditing({ onSlideRename }: UseSlideEditingProps) {
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState("")

  const startEditing = useCallback((e: React.MouseEvent, slide: Slide) => {
    e.stopPropagation()
    setEditingSlideId(slide.id)
    setEditingTitle(slide.title)
  }, [])

  const saveTitle = useCallback((slideId: number) => {
    if (onSlideRename && editingTitle.trim()) {
      onSlideRename(slideId, editingTitle.trim())
    }
    setEditingSlideId(null)
  }, [onSlideRename, editingTitle])

  const cancelEditing = useCallback(() => {
    setEditingSlideId(null)
    setEditingTitle("")
  }, [])

  const handleTitleChange = useCallback((value: string) => {
    setEditingTitle(value)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, slideId: number) => {
    if (e.key === "Enter") saveTitle(slideId)
    if (e.key === "Escape") cancelEditing()
  }, [saveTitle, cancelEditing])

  return {
    editingSlideId,
    editingTitle,
    startEditing,
    saveTitle,
    cancelEditing,
    handleTitleChange,
    handleKeyDown
  }
}