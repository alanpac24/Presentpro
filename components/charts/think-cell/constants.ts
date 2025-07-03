export const CHART_CONSTANTS = {
  // Default dimensions
  DEFAULT_WIDTH: 600,
  DEFAULT_HEIGHT: 400,
  
  // Margins for think-cell style (tight but readable)
  MARGINS: {
    top: 40,
    right: 20,
    bottom: 50,
    left: 20,
  },
  
  // Bar styling
  BAR: {
    maxWidthRatio: 0.6, // Max 60% of available space per bar
    minWidth: 30,
    maxWidth: 80,
    gap: 0.3, // 30% gap between bars
    cornerRadius: 0, // Think-cell uses sharp corners
  },
  
  // 3D effect settings (subtle)
  DEPTH_3D: {
    enabled: true,
    offsetX: 2,
    offsetY: -2,
    opacity: 0.3,
  },
  
  // Label positioning
  LABEL: {
    padding: 5,
    minDistanceFromBar: 8,
    deltaArrowSize: 6,
  },
  
  // Connector lines
  CONNECTOR: {
    strokeWidth: 1,
    dashArray: '3,2',
    extend: 5, // Extend beyond bar edges
  },
  
  // Animation
  ANIMATION: {
    duration: 0, // Think-cell doesn't use animations
    easing: 'linear',
  },
  
  // Value formatting
  FORMAT: {
    decimals: 0,
    thousandsSeparator: ',',
    prefix: '',
    suffix: '',
  },
} as const;