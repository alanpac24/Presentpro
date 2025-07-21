// Common styles and constants used across slide components

export const SLIDE_STYLES = {
  // Text styles
  title: 'text-3xl md:text-4xl font-bold text-gray-900',
  subtitle: 'text-lg text-gray-600',
  sectionTitle: 'text-xl font-semibold text-gray-800',
  
  // Layout styles
  divider: 'w-20 h-1 bg-blue-600',
  container: 'h-full flex flex-col',
  
  // Card styles
  card: 'bg-white border border-gray-200 rounded-lg p-4',
  cardHover: 'hover:border-blue-400 hover:shadow-md transition-all',
  
  // Button/Badge styles
  badge: 'px-3 py-1 rounded-full text-sm font-medium',
  recommendedBadge: 'bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold',
  
  // Icon containers
  iconContainer: 'w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center',
  iconContainerLarge: 'w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center',
  
  // Color variants
  highlight: {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-orange-50 border-orange-200',
    danger: 'bg-red-50 border-red-200'
  }
} as const

export const TRANSITION_STYLES = {
  default: 'transition-all',
  hover: 'transition-all hover:scale-105',
  shadow: 'transition-shadow hover:shadow-lg'
} as const

export const SPACING = {
  section: 'mb-6',
  subsection: 'mb-4',
  item: 'mb-2',
  tight: 'mb-1'
} as const