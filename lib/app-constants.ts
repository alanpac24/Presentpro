// Application-wide constants to avoid magic numbers and strings

// Time intervals (in milliseconds)
export const TIMEOUTS = {
  SLIDE_TRANSITION: 150,
  AUTO_SAVE: 30000, // 30 seconds
  TESTIMONIAL_ROTATION: 5000, // 5 seconds
  LOADING_DELAY: 500,
  ANIMATION_SHORT: 300,
  ANIMATION_MEDIUM: 500,
  ANIMATION_LONG: 1000,
  DEBOUNCE_SEARCH: 300,
  TOAST_DURATION: 3000,
} as const

// Dimensions
export const DIMENSIONS = {
  SIDEBAR_MIN_WIDTH: 400,
  SIDEBAR_MAX_WIDTH: 800,
  SLIDE_CAROUSEL_HEIGHT: 36, // h-36 in tailwind
  HEADER_HEIGHT: 64, // h-16 in tailwind
  ZOOM_MIN: 75,
  ZOOM_DEFAULT: 150,
  ZOOM_MAX: 300,
  PAN_LIMIT: 100,
} as const

// Limits
export const LIMITS = {
  MAX_PRESENTATION_TITLE_LENGTH: 100,
  MAX_SLIDE_TITLE_LENGTH: 50,
  MAX_SEARCH_QUERY_LENGTH: 200,
  MIN_PASSWORD_LENGTH: 8,
  MAX_FILE_SIZE_MB: 50,
} as const

// API endpoints (for future use)
export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  PRESENTATIONS: '/api/presentations',
  TEMPLATES: '/api/templates',
  USER: '/api/user',
  UPLOAD: '/api/upload',
} as const

// Storage keys
export const STORAGE_KEYS = {
  EDIT_USAGE: 'presentpro_edit_usage',
  PRESENTATION_USAGE: 'presentpro_presentation_usage',
  USER_PREFERENCES: 'presentpro_user_preferences',
  DRAFT_PRESENTATION: 'presentpro_draft',
} as const

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM d, yyyy',
  DISPLAY_WITH_TIME: "MMM d, yyyy 'at' h:mm a",
  ISO: 'yyyy-MM-dd',
  RELATIVE: 'relative', // for "3 days ago" type formatting
} as const

// Status values
export const PRESENTATION_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'Free',
  PRO: 'Pro',
  PROFESSIONAL: 'Professional',
  ENTERPRISE: 'Enterprise',
} as const

// Plan limits
export const PLAN_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: {
    presentations: 3,
    edits: 5,
    templates: 'basic',
    export: ['pdf'],
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    presentations: 10,
    edits: 150,
    templates: 'basic',
    export: ['pdf', 'pptx'],
  },
  [SUBSCRIPTION_TIERS.PROFESSIONAL]: {
    presentations: 50,
    edits: 500,
    templates: 'premium',
    export: ['pdf', 'pptx'],
  },
  [SUBSCRIPTION_TIERS.ENTERPRISE]: {
    presentations: Infinity,
    edits: Infinity,
    templates: 'all',
    export: ['pdf', 'pptx', 'custom'],
  },
} as const

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  AUTH_REQUIRED: 'Please sign in to continue.',
  LIMIT_REACHED: 'You have reached your plan limit.',
  INVALID_FILE: 'Invalid file type or size.',
  SAVE_FAILED: 'Failed to save changes.',
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully.',
  CREATED: 'Created successfully.',
  DELETED: 'Deleted successfully.',
  COPIED: 'Copied to clipboard.',
  EXPORTED: 'Export completed.',
} as const

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  HEX_COLOR: /^#[0-9A-F]{6}$/i,
} as const