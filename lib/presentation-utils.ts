import { 
  SlideElement, 
  ElementType, 
  Position, 
  Size, 
  ElementStyle,
  Slide,
  SlideType
} from '@/types/presentation'

/**
 * Generate a unique element ID
 */
export function generateElementId(): string {
  return `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate a unique slide ID
 */
export function generateSlideId(existingSlides: Slide[]): number {
  return Math.max(...existingSlides.map(s => s.id), 0) + 1
}

/**
 * Default styles for different element types
 */
const DEFAULT_STYLES: Record<ElementType, Partial<ElementStyle>> = {
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000'
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'left',
    color: '#333333'
  },
  bullet: {
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'left',
    color: '#333333'
  },
  chart: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  table: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  shape: {
    backgroundColor: '#3b82f6',
    borderWidth: 0,
    borderColor: 'transparent'
  },
  image: {
    backgroundColor: '#f3f4f6',
    borderWidth: 0,
    borderColor: 'transparent'
  }
}

/**
 * Default sizes for different element types
 */
const DEFAULT_SIZES: Record<ElementType, Size> = {
  title: { width: 600, height: 60 },
  text: { width: 400, height: 100 },
  bullet: { width: 400, height: 120 },
  chart: { width: 400, height: 300 },
  table: { width: 500, height: 300 },
  shape: { width: 200, height: 200 },
  image: { width: 300, height: 200 }
}

/**
 * Create a new element with defaults
 */
export function createElement(
  type: ElementType,
  content: string = '',
  position?: Partial<Position>,
  size?: Partial<Size>,
  style?: Partial<ElementStyle>
): SlideElement {
  const defaultStyle: ElementStyle = {
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    color: '#000000',
    backgroundColor: 'transparent',
    borderColor: '#e5e7eb',
    borderWidth: 0,
    textAlign: 'left',
    fontFamily: 'Arial, sans-serif',
    opacity: 1,
    borderRadius: 0,
    ...DEFAULT_STYLES[type],
    ...style
  }

  return {
    id: generateElementId(),
    type,
    content: content || getDefaultContent(type),
    position: {
      x: position?.x ?? 100,
      y: position?.y ?? 100
    },
    size: {
      width: size?.width ?? DEFAULT_SIZES[type].width,
      height: size?.height ?? DEFAULT_SIZES[type].height
    },
    style: defaultStyle
  }
}

/**
 * Get default content for element type
 */
function getDefaultContent(type: ElementType): string {
  const defaults: Record<ElementType, string> = {
    title: 'New Title',
    text: 'Add your text here',
    bullet: '• Point 1\n• Point 2\n• Point 3',
    chart: '',
    table: '',
    shape: '',
    image: ''
  }
  return defaults[type]
}

/**
 * Create a new slide with defaults
 */
export function createSlide(
  type: SlideType,
  title?: string,
  existingSlides: Slide[] = []
): Slide {
  const id = generateSlideId(existingSlides)
  const slideNumber = existingSlides.length + 1
  
  const defaultTitles: Record<SlideType, string> = {
    title: 'Title Slide',
    content: `Slide ${slideNumber}`,
    chart: 'Data Visualization',
    conclusion: 'Summary'
  }

  const slide: Slide = {
    id,
    title: title || defaultTitles[type],
    type,
    content: '',
    elements: []
  }

  // Add default elements based on slide type
  switch (type) {
    case 'title':
      slide.elements = [
        createElement('title', 'Presentation Title', { x: 100, y: 200 }),
        createElement('text', 'Subtitle or date', { x: 100, y: 300 }, { width: 600, height: 40 })
      ]
      break
    case 'content':
      slide.elements = [
        createElement('title', slide.title, { x: 100, y: 50 }, { width: 600, height: 50 }),
        createElement('bullet', '', { x: 100, y: 150 }, { width: 600, height: 300 })
      ]
      break
    case 'chart':
      slide.elements = [
        createElement('title', slide.title, { x: 100, y: 50 }, { width: 600, height: 50 }),
        createElement('chart', '', { x: 150, y: 150 })
      ]
      break
    case 'conclusion':
      slide.elements = [
        createElement('title', 'Key Takeaways', { x: 100, y: 100 }),
        createElement('bullet', '• Summary point 1\n• Summary point 2\n• Next steps', { x: 100, y: 200 })
      ]
      break
  }

  return slide
}

/**
 * Calculate element bounds
 */
export function getElementBounds(element: SlideElement) {
  return {
    left: element.position.x,
    top: element.position.y,
    right: element.position.x + element.size.width,
    bottom: element.position.y + element.size.height,
    width: element.size.width,
    height: element.size.height
  }
}

/**
 * Check if point is inside element
 */
export function isPointInElement(
  point: Position,
  element: SlideElement
): boolean {
  const bounds = getElementBounds(element)
  return (
    point.x >= bounds.left &&
    point.x <= bounds.right &&
    point.y >= bounds.top &&
    point.y <= bounds.bottom
  )
}

/**
 * Align elements
 */
export function alignElements(
  elements: SlideElement[],
  alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
): SlideElement[] {
  if (elements.length === 0) return elements

  const bounds = elements.map(getElementBounds)
  
  switch (alignment) {
    case 'left':
      const minLeft = Math.min(...bounds.map(b => b.left))
      return elements.map(el => ({
        ...el,
        position: { ...el.position, x: minLeft }
      }))
    
    case 'right':
      const maxRight = Math.max(...bounds.map(b => b.right))
      return elements.map((el, i) => ({
        ...el,
        position: { ...el.position, x: maxRight - bounds[i].width }
      }))
    
    case 'center':
      const avgCenterX = bounds.reduce((sum, b) => sum + (b.left + b.right) / 2, 0) / bounds.length
      return elements.map((el, i) => ({
        ...el,
        position: { ...el.position, x: avgCenterX - bounds[i].width / 2 }
      }))
    
    case 'top':
      const minTop = Math.min(...bounds.map(b => b.top))
      return elements.map(el => ({
        ...el,
        position: { ...el.position, y: minTop }
      }))
    
    case 'bottom':
      const maxBottom = Math.max(...bounds.map(b => b.bottom))
      return elements.map((el, i) => ({
        ...el,
        position: { ...el.position, y: maxBottom - bounds[i].height }
      }))
    
    case 'middle':
      const avgCenterY = bounds.reduce((sum, b) => sum + (b.top + b.bottom) / 2, 0) / bounds.length
      return elements.map((el, i) => ({
        ...el,
        position: { ...el.position, y: avgCenterY - bounds[i].height / 2 }
      }))
    
    default:
      return elements
  }
}