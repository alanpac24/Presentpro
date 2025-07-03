import { WaterfallDataPoint, ChartDimensions, BarPosition } from '../types';
import { CHART_CONSTANTS } from '../constants';

export function calculateChartDimensions(
  width: number = CHART_CONSTANTS.DEFAULT_WIDTH,
  height: number = CHART_CONSTANTS.DEFAULT_HEIGHT
): ChartDimensions {
  const margin = CHART_CONSTANTS.MARGINS;
  return {
    width,
    height,
    margin,
    chartWidth: width - margin.left - margin.right,
    chartHeight: height - margin.top - margin.bottom,
  };
}

export function calculateBarPositions(
  data: WaterfallDataPoint[],
  dimensions: ChartDimensions
): BarPosition[] {
  const { chartWidth, chartHeight } = dimensions;
  
  // Calculate cumulative values
  let cumulative = 0;
  const positions: BarPosition[] = [];
  
  // Find min and max values for scale
  let minValue = 0;
  let maxValue = 0;
  let tempCumulative = 0;
  
  data.forEach((point) => {
    const category = point.category || (point.value >= 0 ? 'increase' : 'decrease');
    
    if (category === 'total' || category === 'subtotal') {
      // Totals show the cumulative value
      minValue = Math.min(minValue, 0);
      maxValue = Math.max(maxValue, tempCumulative);
    } else {
      // Regular bars
      const startValue = tempCumulative;
      const endValue = tempCumulative + point.value;
      minValue = Math.min(minValue, startValue, endValue);
      maxValue = Math.max(maxValue, startValue, endValue);
      tempCumulative = endValue;
    }
  });
  
  // Add padding to scale
  const valueRange = maxValue - minValue;
  const padding = valueRange * 0.1;
  const scaleMin = minValue - padding;
  const scaleMax = maxValue + padding;
  const scaleRange = scaleMax - scaleMin;
  
  // Calculate bar width
  const barCount = data.length;
  const totalGapRatio = CHART_CONSTANTS.BAR.gap * (barCount - 1);
  const availableWidth = chartWidth / (barCount + totalGapRatio);
  const barWidth = Math.min(
    Math.max(availableWidth, CHART_CONSTANTS.BAR.minWidth),
    CHART_CONSTANTS.BAR.maxWidth
  );
  const actualTotalWidth = barWidth * barCount + barWidth * CHART_CONSTANTS.BAR.gap * (barCount - 1);
  const startX = (chartWidth - actualTotalWidth) / 2;
  
  // Create scale function
  const yScale = (value: number) => {
    return chartHeight - ((value - scaleMin) / scaleRange) * chartHeight;
  };
  
  // Calculate positions
  cumulative = 0;
  data.forEach((point, index) => {
    const category = point.category || (point.value >= 0 ? 'increase' : 'decrease');
    const x = startX + index * (barWidth * (1 + CHART_CONSTANTS.BAR.gap));
    
    let startValue: number;
    let endValue: number;
    
    if (category === 'total' || category === 'subtotal') {
      // Total bars go from 0 to cumulative
      startValue = 0;
      endValue = cumulative;
    } else {
      // Regular bars
      startValue = cumulative;
      endValue = cumulative + point.value;
      cumulative = endValue;
    }
    
    const y = Math.min(yScale(startValue), yScale(endValue));
    const height = Math.abs(yScale(endValue) - yScale(startValue));
    
    positions.push({
      x,
      y,
      width: barWidth,
      height,
      value: point.value,
      startValue,
      endValue,
      category,
      label: point.label,
      index,
    });
  });
  
  return positions;
}

export function formatValue(value: number, decimals: number = 0): string {
  const formatted = value.toFixed(decimals);
  // Add thousands separator
  return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function calculateDelta(current: number, previous: number): string {
  const delta = current - previous;
  const prefix = delta >= 0 ? '+' : '';
  return prefix + formatValue(delta);
}