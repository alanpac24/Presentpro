"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  }
  shapeType?: "rectangle" | "circle" | "triangle" | "arrow"
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
  const slideRef = useRef<HTMLDivElement>(null)

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

  const updateElement = (elementId: string, updates: Partial<SlideElement>) => {
    setElements((prev) => prev.map((el) => (el.id === elementId ? { ...el, ...updates } : el)))
  }

  const updateElementStyle = (elementId: string, styleUpdates: Partial<SlideElement["style"]>) => {
    setElements((prev) =>
      prev.map((el) => (el.id === elementId ? { ...el, style: { ...el.style, ...styleUpdates } } : el)),
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
      zIndex: Math.max(...elements.map((el) => el.zIndex)) + 1,
    }
    setElements((prev) => [...prev, newElement])
    onElementSelect(newElement.id)
  }

  const addShape = (shapeType: "rectangle" | "circle" | "triangle") => {
    const newElement: SlideElement = {
      id: `shape-${Date.now()}`,
      type: "shape",
      content: "",
      position: { x: 200, y: 200 },
      size: { width: 100, height: 100 },
      style: {
        fontSize: 16,
        fontWeight: "400",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#111827",
        backgroundColor: "#3b82f6",
        borderColor: "#2563eb",
        borderWidth: 0,
        textAlign: "center",
        fontFamily: "Inter",
        opacity: 1,
        borderRadius: shapeType === "circle" ? 50 : 8,
      },
      shapeType,
      zIndex: Math.max(...elements.map((el) => el.zIndex)) + 1,
    }
    setElements((prev) => [...prev, newElement])
    onElementSelect(newElement.id)
  }

  const duplicateElement = () => {
    if (!selectedElementData) return
    const newElement = {
      ...selectedElementData,
      id: `${selectedElementData.type}-${Date.now()}`,
      position: {
        x: selectedElementData.position.x + 20,
        y: selectedElementData.position.y + 20,
      },
      zIndex: Math.max(...elements.map((el) => el.zIndex)) + 1,
    }
    setElements((prev) => [...prev, newElement])
    onElementSelect(newElement.id)
  }

  const deleteElement = () => {
    if (!selectedElement) return
    setElements((prev) => prev.filter((el) => el.id !== selectedElement))
    onElementSelect(null)
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
  }

  const handleElementMouseDown = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDraggedElement(elementId)
    onElementSelect(elementId)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleElementDrag = useCallback(
    (e: React.MouseEvent) => {
      if (draggedElement) {
        const deltaX = (e.clientX - dragStart.x) / (zoom / 100)
        const deltaY = (e.clientY - dragStart.y) / (zoom / 100)

        setElements((prev) =>
          prev.map((el) =>
            el.id === draggedElement
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
      }
    },
    [draggedElement, dragStart, zoom],
  )

  const renderShape = (element: SlideElement) => {
    const { shapeType, style } = element

    if (shapeType === "circle") {
      return (
        <div
          className="w-full h-full rounded-full"
          style={{
            backgroundColor: style.backgroundColor,
            border: style.borderWidth > 0 ? `${style.borderWidth}px solid ${style.borderColor}` : "none",
            opacity: style.opacity,
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
          }}
        />
      )
    }

    return (
      <div
        className="w-full h-full"
        style={{
          backgroundColor: style.backgroundColor,
          border: style.borderWidth > 0 ? `${style.borderWidth}px solid ${style.borderColor}` : "none",
          borderRadius: style.borderRadius,
          opacity: style.opacity,
        }}
      />
    )
  }

  const renderElement = (element: SlideElement) => {
    const isSelected = selectedElement === element.id
    const isEditing = isEditingText === element.id

    return (
      <div
        key={element.id}
        className={`absolute cursor-move transition-all duration-200 ${
          isSelected ? "ring-2 ring-blue-500 ring-opacity-50" : ""
        }`}
        style={{
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          zIndex: element.zIndex,
        }}
        onMouseDown={(e) => handleElementMouseDown(element.id, e)}
        onMouseMove={handleElementDrag}
      >
        <div className="w-full h-full relative">
          {element.type === "shape" ? (
            renderShape(element)
          ) : isEditing ? (
            <textarea
              className="w-full h-full p-3 border-none outline-none resize-none bg-transparent"
              style={{
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
              }}
              value={element.content}
              onChange={(e) => updateElement(element.id, { content: e.target.value })}
              onBlur={() => setIsEditingText(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  setIsEditingText(null)
                }
              }}
              autoFocus
            />
          ) : (
            <div
              className="w-full h-full p-3 overflow-hidden cursor-text"
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
              }}
              onDoubleClick={() => element.type !== "shape" && setIsEditingText(element.id)}
            >
              <div className="whitespace-pre-wrap">{element.content}</div>
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
                <div className="flex items-center space-x-0.5 pr-1 border-r border-gray-200">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={addTextBox}
                    title="Add Text Box"
                  >
                    <Type className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => addShape("rectangle")}
                    title="Add Rectangle"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => addShape("circle")}
                    title="Add Circle"
                  >
                    <Circle className="w-4 h-4" />
                  </Button>
                </div>
                {selectedElementData && selectedElementData.type !== "shape" && (
                  <>
                    <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                      <Select
                        value={selectedElementData.style.fontSize.toString()}
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
                        variant={selectedElementData.style.fontWeight === "600" ? "secondary" : "ghost"}
                        onClick={() =>
                          updateElementStyle(selectedElement!, {
                            fontWeight: selectedElementData.style.fontWeight === "600" ? "400" : "600",
                          })
                        }
                      >
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant={selectedElementData.style.fontStyle === "italic" ? "secondary" : "ghost"}
                        onClick={() =>
                          updateElementStyle(selectedElement!, {
                            fontStyle: selectedElementData.style.fontStyle === "italic" ? "normal" : "italic",
                          })
                        }
                        title="Italic"
                      >
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant={selectedElementData.style.textDecoration === "underline" ? "secondary" : "ghost"}
                        onClick={() =>
                          updateElementStyle(selectedElement!, {
                            textDecoration: selectedElementData.style.textDecoration === "underline" ? "none" : "underline",
                          })
                        }
                        title="Underline"
                      >
                        <Underline className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                      <Button
                        size="icon"
                        variant={selectedElementData.style.textAlign === "left" ? "secondary" : "ghost"}
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
                <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Palette className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64">
                      <div className="space-y-3">
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
                        {selectedElementData && (
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
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                {selectedElementData && (
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
          className="bg-white rounded-lg shadow-lg relative overflow-hidden border border-gray-200"
          style={{
            width: "800px",
            height: "450px",
            transform: `scale(${zoom / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: "center",
          }}
          onClick={() => onElementSelect(null)}
        >
          {elements.sort((a, b) => a.zIndex - b.zIndex).map(renderElement)}
          <div className="absolute bottom-4 left-6 right-6 border-t border-gray-200 pt-2 flex justify-between items-center text-xs text-gray-400">
            <span className="font-medium">PRESENTPRO</span>
            <span>{new Date().toLocaleDateString()}</span>
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