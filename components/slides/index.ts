// Central registry for all slide components
export { TitleSlide } from './TitleSlide'
export { ContentSlide } from './ContentSlide'
export { MetricsSlide } from './MetricsSlide'
export { ChartSlide } from './ChartSlide'
export { ComparisonSlide } from './ComparisonSlide'
export { TimelineSlide } from './TimelineSlide'

export * from './types'

// Slide component mapping
import { TitleSlide } from './TitleSlide'
import { ContentSlide } from './ContentSlide'
import { MetricsSlide } from './MetricsSlide'
import { ChartSlide } from './ChartSlide'
import { ComparisonSlide } from './ComparisonSlide'
import { TimelineSlide } from './TimelineSlide'

export const slideComponents = {
  title: TitleSlide,
  content: ContentSlide,
  metrics: MetricsSlide,
  chart: ChartSlide,
  comparison: ComparisonSlide,
  timeline: TimelineSlide,
  // Legacy mappings
  bullet: ContentSlide,
  twoColumn: ComparisonSlide,
} as const

export type SlideType = keyof typeof slideComponents