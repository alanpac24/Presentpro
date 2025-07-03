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
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  Columns3,
  Rows3,
  Table,
  TableProperties,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  X,
} from "lucide-react"
import { ChartRenderer } from './ChartRenderer'

interface SlideElement {
  id: string
  type: "title" | "text" | "shape" | "chart" | "timeline" | "image" | "table"
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
    lineHeight?: number
    letterSpacing?: number
    lineStyle?: "solid" | "dashed" | "dotted"
    lineThickness?: number
  }
  shapeType?: "rectangle" | "circle" | "triangle" | "line" | "arrow"
  rotation?: number // Add rotation support
  lineOrientation?: "horizontal" | "vertical" | "diagonal-up" | "diagonal-down" // For line shapes
  zIndex: number
  // Table-specific properties
  rows?: number
  columns?: number
  cells?: string[][]
  cellStyles?: {
    backgroundColor?: string
    color?: string
    fontWeight?: string
    fontStyle?: string
    textDecoration?: string
    fontSize?: number
    fontFamily?: string
    textAlign?: "left" | "center" | "right"
    verticalAlign?: "top" | "middle" | "bottom"
  }[][]
  columnWidths?: number[]
  rowHeights?: number[]
  headerRow?: boolean
  borderStyle?: {
    color?: string
    width?: number
    style?: "solid" | "dashed" | "dotted" | "none"
  }
  cellBorders?: {
    top?: { color: string; width: number; style: "solid" | "dashed" | "dotted" | "none" }
    right?: { color: string; width: number; style: "solid" | "dashed" | "dotted" | "none" }
    bottom?: { color: string; width: number; style: "solid" | "dashed" | "dotted" | "none" }
    left?: { color: string; width: number; style: "solid" | "dashed" | "dotted" | "none" }
  }[][]
  // Chart-specific properties
  chartType?: "bar" | "bar-grouped" | "bar-stacked" | "waterfall" | "line" | "pie"
  chartData?: {
    // D3 format - array of data points
    data?: Array<{
      category?: string
      name?: string
      value: number
      series?: string
      type?: 'start' | 'positive' | 'negative' | 'end'
    }>
    // Legacy Chart.js format (for compatibility during migration)
    labels?: string[]
    datasets?: {
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string | string[]
      borderWidth?: number
      fill?: boolean
      stack?: string
      waterfall?: {
        categories?: ('increase' | 'decrease' | 'total' | 'subtotal')[]
        cumulative?: number[]
        deltas?: number[]
        connectorColor?: string
        totalColor?: string
        increaseColor?: string
        decreaseColor?: string
      }
    }[]
  }
  // Advanced chart settings
  chartSettings?: {
    stacked?: boolean
    stackedType?: 'normal' | '100%'
    showTotals?: boolean
    showCAGR?: boolean
    cagrStartIndex?: number
    cagrEndIndex?: number
  }
  chartOptions?: {
    responsive?: boolean
    maintainAspectRatio?: boolean
    plugins?: {
      legend?: {
        display?: boolean
        position?: "top" | "bottom" | "left" | "right"
      }
      title?: {
        display?: boolean
        text?: string
      }
      datalabels?: {
        display?: boolean
        anchor?: 'center' | 'start' | 'end'
        align?: 'center' | 'start' | 'end' | 'right' | 'left' | 'top' | 'bottom'
        formatter?: any
        font?: {
          size?: number
          weight?: string
        }
      }
    }
    scales?: {
      x?: any
      y?: any
    }
  }
  // Smart label configuration
  smartLabels?: {
    enabled?: boolean
    format?: 'number' | 'currency' | 'percentage'
    decimals?: number
    prefix?: string
    suffix?: string
    template?: string // e.g., "{value} ({percentage}%)"
    showValue?: boolean
    showPercentage?: boolean
    showDelta?: boolean
    position?: 'auto' | 'inside' | 'outside' | 'center' | 'end'
    connectorLines?: boolean
    fontSize?: number
    fontWeight?: string
  }
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
  const [editingCell, setEditingCell] = useState<{ elementId: string; row: number; col: number } | null>(null)
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())
  const [tableSelectionStart, setTableSelectionStart] = useState<{ elementId: string; row: number; col: number } | null>(null)
  const [tableSelectionEnd, setTableSelectionEnd] = useState<{ elementId: string; row: number; col: number } | null>(null)
  const [isTableSelecting, setIsTableSelecting] = useState(false)
  const [resizingColumn, setResizingColumn] = useState<{ elementId: string; colIndex: number } | null>(null)
  const [resizingRow, setResizingRow] = useState<{ elementId: string; rowIndex: number } | null>(null)
  const [resizeStartPos, setResizeStartPos] = useState<{ x: number; y: number } | null>(null)
  const [editingCellValue, setEditingCellValue] = useState<string>("")
  const [editingChart, setEditingChart] = useState<string | null>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const tableCellRef = useRef<HTMLTextAreaElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 450 })
  const chartEditorRef = useRef<HTMLDivElement>(null)

  const [elements, setElements] = useState<SlideElement[]>([])

  // Initialize elements with responsive sizes
  useEffect(() => {
    const titleElement: SlideElement = {
      id: "title",
      type: "title",
      content: slide.title || "Click to edit title",
      position: { x: canvasSize.width * 0.075, y: canvasSize.height * 0.133 },
      size: { width: canvasSize.width * 0.85, height: canvasSize.height * 0.178 },
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
    }
    
    const contentElement: SlideElement = {
      id: "content",
      type: "text",
      content: slide.content || "Click to edit content",
      position: { x: canvasSize.width * 0.075, y: canvasSize.height * 0.356 },
      size: { width: canvasSize.width * 0.85, height: canvasSize.height * 0.4 },
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
    }
    
    setElements([titleElement, contentElement])
  }, [slide.title, slide.content, canvasSize])
  
  // Handle click outside for chart editor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartEditorRef.current && !chartEditorRef.current.contains(event.target as Node)) {
        // Check if clicking on a chart element
        const clickedElement = (event.target as HTMLElement).closest('[data-chart-element]')
        if (!clickedElement) {
          setEditingChart(null)
        }
      }
    }
    
    if (editingChart) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [editingChart])

  const selectedElementData = elements.find((el) => el.id === selectedElement)
  
  // Helper function to render chart editor content
  const renderChartEditorContent = (chartElement: SlideElement) => {
    if (!chartElement || !chartElement.chartData) return null
    
    return (
      <>
        {/* Chart Title */}
        <div>
          <p className="text-xs font-medium mb-2">Chart Title</p>
          <input
            type="text"
            value={chartElement.content || ''}
            onChange={(e) => {
              updateElement(chartElement.id, { content: e.target.value })
            }}
            className="w-full h-8 px-2 text-xs border rounded"
            placeholder="Enter chart title"
          />
        </div>
        
        {/* Chart Type */}
        <div>
          <p className="text-xs font-medium mb-2">Chart Type</p>
          <Select
            value={chartElement.chartType}
            onValueChange={(value) => {
              const chartType = value as SlideElement['chartType']
              const defaultData = getDefaultChartData(chartType)
              updateElement(chartElement.id, { 
                chartType: chartType,
                chartData: defaultData
              })
            }}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="bar-grouped">Grouped Bar Chart</SelectItem>
              <SelectItem value="bar-stacked">Stacked Bar Chart</SelectItem>
              <SelectItem value="waterfall">Waterfall Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Color Customization - moved up for better visibility */}
        <div>
          <p className="text-xs font-medium mb-2">Chart Colors</p>
          <div className="space-y-2">
            {chartElement.chartType === 'waterfall' ? (
              // For waterfall charts, show increase/decrease/total colors
              <div className="space-y-2">
                {[
                  { label: 'Positive', key: 'positive', default: '#166534' },
                  { label: 'Negative', key: 'negative', default: '#C93C37' },
                  { label: 'Start/End', key: 'start', default: '#4A6FA5' },
                ].map(({ label, key, default: defaultColor }) => {
                  const currentColor = defaultColor
                  
                  return (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{label}</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-20 p-1"
                          >
                            <div
                              className="w-full h-full rounded"
                              style={{ backgroundColor: currentColor as string }}
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2">
                          <div className="grid grid-cols-6 gap-1">
                            {[
                              'rgba(34, 197, 94, 0.8)', // Green
                              'rgba(239, 68, 68, 0.8)', // Red
                              'rgba(107, 114, 128, 0.8)', // Gray
                              'rgba(59, 130, 246, 0.8)', // Blue
                              'rgba(251, 146, 60, 0.8)', // Orange
                              'rgba(168, 85, 247, 0.8)', // Purple
                              'rgba(245, 158, 11, 0.8)', // Amber
                              'rgba(16, 185, 129, 0.8)', // Emerald
                              'rgba(139, 92, 246, 0.8)', // Violet
                              'rgba(236, 72, 153, 0.8)', // Pink
                              'rgba(99, 102, 241, 0.8)', // Indigo
                              'rgba(20, 184, 166, 0.8)', // Teal
                            ].map((color) => (
                              <button
                                key={color}
                                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                onClick={() => {
                                  // Color customization for D3 charts is handled by the chart component
                                  // For now, we'll just update the element to trigger a re-render
                                  updateElement(chartElement.id, { chartData: { ...chartElement.chartData } })
                                  addToUndoStack()
                                }}
                              />
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )
                })}
              </div>
            ) : (chartElement.chartType === 'pie') ? (
              // For pie charts, show color for each data point
              chartElement.chartData?.data?.map((item, index) => {
                const colors = ['#4A6FA5', '#166534', '#E07B39', '#C93C37', '#7E57C2', '#5D7092']
                const currentColor = colors[index % colors.length]
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 truncate max-w-[120px]">{item.category || item.name || 'Item'}</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 w-16 p-1"
                        >
                          <div
                            className="w-full h-full rounded"
                            style={{ backgroundColor: currentColor }}
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-2">
                        <div className="grid grid-cols-6 gap-1">
                          {[
                            'rgba(59, 130, 246, 0.8)', // Blue
                            'rgba(34, 197, 94, 0.8)', // Green
                            'rgba(251, 146, 60, 0.8)', // Orange
                            'rgba(168, 85, 247, 0.8)', // Purple
                            'rgba(239, 68, 68, 0.8)', // Red
                            'rgba(245, 158, 11, 0.8)', // Amber
                            'rgba(16, 185, 129, 0.8)', // Emerald
                            'rgba(139, 92, 246, 0.8)', // Violet
                            'rgba(236, 72, 153, 0.8)', // Pink
                            'rgba(99, 102, 241, 0.8)', // Indigo
                            'rgba(14, 165, 233, 0.8)', // Sky
                            'rgba(20, 184, 166, 0.8)', // Teal
                          ].map((color) => (
                            <button
                              key={color}
                              className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                // Color customization for D3 charts is handled by the chart component
                                // For now, we'll just update the element to trigger a re-render
                                updateElement(chartElement.id, { chartData: { ...chartElement.chartData } })
                                addToUndoStack()
                              }}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )
              })
            ) : (
              // For bar/line charts, show single color selector
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Primary Color</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-20 p-1"
                    >
                      <div
                        className="w-full h-full rounded"
                        style={{ 
                          backgroundColor: '#4A6FA5'
                        }}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <div className="grid grid-cols-6 gap-1">
                      {[
                        { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgba(59, 130, 246, 1)' }, // Blue
                        { bg: 'rgba(34, 197, 94, 0.8)', border: 'rgba(34, 197, 94, 1)' }, // Green
                        { bg: 'rgba(251, 146, 60, 0.8)', border: 'rgba(251, 146, 60, 1)' }, // Orange
                        { bg: 'rgba(168, 85, 247, 0.8)', border: 'rgba(168, 85, 247, 1)' }, // Purple
                        { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgba(239, 68, 68, 1)' }, // Red
                        { bg: 'rgba(245, 158, 11, 0.8)', border: 'rgba(245, 158, 11, 1)' }, // Amber
                        { bg: 'rgba(16, 185, 129, 0.8)', border: 'rgba(16, 185, 129, 1)' }, // Emerald
                        { bg: 'rgba(139, 92, 246, 0.8)', border: 'rgba(139, 92, 246, 1)' }, // Violet
                        { bg: 'rgba(236, 72, 153, 0.8)', border: 'rgba(236, 72, 153, 1)' }, // Pink
                        { bg: 'rgba(99, 102, 241, 0.8)', border: 'rgba(99, 102, 241, 1)' }, // Indigo
                        { bg: 'rgba(14, 165, 233, 0.8)', border: 'rgba(14, 165, 233, 1)' }, // Sky
                        { bg: 'rgba(20, 184, 166, 0.8)', border: 'rgba(20, 184, 166, 1)' }, // Teal
                      ].map((colorSet) => (
                        <button
                          key={colorSet.bg}
                          className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                          style={{ backgroundColor: colorSet.bg }}
                          onClick={() => {
                            // Color customization for D3 charts is handled by the chart component
                            // For now, we'll just update the element to trigger a re-render
                            updateElement(chartElement.id, { chartData: { ...chartElement.chartData } })
                            addToUndoStack()
                          }}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>
        
        {/* Waterfall-specific controls */}
        {chartElement.chartType === 'waterfall' && (
          <div>
            <p className="text-xs font-medium mb-2">Category Types</p>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {chartElement.chartData?.data?.map((item, index) => {
                const category = item.type || 'positive'
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 truncate max-w-[100px]">{item.name || item.category || 'Item'}</span>
                    <Select
                      value={category}
                      onValueChange={(value) => {
                        const newData = JSON.parse(JSON.stringify(chartElement.chartData))
                        if (newData.data && newData.data[index]) {
                          newData.data[index].type = value
                        }
                        updateElement(chartElement.id, { chartData: newData })
                      }}
                    >
                      <SelectTrigger className="w-24 h-6 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                        <SelectItem value="start">Start</SelectItem>
                        <SelectItem value="end">End</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        {/* Chart Data Editor */}
        <div>
          <p className="text-xs font-medium mb-2">Data Points</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {chartElement.chartData?.data?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item.category || item.name || ''}
                  onChange={(e) => {
                    const newData = JSON.parse(JSON.stringify(chartElement.chartData))
                    if (newData.data && newData.data[index]) {
                      if (chartElement.chartType === 'waterfall') {
                        newData.data[index].name = e.target.value
                      } else {
                        newData.data[index].category = e.target.value
                      }
                    }
                    updateElement(chartElement.id, { chartData: newData })
                  }}
                  className="flex-1 h-7 px-2 text-xs border rounded"
                  placeholder="Label"
                />
                <input
                  type="number"
                  value={item.value || 0}
                  onChange={(e) => {
                    const newData = JSON.parse(JSON.stringify(chartElement.chartData))
                    if (newData.data && newData.data[index]) {
                      newData.data[index].value = parseFloat(e.target.value) || 0
                    }
                    updateElement(chartElement.id, { chartData: newData })
                  }}
                  className="w-20 h-7 px-2 text-xs border rounded"
                  placeholder="Value"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    const newData = JSON.parse(JSON.stringify(chartElement.chartData))
                    if (newData.data) {
                      newData.data.splice(index, 1)
                    }
                    updateElement(chartElement.id, { chartData: newData })
                  }}
                  className="h-6 w-6"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )) || []}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
                const newData = JSON.parse(JSON.stringify(chartElement.chartData))
              if (!newData.data) {
                newData.data = []
              }
              const newItem = {
                value: 50
              } as any
              
              if (chartElement.chartType === 'waterfall') {
                newItem.name = `Item ${newData.data.length + 1}`
                newItem.type = 'positive'
              } else {
                newItem.category = `Item ${newData.data.length + 1}`
              }
              
              newData.data.push(newItem)
              updateElement(chartElement.id, { chartData: newData })
            }}
            className="w-full mt-2 h-7 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Data Point
          </Button>
        </div>
        
        {/* Smart Labels Configuration */}
        <div className="space-y-3 border-t pt-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium">Smart Labels</p>
            <Button
              size="sm"
              variant={chartElement.smartLabels?.enabled ? "secondary" : "ghost"}
              onClick={() => {
                const currentLabels = chartElement.smartLabels || {
                  enabled: true,
                  format: 'number',
                  decimals: 0,
                  template: '{value}',
                  showValue: true,
                  showPercentage: false,
                  position: 'auto',
                  fontSize: 11
                }
                updateElement(chartElement.id, { 
                  smartLabels: { ...currentLabels, enabled: !currentLabels.enabled }
                })
              }}
              className="h-6 px-2 text-xs"
            >
              {chartElement.smartLabels?.enabled ? 'On' : 'Off'}
            </Button>
          </div>
          
          {chartElement.smartLabels?.enabled && (
            <>
              {/* Label Format */}
              <div className="space-y-1">
                <p className="text-xs text-gray-600">Format</p>
                <Select
                  value={chartElement.smartLabels?.format || 'number'}
                  onValueChange={(value) => {
                    updateElement(chartElement.id, {
                      smartLabels: { ...chartElement.smartLabels!, format: value as any }
                    })
                  }}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="currency">Currency ($)</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Decimals */}
              <div className="space-y-1">
                <p className="text-xs text-gray-600">Decimal Places</p>
                <input
                  type="number"
                  min="0"
                  max="4"
                  value={chartElement.smartLabels?.decimals || 0}
                  onChange={(e) => {
                    updateElement(chartElement.id, {
                      smartLabels: { ...chartElement.smartLabels!, decimals: parseInt(e.target.value) || 0 }
                    })
                  }}
                  className="w-full h-7 px-2 text-xs border rounded"
                />
              </div>
              
              {/* Template */}
              <div className="space-y-1">
                <p className="text-xs text-gray-600">Template</p>
                <Select
                  value={chartElement.smartLabels?.template || '{value}'}
                  onValueChange={(value) => {
                    updateElement(chartElement.id, {
                      smartLabels: { ...chartElement.smartLabels!, template: value }
                    })
                  }}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="{value}">Value Only</SelectItem>
                    <SelectItem value="{value} ({percentage}%)">Value (Percentage)</SelectItem>
                    <SelectItem value="{percentage}%">Percentage Only</SelectItem>
                    <SelectItem value="${value}">With Dollar Sign</SelectItem>
                    <SelectItem value="{value}k">Thousands (k)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Show Options */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={chartElement.smartLabels?.showPercentage || false}
                    onChange={(e) => {
                      updateElement(chartElement.id, {
                        smartLabels: { ...chartElement.smartLabels!, showPercentage: e.target.checked }
                      })
                    }}
                    className="h-3 w-3"
                  />
                  <span className="text-xs">Show Percentage</span>
                </label>
                {chartElement.chartType === 'waterfall' && (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={chartElement.smartLabels?.showDelta || false}
                      onChange={(e) => {
                        updateElement(chartElement.id, {
                          smartLabels: { ...chartElement.smartLabels!, showDelta: e.target.checked }
                        })
                      }}
                      className="h-3 w-3"
                    />
                    <span className="text-xs">Show +/- Signs</span>
                  </label>
                )}
              </div>

              {/* Position Control */}
              <div>
                <p className="text-xs font-medium mb-2">Label Position</p>
                <Select
                  value={chartElement.smartLabels?.position || 'auto'}
                  onValueChange={(value) => {
                    updateElement(chartElement.id, {
                      smartLabels: {
                        ...chartElement.smartLabels,
                        position: value as 'auto' | 'inside' | 'outside' | 'center' | 'end'
                      }
                    })
                  }}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="inside">Inside</SelectItem>
                    <SelectItem value="outside">Outside</SelectItem>
                    <SelectItem value="end">End</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size Control */}
              <div>
                <p className="text-xs font-medium mb-2">Font Size</p>
                <input
                  type="range"
                  min="8"
                  max="24"
                  value={chartElement.smartLabels?.fontSize || 12}
                  onChange={(e) => {
                    updateElement(chartElement.id, {
                      smartLabels: {
                        ...chartElement.smartLabels,
                        fontSize: parseInt(e.target.value)
                      }
                    })
                  }}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{chartElement.smartLabels?.fontSize || 12}px</span>
              </div>

              {/* Font Weight Control */}
              <div>
                <p className="text-xs font-medium mb-2">Font Weight</p>
                <Select
                  value={chartElement.smartLabels?.fontWeight || 'normal'}
                  onValueChange={(value) => {
                    updateElement(chartElement.id, {
                      smartLabels: {
                        ...chartElement.smartLabels,
                        fontWeight: value
                      }
                    })
                  }}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="600">Semi Bold</SelectItem>
                    <SelectItem value="300">Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prefix/Suffix Controls */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs font-medium mb-1">Prefix</p>
                  <input
                    type="text"
                    value={chartElement.smartLabels?.prefix || ''}
                    onChange={(e) => {
                      updateElement(chartElement.id, {
                        smartLabels: {
                          ...chartElement.smartLabels,
                          prefix: e.target.value
                        }
                      })
                    }}
                    placeholder="e.g., $"
                    className="w-full px-2 py-1 text-xs border rounded"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium mb-1">Suffix</p>
                  <input
                    type="text"
                    value={chartElement.smartLabels?.suffix || ''}
                    onChange={(e) => {
                      updateElement(chartElement.id, {
                        smartLabels: {
                          ...chartElement.smartLabels,
                          suffix: e.target.value
                        }
                      })
                    }}
                    placeholder="e.g., %"
                    className="w-full px-2 py-1 text-xs border rounded"
                  />
                </div>
              </div>

              {/* Connector Lines Toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chartElement.smartLabels?.connectorLines || false}
                  onChange={(e) => {
                    updateElement(chartElement.id, {
                      smartLabels: {
                        ...chartElement.smartLabels,
                        connectorLines: e.target.checked
                      }
                    })
                  }}
                  className="h-3 w-3"
                />
                <span className="text-xs">Show Connector Lines</span>
              </label>
            </>
          )}
        </div>
        
        {/* Legend Toggle */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium">Show Legend</p>
          <Button
            size="sm"
            variant={chartElement.chartOptions?.plugins?.legend?.display ? "secondary" : "ghost"}
            onClick={() => {
              const newOptions = { ...chartElement.chartOptions }
              if (!newOptions.plugins) newOptions.plugins = {}
              if (!newOptions.plugins.legend) newOptions.plugins.legend = {}
              newOptions.plugins.legend.display = !newOptions.plugins.legend.display
              updateElement(chartElement.id, { chartOptions: newOptions })
            }}
            className="h-7 px-3 text-xs"
          >
            {chartElement.chartOptions?.plugins?.legend?.display ? 'On' : 'Off'}
          </Button>
        </div>

        {/* Stacked Chart Settings - Only for Bar charts */}
        {(chartElement.chartType === 'bar' || chartElement.chartType === 'bar-grouped' || chartElement.chartType === 'bar-stacked') && (
          <div className="space-y-3 pt-3 border-t">
            <p className="text-xs font-semibold text-gray-700">Stacking Options</p>
            
            {/* Enable Stacking */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">Enable Stacking</p>
              <Button
                size="sm"
                variant={chartElement.chartSettings?.stacked ? "secondary" : "ghost"}
                onClick={() => {
                  updateElement(chartElement.id, {
                    chartSettings: {
                      ...chartElement.chartSettings,
                      stacked: !chartElement.chartSettings?.stacked
                    }
                  })
                }}
                className="h-7 px-3 text-xs"
              >
                {chartElement.chartSettings?.stacked ? 'On' : 'Off'}
              </Button>
            </div>

            {/* Stack Type - Only show if stacking is enabled */}
            {chartElement.chartSettings?.stacked && (
              <>
                <div>
                  <p className="text-xs font-medium mb-2">Stack Type</p>
                  <Select
                    value={chartElement.chartSettings?.stackedType || 'normal'}
                    onValueChange={(value) => {
                      updateElement(chartElement.id, {
                        chartSettings: {
                          ...chartElement.chartSettings,
                          stackedType: value as 'normal' | '100%'
                        }
                      })
                    }}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="100%">100% Stacked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Show Totals */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chartElement.chartSettings?.showTotals || false}
                    onChange={(e) => {
                      updateElement(chartElement.id, {
                        chartSettings: {
                          ...chartElement.chartSettings,
                          showTotals: e.target.checked
                        }
                      })
                    }}
                    className="h-3 w-3"
                  />
                  <span className="text-xs">Show Totals on Top</span>
                </label>
              </>
            )}

            {/* CAGR (Compound Annual Growth Rate) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={chartElement.chartSettings?.showCAGR || false}
                  onChange={(e) => {
                    updateElement(chartElement.id, {
                      chartSettings: {
                        ...chartElement.chartSettings,
                        showCAGR: e.target.checked
                      }
                    })
                  }}
                  className="h-3 w-3"
                />
                <span className="text-xs">Show CAGR Line</span>
              </label>

              {/* CAGR Period Selection - Only show if CAGR is enabled */}
              {chartElement.chartSettings?.showCAGR && chartElement.chartData && (
                <div className="grid grid-cols-2 gap-2 ml-5">
                  <div>
                    <p className="text-xs font-medium mb-1">Start Period</p>
                    <Select
                      value={chartElement.chartSettings?.cagrStartIndex?.toString() || '0'}
                      onValueChange={(value) => {
                        updateElement(chartElement.id, {
                          chartSettings: {
                            ...chartElement.chartSettings,
                            cagrStartIndex: parseInt(value)
                          }
                        })
                      }}
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {chartElement.chartData.labels?.map((label, idx) => (
                          <SelectItem key={idx} value={idx.toString()}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1">End Period</p>
                    <Select
                      value={chartElement.chartSettings?.cagrEndIndex?.toString() || 
                             ((chartElement.chartData.labels?.length || 1) - 1).toString()}
                      onValueChange={(value) => {
                        updateElement(chartElement.id, {
                          chartSettings: {
                            ...chartElement.chartSettings,
                            cagrEndIndex: parseInt(value)
                          }
                        })
                      }}
                    >
                      <SelectTrigger className="h-7">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {chartElement.chartData.labels?.map((label, idx) => (
                          <SelectItem key={idx} value={idx.toString()}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )
  }

  // Helper function to sanitize cell content
  const sanitizeCellContent = (content: any): string => {
    if (content === null || content === undefined) return ''
    if (typeof content === 'string') return content
    if (typeof content === 'number') return content.toString()
    if (typeof content === 'boolean') return content ? 'true' : 'false'
    return String(content)
  }

  // Helper function to process waterfall chart data
  const processWaterfallData = (data: number[], categories?: ('increase' | 'decrease' | 'total' | 'subtotal')[]) => {
    const cumulative: number[] = []
    const invisible: number[] = []
    const visible: number[] = []
    
    let runningTotal = 0
    
    data.forEach((value, index) => {
      const category = categories?.[index] || (value >= 0 ? 'increase' : 'decrease')
      
      if (category === 'total' || category === 'subtotal') {
        // For totals, show the bar from 0 to the running total
        invisible[index] = 0
        visible[index] = runningTotal
        cumulative[index] = runningTotal
      } else {
        // For increases/decreases, show the bar from the previous total
        invisible[index] = runningTotal
        visible[index] = value
        runningTotal += value
        cumulative[index] = runningTotal
      }
    })
    
    return { invisible, visible, cumulative }
  }

  // Smart label formatting function
  const formatChartLabel = (value: number, options?: {
    format?: 'number' | 'currency' | 'percentage'
    decimals?: number
    prefix?: string
    suffix?: string
    template?: string
    showPercentage?: boolean
    total?: number
  }) => {
    const {
      format = 'number',
      decimals = 0,
      prefix = '',
      suffix = '',
      template = '{value}',
      showPercentage = false,
      total = 0
    } = options || {}
    
    let formattedValue = ''
    
    switch (format) {
      case 'currency':
        formattedValue = `$${value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
        break
      case 'percentage':
        formattedValue = `${(value * 100).toFixed(decimals)}%`
        break
      default:
        formattedValue = value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    }
    
    let result = template.replace('{value}', prefix + formattedValue + suffix)
    
    if (showPercentage && total > 0) {
      const percentage = ((value / total) * 100).toFixed(1)
      result = result.replace('{percentage}', percentage)
    }
    
    return result
  }

  // Calculate label positions to avoid overlaps
  const calculateLabelPositions = (labels: { x: number, y: number, width: number, height: number }[]) => {
    const positioned = [...labels]
    const padding = 5
    
    // Sort by y position
    positioned.sort((a, b) => a.y - b.y)
    
    // Adjust positions to avoid overlaps
    for (let i = 1; i < positioned.length; i++) {
      const prev = positioned[i - 1]
      const curr = positioned[i]
      
      // Check for vertical overlap
      if (curr.y < prev.y + prev.height + padding) {
        // Move current label down
        curr.y = prev.y + prev.height + padding
      }
    }
    
    return positioned
  }

  // Calculate CAGR (Compound Annual Growth Rate)
  // Helper function to calculate cells in selection range
  const calculateSelectedCells = (elementId: string, start: { row: number; col: number }, end: { row: number; col: number }) => {
    const minRow = Math.min(start.row, end.row)
    const maxRow = Math.max(start.row, end.row)
    const minCol = Math.min(start.col, end.col)
    const maxCol = Math.max(start.col, end.col)
    
    const cells = new Set<string>()
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        cells.add(`${elementId}-${row}-${col}`)
      }
    }
    return cells
  }

  // Helper function to update styles for selected table cells
  const updateSelectedCellStyles = (styleUpdates: Partial<typeof elements[0]['style']>) => {
    if (selectedCells.size === 0) return
    
    // Find the table element that contains the selected cells
    const cellId = Array.from(selectedCells)[0]
    const [elementId] = cellId.split('-')
    const element = elements.find(el => el.id === elementId)
    
    if (!element || element.type !== 'table' || !element.cells) return
    
    // Initialize cellStyles if it doesn't exist
    const cellStyles = element.cellStyles || Array(element.rows).fill(null).map(() => 
      Array(element.columns).fill({})
    )
    
    // Update styles for each selected cell
    selectedCells.forEach(cellId => {
      const [, rowStr, colStr] = cellId.split('-')
      const row = parseInt(rowStr)
      const col = parseInt(colStr)
      
      if (!isNaN(row) && !isNaN(col)) {
        cellStyles[row][col] = {
          ...cellStyles[row][col],
          ...styleUpdates
        }
      }
    })
    
    updateElement(element.id, { cellStyles })
  }

  // Helper function to format table cells with bullets or numbers
  const formatTableCells = (action: 'bullet' | 'numberedList') => {
    if (selectedCells.size === 0) return
    
    // Find the table element
    const cellId = Array.from(selectedCells)[0]
    const [elementId] = cellId.split('-')
    const element = elements.find(el => el.id === elementId)
    
    if (!element || element.type !== 'table' || !element.cells) return
    
    const newCells = [...element.cells]
    
    // Process each selected cell
    selectedCells.forEach(cellId => {
      const [, rowStr, colStr] = cellId.split('-')
      const row = parseInt(rowStr)
      const col = parseInt(colStr)
      
      if (!isNaN(row) && !isNaN(col)) {
        const content = newCells[row][col]
        const lines = content.split('\n')
        
        if (action === 'bullet') {
          // Toggle bullets
          const hasBullets = lines.every(line => line.trim() === '' || line.trim().startsWith('•'))
          
          if (hasBullets) {
            // Remove bullets
            newCells[row][col] = lines.map(line => 
              line.replace(/^(\s*)• /, '$1')
            ).join('\n')
          } else {
            // Add bullets
            newCells[row][col] = lines.map(line => {
              if (line.trim() === '') return line
              if (line.trim().startsWith('•')) return line
              // Remove numbers if present
              const cleanLine = line.replace(/^(\s*)\d+\. /, '$1')
              return cleanLine.replace(/^(\s*)/, '$1• ')
            }).join('\n')
          }
        } else if (action === 'numberedList') {
          // Toggle numbered list
          const hasNumbers = lines.every(line => line.trim() === '' || line.trim().match(/^\d+\./))
          
          if (hasNumbers) {
            // Remove numbers
            newCells[row][col] = lines.map(line => 
              line.replace(/^(\s*)\d+\. /, '$1')
            ).join('\n')
          } else {
            // Add numbers
            let lineNumber = 1
            newCells[row][col] = lines.map(line => {
              if (line.trim() === '') return line
              if (line.trim().match(/^\d+\./)) {
                lineNumber++
                return line
              }
              // Remove bullets if present
              const cleanLine = line.replace(/^(\s*)• /, '$1')
              const numberedLine = cleanLine.replace(/^(\s*)/, `$1${lineNumber}. `)
              lineNumber++
              return numberedLine
            }).join('\n')
          }
        }
      }
    })
    
    updateElement(element.id, { cells: newCells })
  }

  // Update canvas size based on viewport
  useEffect(() => {
    const updateCanvasSize = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      // Calculate available space (accounting for header, toolbar, etc.)
      const availableWidth = viewportWidth - 100 // padding
      const availableHeight = viewportHeight - 350 // header + carousel + padding
      
      // Maintain 16:9 aspect ratio
      let width = Math.min(800, availableWidth * 0.9)
      let height = width * 9 / 16
      
      // If height is too large, calculate from height instead
      if (height > availableHeight * 0.9) {
        height = availableHeight * 0.9
        width = height * 16 / 9
      }
      
      // Set minimum sizes
      width = Math.max(400, width)
      height = Math.max(225, height)
      
      setCanvasSize({ width: Math.round(width), height: Math.round(height) })
    }
    
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])
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

  const deleteElement = (elementId?: string) => {
    // Add to undo stack before deleting
    addToUndoStack()
    
    if (elementId) {
      // Delete specific element (used by AI assistant)
      setElements((prev) => prev.filter((el) => el.id !== elementId))
      if (selectedElement === elementId) {
        onElementSelect(null)
      }
      if (multiSelectedElements.has(elementId)) {
        const newSet = new Set(multiSelectedElements)
        newSet.delete(elementId)
        setMultiSelectedElements(newSet)
      }
    } else if (multiSelectedElements.size > 0) {
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
        if (!isEditing) {
          e.preventDefault()
        }
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
        if (!isEditing) {
          e.preventDefault()
        }
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
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        if (isEditing) {
          // Allow select all in text editing mode
          // Don't prevent default - let the browser handle it
        } else {
          // Select all elements when not editing
          e.preventDefault()
          const allElementIds = new Set(elements.map(el => el.id))
          setMultiSelectedElements(allElementIds)
          if (elements.length > 0) {
            onElementSelect(elements[0].id)
          }
        }
      } else if (!isEditing && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Arrow key nudging
        e.preventDefault()
        const nudgeAmount = e.shiftKey ? 10 : 1
        let deltaX = 0
        let deltaY = 0
        
        switch (e.key) {
          case 'ArrowUp':
            deltaY = -nudgeAmount
            break
          case 'ArrowDown':
            deltaY = nudgeAmount
            break
          case 'ArrowLeft':
            deltaX = -nudgeAmount
            break
          case 'ArrowRight':
            deltaX = nudgeAmount
            break
        }
        
        // Move selected elements
        if (selectedElement || multiSelectedElements.size > 0) {
          addToUndoStack()
          const elementsToMove = multiSelectedElements.size > 0 
            ? Array.from(multiSelectedElements)
            : selectedElement ? [selectedElement] : []
          
          setElements(prev => prev.map(el => 
            elementsToMove.includes(el.id)
              ? {
                  ...el,
                  position: {
                    x: Math.max(0, Math.min(canvasSize.width - el.size.width, el.position.x + deltaX)),
                    y: Math.max(0, Math.min(canvasSize.height - el.size.height, el.position.y + deltaY))
                  }
                }
              : el
          ))
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleUndo, handleRedo, selectedElement, elements, copiedElement, isEditingText, deleteElement, multiSelectedElements, onElementSelect, addToUndoStack, canvasSize])

  const formatText = (action: string) => {
    addToUndoStack()
    
    // Get all text elements to format (either multi-selected or single selected)
    let elementsToFormat: string[] = []
    
    if (multiSelectedElements.size > 0) {
      // Filter only text elements from multi-selection
      elementsToFormat = Array.from(multiSelectedElements).filter(id => {
        const el = elements.find(e => e.id === id)
        return el && el.type !== 'shape'
      })
    } else if (selectedElement) {
      const el = elements.find(e => e.id === selectedElement)
      if (el && el.type !== 'shape') {
        elementsToFormat = [selectedElement]
      }
    }
    
    if (elementsToFormat.length === 0) return
    
    // Format each text element
    elementsToFormat.forEach(elementId => {
      const element = elements.find(el => el.id === elementId)
      if (!element || element.type === 'shape') return
      
      let content = element.content
      let textarea = isEditingText === elementId ? textAreaRef.current : null
      let start = 0
      let end = content.length
      
      // If we have a textarea reference for this element, use its selection
      if (textarea) {
        start = textarea.selectionStart
        end = textarea.selectionEnd
      }
      
      const selectedText = content.substring(start, end)
      const beforeText = content.substring(0, start)
      const afterText = content.substring(end)
      
      let newText = content
      let newStart = start
      let newEnd = end
      
      // Helper function to check if all lines have bullets/numbers
      const checkAllLinesHaveFormat = (text: string, format: 'bullet' | 'number'): boolean => {
        const lines = text.split('\n').filter(line => line.trim() !== '')
        if (lines.length === 0) return false
        
        if (format === 'bullet') {
          return lines.every(line => line.trim().startsWith('•'))
        } else {
          return lines.every(line => line.trim().match(/^\d+\./))
        }
      }
      
      // Helper function to remove bullets/numbers
      const removeFormat = (text: string, format: 'bullet' | 'number'): string => {
        const lines = text.split('\n')
        return lines.map(line => {
          if (format === 'bullet') {
            return line.replace(/^(\s*)• /, '$1')
          } else {
            return line.replace(/^(\s*)\d+\. /, '$1')
          }
        }).join('\n')
      }
      
      switch (action) {
        case "bullet":
          // Check the relevant text
          const bulletCheckText = (start === end) ? content : selectedText
          const hasBullets = checkAllLinesHaveFormat(bulletCheckText, 'bullet')
          
          if (hasBullets) {
            // Remove bullets
            if (start === end) {
              newText = removeFormat(content, 'bullet')
            } else {
              newText = beforeText + removeFormat(selectedText, 'bullet') + afterText
            }
          } else {
            // Add bullets
            if (!textarea || (start === end)) {
              const lines = content.split('\n')
              const formattedLines = lines.map(line => {
                if (line.trim() === '') return line
                if (line.trim().startsWith('•')) return line
                // Remove numbers if present before adding bullets
                const cleanLine = line.replace(/^(\s*)\d+\. /, '$1')
                return cleanLine.replace(/^(\s*)/, '$1• ')
              })
              newText = formattedLines.join('\n')
            } else {
              const lines = selectedText.split('\n')
              const formattedLines = lines.map(line => {
                if (line.trim() === '') return line
                if (line.trim().startsWith('•')) return line
                // Remove numbers if present before adding bullets
                const cleanLine = line.replace(/^(\s*)\d+\. /, '$1')
                return cleanLine.replace(/^(\s*)/, '$1• ')
              })
              newText = beforeText + formattedLines.join('\n') + afterText
            }
          }
          break
          
        case "numberedList":
          // Check the relevant text
          const numberCheckText = (start === end) ? content : selectedText
          const hasNumbers = checkAllLinesHaveFormat(numberCheckText, 'number')
          
          if (hasNumbers) {
            // Remove numbers
            if (start === end) {
              newText = removeFormat(content, 'number')
            } else {
              newText = beforeText + removeFormat(selectedText, 'number') + afterText
            }
          } else {
            // Add numbers
            if (!textarea || (start === end)) {
              const lines = content.split('\n')
              let lineNumber = 1
              const formattedLines = lines.map((line) => {
                if (line.trim() === '') return line
                if (line.trim().match(/^\d+\./)) {
                  lineNumber++
                  return line
                }
                // Remove bullets if present before adding numbers
                const cleanLine = line.replace(/^(\s*)• /, '$1')
                const numberedLine = cleanLine.replace(/^(\s*)/, `$1${lineNumber}. `)
                lineNumber++
                return numberedLine
              })
              newText = formattedLines.join('\n')
            } else {
              const lines = selectedText.split('\n')
              let lineNumber = 1
              const formattedLines = lines.map((line) => {
                if (line.trim() === '') return line
                if (line.trim().match(/^\d+\./)) {
                  lineNumber++
                  return line
                }
                // Remove bullets if present before adding numbers
                const cleanLine = line.replace(/^(\s*)• /, '$1')
                const numberedLine = cleanLine.replace(/^(\s*)/, `$1${lineNumber}. `)
                lineNumber++
                return numberedLine
              })
              newText = beforeText + formattedLines.join('\n') + afterText
            }
          }
          break
      }
      
      updateElement(elementId, { content: newText })
      
      // Restore selection after state update for the editing element
      if (textarea && isEditingText === elementId) {
        setTimeout(() => {
          textarea.setSelectionRange(newStart, newEnd)
          textarea.focus()
        }, 0)
      }
    })
  }

  const updateElement = (elementId: string | null, updates: Partial<SlideElement>) => {
    if (!elementId) return
    
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

  // Handle AI Assistant actions
  const handleAIAction = (action: any) => {
    addToUndoStack()
    
    switch (action.type) {
      case 'addElement':
        const { elementType, position, size, properties } = action.payload
        let newElement: SlideElement
        
        switch (elementType) {
          case 'text':
            newElement = {
              id: `text-${Date.now()}`,
              type: 'text',
              content: properties.content || 'New text',
              position: position || { x: canvasSize.width * 0.1, y: canvasSize.height * 0.5 },
              size: size || { width: 300, height: 100 },
              style: {
                fontSize: properties.fontSize || 16,
                fontWeight: properties.fontWeight || '400',
                fontStyle: 'normal',
                textDecoration: 'none',
                color: properties.color || '#000000',
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 0,
                textAlign: properties.textAlign || 'left',
                lineHeight: 1.5,
                letterSpacing: 0,
                opacity: 1,
                fontFamily: 'Inter',
              },
              zIndex: elements.length > 0 ? Math.max(...elements.map((el) => el.zIndex)) + 1 : 1
            }
            break
            
          case 'shape':
            newElement = {
              id: `shape-${Date.now()}`,
              type: 'shape',
              content: '',
              position: position || { x: canvasSize.width * 0.1, y: canvasSize.height * 0.5 },
              size: size || { width: 200, height: 200 },
              shapeType: properties.shapeType || 'rectangle',
              style: {
                fontSize: 16,
                fontWeight: '400',
                fontStyle: 'normal',
                textDecoration: 'none',
                color: '#000000',
                backgroundColor: properties.backgroundColor || '#3b82f6',
                borderColor: properties.borderColor || '#1e40af',
                borderWidth: properties.borderWidth || 2,
                borderRadius: properties.shapeType === 'circle' ? 50 : 0,
                textAlign: 'center',
                lineHeight: 1.5,
                letterSpacing: 0,
                opacity: 1,
                fontFamily: 'Inter',
              },
              zIndex: elements.length > 0 ? Math.max(...elements.map((el) => el.zIndex)) + 1 : 1
            }
            break
            
          case 'chart':
            newElement = {
              id: `chart-${Date.now()}`,
              type: 'chart',
              content: '',
              position: position || { x: canvasSize.width * 0.1, y: canvasSize.height * 0.3 },
              size: size || { width: 400, height: 300 },
              chartType: properties.chartType || 'bar',
              chartData: properties.chartData || {
                data: [
                  { category: 'Jan', value: 12 },
                  { category: 'Feb', value: 19 },
                  { category: 'Mar', value: 3 },
                  { category: 'Apr', value: 5 },
                  { category: 'May', value: 2 }
                ]
              },
              chartOptions: properties.chartOptions,
              smartLabels: properties.smartLabels,
              chartSettings: properties.chartSettings,
              style: {
                fontSize: 16,
                fontWeight: '400',
                fontStyle: 'normal',
                textDecoration: 'none',
                color: '#000000',
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                borderRadius: 8,
                textAlign: 'left',
                lineHeight: 1.5,
                letterSpacing: 0,
                opacity: 1,
                fontFamily: 'Inter',
              },
              zIndex: elements.length > 0 ? Math.max(...elements.map((el) => el.zIndex)) + 1 : 1
            }
            break
            
          case 'table':
            const rows = properties.rows || 3
            const columns = properties.columns || 3
            const cells: string[][] = Array(rows).fill(null).map(() => Array(columns).fill(""))
            const columnWidths = Array(columns).fill(100 / columns)
            const rowHeights = Array(rows).fill(100 / rows)
            
            newElement = {
              id: `table-${Date.now()}`,
              type: 'table',
              content: '',
              position: position || { x: canvasSize.width * 0.1, y: canvasSize.height * 0.3 },
              size: size || { width: 400, height: 200 },
              rows,
              columns,
              cells,
              columnWidths,
              rowHeights,
              headerRow: true,
              borderStyle: {
                color: '#e5e7eb',
                width: 1,
                style: 'solid' as const
              },
              cellStyles: Array(rows).fill(null).map(() => Array(columns).fill({})),
              style: {
                fontSize: 14,
                fontWeight: '400',
                fontStyle: 'normal',
                textDecoration: 'none',
                color: '#000000',
                backgroundColor: '#ffffff',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                borderRadius: 0,
                textAlign: 'center',
                lineHeight: 1.5,
                letterSpacing: 0,
                opacity: 1,
                fontFamily: 'Inter',
              },
              zIndex: elements.length > 0 ? Math.max(...elements.map((el) => el.zIndex)) + 1 : 1
            }
            break
            
          default:
            return
        }
        
        setElements(prev => [...prev, newElement])
        onElementSelect(newElement.id)
        break
        
      case 'updateElement':
        const { elementId, updates } = action.payload
        updateElement(elementId, updates)
        break
        
      case 'deleteElement':
        const { elementId: deleteId } = action.payload
        deleteElement(deleteId)
        break
        
      case 'alignElements':
        const { direction } = action.payload
        alignElements(direction)
        break
        
      case 'distributeElements':
        const { axis } = action.payload
        distributeElements(axis)
        break
    }
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

  // Helper function to generate default chart data
  const getDefaultChartData = (chartType: SlideElement['chartType']): SlideElement['chartData'] => {
    switch (chartType) {
      case 'bar':
        return {
          data: [
            { category: 'Product A', value: 120 },
            { category: 'Product B', value: 95 },
            { category: 'Product C', value: 140 },
            { category: 'Product D', value: 110 },
            { category: 'Product E', value: 85 }
          ]
        }
      case 'bar-grouped':
        return {
          data: [
            { category: '2022', value: 120, series: 'Revenue' },
            { category: '2022', value: 85, series: 'Profit' },
            { category: '2023', value: 150, series: 'Revenue' },
            { category: '2023', value: 95, series: 'Profit' },
            { category: '2024', value: 180, series: 'Revenue' },
            { category: '2024', value: 115, series: 'Profit' }
          ]
        }
      case 'bar-stacked':
        return {
          data: [
            { category: 'Q1', value: 40, series: 'Online' },
            { category: 'Q1', value: 60, series: 'Retail' },
            { category: 'Q1', value: 20, series: 'Partner' },
            { category: 'Q2', value: 50, series: 'Online' },
            { category: 'Q2', value: 55, series: 'Retail' },
            { category: 'Q2', value: 30, series: 'Partner' },
            { category: 'Q3', value: 65, series: 'Online' },
            { category: 'Q3', value: 50, series: 'Retail' },
            { category: 'Q3', value: 35, series: 'Partner' }
          ]
        }
      case 'waterfall':
        return {
          data: [
            { name: 'Q1 Revenue', value: 150, type: 'start' },
            { name: 'Product Sales', value: 45, type: 'positive' },
            { name: 'Services', value: 30, type: 'positive' },
            { name: 'Returns', value: -20, type: 'negative' },
            { name: 'Costs', value: -35, type: 'negative' },
            { name: 'Q2 Revenue', value: 170, type: 'end' }
          ]
        }
      case 'line':
        return {
          data: [
            { category: 'Jan', value: 12 },
            { category: 'Feb', value: 19 },
            { category: 'Mar', value: 15 },
            { category: 'Apr', value: 25 },
            { category: 'May', value: 22 },
            { category: 'Jun', value: 30 }
          ]
        }
      case 'pie':
        return {
          data: [
            { category: 'Product A', value: 35 },
            { category: 'Product B', value: 25 },
            { category: 'Product C', value: 20 },
            { category: 'Product D', value: 15 },
            { category: 'Product E', value: 5 }
          ]
        }
      default:
        return {
          data: [
            { category: 'Item 1', value: 100 },
            { category: 'Item 2', value: 80 },
            { category: 'Item 3', value: 60 },
            { category: 'Item 4', value: 40 }
          ]
        }
    }
  }

  const addChart = (chartType: SlideElement['chartType'] = 'bar') => {
    const defaultData = getDefaultChartData(chartType)

    const newElement: SlideElement = {
      id: `chart-${Date.now()}`,
      type: "chart",
      content: "",
      position: { x: 200, y: 150 },
      size: { width: 400, height: 300 },
      style: {
        fontSize: 14,
        fontWeight: "400",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#374151",
        backgroundColor: "white",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        textAlign: "center",
        fontFamily: "Inter",
        opacity: 1,
        borderRadius: 8,
      },
      zIndex: elements.length > 0 ? Math.max(...elements.map((el) => el.zIndex)) + 1 : 1,
      chartType,
      chartData: defaultData
    }
    
    setElements(prev => [...prev, newElement])
    addToUndoStack()
    onElementSelect(newElement.id)
  }

  const addTable = (rows: number = 3, columns: number = 3) => {
    // Validate input
    const validRows = Math.max(1, Math.min(20, rows))
    const validColumns = Math.max(1, Math.min(10, columns))
    
    // Initialize cells with empty strings
    const cells: string[][] = Array(validRows).fill(null).map(() => Array(validColumns).fill(""))
    
    // Initialize column widths equally
    const columnWidth = 100 / validColumns
    const columnWidths = Array(validColumns).fill(columnWidth)
    
    // Initialize row heights equally  
    const rowHeight = 100 / validRows
    const rowHeights = Array(validRows).fill(rowHeight)
    
    const newElement: SlideElement = {
      id: `table-${Date.now()}`,
      type: "table",
      content: "",
      position: { x: 150, y: 150 },
      size: { width: 400, height: 200 },
      style: {
        fontSize: 14,
        fontWeight: "400",
        fontStyle: "normal",
        textDecoration: "none",
        color: "#374151",
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        textAlign: "left",
        fontFamily: "Inter",
        opacity: 1,
        borderRadius: 0,
      },
      rows: validRows,
      columns: validColumns,
      cells,
      columnWidths,
      rowHeights,
      headerRow: true,
      borderStyle: {
        color: "#e5e7eb",
        width: 1,
        style: "solid" as const
      },
      cellStyles: Array(validRows).fill(null).map(() => Array(validColumns).fill({})),
      zIndex: elements.length > 0 ? Math.max(...elements.map((el) => el.zIndex)) + 1 : 1,
    }
    setElements((prev) => [...prev, newElement])
    onElementSelect(newElement.id)
  }

  const duplicateElement = () => {
    addToUndoStack()
    
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
              x: Math.min(element.position.x + 20, canvasSize.width - element.size.width),
              y: Math.min(element.position.y + 20, canvasSize.height - element.size.height),
            },
            style: { ...element.style },
            rotation: element.rotation,
            lineOrientation: element.lineOrientation,
            zIndex: ++maxZIndex,
          }
          
          // Deep copy chart data if it's a chart
          if (element.type === 'chart' && element.chartData) {
            newElement.chartData = JSON.parse(JSON.stringify(element.chartData))
            newElement.chartOptions = JSON.parse(JSON.stringify(element.chartOptions || {}))
            newElement.chartType = element.chartType
          }
          
          // Deep copy table data if it's a table
          if (element.type === 'table' && element.cells) {
            newElement.cells = element.cells.map(row => [...row])
            newElement.columnWidths = [...(element.columnWidths || [])]
            newElement.rowHeights = [...(element.rowHeights || [])]
            newElement.cellStyles = element.cellStyles?.map(row => row.map(cell => ({...cell}))) || []
            newElement.borderStyle = { ...element.borderStyle }
            newElement.rows = element.rows
            newElement.columns = element.columns
            newElement.headerRow = element.headerRow
          }
          
          // Deep copy shape properties
          if (element.type === 'shape') {
            newElement.shapeType = element.shapeType
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
          x: Math.min(selectedElementData.position.x + 20, canvasSize.width - selectedElementData.size.width),
          y: Math.min(selectedElementData.position.y + 20, canvasSize.height - selectedElementData.size.height),
        },
        style: { ...selectedElementData.style },
        rotation: selectedElementData.rotation,
        lineOrientation: selectedElementData.lineOrientation,
        zIndex: elements.length > 0 ? Math.max(...elements.map((el) => el.zIndex)) + 1 : 1,
      }
      
      // Deep copy chart data if it's a chart
      if (selectedElementData.type === 'chart' && selectedElementData.chartData) {
        newElement.chartData = JSON.parse(JSON.stringify(selectedElementData.chartData))
        newElement.chartOptions = JSON.parse(JSON.stringify(selectedElementData.chartOptions || {}))
        newElement.chartType = selectedElementData.chartType
      }
      
      // Deep copy table data if it's a table
      if (selectedElementData.type === 'table' && selectedElementData.cells) {
        newElement.cells = selectedElementData.cells.map(row => [...row])
        newElement.columnWidths = [...(selectedElementData.columnWidths || [])]
        newElement.rowHeights = [...(selectedElementData.rowHeights || [])]
        newElement.cellStyles = selectedElementData.cellStyles?.map(row => row.map(cell => ({...cell}))) || []
        newElement.borderStyle = { ...selectedElementData.borderStyle }
        newElement.rows = selectedElementData.rows
        newElement.columns = selectedElementData.columns
        newElement.headerRow = selectedElementData.headerRow
      }
      
      // Deep copy shape properties
      if (selectedElementData.type === 'shape') {
        newElement.shapeType = selectedElementData.shapeType
      }
      setElements((prev) => [...prev, newElement])
      onElementSelect(newElement.id)
    }
  }

  // Alignment functions
  const alignElements = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    const selectedIds = multiSelectedElements.size > 0 
      ? Array.from(multiSelectedElements)
      : selectedElement ? [selectedElement] : []
    
    if (selectedIds.length < 2) return // Need at least 2 elements to align
    
    addToUndoStack()
    
    // Get bounding box of all selected elements
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    
    selectedIds.forEach(id => {
      const el = elements.find(e => e.id === id)
      if (el) {
        minX = Math.min(minX, el.position.x)
        minY = Math.min(minY, el.position.y)
        maxX = Math.max(maxX, el.position.x + el.size.width)
        maxY = Math.max(maxY, el.position.y + el.size.height)
      }
    })
    
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    
    setElements(prev => prev.map(el => {
      if (!selectedIds.includes(el.id)) return el
      
      let newX = el.position.x
      let newY = el.position.y
      
      switch (alignment) {
        case 'left':
          newX = minX
          break
        case 'center':
          newX = centerX - el.size.width / 2
          break
        case 'right':
          newX = maxX - el.size.width
          break
        case 'top':
          newY = minY
          break
        case 'middle':
          newY = centerY - el.size.height / 2
          break
        case 'bottom':
          newY = maxY - el.size.height
          break
      }
      
      return {
        ...el,
        position: { x: newX, y: newY }
      }
    }))
  }
  
  // Distribution functions
  const distributeElements = (direction: 'horizontal' | 'vertical') => {
    const selectedIds = multiSelectedElements.size > 0 
      ? Array.from(multiSelectedElements)
      : selectedElement ? [selectedElement] : []
    
    if (selectedIds.length < 3) return // Need at least 3 elements to distribute
    
    addToUndoStack()
    
    // Get elements and sort by position
    const selectedElements = selectedIds
      .map(id => elements.find(e => e.id === id))
      .filter(el => el !== undefined) as SlideElement[]
    
    if (direction === 'horizontal') {
      // Sort by x position
      selectedElements.sort((a, b) => a.position.x - b.position.x)
      
      const firstEl = selectedElements[0]
      const lastEl = selectedElements[selectedElements.length - 1]
      const totalWidth = selectedElements.reduce((sum, el) => sum + el.size.width, 0)
      const totalSpace = (lastEl.position.x + lastEl.size.width) - firstEl.position.x
      const gapSpace = totalSpace - totalWidth
      const gap = gapSpace / (selectedElements.length - 1)
      
      let currentX = firstEl.position.x
      
      setElements(prev => prev.map(el => {
        const index = selectedElements.findIndex(e => e.id === el.id)
        if (index === -1) return el
        
        if (index === 0) return el // Keep first element in place
        
        const prevEl = selectedElements[index - 1]
        currentX = currentX + prevEl.size.width + gap
        
        return {
          ...el,
          position: { ...el.position, x: currentX }
        }
      }))
    } else {
      // Sort by y position
      selectedElements.sort((a, b) => a.position.y - b.position.y)
      
      const firstEl = selectedElements[0]
      const lastEl = selectedElements[selectedElements.length - 1]
      const totalHeight = selectedElements.reduce((sum, el) => sum + el.size.height, 0)
      const totalSpace = (lastEl.position.y + lastEl.size.height) - firstEl.position.y
      const gapSpace = totalSpace - totalHeight
      const gap = gapSpace / (selectedElements.length - 1)
      
      let currentY = firstEl.position.y
      
      setElements(prev => prev.map(el => {
        const index = selectedElements.findIndex(e => e.id === el.id)
        if (index === -1) return el
        
        if (index === 0) return el // Keep first element in place
        
        const prevEl = selectedElements[index - 1]
        currentY = currentY + prevEl.size.height + gap
        
        return {
          ...el,
          position: { ...el.position, y: currentY }
        }
      }))
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
                      x: Math.max(0, Math.min(canvasSize.width - el.size.width, el.position.x + deltaX)),
                      y: Math.max(0, Math.min(canvasSize.height - el.size.height, el.position.y + deltaY)),
                    },
                  }
                : el,
            ),
          )
          setDragStart({ x: e.clientX, y: e.clientY })
        })
      }
    },
    [draggedElement, dragStart, zoom, multiSelectedElements, canvasSize],
  )

  // Global mouse event handlers
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (draggedElement) {
        handleElementDrag(e)
      } else if (resizingElement) {
        handleResize(e)
      } else if (resizingColumn && resizeStartPos) {
        // Handle column resize
        const deltaX = e.clientX - resizeStartPos.x
        const element = elements.find(el => el.id === resizingColumn.elementId)
        if (element && element.type === 'table' && element.columnWidths) {
          const totalWidth = element.size.width
          const deltaPercent = (deltaX / totalWidth) * 100
          
          const newColumnWidths = [...element.columnWidths]
          const currentWidth = newColumnWidths[resizingColumn.colIndex]
          const nextWidth = newColumnWidths[resizingColumn.colIndex + 1]
          
          const newCurrentWidth = Math.max(5, Math.min(90, currentWidth + deltaPercent))
          const widthDiff = newCurrentWidth - currentWidth
          newColumnWidths[resizingColumn.colIndex] = newCurrentWidth
          newColumnWidths[resizingColumn.colIndex + 1] = nextWidth - widthDiff
          
          updateElement(element.id, { columnWidths: newColumnWidths })
          setResizeStartPos({ x: e.clientX, y: e.clientY })
        }
      } else if (resizingRow && resizeStartPos) {
        // Handle row resize
        const deltaY = e.clientY - resizeStartPos.y
        const element = elements.find(el => el.id === resizingRow.elementId)
        if (element && element.type === 'table' && element.rowHeights) {
          const totalHeight = element.size.height
          const deltaPercent = (deltaY / totalHeight) * 100
          
          const newRowHeights = [...element.rowHeights]
          const currentHeight = newRowHeights[resizingRow.rowIndex]
          const nextHeight = newRowHeights[resizingRow.rowIndex + 1]
          
          const newCurrentHeight = Math.max(5, Math.min(90, currentHeight + deltaPercent))
          const heightDiff = newCurrentHeight - currentHeight
          newRowHeights[resizingRow.rowIndex] = newCurrentHeight
          newRowHeights[resizingRow.rowIndex + 1] = nextHeight - heightDiff
          
          updateElement(element.id, { rowHeights: newRowHeights })
          setResizeStartPos({ x: e.clientX, y: e.clientY })
        }
      }
    }
    
    const handleGlobalMouseUp = () => {
      setDraggedElement(null)
      setResizingElement(null)
      setResizeDirection('')
      setResizingColumn(null)
      setResizingRow(null)
      setResizeStartPos(null)
    }
    
    if (draggedElement || resizingElement || resizingColumn || resizingRow) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('mouseup', handleGlobalMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove)
        document.removeEventListener('mouseup', handleGlobalMouseUp)
      }
    }
  }, [draggedElement, resizingElement, resizingColumn, resizingRow, handleElementDrag, handleResize, resizeStartPos, elements, updateElement])

  // Focus contentEditable when entering table cell edit mode
  useEffect(() => {
    if (editingCell && tableCellRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (tableCellRef.current) {
          tableCellRef.current.focus()
          // Select all text in contentEditable
          const range = document.createRange()
          const sel = window.getSelection()
          range.selectNodeContents(tableCellRef.current)
          sel?.removeAllRanges()
          sel?.addRange(range)
        }
      })
    }
  }, [editingCell])

  // Update editingCellValue when navigating to a different cell
  useEffect(() => {
    if (editingCell) {
      const element = elements.find(el => el.id === editingCell.elementId)
      if (element && element.type === 'table' && element.cells) {
        const cellValue = element.cells[editingCell.row][editingCell.col] || ""
        setEditingCellValue(cellValue)
      }
    }
  }, [editingCell?.elementId, editingCell?.row, editingCell?.col, elements])

  // When selected element changes, handle table cell selection
  useEffect(() => {
    if (selectedElement) {
      const element = elements.find(el => el.id === selectedElement)
      if (element && element.type === 'table') {
        // If a table is selected but no cells are selected, select the first cell
        if (selectedCells.size === 0) {
          const firstCellId = `${element.id}-0-0`
          setSelectedCells(new Set([firstCellId]))
          setTableSelectionStart({ elementId: element.id, row: 0, col: 0 })
          setTableSelectionEnd({ elementId: element.id, row: 0, col: 0 })
        }
      } else {
        // Clear table selection when non-table element is selected
        setSelectedCells(new Set())
        setTableSelectionStart(null)
        setTableSelectionEnd(null)
        setEditingCell(null)
      }
    } else {
      // Clear all selections when nothing is selected
      setSelectedCells(new Set())
      setTableSelectionStart(null) 
      setTableSelectionEnd(null)
      setEditingCell(null)
    }
  }, [selectedElement, elements])

  const renderChart = (element: SlideElement) => {
    return (
      <ChartRenderer 
        element={element} 
        onDoubleClick={(elementId) => setEditingChart(elementId)}
      />
    )
  }

  const renderTable = (element: SlideElement) => {
    if (!element.cells || !element.rows || !element.columns) {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-50 rounded border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Table className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Invalid table data</p>
            <p className="text-xs text-gray-400 mt-1">Double-click to configure</p>
          </div>
        </div>
      )
    }

    // Validate table data integrity
    if (element.cells.length !== element.rows || 
        element.cells.some(row => !Array.isArray(row) || row.length !== element.columns)) {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-50 rounded border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Table className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">Table data corrupted</p>
            <p className="text-xs text-gray-400 mt-1">Please recreate the table</p>
          </div>
        </div>
      )
    }

    const cellHeight = element.rowHeights 
      ? element.size.height * (element.rowHeights[0] / 100)
      : element.size.height / element.rows
    const isEditingThisTable = editingCell?.elementId === element.id

    // Handle table cell mouse events
    const handleCellMouseDown = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      e.stopPropagation()
      const isShift = e.shiftKey

      // Make sure the table element is selected first
      if (selectedElement !== element.id) {
        onElementSelect(element.id)
      }

      if (isShift && tableSelectionStart) {
        // Shift-click to extend selection (no edit mode)
        const newEnd = { elementId: element.id, row: rowIndex, col: colIndex }
        setTableSelectionEnd(newEnd)
        const cells = calculateSelectedCells(element.id, tableSelectionStart, newEnd)
        setSelectedCells(cells)
      } else {
        // Single click selects cell
        const cellId = `${element.id}-${rowIndex}-${colIndex}`
        setSelectedCells(new Set([cellId]))
        setTableSelectionStart({ elementId: element.id, row: rowIndex, col: colIndex })
        setTableSelectionEnd({ elementId: element.id, row: rowIndex, col: colIndex })
        setIsTableSelecting(true)
      }
    }

    const handleCellMouseEnter = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
      if (isTableSelecting && tableSelectionStart) {
        // Exit edit mode if we're dragging to select multiple cells
        if (editingCell) {
          setEditingCell(null)
        }
        
        const newEnd = { elementId: element.id, row: rowIndex, col: colIndex }
        setTableSelectionEnd(newEnd)
        const cells = calculateSelectedCells(element.id, tableSelectionStart, newEnd)
        setSelectedCells(cells)
      }
    }

    const handleCellMouseUp = () => {
      setIsTableSelecting(false)
    }

    return (
      <div className="w-full h-full relative group">
        {/* Table selection border - easier to grab */}
        <div 
          className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-gray-300 transition-colors"
          style={{ margin: '-4px' }}
        />
        
        {/* Table grab handle */}
        <div 
          className="absolute -top-6 left-0 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          <Move className="w-3 h-3 inline mr-1" />
          Click border to move table
        </div>
        
        {/* Invisible border areas for easier selection - split into 4 borders */}
        {/* Top border */}
        <div 
          className="absolute -top-1 left-0 right-0 h-2 cursor-move"
          style={{ zIndex: 5 }}
          onMouseDown={(e) => {
            e.stopPropagation()
            onElementSelect(element.id)
            setSelectedCells(new Set([`${element.id}-0-0`]))
            setTableSelectionStart({ elementId: element.id, row: 0, col: 0 })
            setTableSelectionEnd({ elementId: element.id, row: 0, col: 0 })
          }}
        />
        {/* Bottom border */}
        <div 
          className="absolute -bottom-1 left-0 right-0 h-2 cursor-move"
          style={{ zIndex: 5 }}
          onMouseDown={(e) => {
            e.stopPropagation()
            onElementSelect(element.id)
            setSelectedCells(new Set([`${element.id}-0-0`]))
            setTableSelectionStart({ elementId: element.id, row: 0, col: 0 })
            setTableSelectionEnd({ elementId: element.id, row: 0, col: 0 })
          }}
        />
        {/* Left border */}
        <div 
          className="absolute top-0 -left-1 bottom-0 w-2 cursor-move"
          style={{ zIndex: 5 }}
          onMouseDown={(e) => {
            e.stopPropagation()
            onElementSelect(element.id)
            setSelectedCells(new Set([`${element.id}-0-0`]))
            setTableSelectionStart({ elementId: element.id, row: 0, col: 0 })
            setTableSelectionEnd({ elementId: element.id, row: 0, col: 0 })
          }}
        />
        {/* Right border */}
        <div 
          className="absolute top-0 -right-1 bottom-0 w-2 cursor-move"
          style={{ zIndex: 5 }}
          onMouseDown={(e) => {
            e.stopPropagation()
            onElementSelect(element.id)
            setSelectedCells(new Set([`${element.id}-0-0`]))
            setTableSelectionStart({ elementId: element.id, row: 0, col: 0 })
            setTableSelectionEnd({ elementId: element.id, row: 0, col: 0 })
          }}
        />
        
        <table 
          className="w-full h-full border-collapse relative"
          style={{
            backgroundColor: element.style.backgroundColor,
            color: element.style.color,
            fontSize: element.style.fontSize,
            fontFamily: element.style.fontFamily,
          }}
          onMouseUp={handleCellMouseUp}
          onMouseLeave={handleCellMouseUp}
        >
          <tbody>
            {element.cells.map((row, rowIndex) => (
              <tr key={rowIndex} style={{ height: element.rowHeights ? `${element.rowHeights[rowIndex]}%` : 'auto' }}>
                {row.map((cellContent, colIndex) => {
                  const cellId = `${element.id}-${rowIndex}-${colIndex}`
                  const isEditing = isEditingThisTable && 
                    editingCell?.row === rowIndex && 
                    editingCell?.col === colIndex
                  const isSelected = selectedCells.has(cellId)
                  const isHeaderRow = element.headerRow && rowIndex === 0
                  
                  // Get cell-specific styles if available
                  const cellStyle = element.cellStyles?.[rowIndex]?.[colIndex] || {}
                  const cellBorder = element.cellBorders?.[rowIndex]?.[colIndex] || {}
                  
                  // Calculate border styles
                  const borderTop = cellBorder.top 
                    ? `${cellBorder.top.width}px ${cellBorder.top.style} ${cellBorder.top.color}` 
                    : `${element.borderStyle?.width || 1}px ${element.borderStyle?.style || 'solid'} ${element.borderStyle?.color || '#e5e7eb'}`
                  const borderRight = cellBorder.right 
                    ? `${cellBorder.right.width}px ${cellBorder.right.style} ${cellBorder.right.color}` 
                    : `${element.borderStyle?.width || 1}px ${element.borderStyle?.style || 'solid'} ${element.borderStyle?.color || '#e5e7eb'}`
                  const borderBottom = cellBorder.bottom 
                    ? `${cellBorder.bottom.width}px ${cellBorder.bottom.style} ${cellBorder.bottom.color}` 
                    : `${element.borderStyle?.width || 1}px ${element.borderStyle?.style || 'solid'} ${element.borderStyle?.color || '#e5e7eb'}`
                  const borderLeft = cellBorder.left 
                    ? `${cellBorder.left.width}px ${cellBorder.left.style} ${cellBorder.left.color}` 
                    : `${element.borderStyle?.width || 1}px ${element.borderStyle?.style || 'solid'} ${element.borderStyle?.color || '#e5e7eb'}`
                  
                  return (
                    <td
                      key={colIndex}
                      className={`relative ${isSelected ? 'bg-blue-50' : ''}`}
                      style={{
                        borderTop,
                        borderRight,
                        borderBottom,
                        borderLeft,
                        padding: '8px',
                        width: element.columnWidths ? `${element.columnWidths[colIndex]}%` : 'auto',
                        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : (cellStyle.backgroundColor || (isHeaderRow && !cellStyle.backgroundColor ? '#f3f4f6' : 'transparent')),
                        color: cellStyle.color || element.style.color,
                        fontWeight: cellStyle.fontWeight || (isHeaderRow ? '600' : element.style.fontWeight),
                        textAlign: cellStyle.textAlign || element.style.textAlign,
                        verticalAlign: cellStyle.verticalAlign || 'middle',
                        cursor: 'text',
                        userSelect: isEditing ? 'text' : 'none',
                        position: 'relative',
                        zIndex: isEditing ? 50 : 'auto',
                      }}
                      onMouseDown={(e) => {
                        // Only handle single click for selection
                        if (e.detail === 1) {
                          handleCellMouseDown(e, rowIndex, colIndex)
                        }
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation()
                        // Enter edit mode on double click
                        setEditingCell({ elementId: element.id, row: rowIndex, col: colIndex })
                        setEditingCellValue(sanitizeCellContent(element.cells![rowIndex][colIndex]))
                        setIsEditingText(null)
                      }}
                      onMouseEnter={(e) => handleCellMouseEnter(e, rowIndex, colIndex)}
                    >
                      {isEditing ? (
                        <div
                          ref={tableCellRef as any}
                          contentEditable
                          suppressContentEditableWarning
                          className="w-full h-full outline-none overflow-hidden p-2 bg-white border-2 border-blue-500"
                          onInput={(e) => {
                            const newValue = e.currentTarget.textContent || ""
                            setEditingCellValue(newValue)
                          }}
                          onBlur={(e) => {
                            // Save the value when losing focus
                            const finalValue = e.currentTarget.textContent || ""
                            const newCells = [...element.cells!]
                            newCells[editingCell!.row][editingCell!.col] = finalValue
                            updateElement(element.id, { cells: newCells })
                            setEditingCell(null)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              // Save current value
                              const finalValue = e.currentTarget.textContent || ""
                              const newCells = [...element.cells!]
                              newCells[editingCell!.row][editingCell!.col] = finalValue
                              updateElement(element.id, { cells: newCells })
                              
                              // Move to next cell
                              if (colIndex < element.columns! - 1) {
                                setEditingCell({ elementId: element.id, row: rowIndex, col: colIndex + 1 })
                                setEditingCellValue(sanitizeCellContent(element.cells![rowIndex][colIndex + 1]))
                              } else if (rowIndex < element.rows! - 1) {
                                setEditingCell({ elementId: element.id, row: rowIndex + 1, col: 0 })
                                setEditingCellValue(sanitizeCellContent(element.cells![rowIndex + 1][0]))
                              } else {
                                setEditingCell(null)
                              }
                            } else if (e.key === 'Enter' && e.shiftKey) {
                              // Allow Shift+Enter for new lines - don't prevent default
                            } else if (e.key === 'Tab') {
                              e.preventDefault()
                              if (e.shiftKey) {
                                // Move to previous cell
                                if (colIndex > 0) {
                                  setEditingCell({ elementId: element.id, row: rowIndex, col: colIndex - 1 })
                                } else if (rowIndex > 0) {
                                  setEditingCell({ elementId: element.id, row: rowIndex - 1, col: element.columns! - 1 })
                                }
                              } else {
                                // Move to next cell
                                if (colIndex < element.columns! - 1) {
                                  setEditingCell({ elementId: element.id, row: rowIndex, col: colIndex + 1 })
                                } else if (rowIndex < element.rows! - 1) {
                                  setEditingCell({ elementId: element.id, row: rowIndex + 1, col: 0 })
                                }
                              }
                            } else if (e.key === 'Escape') {
                              setEditingCell(null)
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault()
                              if (rowIndex > 0) {
                                setEditingCell({ elementId: element.id, row: rowIndex - 1, col: colIndex })
                              }
                            } else if (e.key === 'ArrowDown') {
                              e.preventDefault()
                              if (rowIndex < element.rows! - 1) {
                                setEditingCell({ elementId: element.id, row: rowIndex + 1, col: colIndex })
                              }
                            } else if (e.key === 'ArrowLeft' && (e.target as HTMLTextAreaElement).selectionStart === 0) {
                              e.preventDefault()
                              if (colIndex > 0) {
                                setEditingCell({ elementId: element.id, row: rowIndex, col: colIndex - 1 })
                              }
                            } else if (e.key === 'ArrowRight' && (e.target as HTMLTextAreaElement).selectionStart === cellContent.length) {
                              e.preventDefault()
                              if (colIndex < element.columns! - 1) {
                                setEditingCell({ elementId: element.id, row: rowIndex, col: colIndex + 1 })
                              }
                            }
                          }}
                          style={{
                            fontSize: cellStyle.fontSize || element.style.fontSize,
                            fontFamily: cellStyle.fontFamily || element.style.fontFamily,
                            color: cellStyle.color || element.style.color,
                            fontWeight: cellStyle.fontWeight || element.style.fontWeight,
                            fontStyle: cellStyle.fontStyle || element.style.fontStyle,
                            textDecoration: cellStyle.textDecoration || element.style.textDecoration,
                            textAlign: cellStyle.textAlign || element.style.textAlign,
                            padding: 0,
                            lineHeight: 1.5,
                            position: 'relative',
                            zIndex: 100,
                          }}
                          onClick={(e) => e.stopPropagation()} // Prevent click from bubbling up
                          onMouseDown={(e) => e.stopPropagation()} // Prevent mousedown from bubbling up
                          onFocus={(e) => {
                            // Focus contentEditable
                            const range = document.createRange()
                            const sel = window.getSelection()
                            range.selectNodeContents(e.currentTarget)
                            sel?.removeAllRanges()
                            sel?.addRange(range)
                          }}
                        >
                          {editingCellValue}
                        </div>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center whitespace-pre-wrap"
                          style={{
                            fontSize: cellStyle.fontSize || element.style.fontSize,
                            fontFamily: cellStyle.fontFamily || element.style.fontFamily,
                            fontWeight: cellStyle.fontWeight || element.style.fontWeight,
                            fontStyle: cellStyle.fontStyle || element.style.fontStyle,
                            textDecoration: cellStyle.textDecoration || element.style.textDecoration,
                            justifyContent: cellStyle.textAlign === 'center' ? 'center' : cellStyle.textAlign === 'right' ? 'flex-end' : 'flex-start',
                            lineHeight: 1.5,
                          }}
                        >
                          {sanitizeCellContent(cellContent)}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Column resize handles - positioned absolutely over the table */}
        {Array.from({ length: (element.columns || 0) - 1 }, (_, colIndex) => {
          const leftOffset = element.columnWidths 
            ? element.columnWidths.slice(0, colIndex + 1).reduce((sum, w) => sum + w, 0)
            : ((colIndex + 1) / (element.columns || 1)) * 100
          
          return (
            <div
              key={`col-resize-${colIndex}`}
              className={`absolute top-0 w-1 h-full cursor-col-resize z-20 transition-all ${
                resizingColumn?.elementId === element.id && resizingColumn?.colIndex === colIndex
                  ? 'bg-blue-500 opacity-100 w-2'
                  : 'hover:bg-blue-500 hover:opacity-50'
              }`}
              style={{
                left: `${leftOffset}%`,
                transform: 'translateX(-50%)',
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                setResizingColumn({ elementId: element.id, colIndex })
                setResizeStartPos({ x: e.clientX, y: e.clientY })
              }}
            />
          )
        })}
        
        {/* Row resize handles - positioned absolutely over the table */}
        {Array.from({ length: (element.rows || 0) - 1 }, (_, rowIndex) => {
          const topOffset = element.rowHeights 
            ? element.rowHeights.slice(0, rowIndex + 1).reduce((sum, h) => sum + h, 0)
            : ((rowIndex + 1) / (element.rows || 1)) * 100
          
          return (
            <div
              key={`row-resize-${rowIndex}`}
              className={`absolute left-0 w-full h-1 cursor-row-resize z-20 transition-all ${
                resizingRow?.elementId === element.id && resizingRow?.rowIndex === rowIndex
                  ? 'bg-blue-500 opacity-100 h-2'
                  : 'hover:bg-blue-500 hover:opacity-50'
              }`}
              style={{
                top: `${topOffset}%`,
                transform: 'translateY(-50%)',
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                setResizingRow({ elementId: element.id, rowIndex })
                setResizeStartPos({ x: e.clientX, y: e.clientY })
              }}
            />
          )
        })}
      </div>
    )
  }

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
          cursor: isEditing ? 'text' : (isDragging ? 'grabbing' : (isSelected ? 'move' : 'default')),
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
          // For all elements, start dragging if selected and not editing
          if (isSelected && !isEditing && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            setDraggedElement(element.id)
            setDragStart({ x: e.clientX, y: e.clientY })
          }
          // For shapes and tables that aren't selected, select and start dragging immediately
          else if ((element.type === 'shape' || element.type === 'table') && !isSelected && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            handleElementClick(element.id, e)
            setDraggedElement(element.id)
            setDragStart({ x: e.clientX, y: e.clientY })
          }
        }}
      >
        <div className="w-full h-full relative">
          {element.type === "shape" ? (
            renderShape(element)
          ) : element.type === "table" ? (
            renderTable(element)
          ) : element.type === "chart" ? (
            renderChart(element)
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
                cursor: isSelected ? 'move' : 'default',
              }}
              onClick={(e) => {
                e.stopPropagation()
                // Single click only selects, doesn't enter edit mode
                if (!isSelected) {
                  handleElementClick(element.id, e)
                }
              }}
              onDoubleClick={(e) => {
                e.stopPropagation()
                // Double click enters edit mode for text elements
                if (element.type === "chart") {
                  // For charts, show the editor popup
                  setEditingChart(element.id)
                } else if (element.type !== "shape" && element.type !== "table" && !isEditing) {
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
    <div className="flex-1 bg-gray-50 flex flex-col relative overflow-hidden min-h-0">
      {/* Persistent Formatting Toolbar */}
      <div className="bg-white border-b border-gray-200 px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3">
        <div className="flex items-center justify-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <Card className="shadow-sm border border-gray-200 bg-white rounded-lg">
            <CardContent className="p-0.5 sm:p-1 md:p-1.5 lg:p-2">
              <div className="flex items-center space-x-0.5 sm:space-x-1">
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
                    className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                  >
                    <Type className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        title="Add Shape"
                        className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                      >
                        <Shapes className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => addShape("rectangle")}>
                        <Square className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Rectangle</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addShape("circle")}>
                        <Circle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Circle</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addShape("triangle")}>
                        <Triangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Triangle</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addShape("line")}>
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Line</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addShape("arrow")}>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Arrow</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        title="Add Table"
                        className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                      >
                        <Table className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem onClick={() => addTable(2, 2)}>
                        <TableProperties className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">2x2 Table</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addTable(3, 3)}>
                        <TableProperties className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">3x3 Table</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addTable(4, 4)}>
                        <TableProperties className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">4x4 Table</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addTable(5, 5)}>
                        <TableProperties className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">5x5 Table</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addTable(3, 4)}>
                        <TableProperties className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">3x4 Table</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addTable(4, 3)}>
                        <TableProperties className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">4x3 Table</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  {/* Chart dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9">
                        <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem onClick={() => addChart('bar')}>
                        <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Bar Chart</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addChart('bar-grouped')}>
                        <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Grouped Bar Chart</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addChart('bar-stacked')}>
                        <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Stacked Bar Chart</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addChart('line')}>
                        <LineChart className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Line Chart</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addChart('pie')}>
                        <PieChart className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Pie Chart</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addChart('waterfall')}>
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                        <span className="text-xs sm:text-sm">Waterfall Chart</span>
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
                        className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                      >
                        <Undo className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={handleRedo}
                        disabled={redoStack.length === 0}
                        title="Redo (Ctrl+Y)"
                        className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                      >
                        <Redo className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                    
                    {/* Text Formatting - show for text elements and when table cells are selected */}
                    {selectedElementData && (selectedElementData.type !== "shape" && selectedElementData.type !== "table" || (selectedElementData.type === "table" && selectedCells.size > 0)) && (
                      <>
                        <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                          <Select
                            value={selectedElementData?.style.fontSize.toString() || "16"}
                            onValueChange={(v) => {
                              if (selectedElementData.type === "table" && selectedCells.size > 0) {
                                updateSelectedCellStyles({ fontSize: Number(v) })
                              } else {
                                updateElementStyle(selectedElement!, { fontSize: Number(v) })
                              }
                            }}
                          >
                            <SelectTrigger className="w-12 sm:w-14 md:w-16 h-7 sm:h-8 md:h-9 text-[10px] sm:text-xs rounded-md">
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
                            onClick={() => {
                              const newWeight = selectedElementData?.style.fontWeight === "600" ? "400" : "600"
                              if (selectedElementData.type === "table" && selectedCells.size > 0) {
                                updateSelectedCellStyles({ fontWeight: newWeight })
                              } else {
                                updateElementStyle(selectedElement!, { fontWeight: newWeight })
                              }
                            }}
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                          >
                            <Bold className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant={selectedElementData?.style.fontStyle === "italic" ? "secondary" : "ghost"}
                            onClick={() => {
                              const newStyle = selectedElementData?.style.fontStyle === "italic" ? "normal" : "italic"
                              if (selectedElementData.type === "table" && selectedCells.size > 0) {
                                updateSelectedCellStyles({ fontStyle: newStyle })
                              } else {
                                updateElementStyle(selectedElement!, { fontStyle: newStyle })
                              }
                            }}
                            title="Italic"
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                          >
                            <Italic className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant={selectedElementData?.style.textDecoration === "underline" ? "secondary" : "ghost"}
                            onClick={() => {
                              const newDecoration = selectedElementData?.style.textDecoration === "underline" ? "none" : "underline"
                              if (selectedElementData.type === "table" && selectedCells.size > 0) {
                                updateSelectedCellStyles({ textDecoration: newDecoration })
                              } else {
                                updateElementStyle(selectedElement!, { textDecoration: newDecoration })
                              }
                            }}
                            title="Underline"
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                          >
                            <Underline className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                    
                    {/* Lists and Indentation - only show for text elements */}
                    {selectedElementData && selectedElementData.type !== "shape" && selectedElementData.type !== "table" && (
                      <>
                        <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (selectedElementData?.type === "table" && selectedCells.size > 0) {
                                formatTableCells("bullet")
                              } else if (!isEditingText && selectedElement) {
                                setIsEditingText(selectedElement)
                                setTimeout(() => formatText("bullet"), 100)
                              } else if (isEditingText) {
                                formatText("bullet")
                              }
                            }}
                            title="Bullet List"
                            disabled={!selectedElement}
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                          >
                            <List className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (selectedElementData?.type === "table" && selectedCells.size > 0) {
                                formatTableCells("numberedList")
                              } else if (!isEditingText && selectedElement) {
                                setIsEditingText(selectedElement)
                                setTimeout(() => formatText("numberedList"), 100)
                              } else if (isEditingText) {
                                formatText("numberedList")
                              }
                            }}
                            title="Numbered List"
                            disabled={!selectedElement}
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                          >
                            <ListOrdered className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                          <Button
                            size="icon"
                            variant={selectedElementData?.style.textAlign === "left" ? "secondary" : "ghost"}
                            onClick={() => {
                              if (selectedElementData.type === "table" && selectedCells.size > 0) {
                                updateSelectedCellStyles({ textAlign: "left" })
                              } else {
                                updateElementStyle(selectedElement!, { textAlign: "left" })
                              }
                            }}
                            title="Align Left"
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                          >
                            <AlignLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant={selectedElementData.style.textAlign === "center" ? "secondary" : "ghost"}
                            onClick={() => {
                              if (selectedElementData.type === "table" && selectedCells.size > 0) {
                                updateSelectedCellStyles({ textAlign: "center" })
                              } else {
                                updateElementStyle(selectedElement!, { textAlign: "center" })
                              }
                            }}
                            title="Align Center"
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                          >
                            <AlignCenter className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant={selectedElementData.style.textAlign === "right" ? "secondary" : "ghost"}
                            onClick={() => {
                              if (selectedElementData.type === "table" && selectedCells.size > 0) {
                                updateSelectedCellStyles({ textAlign: "right" })
                              } else {
                                updateElementStyle(selectedElement!, { textAlign: "right" })
                              }
                            }}
                            title="Align Right"
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                          >
                            <AlignRight className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant={selectedElementData.style.textAlign === "justify" ? "secondary" : "ghost"}
                            onClick={() => {
                              if (selectedElementData.type === "table" && selectedCells.size > 0) {
                                updateSelectedCellStyles({ textAlign: "justify" })
                              } else {
                                updateElementStyle(selectedElement!, { textAlign: "justify" })
                              }
                            }}
                            title="Justify"
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                          >
                            <AlignJustify className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                          <Select
                            value={selectedElementData.style.fontFamily}
                            onValueChange={(v) => {
                              if (selectedElementData.type === "table" && selectedCells.size > 0) {
                                updateSelectedCellStyles({ fontFamily: v })
                              } else {
                                updateElementStyle(selectedElement!, { fontFamily: v })
                              }
                            }}
                          >
                            <SelectTrigger className="w-24 sm:w-28 md:w-32 h-7 sm:h-8 md:h-9 text-[10px] sm:text-xs rounded-md">
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
                                className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                              >
                                {selectedElementData.lineOrientation === "horizontal" && <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                                {selectedElementData.lineOrientation === "vertical" && <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                                {selectedElementData.lineOrientation === "diagonal-up" && <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />}
                                {selectedElementData.lineOrientation === "diagonal-down" && <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />}
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
                          <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline">Style:</span>
                          <Select
                            value={selectedElementData.style.lineStyle || "solid"}
                            onValueChange={(value) => 
                              updateElementStyle(selectedElement!, { 
                                lineStyle: value as "solid" | "dashed" | "dotted" 
                              })
                            }
                          >
                            <SelectTrigger className="w-16 sm:w-20 h-6 sm:h-7 text-[10px] sm:text-xs">
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
                          <span className="text-[10px] sm:text-xs text-gray-500 hidden md:inline">Thickness:</span>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            value={selectedElementData.style.lineThickness || 4}
                            onChange={(e) => updateElementStyle(selectedElement!, { 
                              lineThickness: parseInt(e.target.value) 
                            })}
                            className="w-12 sm:w-16 md:w-20"
                            title={`${selectedElementData.style.lineThickness || 4}px`}
                          />
                          <span className="text-[10px] sm:text-xs w-6 text-right hidden lg:inline">
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
                          className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                        >
                          <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Size controls for shapes */}
                    {selectedElementData && selectedElementData.type === "shape" && (
                      <div className="flex items-center space-x-1 px-1 border-r border-gray-200">
                        <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline">W:</span>
                        <input
                          type="number"
                          value={selectedElementData.size.width}
                          onChange={(e) => updateElement(selectedElement!, { 
                            size: { ...selectedElementData.size, width: Math.max(10, parseInt(e.target.value) || 0) }
                          })}
                          className="w-12 sm:w-14 md:w-16 h-6 sm:h-7 px-1 sm:px-2 text-[10px] sm:text-xs border rounded"
                        />
                        <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline">H:</span>
                        <input
                          type="number"
                          value={selectedElementData.size.height}
                          onChange={(e) => updateElement(selectedElement!, { 
                            size: { ...selectedElementData.size, height: Math.max(10, parseInt(e.target.value) || 0) }
                          })}
                          className="w-12 sm:w-14 md:w-16 h-6 sm:h-7 px-1 sm:px-2 text-[10px] sm:text-xs border rounded"
                        />
                      </div>
                    )}
                    
                    {/* Chart-specific controls */}
                    {selectedElementData && selectedElementData.type === "chart" && (
                      <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              title="Edit Chart Data"
                              className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                            >
                              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-96" align="start">
                            <div className="space-y-4">
                              <h3 className="font-medium text-sm">Edit Chart Data</h3>
                              
                              {/* Chart Type */}
                              <div>
                                <p className="text-xs font-medium mb-2">Chart Type</p>
                                <Select
                                  value={selectedElementData.chartType}
                                  onValueChange={(value) => {
                                    // Get default data for the new chart type
                                    const chartType = value as SlideElement['chartType']
                                    let defaultData: SlideElement['chartData']
                                    
                                    switch (chartType) {
                                      case 'pie':
                                      case 'doughnut':
                                        defaultData = {
                                          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                                          datasets: [{
                                            label: 'Quarterly Revenue',
                                            data: [30, 25, 20, 25],
                                            backgroundColor: [
                                              'rgba(59, 130, 246, 0.8)',
                                              'rgba(34, 197, 94, 0.8)', 
                                              'rgba(251, 146, 60, 0.8)',
                                              'rgba(168, 85, 247, 0.8)'
                                            ],
                                            borderWidth: 2,
                                            borderColor: '#fff'
                                          }]
                                        }
                                        break
                                      case 'line':
                                        defaultData = {
                                          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                          datasets: [{
                                            label: 'Monthly Growth',
                                            data: [12, 19, 15, 25, 22, 30],
                                            borderColor: 'rgba(59, 130, 246, 1)',
                                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                            borderWidth: 2,
                                            fill: true
                                          }]
                                        }
                                        break
                                      case 'waterfall':
                                        defaultData = getDefaultChartData('waterfall')
                                        break
                                      default: // bar, column
                                        defaultData = {
                                          labels: ['Product A', 'Product B', 'Product C', 'Product D'],
                                          datasets: [{
                                            label: 'Sales by Product',
                                            data: [65, 45, 80, 55],
                                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                            borderColor: 'rgba(59, 130, 246, 1)',
                                            borderWidth: 1
                                          }]
                                        }
                                    }
                                    
                                    updateElement(selectedElement!, { 
                                      chartType: chartType,
                                      chartData: defaultData
                                    })
                                  }}
                                >
                                  <SelectTrigger className="w-full h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="bar">Bar Chart</SelectItem>
                                    <SelectItem value="bar-grouped">Grouped Bar Chart</SelectItem>
                                    <SelectItem value="bar-stacked">Stacked Bar Chart</SelectItem>
                                    <SelectItem value="waterfall">Waterfall Chart</SelectItem>
                                    <SelectItem value="line">Line Chart</SelectItem>
                                    <SelectItem value="pie">Pie Chart</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {/* Chart Data Editor */}
                              <div>
                                <p className="text-xs font-medium mb-2">Data Points</p>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {selectedElementData.chartData?.data?.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                      <input
                                        type="text"
                                        value={item.category || item.name || ''}
                                        onChange={(e) => {
                                          const newData = JSON.parse(JSON.stringify(selectedElementData.chartData))
                                          if (newData.data && newData.data[index]) {
                                            if (selectedElementData.chartType === 'waterfall') {
                                              newData.data[index].name = e.target.value
                                            } else {
                                              newData.data[index].category = e.target.value
                                            }
                                          }
                                          updateElement(selectedElement!, { chartData: newData })
                                        }}
                                        className="flex-1 h-7 px-2 text-xs border rounded"
                                        placeholder="Label"
                                      />
                                      <input
                                        type="number"
                                        value={item.value || 0}
                                        onChange={(e) => {
                                          const newData = JSON.parse(JSON.stringify(selectedElementData.chartData))
                                          if (newData.data && newData.data[index]) {
                                            newData.data[index].value = parseFloat(e.target.value) || 0
                                          }
                                          updateElement(selectedElement!, { chartData: newData })
                                        }}
                                        className="w-20 h-7 px-2 text-xs border rounded"
                                        placeholder="Value"
                                      />
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {
                                          const newData = JSON.parse(JSON.stringify(selectedElementData.chartData))
                                          if (newData.data) {
                                            newData.data.splice(index, 1)
                                          }
                                          updateElement(selectedElement!, { chartData: newData })
                                        }}
                                        className="h-6 w-6"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  )) || []}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const newData = JSON.parse(JSON.stringify(selectedElementData.chartData))
                                    if (!newData.data) {
                                      newData.data = []
                                    }
                                    const newItem = {
                                      value: 50
                                    } as any
                                    
                                    if (selectedElementData.chartType === 'waterfall') {
                                      newItem.name = `Item ${newData.data.length + 1}`
                                      newItem.type = 'positive'
                                    } else {
                                      newItem.category = `Item ${newData.data.length + 1}`
                                    }
                                    
                                    newData.data.push(newItem)
                                    updateElement(selectedElement!, { chartData: newData })
                                  }}
                                  className="w-full mt-2 h-7 text-xs"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add Data Point
                                </Button>
                              </div>
                              
                              {/* Legend Toggle */}
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-medium">Show Legend</p>
                                <Button
                                  size="sm"
                                  variant={selectedElementData.chartOptions?.plugins?.legend?.display ? "secondary" : "ghost"}
                                  onClick={() => {
                                    const newOptions = { ...selectedElementData.chartOptions }
                                    if (!newOptions.plugins) newOptions.plugins = {}
                                    if (!newOptions.plugins.legend) newOptions.plugins.legend = {}
                                    newOptions.plugins.legend.display = !newOptions.plugins.legend.display
                                    updateElement(selectedElement!, { chartOptions: newOptions })
                                  }}
                                  className="h-6 px-2 text-xs"
                                >
                                  {selectedElementData.chartOptions?.plugins?.legend?.display ? "On" : "Off"}
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                    
                    {/* Table-specific controls */}
                    {selectedElementData && selectedElementData.type === "table" && (
                      <>
                        <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (!selectedElementData.rows || !selectedElementData.columns || !selectedElementData.cells) return
                              const newRows = selectedElementData.rows + 1
                              const newCells = [...selectedElementData.cells]
                              newCells.push(Array(selectedElementData.columns).fill(""))
                              updateElement(selectedElement!, { 
                                rows: newRows, 
                                cells: newCells 
                              })
                            }}
                            title="Add Row"
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            <Rows3 className="w-2 h-2 sm:w-3 sm:h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (!selectedElementData.rows || selectedElementData.rows <= 1 || !selectedElementData.cells) return
                              const newRows = selectedElementData.rows - 1
                              const newCells = selectedElementData.cells.slice(0, -1)
                              updateElement(selectedElement!, { 
                                rows: newRows, 
                                cells: newCells 
                              })
                            }}
                            title="Remove Row"
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                            disabled={!selectedElementData.rows || selectedElementData.rows <= 1}
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                            <Rows3 className="w-2 h-2 sm:w-3 sm:h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (!selectedElementData.columns || !selectedElementData.cells) return
                              const newColumns = selectedElementData.columns + 1
                              const newCells = selectedElementData.cells.map(row => [...row, ""])
                              const newColumnWidths = selectedElementData.columnWidths 
                                ? [...selectedElementData.columnWidths].map(w => w * (selectedElementData.columns! / newColumns))
                                : undefined
                              if (newColumnWidths) {
                                newColumnWidths.push(100 / newColumns)
                              }
                              updateElement(selectedElement!, { 
                                columns: newColumns, 
                                cells: newCells,
                                columnWidths: newColumnWidths
                              })
                            }}
                            title="Add Column"
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                            <Columns3 className="w-2 h-2 sm:w-3 sm:h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (!selectedElementData.columns || selectedElementData.columns <= 1 || !selectedElementData.cells) return
                              const newColumns = selectedElementData.columns - 1
                              const newCells = selectedElementData.cells.map(row => row.slice(0, -1))
                              const newColumnWidths = selectedElementData.columnWidths 
                                ? selectedElementData.columnWidths.slice(0, -1).map(w => w * (selectedElementData.columns! / newColumns))
                                : undefined
                              updateElement(selectedElement!, { 
                                columns: newColumns, 
                                cells: newCells,
                                columnWidths: newColumnWidths
                              })
                            }}
                            title="Remove Column"
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                            disabled={!selectedElementData.columns || selectedElementData.columns <= 1}
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                            <Columns3 className="w-2 h-2 sm:w-3 sm:h-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                          <Button
                            size="icon"
                            variant={selectedElementData.headerRow ? "secondary" : "ghost"}
                            onClick={() => updateElement(selectedElement!, { 
                              headerRow: !selectedElementData.headerRow 
                            })}
                            title="Toggle Header Row"
                            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                          >
                            <TableProperties className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                        
                        {/* Table Border Controls */}
                        <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                title="Table Borders"
                                className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                              >
                                <Square className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64" align="start">
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs font-medium mb-2">Border Style</p>
                                  <Select
                                    value={selectedElementData.borderStyle?.style || "solid"}
                                    onValueChange={(value) => {
                                      const borderStyle = {
                                        color: selectedElementData.borderStyle?.color || "#e5e7eb",
                                        width: selectedElementData.borderStyle?.width || 1,
                                        style: value as "solid" | "dashed" | "dotted" | "none"
                                      }
                                      updateElement(selectedElement!, { borderStyle })
                                    }}
                                  >
                                    <SelectTrigger className="w-full h-8 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="solid">Solid</SelectItem>
                                      <SelectItem value="dashed">Dashed</SelectItem>
                                      <SelectItem value="dotted">Dotted</SelectItem>
                                      <SelectItem value="none">None</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <p className="text-xs font-medium mb-2">Border Width</p>
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="range"
                                      min="1"
                                      max="10"
                                      value={selectedElementData.borderStyle?.width || 1}
                                      onChange={(e) => {
                                        const borderStyle = {
                                          color: selectedElementData.borderStyle?.color || "#e5e7eb",
                                          width: parseInt(e.target.value),
                                          style: selectedElementData.borderStyle?.style || "solid"
                                        }
                                        updateElement(selectedElement!, { borderStyle })
                                      }}
                                      className="flex-1"
                                    />
                                    <span className="text-xs w-8 text-right">
                                      {selectedElementData.borderStyle?.width || 1}px
                                    </span>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-xs font-medium mb-2">Border Color</p>
                                  <div className="grid grid-cols-8 gap-1">
                                    {colors.map((c) => (
                                      <button
                                        key={c}
                                        className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                                        style={{ backgroundColor: c }}
                                        onClick={() => {
                                          const borderStyle = {
                                            color: c,
                                            width: selectedElementData.borderStyle?.width || 1,
                                            style: selectedElementData.borderStyle?.style || "solid"
                                          }
                                          updateElement(selectedElement!, { borderStyle })
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </>
                    )}
                    
                    <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                      <Popover>
                    <PopoverTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9">
                        <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
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
                        ) : selectedElementData?.type === "table" && selectedCells.size > 0 ? (
                          // For table cells, show cell-specific colors
                          <>
                            <div>
                              <p className="text-xs font-medium mb-2">Cell Text Color</p>
                              <div className="grid grid-cols-8 gap-1">
                                {colors.map((c) => (
                                  <button
                                    key={c}
                                    className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                                    style={{ backgroundColor: c }}
                                    onClick={() => updateSelectedCellStyles({ color: c })}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-medium mb-2">Cell Background</p>
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
                                    onClick={() => updateSelectedCellStyles({ 
                                      backgroundColor: c === "transparent" ? "transparent" : c 
                                    })}
                                  />
                                ))}
                              </div>
                            </div>
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
                
                {/* Alignment controls - show when 2+ elements selected */}
                {(multiSelectedElements.size > 1) && (
                  <>
                    <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => alignElements('left')}
                        title="Align Left"
                        className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                      >
                        <AlignHorizontalJustifyStart className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => alignElements('center')}
                        title="Align Center"
                        className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                      >
                        <AlignHorizontalJustifyCenter className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => alignElements('right')}
                        title="Align Right"
                        className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                      >
                        <AlignHorizontalJustifyEnd className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => alignElements('top')}
                        title="Align Top"
                        className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                      >
                        <AlignVerticalJustifyStart className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => alignElements('middle')}
                        title="Align Middle"
                        className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                      >
                        <AlignVerticalJustifyCenter className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => alignElements('bottom')}
                        title="Align Bottom"
                        className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                      >
                        <AlignVerticalJustifyEnd className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </>
                )}
                
                {/* Distribution controls - show when 3+ elements selected */}
                {(multiSelectedElements.size > 2) && (
                  <div className="flex items-center space-x-0.5 px-1 border-r border-gray-200">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => distributeElements('horizontal')}
                      title="Distribute Horizontally"
                      className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                    >
                      <Columns3 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => distributeElements('vertical')}
                      title="Distribute Vertically"
                      className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                    >
                      <Rows3 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                )}
                
                {isAnyElementSelected && (
                  <div className="flex items-center space-x-0.5 pl-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={duplicateElement}
                      title="Duplicate"
                      className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
                    >
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteElement()}
                      className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div
        className="flex-1 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12 overflow-hidden min-h-0"
        onMouseDown={handleSlideMouseDown}
        onMouseMove={handleSlideMouseMove}
        onMouseUp={handleSlideMouseUp}
        onWheel={(e) => e.stopPropagation()}
        style={{ cursor: zoom > 100 && !draggedElement ? (isDragging ? "grabbing" : "grab") : "default" }}
      >
        <div className="relative" style={{ maxWidth: '100%', maxHeight: '100%' }}>
          <div
            ref={slideRef}
            className="bg-white rounded-lg shadow-lg relative overflow-hidden"
            style={{
              width: `${canvasSize.width}px`,
              height: `${canvasSize.height}px`,
              maxWidth: '100%',
              maxHeight: '100%',
              transform: `scale(${zoom / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: "center",
              aspectRatio: '16/9',
            }}
            onMouseDown={(e) => {
              // Start marquee selection if clicking on empty canvas
              if (e.target === e.currentTarget && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                setIsSelecting(true)
                const rect = slideRef.current?.getBoundingClientRect()
                if (rect) {
                  const x = (e.clientX - rect.left) / (zoom / 100)
                  const y = (e.clientY - rect.top) / (zoom / 100)
                  setSelectionBox({ 
                    start: { x, y }, 
                    end: { x, y } 
                  })
                }
                // Clear selections when starting marquee
                onElementSelect(null)
                setMultiSelectedElements(new Set())
                setLastSelectedElement(null)
              }
            }}
            onMouseMove={(e) => {
              // Update marquee selection box
              if (isSelecting && selectionBox) {
                const rect = slideRef.current?.getBoundingClientRect()
                if (rect) {
                  const x = (e.clientX - rect.left) / (zoom / 100)
                  const y = (e.clientY - rect.top) / (zoom / 100)
                  setSelectionBox({
                    ...selectionBox,
                    end: { x, y }
                  })
                }
              }
            }}
            onMouseUp={(e) => {
              // Complete marquee selection
              if (isSelecting && selectionBox) {
                const minX = Math.min(selectionBox.start.x, selectionBox.end.x)
                const maxX = Math.max(selectionBox.start.x, selectionBox.end.x)
                const minY = Math.min(selectionBox.start.y, selectionBox.end.y)
                const maxY = Math.max(selectionBox.start.y, selectionBox.end.y)
                
                // Select all elements within the selection box
                const selected = new Set<string>()
                elements.forEach(element => {
                  const elLeft = element.position.x
                  const elRight = element.position.x + element.size.width
                  const elTop = element.position.y
                  const elBottom = element.position.y + element.size.height
                  
                  // Check if element intersects with selection box
                  if (elRight >= minX && elLeft <= maxX && 
                      elBottom >= minY && elTop <= maxY) {
                    selected.add(element.id)
                  }
                })
                
                if (selected.size > 0) {
                  setMultiSelectedElements(selected)
                  // Select the first element as the primary selection
                  const firstId = Array.from(selected)[0]
                  onElementSelect(firstId)
                }
                
                setIsSelecting(false)
                setSelectionBox(null)
              }
            }}
          >
          {elements.sort((a, b) => a.zIndex - b.zIndex).map(renderElement)}
          
          {/* Marquee Selection Box */}
          {isSelecting && selectionBox && (
            <div
              className="absolute border-2 border-blue-500 border-dashed bg-blue-500 bg-opacity-10 pointer-events-none"
              style={{
                left: Math.min(selectionBox.start.x, selectionBox.end.x),
                top: Math.min(selectionBox.start.y, selectionBox.end.y),
                width: Math.abs(selectionBox.end.x - selectionBox.start.x),
                height: Math.abs(selectionBox.end.y - selectionBox.start.y),
              }}
            />
          )}
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6 border-t border-gray-200 pt-1 sm:pt-2 flex justify-between items-center text-[9px] sm:text-[10px] md:text-xs text-gray-400">
            <span className="font-medium">PRESENTPRO</span>
            <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
          </div>
        </div>
        </div>
      </div>

      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 flex items-center space-x-2 sm:space-x-3">
        <Card className="shadow-lg border border-gray-200 rounded-lg">
          <CardContent className="p-1 sm:p-1.5">
            <div className="flex items-center space-x-0.5 sm:space-x-1">
              <Button variant="ghost" size="icon" onClick={() => onZoomChange(zoom - 25)} disabled={zoom <= 75} className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9">
                <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 min-w-[2rem] sm:min-w-[2.5rem] md:min-w-[3rem] text-center">{Math.round((zoom / 1.5) * 100) / 100}%</span>
              <Button variant="ghost" size="icon" onClick={() => onZoomChange(zoom + 25)} disabled={zoom >= 300} className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9">
                <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart Editor Popup */}
      {editingChart && (() => {
        const chartElement = elements.find(el => el.id === editingChart)
        if (!chartElement) return null
        
        // Calculate position next to the chart
        const slideRect = slideRef.current?.getBoundingClientRect()
        if (!slideRect) {
          // Fallback to center screen if slide ref not available
          return (
            <div 
              ref={chartEditorRef}
              className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-96 max-h-[80vh] overflow-y-auto z-50"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-sm">Edit Chart Data</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingChart(null)}
                  className="h-6 w-6"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {renderChartEditorContent(chartElement)}
              </div>
            </div>
          )
        }
        
        const chartScreenX = chartElement.position.x * (zoom / 100) + slideRect.left
        const chartScreenY = chartElement.position.y * (zoom / 100) + slideRect.top
        const chartWidth = chartElement.size.width * (zoom / 100)
        const chartHeight = chartElement.size.height * (zoom / 100)
        
        // Position the editor to the right of the chart if there's space, otherwise to the left
        const editorWidth = 384 // w-96 = 24rem = 384px
        const windowWidth = window.innerWidth
        const spaceOnRight = windowWidth - (chartScreenX + chartWidth)
        const shouldPositionRight = spaceOnRight > editorWidth + 20
        
        let editorX = shouldPositionRight 
          ? chartScreenX + chartWidth + 10
          : chartScreenX - editorWidth - 10
          
        // Ensure editor stays within viewport
        editorX = Math.max(10, Math.min(windowWidth - editorWidth - 10, editorX))
        
        // Center vertically with the chart
        let editorY = chartScreenY + (chartHeight / 2)
        
        // Ensure editor doesn't go off screen vertically
        const maxHeight = window.innerHeight * 0.8
        editorY = Math.max(maxHeight / 2 + 10, Math.min(window.innerHeight - maxHeight / 2 - 10, editorY))
        
        return (
          <div 
            ref={chartEditorRef}
            className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-96 max-h-[80vh] overflow-y-auto z-50"
            style={{
              left: `${editorX}px`,
              top: `${editorY}px`,
              transform: 'translateY(-50%)',
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-sm">Edit Chart Data</h3>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setEditingChart(null)}
                className="h-6 w-6"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {renderChartEditorContent(chartElement)}
            </div>
          </div>
        )
      })()}

    </div>
  )
}