export type WaterfallCategory = 'increase' | 'decrease' | 'total' | 'subtotal';

export interface WaterfallDataPoint {
  label: string;
  value: number;
  category?: WaterfallCategory;
}

export interface WaterfallChartProps {
  data: WaterfallDataPoint[];
  width?: number;
  height?: number;
  showConnectors?: boolean;
  showDeltas?: boolean;
  showPercentages?: boolean;
  title?: string;
  className?: string;
}

export interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  chartWidth: number;
  chartHeight: number;
}

export interface BarPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  startValue: number;
  endValue: number;
  category: WaterfallCategory;
  label: string;
  index: number;
}