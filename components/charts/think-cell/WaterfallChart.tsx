"use client"

import React from 'react';
import { WaterfallChartProps, WaterfallCategory } from './types';
import { THINK_CELL_COLORS, THINK_CELL_FONTS, getColor } from './utils/colors';
import { CHART_CONSTANTS } from './constants';
import { calculateChartDimensions, calculateBarPositions, formatValue } from './utils/scales';

export function WaterfallChart({
  data,
  width = CHART_CONSTANTS.DEFAULT_WIDTH,
  height = CHART_CONSTANTS.DEFAULT_HEIGHT,
  showConnectors = true,
  showDeltas = true,
  showPercentages = false,
  title,
  className = '',
}: WaterfallChartProps) {
  const dimensions = calculateChartDimensions(width, height);
  const barPositions = calculateBarPositions(data, dimensions);
  const { margin, chartWidth, chartHeight } = dimensions;

  // Calculate total for percentage calculations
  const total = barPositions[barPositions.length - 1]?.endValue || 0;

  return (
    <div className={`think-cell-chart ${className}`}>
      <svg 
        width={width} 
        height={height} 
        style={{ 
          backgroundColor: THINK_CELL_COLORS.canvasBackground,
          fontFamily: THINK_CELL_FONTS.family,
        }}
      >
        {/* Title */}
        {title && (
          <text
            x={width / 2}
            y={margin.top / 2}
            textAnchor="middle"
            fontSize={THINK_CELL_FONTS.sizes.title}
            fontWeight={THINK_CELL_FONTS.weights.medium}
            fill={THINK_CELL_COLORS.labelPrimary}
          >
            {title}
          </text>
        )}

        {/* Chart area */}
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Background */}
          <rect
            x={0}
            y={0}
            width={chartWidth}
            height={chartHeight}
            fill={THINK_CELL_COLORS.chartBackground}
            stroke="none"
          />

          {/* X-axis line (no other grid lines for think-cell style) */}
          <line
            x1={0}
            y1={chartHeight}
            x2={chartWidth}
            y2={chartHeight}
            stroke={THINK_CELL_COLORS.axis}
            strokeWidth={1}
          />

          {/* Bars and connectors */}
          {barPositions.map((bar, index) => {
            const nextBar = barPositions[index + 1];
            const barColor = THINK_CELL_COLORS[bar.category] || THINK_CELL_COLORS.increase;

            return (
              <g key={index}>
                {/* 3D effect (subtle) */}
                {CHART_CONSTANTS.DEPTH_3D.enabled && (
                  <rect
                    x={bar.x + CHART_CONSTANTS.DEPTH_3D.offsetX}
                    y={bar.y + CHART_CONSTANTS.DEPTH_3D.offsetY}
                    width={bar.width}
                    height={bar.height}
                    fill={getColor('shadowColor')}
                    opacity={CHART_CONSTANTS.DEPTH_3D.opacity}
                  />
                )}

                {/* Main bar */}
                <rect
                  x={bar.x}
                  y={bar.y}
                  width={bar.width}
                  height={bar.height}
                  fill={barColor}
                  stroke={THINK_CELL_COLORS.barStroke}
                  strokeWidth={THINK_CELL_COLORS.barStrokeWidth}
                />

                {/* Connector line to next bar */}
                {showConnectors && nextBar && 
                 bar.category !== 'total' && 
                 nextBar.category !== 'total' && (
                  <line
                    x1={bar.x + bar.width + CHART_CONSTANTS.CONNECTOR.extend}
                    y1={bar.y + (bar.endValue < bar.startValue ? bar.height : 0)}
                    x2={nextBar.x - CHART_CONSTANTS.CONNECTOR.extend}
                    y2={nextBar.y + (nextBar.startValue < bar.endValue ? nextBar.height : 0)}
                    stroke={THINK_CELL_COLORS.connector}
                    strokeWidth={CHART_CONSTANTS.CONNECTOR.strokeWidth}
                    strokeDasharray={CHART_CONSTANTS.CONNECTOR.dashArray}
                  />
                )}

                {/* Value label */}
                <text
                  x={bar.x + bar.width / 2}
                  y={bar.y - CHART_CONSTANTS.LABEL.minDistanceFromBar}
                  textAnchor="middle"
                  fontSize={THINK_CELL_FONTS.sizes.value}
                  fill={THINK_CELL_COLORS.labelPrimary}
                  fontWeight={THINK_CELL_FONTS.weights.medium}
                >
                  {formatValue(bar.value)}
                </text>

                {/* Delta indicator */}
                {showDeltas && index > 0 && bar.category !== 'total' && bar.category !== 'subtotal' && (
                  <g>
                    {/* Arrow */}
                    <path
                      d={bar.value >= 0 
                        ? `M ${bar.x + bar.width + 10} ${bar.y + bar.height / 2} l 5 -5 l 0 3 l 8 0 l 0 4 l -8 0 l 0 3 z`
                        : `M ${bar.x + bar.width + 10} ${bar.y + bar.height / 2} l 5 5 l 0 -3 l 8 0 l 0 -4 l -8 0 l 0 -3 z`
                      }
                      fill={barColor}
                      opacity={0.7}
                    />
                    {/* Delta value */}
                    <text
                      x={bar.x + bar.width + 28}
                      y={bar.y + bar.height / 2 + 4}
                      fontSize={THINK_CELL_FONTS.sizes.value - 1}
                      fill={THINK_CELL_COLORS.labelSecondary}
                    >
                      {bar.value >= 0 ? '+' : ''}{formatValue(bar.value)}
                    </text>
                  </g>
                )}

                {/* Percentage (if enabled) */}
                {showPercentages && total !== 0 && (
                  <text
                    x={bar.x + bar.width / 2}
                    y={bar.y + bar.height / 2}
                    textAnchor="middle"
                    fontSize={THINK_CELL_FONTS.sizes.value - 1}
                    fill="#FFFFFF"
                    fontWeight={THINK_CELL_FONTS.weights.normal}
                  >
                    {((bar.value / total) * 100).toFixed(1)}%
                  </text>
                )}

                {/* Category label */}
                <text
                  x={bar.x + bar.width / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  fontSize={THINK_CELL_FONTS.sizes.label}
                  fill={THINK_CELL_COLORS.labelPrimary}
                >
                  {bar.label}
                </text>
              </g>
            );
          })}

          {/* Zero line (if scale includes negative values) */}
          {barPositions.some(b => b.startValue < 0 || b.endValue < 0) && (
            <line
              x1={0}
              y1={chartHeight}
              x2={chartWidth}
              y2={chartHeight}
              stroke={THINK_CELL_COLORS.axis}
              strokeWidth={1}
              strokeDasharray="2,2"
            />
          )}
        </g>
      </svg>
    </div>
  );
}