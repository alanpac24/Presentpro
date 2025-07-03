// Think-cell inspired color palette
export const THINK_CELL_COLORS = {
  // Primary colors for data
  increase: '#5B9BD5', // Muted blue for positive values
  decrease: '#ED7D31', // Muted orange for negative values
  total: '#70AD47',    // Muted green for totals
  subtotal: '#A5A5A5', // Gray for subtotals
  
  // Chart structure colors
  axis: '#666666',
  gridLine: '#E7E6E6',
  connector: '#A6A6A6',
  
  // Text colors
  labelPrimary: '#404040',
  labelSecondary: '#666666',
  
  // Bar effects
  barStroke: '#FFFFFF',
  barStrokeWidth: 0.5,
  
  // 3D effect colors (subtle)
  shadowColor: 'rgba(0, 0, 0, 0.1)',
  highlightColor: 'rgba(255, 255, 255, 0.3)',
  
  // Background
  chartBackground: '#FFFFFF',
  canvasBackground: '#FAFAFA',
} as const;

// Professional font settings
export const THINK_CELL_FONTS = {
  family: 'Arial, sans-serif',
  sizes: {
    title: 14,
    label: 11,
    value: 11,
    axis: 10,
  },
  weights: {
    normal: 400,
    medium: 500,
    bold: 600,
  },
} as const;

// Get color with optional opacity
export function getColor(colorKey: keyof typeof THINK_CELL_COLORS, opacity?: number): string {
  const value = THINK_CELL_COLORS[colorKey];
  
  // Check if the value is a string (color value)
  if (typeof value !== 'string') {
    return String(value);
  }
  
  const color = value;
  
  if (opacity !== undefined && opacity < 1 && color.startsWith('#')) {
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  return color;
}