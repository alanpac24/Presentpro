"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ZoomIn,
  ZoomOut,
  Move,
  Type,
  Square,
  Circle,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Copy,
  Trash2,
  Image,
  Minus,
  Plus,
  List,
  ListOrdered,
  Undo,
  Redo,
  Triangle,
  ArrowRight,
  Shapes,
  RotateCw,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface SlideElement {
  id: string
  type: "title" | "text" | "shape" | "chart" | "timeline" | "image"
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  style: {
    fontSize: number
    fontWeight: string
    fontStyle: string
    textDecoration: string
    color: string
    backgroundColor: string
    borderColor: string
    borderWidth: number
    textAlign: "left" | "center" | "right" | "justify"
    fontFamily: string
    opacity: number
    borderRadius: number
    lineStyle?: "solid" | "dashed" | "dotted"
    lineThickness?: number
  }
  shapeType?: "rectangle" | "circle" | "triangle" | "line" | "arrow"
  rotation?: number // Add rotation support
  lineOrientation?: "horizontal" | "vertical" | "diagonal-up" | "diagonal-down" // For line shapes
  zIndex: number
}

interface SlideViewProps {
  slide: any
  selectedElement: string | null
  onElementSelect: (element: string | null) => void
  zoom: number
  panOffset: { x: number; y: number }
  onZoomChange: (zoom: number) => void
  onPanChange: (deltaX: number, deltaY: number) => void
}

const fontFamilies = ["Inter", "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana"]
const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72]
const colors = [
  "#000000",
  "#374151",
  "#6b7280",
  "#9ca3af",
  "#d1d5db",
  "#f3f4f6",
  "#ffffff",
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
]

