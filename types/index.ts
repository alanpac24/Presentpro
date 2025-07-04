/**
 * Central export point for all type definitions
 */

export * from './user'
export * from './database'
// Re-export presentation types except those that conflict with database
export {
  type Slide,
  type SlideType,
  type SlideElement,
  type ElementType,
  type ChartType,
  type ShapeType,
  type Position,
  type Size,
  type ElementStyle,
  type ChartData,
  type TableData,
  type Presentation,
  type Template,
  type TemplateCategory,
  type PresentationAction
} from './presentation'