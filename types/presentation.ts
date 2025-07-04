/**
 * Core presentation types used throughout the application
 */

export interface Slide {
  id: number
  title: string
  type: SlideType
  content: string
  elements?: SlideElement[]
}

export type SlideType = 'title' | 'content' | 'chart' | 'conclusion'

export interface SlideElement {
  id: string
  type: ElementType
  content: string
  position: Position
  size: Size
  style: ElementStyle
  // Type-specific properties
  chartType?: ChartType
  chartData?: ChartData
  shapeType?: ShapeType
  imageUrl?: string
  tableData?: TableData
}

export type ElementType = 'text' | 'title' | 'bullet' | 'chart' | 'table' | 'shape' | 'image'
export type ChartType = 'bar' | 'line' | 'pie'
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow'

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface ElementStyle {
  fontSize: number
  fontWeight: string
  fontStyle: string
  textDecoration: string
  color: string
  backgroundColor: string
  borderColor: string
  borderWidth: number
  textAlign: 'left' | 'center' | 'right' | 'justify'
  fontFamily: string
  opacity: number
  borderRadius: number
  lineHeight?: number
  letterSpacing?: number
}

export interface ChartData {
  data: Array<{
    label: string
    value: number
    color?: string
  }>
}

export interface TableData {
  rows: number
  columns: number
  cells: string[][]
}

// Presentation metadata
export interface Presentation {
  id: string
  title: string
  description?: string
  slides: Slide[]
  createdAt: Date
  updatedAt: Date
  status: PresentationStatus
  templateId?: string
}

export type PresentationStatus = 'draft' | 'published' | 'archived'

// Template types
export interface Template {
  id: string
  name: string
  description: string
  category: TemplateCategory
  preview: string
  slides: Slide[]
}

export type TemplateCategory = 'business' | 'education' | 'marketing' | 'general'

// Action types for state management
export type PresentationAction = 
  | { type: 'ADD_SLIDE'; payload: { slideType: SlideType } }
  | { type: 'DELETE_SLIDE'; payload: { slideId: number } }
  | { type: 'UPDATE_SLIDE'; payload: { slideId: number; updates: Partial<Slide> } }
  | { type: 'ADD_ELEMENT'; payload: { slideId: number; element: SlideElement } }
  | { type: 'UPDATE_ELEMENT'; payload: { slideId: number; elementId: string; updates: Partial<SlideElement> } }
  | { type: 'DELETE_ELEMENT'; payload: { slideId: number; elementId: string } }
  | { type: 'REORDER_SLIDES'; payload: { fromIndex: number; toIndex: number } }