export function SlideView({
  slide,
  selectedElement,
  onElementSelect,
  zoom,
  panOffset,
  onZoomChange,
  onPanChange,
}: SlideViewProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isEditingText, setIsEditingText] = useState<string | null>(null)
  const [draggedElement, setDraggedElement] = useState<string | null>(null)
  const [resizingElement, setResizingElement] = useState<string | null>(null)
  const [resizeDirection, setResizeDirection] = useState<string>('')
  const [textSelection, setTextSelection] = useState<Selection | null>(null)
  const [undoStack, setUndoStack] = useState<any[]>([])
  const [redoStack, setRedoStack] = useState<any[]>([])
  const [copiedElement, setCopiedElement] = useState<SlideElement | null>(null)
  const [multiSelectedElements, setMultiSelectedElements] = useState<Set<string>>(new Set())
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionBox, setSelectionBox] = useState<{ start: { x: number; y: number }; end: { x: number; y: number } } | null>(null)
  const [lastSelectedElement, setLastSelectedElement] = useState<string | null>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const [elements, setElements] = useState<SlideElement[]>([
    {
      id: "title",
      type: "title",
      content: slide.title || "Click to edit title",
      position: { x: 60, y: 60 },
      size: { width: 680, height: 80 },
      style: {
        fontSize: 32,
        fontWeight: "300",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#111827",
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        textAlign: "left",
        fontFamily: "Inter",
        opacity: 1,
        borderRadius: 0,
      },
      zIndex: 1,
    },
    {
      id: "content",
      type: "text",
      content: slide.content || "Click to edit content",
      position: { x: 60, y: 160 },
      size: { width: 680, height: 180 },
      style: {
        fontSize: 16,
        fontWeight: "400",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#374151",
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        textAlign: "left",
        fontFamily: "Inter",
        opacity: 1,
        borderRadius: 0,
      },
      zIndex: 2,
    },
  ])

  const selectedElementData = elements.find((el) => el.id === selectedElement)
  const hasMultiSelection = multiSelectedElements.size > 0
  const isAnyElementSelected = selectedElementData || hasMultiSelection

  const addToUndoStack = () => {
    setUndoStack([...undoStack, elements])
    setRedoStack([])
  }

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const newUndoStack = [...undoStack]
      const prevState = newUndoStack.pop()
      if (prevState) {
        setRedoStack([elements, ...redoStack])
        setElements(prevState)
        setUndoStack(newUndoStack)
      }
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack]
      const nextState = newRedoStack.shift()
      if (nextState) {
        setUndoStack([...undoStack, elements])
        setElements(nextState)
        setRedoStack(newRedoStack)
      }
    }
  }

  const deleteElement = () => {
    if (multiSelectedElements.size > 0) {
      // Delete all multi-selected elements
      setElements((prev) => prev.filter((el) => !multiSelectedElements.has(el.id)))
      setMultiSelectedElements(new Set())
      onElementSelect(null)
    } else if (selectedElement) {
      // Delete single selected element
      setElements((prev) => prev.filter((el) => el.id !== selectedElement))
      onElementSelect(null)
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isEditing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        e.preventDefault()
        if (isEditing && isEditingText) {
          // Copy text selection
          document.execCommand('copy')
        } else if (selectedElement) {
          // Copy entire element
          const element = elements.find(el => el.id === selectedElement)
          if (element) {
            setCopiedElement(element)
          }
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault()
        if (isEditing && isEditingText) {
          // Paste text
          document.execCommand('paste')
        } else if (copiedElement) {
          // Paste element
          const newElement: SlideElement = {
            ...copiedElement,
            id: `${copiedElement.type}-${Date.now()}`,
            position: {
              x: copiedElement.position.x + 20,
              y: copiedElement.position.y + 20,
            },
            zIndex: elements.length > 0 ? Math.max(...elements.map((el) => el.zIndex)) + 1 : 1,
          }
          setElements(prev => [...prev, newElement])
          onElementSelect(newElement.id)
        }
      } else if (!isEditing && (e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      } else if (!isEditing && (e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        handleRedo()
      } else if (!isEditing && e.key === 'Delete' && selectedElement) {
        e.preventDefault()
        deleteElement()
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'a' && isEditing) {
        // Allow select all in text editing mode
        // Don't prevent default - let the browser handle it
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo, selectedElement, elements, copiedElement, isEditingText, deleteElement])

  const formatText = (action: string) => {
    const targetId = isEditingText || selectedElement
    if (!targetId) return
    
    const element = elements.find(el => el.id === targetId)
    if (!element || element.type === 'shape') return

    let content = element.content
    let textarea = textAreaRef.current
    let start = 0
    let end = content.length
    
    // If we have a textarea reference, use its selection
    if (textarea) {
      start = textarea.selectionStart
      end = textarea.selectionEnd
    }
    
    const selectedText = content.substring(start, end)
    const beforeText = content.substring(0, start)
    const afterText = content.substring(end)

    addToUndoStack()

    let newText = content
    let newStart = start
    let newEnd = end

    switch (action) {
      case "bullet":
        // If not in editing mode or no selection, apply to all content
        if (!textarea || (start === end)) {
          const lines = content.split('\n')
          const formattedLines = lines.map(line => {
            if (line.trim() === '') return line // Keep empty lines
            if (line.trim().startsWith('•')) return line
            return '• ' + line
          })
          newText = formattedLines.join('\n')
          newEnd = newText.length
        } else if (start !== end && selectedText.includes('\n')) {
          // Handle multiple lines if text is selected
          const lines = selectedText.split('\n')
          const formattedLines = lines.map(line => {
            // Don't add bullet if line already has one
            if (line.trim().startsWith('•')) return line
            return '• ' + line
          })
          newText = beforeText + formattedLines.join('\n') + afterText
          newEnd = beforeText.length + formattedLines.join('\n').length
        } else {
          // Single line or cursor position
          if (start === 0 || beforeText.endsWith('\n')) {
            newText = beforeText + "• " + selectedText + afterText
            newStart = start + 2
            newEnd = end + 2
          } else {
            const lastNewline = beforeText.lastIndexOf('\n')
            const lineStart = lastNewline + 1
            const currentLine = beforeText.substring(lineStart)
            // Don't add bullet if line already has one
            if (!currentLine.trim().startsWith('•')) {
              newText = beforeText.substring(0, lineStart) + "• " + currentLine + selectedText + afterText
              newStart = start + 2
              newEnd = end + 2
            }
          }
        }
        break
      
      case "numberedList":
        // If not in editing mode or no selection, apply to all content
        if (!textarea || (start === end)) {
          const lines = content.split('\n')
          let lineNumber = 1
          const formattedLines = lines.map((line) => {
            if (line.trim() === '') return line // Keep empty lines
            if (line.trim().match(/^\d+\./)) return line // Already numbered
            const numberedLine = `${lineNumber}. ${line}`
            lineNumber++
            return numberedLine
          })
          newText = formattedLines.join('\n')
          newEnd = newText.length
        } else if (start !== end && selectedText.includes('\n')) {
          // Handle multiple lines if text is selected
          const lines = selectedText.split('\n')
          let lineNumber = 1
          const formattedLines = lines.map((line) => {
            if (line.trim() === '') return line // Keep empty lines
            if (line.trim().match(/^\d+\./)) return line // Already numbered
            const numberedLine = `${lineNumber}. ${line}`
            lineNumber++
            return numberedLine
          })
          newText = beforeText + formattedLines.join('\n') + afterText
          newEnd = beforeText.length + formattedLines.join('\n').length
        } else {
          // Single line or cursor position
          if (start === 0 || beforeText.endsWith('\n')) {
            newText = beforeText + "1. " + selectedText + afterText
            newStart = start + 3
            newEnd = end + 3
          } else {
            const lastNewline = beforeText.lastIndexOf('\n')
            const lineStart = lastNewline + 1
            const currentLine = beforeText.substring(lineStart)
            // Don't add number if line already has one
            if (!currentLine.trim().match(/^\d+\./)) {
              newText = beforeText.substring(0, lineStart) + "1. " + currentLine + selectedText + afterText
              newStart = start + 3
              newEnd = end + 3
            }
          }
        }
        break
    }

    updateElement(targetId, { content: newText })
    
    // Restore selection after state update
    setTimeout(() => {
      if (textAreaRef.current && isEditingText) {
        textAreaRef.current.setSelectionRange(newStart, newEnd)
        textAreaRef.current.focus()
      }
    }, 0)
  }

  const updateElement = (elementId: string | null, updates: Partial<SlideElement>) => {
    if (!elementId) return
    addToUndoStack()
    
    // Update all multi-selected elements or just the single element
    const elementsToUpdate = multiSelectedElements.size > 0 && multiSelectedElements.has(elementId)
      ? Array.from(multiSelectedElements)
      : [elementId]
    
    setElements((prev) => prev.map((el) => 
      elementsToUpdate.includes(el.id) 
        ? { ...el, ...updates } 
        : el
    ))
  }

  const updateElementStyle = (elementId: string | null, styleUpdates: Partial<SlideElement["style"]>) => {
    if (!elementId) return
    addToUndoStack()
    
    // Update style for all multi-selected elements or just the single element
    const elementsToUpdate = multiSelectedElements.size > 0 
      ? Array.from(multiSelectedElements)
      : [elementId]
    
    setElements((prev) =>
      prev.map((el) => 
        elementsToUpdate.includes(el.id) 
          ? { ...el, style: { ...el.style, ...styleUpdates } } 
          : el
      ),
    )
  }

  const addTextBox = () => {
    const newElement: SlideElement = {
      id: `text-${Date.now()}`,
      type: "text",
      content: "New text box",
      position: { x: 100, y: 100 },
      size: { width: 200, height: 50 },
      style: {
        fontSize: 16,
        fontWeight: "400",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#111827",
        backgroundColor: "transparent",
        borderColor: "transparent",
        borderWidth: 0,
        textAlign: "left",
        fontFamily: "Inter",
        opacity: 1,
        borderRadius: 0,
      },
      zIndex: elements.length > 0 ? Math.max(...elements.map((el) => el.zIndex)) + 1 : 1,
    }
    setElements((prev) => [...prev, newElement])
    onElementSelect(newElement.id)
  }

  const addShape = (shapeType: "rectangle" | "circle" | "triangle" | "line" | "arrow") => {
    const isLine = shapeType === "line" || shapeType === "arrow"
    const newElement: SlideElement = {
      id: `shape-${Date.now()}`,
      type: "shape",
      content: "",
      position: { x: 200, y: 200 },
      size: { 
        width: isLine ? 150 : 100, 
        height: isLine ? 4 : 100 
      },
      style: {
        fontSize: 16,
        fontWeight: "400",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#111827",
        backgroundColor: isLine ? "#374151" : "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 0,
        textAlign: "center",
        fontFamily: "Inter",
        opacity: 1,
        borderRadius: shapeType === "circle" ? 50 : (isLine ? 2 : 8),
        lineStyle: isLine ? "solid" : undefined,
        lineThickness: isLine ? 4 : undefined,
      },
      shapeType,
      rotation: 0,
      lineOrientation: isLine ? "horizontal" : undefined,
      zIndex: elements.length > 0 ? Math.max(...elements.map((el) => el.zIndex)) + 1 : 1,
    }
    setElements((prev) => [...prev, newElement])
    onElementSelect(newElement.id)
  }

  const duplicateElement = () => {
    if (multiSelectedElements.size > 0) {
      // Duplicate all multi-selected elements
      const newElements: SlideElement[] = []
      const selectedIds = Array.from(multiSelectedElements)
      let maxZIndex = Math.max(...elements.map((el) => el.zIndex))
      
      selectedIds.forEach((id) => {
        const element = elements.find(el => el.id === id)
        if (element) {
          const newElement: SlideElement = {
            ...element,
            id: `${element.type}-${Date.now()}-${Math.random()}`,
            position: {
              x: element.position.x + 20,
              y: element.position.y + 20,
            },
            style: { ...element.style },
            rotation: element.rotation,
            lineOrientation: element.lineOrientation,
            zIndex: ++maxZIndex,
          }
          newElements.push(newElement)
        }
      })
      
      setElements((prev) => [...prev, ...newElements])
      setMultiSelectedElements(new Set(newElements.map(el => el.id)))
      if (newElements.length > 0) {
        onElementSelect(newElements[0].id)
      }
    } else if (selectedElementData) {
      // Duplicate single element
      const newElement: SlideElement = {
        ...selectedElementData,
        id: `${selectedElementData.type}-${Date.now()}`,
        position: {
          x: selectedElementData.position.x + 20,
          y: selectedElementData.position.y + 20,
        },
        style: { ...selectedElementData.style },
        rotation: selectedElementData.rotation,
        lineOrientation: selectedElementData.lineOrientation,
        zIndex: elements.length > 0 ? Math.max(...elements.map((el) => el.zIndex)) + 1 : 1,
      }
      setElements((prev) => [...prev, newElement])
      onElementSelect(newElement.id)
    }
  }

  const handleSlideMouseDown = (e: React.MouseEvent) => {
    if (zoom > 100 && !draggedElement && !resizingElement) {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleSlideMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 100) {
      const deltaX = (e.clientX - dragStart.x) * 0.5
      const deltaY = (e.clientY - dragStart.y) * 0.5
      onPanChange(deltaX, deltaY)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleSlideMouseUp = () => {
    setIsDragging(false)
    setDraggedElement(null)
    setResizingElement(null)
    setResizeDirection('')
  }

  // Add resize handling
  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!resizingElement || !resizeDirection) return
      
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      
      setElements(prev => prev.map(el => {
        if (el.id === resizingElement) {
          const newSize = { ...el.size }
          const newPos = { ...el.position }
          
          // Use stored resize direction
          if (resizeDirection.includes('e')) newSize.width = Math.max(50, el.size.width + deltaX)
          if (resizeDirection.includes('w')) {
            const widthDelta = Math.min(deltaX, el.size.width - 50)
            newSize.width = el.size.width - widthDelta
            newPos.x = el.position.x + widthDelta
          }
          if (resizeDirection.includes('s')) newSize.height = Math.max(50, el.size.height + deltaY)
          if (resizeDirection.includes('n')) {
            const heightDelta = Math.min(deltaY, el.size.height - 50)
            newSize.height = el.size.height - heightDelta
            newPos.y = el.position.y + heightDelta
          }
          
          return { ...el, size: newSize, position: newPos }
        }
        return el
      }))
      
      setDragStart({ x: e.clientX, y: e.clientY })
    },
    [resizingElement, resizeDirection, dragStart]
  )

  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    const isCtrlOrCmd = e.ctrlKey || e.metaKey
    const isShift = e.shiftKey
    
    if (isCtrlOrCmd) {
      // Multi-select with Ctrl/Cmd
      const newSelection = new Set(multiSelectedElements)
      if (newSelection.has(elementId)) {
        newSelection.delete(elementId)
      } else {
        newSelection.add(elementId)
      }
      setMultiSelectedElements(newSelection)
      onElementSelect(elementId)
    } else if (isShift && lastSelectedElement) {
      // Range select with Shift
      const currentIndex = elements.findIndex(el => el.id === elementId)
      const lastIndex = elements.findIndex(el => el.id === lastSelectedElement)
      
      if (currentIndex !== -1 && lastIndex !== -1) {
        const start = Math.min(currentIndex, lastIndex)
        const end = Math.max(currentIndex, lastIndex)
        const newSelection = new Set<string>()
        
        for (let i = start; i <= end; i++) {
          newSelection.add(elements[i].id)
        }
        
        setMultiSelectedElements(newSelection)
        onElementSelect(elementId)
      }
    } else {
      // Single select
      setMultiSelectedElements(new Set())
      setLastSelectedElement(elementId)
      onElementSelect(elementId)
    }
  }

  const handleElementDrag = useCallback(
    (e: MouseEvent) => {
      if (draggedElement) {
        e.preventDefault() // Prevent text selection while dragging
        
        requestAnimationFrame(() => {
          const deltaX = (e.clientX - dragStart.x) / (zoom / 100)
          const deltaY = (e.clientY - dragStart.y) / (zoom / 100)

          // Check if dragging a multi-selected element
          const elementsToMove = multiSelectedElements.size > 0 && multiSelectedElements.has(draggedElement)
            ? Array.from(multiSelectedElements)
            : [draggedElement]

          setElements((prev) =>
            prev.map((el) =>
              elementsToMove.includes(el.id)
                ? {
                    ...el,
                    position: {
                      x: Math.max(0, Math.min(750, el.position.x + deltaX)),
                      y: Math.max(0, Math.min(400, el.position.y + deltaY)),
                    },
                  }
                : el,
            ),
          )
          setDragStart({ x: e.clientX, y: e.clientY })
        })
      }
    },
    [draggedElement, dragStart, zoom, multiSelectedElements],
  )

  // Global mouse event handlers
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (draggedElement) {
        handleElementDrag(e)
      } else if (resizingElement) {
        handleResize(e)
      }
    }
    
    const handleGlobalMouseUp = () => {
      setDraggedElement(null)
      setResizingElement(null)
      setResizeDirection('')
    }
    
    if (draggedElement || resizingElement) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }
  }, [draggedElement, resizingElement, handleElementDrag, handleResize])

  const renderShape = (element: SlideElement) => {
    const { shapeType, style, lineOrientation, rotation = 0 } = element

    // Apply rotation transform
    const rotationStyle = rotation !== 0 ? { transform: `rotate(${rotation}deg)` } : {}

    if (shapeType === "circle") {
      return (
        <div
          className="w-full h-full rounded-full"
          style={{
            backgroundColor: style.backgroundColor,
            border: style.borderWidth > 0 ? `${style.borderWidth}px solid ${style.borderColor}` : "none",
            opacity: style.opacity,
            ...rotationStyle,
          }}
        />
      )
    }

    if (shapeType === "triangle") {
      return (
        <div
          className="w-full h-full"
          style={{
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            backgroundColor: style.backgroundColor,
            opacity: style.opacity,
            ...rotationStyle,
          }}
        />
      )
    }

    if (shapeType === "line") {
      // Use SVG for better line styling
      const thickness = style.lineThickness || 4
      
      let strokeDasharray = "none"
      if (style.lineStyle === 'dashed') {
        strokeDasharray = `${thickness * 3} ${thickness * 2}`
      } else if (style.lineStyle === 'dotted') {
        strokeDasharray = `${thickness} ${thickness}`
      }

      let x1, y1, x2, y2
      switch (lineOrientation) {
        case "horizontal":
          x1 = 0; y1 = "50%"; x2 = "100%"; y2 = "50%"
          break
        case "vertical":
          x1 = "50%"; y1 = 0; x2 = "50%"; y2 = "100%"
          break
        case "diagonal-up":
          x1 = 0; y1 = "100%"; x2 = "100%"; y2 = 0
          break
        case "diagonal-down":
        default:
          x1 = 0; y1 = 0; x2 = "100%"; y2 = "100%"
          break
      }

      return (
        <div className="w-full h-full relative" style={rotationStyle}>
          <svg 
            className="absolute inset-0 w-full h-full" 
            style={{ overflow: 'visible' }}
          >
            {/* Invisible wider line for easier clicking */}
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="transparent"
              strokeWidth={Math.max(thickness + 20, 20)}
              style={{ cursor: 'pointer' }}
            />
            {/* Visible line */}
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={style.backgroundColor}
              strokeWidth={thickness}
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              opacity={style.opacity}
            />
          </svg>
        </div>
      )
    }

    if (shapeType === "arrow") {
      // Enhanced arrow design with better visuals
      const arrowStyle: React.CSSProperties = {
        position: 'absolute',
        backgroundColor: style.backgroundColor,
        opacity: style.opacity,
      }

      const arrowheadStyle: React.CSSProperties = {
        position: 'absolute',
        width: '0',
        height: '0',
        opacity: style.opacity,
      }

      let shaftStyle = { ...arrowStyle }
      let headStyle = { ...arrowheadStyle }

      switch (lineOrientation) {
        case "horizontal":
          shaftStyle = {
            ...shaftStyle,
            width: 'calc(100% - 20px)',
            height: '4px',
            top: '50%',
            left: '0',
            transform: 'translateY(-50%)',
          }
          headStyle = {
            ...headStyle,
            right: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            borderLeft: `20px solid ${style.backgroundColor}`,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
          }
          break
        case "vertical":
          shaftStyle = {
            ...shaftStyle,
            width: '4px',
            height: 'calc(100% - 20px)',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
          }
          headStyle = {
            ...headStyle,
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            borderTop: `20px solid ${style.backgroundColor}`,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
          }
          break
        case "diagonal-up":
          shaftStyle = {
            ...shaftStyle,
            width: 'calc(141% - 20px)',
            height: '4px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            transformOrigin: 'center',
          }
          headStyle = {
            ...headStyle,
            top: '15%',
            right: '15%',
            transform: 'rotate(-45deg)',
            borderLeft: `20px solid ${style.backgroundColor}`,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
          }
          break
        case "diagonal-down":
          shaftStyle = {
            ...shaftStyle,
            width: 'calc(141% - 20px)',
            height: '4px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            transformOrigin: 'center',
          }
          headStyle = {
            ...headStyle,
            bottom: '15%',
            right: '15%',
            transform: 'rotate(45deg)',
            borderLeft: `20px solid ${style.backgroundColor}`,
            borderTop: '10px solid transparent',
            borderBottom: '10px solid transparent',
          }
          break
      }

      return (
        <div className="w-full h-full relative" style={rotationStyle}>
          <div style={shaftStyle} />
          <div style={headStyle} />
        </div>
      )
    }

    // Rectangle shape
    return (
      <div
        className="w-full h-full"
        style={{
          backgroundColor: style.backgroundColor,
          border: style.borderWidth > 0 ? `${style.borderWidth}px solid ${style.borderColor}` : "none",
          borderRadius: style.borderRadius,
          opacity: style.opacity,
          ...rotationStyle,
        }}
      />
    )
  }

  const renderElement = (element: SlideElement) => {
    const isSelected = selectedElement === element.id || multiSelectedElements.has(element.id)
    const isEditing = isEditingText === element.id
    const isDragging = draggedElement === element.id
    const isResizing = resizingElement === element.id
    const isMultiSelected = multiSelectedElements.has(element.id)

    return (
      <div
        key={element.id}
        className={`absolute ${
          !isDragging && !isResizing ? 'transition-all duration-200' : ''
        } ${
          isMultiSelected ? "ring-2 ring-purple-500 ring-opacity-50" : 
          isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""
        } ${!isEditing && !isSelected ? 'hover:ring-2 hover:ring-blue-300 hover:ring-opacity-30' : ''}`}
        style={{
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          zIndex: element.zIndex,
          cursor: isEditing ? 'auto' : (isDragging ? 'grabbing' : 'default'),
          willChange: isDragging || isResizing ? 'transform' : 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (!isEditing && !isDragging) {
            handleElementClick(element.id, e)
          }
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          // For shapes, start dragging immediately
          if (element.type === 'shape' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            setDraggedElement(element.id)
            setDragStart({ x: e.clientX, y: e.clientY })
          }
          // For text elements, only drag if already selected and not clicking on text
          else if (isSelected && !isEditing && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            const target = e.target as HTMLElement
            if (!target.classList.contains('text-content-area')) {
              setDraggedElement(element.id)
              setDragStart({ x: e.clientX, y: e.clientY })
            }
          }
        }}
      >
        <div className="w-full h-full relative">
          {element.type === "shape" ? (
            renderShape(element)
          ) : isEditing ? (
            <textarea
              ref={textAreaRef}
              className="w-full h-full p-3 border-none outline-none resize-none bg-transparent select-text"
              style={{
                userSelect: 'text',
                WebkitUserSelect: 'text',
                fontSize: element.style.fontSize,
                fontWeight: element.style.fontWeight,
                fontStyle: element.style.fontStyle,
                textDecoration: element.style.textDecoration,
                color: element.style.color,
                textAlign: element.style.textAlign,
                fontFamily: element.style.fontFamily,
                backgroundColor: element.style.backgroundColor,
                borderRadius: element.style.borderRadius,
                lineHeight: 1.5,
                cursor: 'text',
                caretColor: element.style.color || '#000000',
              }}
              value={element.content}
              onChange={(e) => {
                const textarea = e.currentTarget
                const content = e.target.value
                updateElement(element.id, { content })
                
                // Auto-resize the text box
                textarea.style.height = 'auto'
                const scrollHeight = textarea.scrollHeight
                const newHeight = Math.max(element.size.height, scrollHeight + 24) // 24px for padding
                
                if (newHeight !== element.size.height) {
                  updateElement(element.id, { 
                    size: { ...element.size, height: newHeight }
                  })
                }
              }}
              onBlur={(e) => {
                // Save content before blur
                const content = e.currentTarget.value
                updateElement(element.id, { content })
                // Only blur if clicking outside the element
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setIsEditingText(null)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsEditingText(null)
                  e.preventDefault()
                }
                // Allow Ctrl/Cmd+A for select all
                if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                  // Don't prevent default - let browser handle select all
                  return
                }
                e.stopPropagation()
              }}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className="w-full h-full p-3 overflow-hidden select-none text-content-area"
              style={{
                fontSize: element.style.fontSize,
                fontWeight: element.style.fontWeight,
                fontStyle: element.style.fontStyle,
                textDecoration: element.style.textDecoration,
                color: element.style.color,
                textAlign: element.style.textAlign,
                fontFamily: element.style.fontFamily,
                backgroundColor: element.style.backgroundColor,
                border:
                  element.style.borderWidth > 0
                    ? `${element.style.borderWidth}px solid ${element.style.borderColor}`
                    : "none",
                borderRadius: element.style.borderRadius,
                opacity: element.style.opacity,
                lineHeight: 1.5,
                cursor: isSelected ? 'text' : 'default',
              }}
              onClick={(e) => {
                e.stopPropagation()
                // If not selected, select it first
                if (!isSelected) {
                  handleElementClick(element.id, e)
                } 
                // If already selected, enter edit mode
                else if (element.type !== "shape") {
                  setIsEditingText(element.id)
                }
              }}
            >
              <div className="whitespace-pre-wrap" style={{ pointerEvents: 'none' }}>{element.content}</div>
            </div>
          )}
        </div>

        {/* Selection Handles */}
        {isSelected && !isEditing && (
          <>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded-md text-xs font-medium">
              <Move className="w-3 h-3 inline mr-1" />
              {element.type}
            </div>
            {/* Resize handles */}
            {[
              { pos: "-top-1 -left-1", cursor: "nw-resize" },
              { pos: "-top-1 -right-1", cursor: "ne-resize" },
              { pos: "-bottom-1 -left-1", cursor: "sw-resize" },
              { pos: "-bottom-1 -right-1", cursor: "se-resize" },
              { pos: "-top-1 left-1/2 transform -translate-x-1/2", cursor: "n-resize" },
              { pos: "-bottom-1 left-1/2 transform -translate-x-1/2", cursor: "s-resize" },
              { pos: "top-1/2 -left-1 transform -translate-y-1/2", cursor: "w-resize" },
              { pos: "top-1/2 -right-1 transform -translate-y-1/2", cursor: "e-resize" },
            ].map((handle, index) => (
              <div
                key={index}
                className={`absolute w-2 h-2 bg-blue-500 rounded-sm ${handle.pos}`}
                style={{ cursor: handle.cursor }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  setResizingElement(element.id)
                  setResizeDirection(handle.cursor.replace('-resize', ''))
                  setDragStart({ x: e.clientX, y: e.clientY })
                }}
              />
            ))}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-50 flex flex-col relative">
      {/* Persistent Formatting Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-center">
          <Card className="shadow-sm border border-gray-200 bg-white rounded-lg">
            <CardContent className="p-2">
              <div className="flex items-center space-x-1">
                {hasMultiSelection && multiSelectedElements.size > 1 && (
                  <div className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium mr-2">
                    {multiSelectedElements.size} selected
                  </div>
                )}
                <div className={`flex items-center space-x-0.5 pr-1 ${isAnyElementSelected ? 'border-r border-gray-200' : ''}`}>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={addTextBox}
                    title="Add Text Box"
                  >
                    <Type className="w-4 h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        title="Add Shape"
                      >
                        <Shapes className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => addShape("rectangle")}>
                        <Square className="w-4 h-4" />
                        <span>Rectangle</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addShape("circle")}>
                        <Circle className="w-4 h-4" />
                        <span>Circle</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addShape("triangle")}>
                        <Triangle className="w-4 h-4" />
                        <span>Triangle</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addShape("line")}>
                        <Minus className="w-4 h-4" />
                        <span>Line</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addShape("arrow")}>
                        <ArrowRight className="w-4 h-4" />
                        <span>Arrow</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {isAnyElementSelected ? (
                  <>
                    {/* Undo/Redo */}
                    <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={handleUndo}
                        disabled={undoStack.length === 0}
                        title="Undo (Ctrl+Z)"
                      >
                        <Undo className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={handleRedo}
                        disabled={redoStack.length === 0}
                        title="Redo (Ctrl+Y)"
                      >
                        <Redo className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Text Formatting - only show for text elements */}
                    {selectedElementData && selectedElementData.type !== "shape" && (
                      <>
                        <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                          <Select
                            value={selectedElementData?.style.fontSize.toString() || "16"}
                            onValueChange={(v) => updateElementStyle(selectedElement!, { fontSize: Number(v) })}
                          >
                            <SelectTrigger className="w-16 h-9 text-xs rounded-md">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fontSizes.map((s) => (
                                <SelectItem key={s} value={s.toString()}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                          <Button
                            size="icon"
                            variant={selectedElementData?.style.fontWeight === "600" ? "secondary" : "ghost"}
                            onClick={() =>
                              updateElementStyle(selectedElement!, {
                                fontWeight: selectedElementData?.style.fontWeight === "600" ? "400" : "600",
                              })
                            }
                          >
                            <Bold className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant={selectedElementData?.style.fontStyle === "italic" ? "secondary" : "ghost"}
                            onClick={() =>
                              updateElementStyle(selectedElement!, {
                                fontStyle: selectedElementData?.style.fontStyle === "italic" ? "normal" : "italic",
                              })
                            }
                            title="Italic"
                          >
                            <Italic className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant={selectedElementData?.style.textDecoration === "underline" ? "secondary" : "ghost"}
                            onClick={() =>
                              updateElementStyle(selectedElement!, {
                                textDecoration: selectedElementData?.style.textDecoration === "underline" ? "none" : "underline",
                              })
                            }
                            title="Underline"
                          >
                            <Underline className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                    
                    {/* Lists and Indentation - only show for text elements */}
                    {selectedElementData && selectedElementData.type !== "shape" && (
                      <>
                        <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (!isEditingText && selectedElement) {
                                setIsEditingText(selectedElement)
                                setTimeout(() => formatText("bullet"), 100)
                              } else if (isEditingText) {
                                formatText("bullet")
                              }
                            }}
                            title="Bullet List"
                            disabled={!selectedElement || (selectedElementData?.type === "shape")}
                          >
                            <List className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (!isEditingText && selectedElement) {
                                setIsEditingText(selectedElement)
                                setTimeout(() => formatText("numberedList"), 100)
                              } else if (isEditingText) {
                                formatText("numberedList")
                              }
                            }}
                            title="Numbered List"
                            disabled={!selectedElement || (selectedElementData?.type === "shape")}
                          >
                            <ListOrdered className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                          <Button
                            size="icon"
                            variant={selectedElementData?.style.textAlign === "left" ? "secondary" : "ghost"}
                            onClick={() => updateElementStyle(selectedElement!, { textAlign: "left" })}
                          >
                            <AlignLeft className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant={selectedElementData.style.textAlign === "center" ? "secondary" : "ghost"}
                            onClick={() => updateElementStyle(selectedElement!, { textAlign: "center" })}
                          >
                            <AlignCenter className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant={selectedElementData.style.textAlign === "right" ? "secondary" : "ghost"}
                            onClick={() => updateElementStyle(selectedElement!, { textAlign: "right" })}
                            title="Align Right"
                          >
                            <AlignRight className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant={selectedElementData.style.textAlign === "justify" ? "secondary" : "ghost"}
                            onClick={() => updateElementStyle(selectedElement!, { textAlign: "justify" })}
                            title="Justify"
                          >
                            <AlignJustify className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                          <Select
                            value={selectedElementData.style.fontFamily}
                            onValueChange={(v) => updateElementStyle(selectedElement!, { fontFamily: v })}
                          >
                            <SelectTrigger className="w-32 h-9 text-xs rounded-md">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fontFamilies.map((font) => (
                                <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                                  {font}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                    
                    {/* Shape-specific controls */}
                    {selectedElementData && selectedElementData.type === "shape" && (selectedElementData.shapeType === "line" || selectedElementData.shapeType === "arrow") && (
                      <>
                        <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                title="Line Orientation"
                              >
                                {selectedElementData.lineOrientation === "horizontal" && <ArrowRight className="w-4 h-4" />}
                                {selectedElementData.lineOrientation === "vertical" && <ArrowDown className="w-4 h-4" />}
                                {selectedElementData.lineOrientation === "diagonal-up" && <ArrowUpRight className="w-4 h-4" />}
                                {selectedElementData.lineOrientation === "diagonal-down" && <ArrowDownRight className="w-4 h-4" />}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem onClick={() => updateElement(selectedElement!, { lineOrientation: "horizontal" })}>
                                <ArrowRight className="w-4 h-4 mr-2" />
                                <span>Horizontal</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateElement(selectedElement!, { lineOrientation: "vertical" })}>
                                <ArrowDown className="w-4 h-4 mr-2" />
                                <span>Vertical</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateElement(selectedElement!, { lineOrientation: "diagonal-up" })}>
                                <ArrowUpRight className="w-4 h-4 mr-2" />
                                <span>Diagonal Up</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateElement(selectedElement!, { lineOrientation: "diagonal-down" })}>
                                <ArrowDownRight className="w-4 h-4 mr-2" />
                                <span>Diagonal Down</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        {/* Line Style */}
                        <div className="flex items-center space-x-1 px-1 border-r border-gray-200">
                          <span className="text-xs text-gray-500">Style:</span>
                          <Select
                            value={selectedElementData.style.lineStyle || "solid"}
                            onValueChange={(value) => 
                              updateElementStyle(selectedElement!, { 
                                lineStyle: value as "solid" | "dashed" | "dotted" 
                              })
                            }
                          >
                            <SelectTrigger className="w-20 h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="solid">Solid</SelectItem>
                              <SelectItem value="dashed">Dashed</SelectItem>
                              <SelectItem value="dotted">Dotted</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Line Thickness */}
                        <div className="flex items-center space-x-1 px-1 border-r border-gray-200">
                          <span className="text-xs text-gray-500">Thickness:</span>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            value={selectedElementData.style.lineThickness || 4}
                            onChange={(e) => updateElementStyle(selectedElement!, { 
                              lineThickness: parseInt(e.target.value) 
                            })}
                            className="w-20"
                            title={`${selectedElementData.style.lineThickness || 4}px`}
                          />
                          <span className="text-xs w-6 text-right">
                            {selectedElementData.style.lineThickness || 4}
                          </span>
                        </div>
                      </>
                    )}
                    
                    {/* Rotation control for non-line shapes */}
                    {selectedElementData && selectedElementData.type === "shape" && selectedElementData.shapeType !== "line" && selectedElementData.shapeType !== "arrow" && (
                      <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            const currentRotation = selectedElementData.rotation || 0
                            updateElement(selectedElement!, { rotation: (currentRotation + 45) % 360 })
                          }}
                          title="Rotate 45°"
                        >
                          <RotateCw className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Size controls for shapes */}
                    {selectedElementData && selectedElementData.type === "shape" && (
                      <div className="flex items-center space-x-1 px-1 border-r border-gray-200">
                        <span className="text-xs text-gray-500">W:</span>
                        <input
                          type="number"
                          value={selectedElementData.size.width}
                          onChange={(e) => updateElement(selectedElement!, { 
                            size: { ...selectedElementData.size, width: Math.max(10, parseInt(e.target.value) || 0) }
                          })}
                          className="w-16 h-7 px-2 text-xs border rounded"
                        />
                        <span className="text-xs text-gray-500">H:</span>
                        <input
                          type="number"
                          value={selectedElementData.size.height}
                          onChange={(e) => updateElement(selectedElement!, { 
                            size: { ...selectedElementData.size, height: Math.max(10, parseInt(e.target.value) || 0) }
                          })}
                          className="w-16 h-7 px-2 text-xs border rounded"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                      <Popover>
                    <PopoverTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Palette className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-3">
                        {selectedElementData?.type === "shape" ? (
                          // For shapes, show shape color and border options
                          <>
                            <div>
                              <p className="text-xs font-medium mb-2">Shape Color</p>
                              <div className="grid grid-cols-8 gap-1">
                                {colors.map((c) => (
                                  <button
                                    key={c}
                                    className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                                    style={{ backgroundColor: c }}
                                    onClick={() =>
                                      updateElementStyle(selectedElement!, { backgroundColor: c })
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            {selectedElementData.shapeType === "line" ? (
                              // Line-specific controls
                              <>
                                <div>
                                  <p className="text-xs font-medium mb-2">Line Style</p>
                                  <Select
                                    value={selectedElementData.style.lineStyle || "solid"}
                                    onValueChange={(value) => 
                                      updateElementStyle(selectedElement!, { 
                                        lineStyle: value as "solid" | "dashed" | "dotted" 
                                      })
                                    }
                                  >
                                    <SelectTrigger className="w-full h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="solid">Solid</SelectItem>
                                      <SelectItem value="dashed">Dashed</SelectItem>
                                      <SelectItem value="dotted">Dotted</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <p className="text-xs font-medium mb-2">Line Thickness</p>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="range"
                                      min="1"
                                      max="20"
                                      value={selectedElementData.style.lineThickness || 4}
                                      onChange={(e) => updateElementStyle(selectedElement!, { 
                                        lineThickness: parseInt(e.target.value) 
                                      })}
                                      className="flex-1"
                                    />
                                    <span className="text-xs w-8 text-right">
                                      {selectedElementData.style.lineThickness || 4}px
                                    </span>
                                  </div>
                                </div>
                              </>
                            ) : (
                              // Regular shape border controls
                              <div>
                                <p className="text-xs font-medium mb-2">Border</p>
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-xs">Width:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={selectedElementData.style.borderWidth}
                                    onChange={(e) => updateElementStyle(selectedElement!, { 
                                      borderWidth: Math.max(0, Math.min(10, parseInt(e.target.value) || 0))
                                    })}
                                    className="w-16 h-6 px-2 text-xs border rounded"
                                  />
                                </div>
                                <div className="grid grid-cols-8 gap-1">
                                  {colors.map((c) => (
                                    <button
                                      key={c}
                                      className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                                      style={{ backgroundColor: c }}
                                      onClick={() =>
                                        updateElementStyle(selectedElement!, { borderColor: c })
                                      }
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          // For text elements, show both text and background colors
                          <>
                            <div>
                              <p className="text-xs font-medium mb-2">Text Color</p>
                              <div className="grid grid-cols-8 gap-1">
                                {colors.map((c) => (
                                  <button
                                    key={c}
                                    className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                                    style={{ backgroundColor: c }}
                                    onClick={() =>
                                      selectedElementData && updateElementStyle(selectedElement!, { color: c })
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium mb-2">Background</p>
                              <div className="grid grid-cols-8 gap-1">
                                {colors.concat(["transparent"]).map((c) => (
                                  <button
                                    key={c}
                                    className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                                    style={{ 
                                      backgroundColor: c === "transparent" ? "white" : c,
                                      backgroundImage: c === "transparent" 
                                        ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)"
                                        : "none",
                                      backgroundSize: "8px 8px",
                                      backgroundPosition: "0 0, 4px 4px"
                                    }}
                                    onClick={() =>
                                      updateElementStyle(selectedElement!, { 
                                        backgroundColor: c === "transparent" ? "transparent" : c 
                                      })
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                  </>
                ) : null}
                {isAnyElementSelected && (
                  <div className="flex items-center space-x-0.5 pl-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={duplicateElement}
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={deleteElement}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div
        className="flex-1 flex items-center justify-center p-12 overflow-hidden"
        onMouseDown={handleSlideMouseDown}
        onMouseMove={handleSlideMouseMove}
        onMouseUp={handleSlideMouseUp}
        style={{ cursor: zoom > 100 && !draggedElement ? (isDragging ? "grabbing" : "grab") : "default" }}
      >
        <div
          ref={slideRef}
          className="bg-white rounded-lg shadow-lg relative overflow-hidden"
          style={{
            width: "800px",
            height: "450px",
            transform: `scale(${zoom / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: "center",
          }}
          onClick={(e) => {
            // Only deselect if clicking directly on the slide background
            if (e.target === e.currentTarget) {
              onElementSelect(null)
              setMultiSelectedElements(new Set())
              setLastSelectedElement(null)
            }
          }}
        >
          {elements.sort((a, b) => a.zIndex - b.zIndex).map(renderElement)}
          <div className="absolute bottom-4 left-6 right-6 border-t border-gray-200 pt-2 flex justify-between items-center text-xs text-gray-400">
            <span className="font-medium">PRESENTPRO</span>
            <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 flex items-center space-x-3">
        <Card className="shadow-lg border border-gray-200 rounded-lg">
          <CardContent className="p-1.5">
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" onClick={() => onZoomChange(zoom - 25)} disabled={zoom <= 50}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">{zoom}%</span>
              <Button variant="ghost" size="icon" onClick={() => onZoomChange(zoom + 25)} disabled={zoom >= 200}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}