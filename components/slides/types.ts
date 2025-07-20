// Shared types for all slide components
export interface BaseSlideProps {
  id: string
  className?: string
}

export interface TitleSlideData {
  title: string
  subtitle?: string
  presenter?: string
  company?: string
  date?: string
}

export interface ContentSlideData {
  title: string
  content?: string
  bullets?: string[]
}

export interface MetricsSlideData {
  title: string
  subtitle?: string
  metrics: Array<{
    label: string
    value: string
    trend?: string
    color?: 'blue' | 'green' | 'orange' | 'red'
  }>
}

export interface ChartSlideData {
  title: string
  subtitle?: string
  chartType: 'bar' | 'line' | 'pie'
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string | string[]
      borderColor?: string
    }>
  }
}

export interface ComparisonSlideData {
  title: string
  subtitle?: string
  leftTitle: string
  rightTitle: string
  comparisons: Array<{
    feature: string
    left: string
    right: string
  }>
}

export interface TimelineSlideData {
  title: string
  subtitle?: string
  phases: Array<{
    phase: string
    duration: string
    activities: string[]
    milestone?: string
  }>
}

export interface InvestmentSlideData {
  title: string
  subtitle?: string
  investment: {
    initial: string
    monthly: string
    total: string
    roi: string
    payback: string
  }
  benefits: string[]
}

export interface ConclusionSlideData {
  title: string
  subtitle?: string
  keyTakeaways: string[]
  nextSteps: string[]
  callToAction?: string
}