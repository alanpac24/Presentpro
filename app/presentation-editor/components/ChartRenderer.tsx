'use client'

import React from 'react'
import { BarChart3 } from 'lucide-react'
import { WaterfallChartD3 } from '@/components/charts/think-cell-d3/WaterfallChartD3'
import { ProfessionalBarChartD3 } from '@/components/charts/think-cell-d3/ProfessionalBarChartD3'
import { LineChartD3 } from '@/components/charts/think-cell-d3/LineChartD3'
import { PieChartD3 } from '@/components/charts/think-cell-d3/PieChartD3'

interface ChartRendererProps {
  element: {
    id: string
    chartType?: string
    chartData?: {
      data: Array<{
        category: string
        value: number
        series?: string
      }>
    }
    size: {
      width: number
      height: number
    }
    style: {
      backgroundColor: string
      borderRadius: number
      borderWidth: number
      borderColor: string
    }
  }
  onDoubleClick: (elementId: string) => void
}

export function ChartRenderer({ element, onDoubleClick }: ChartRendererProps) {
  if (!element.chartType || !element.chartData) return null

  // Validate chart data - D3 charts use data array instead of labels/datasets
  if (!element.chartData.data || element.chartData.data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-50 rounded">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Invalid chart data</p>
          <p className="text-xs text-gray-400 mt-1">Double-click to edit</p>
        </div>
      </div>
    )
  }

  const chartStyle = {
    width: '100%',
    height: '100%',
    padding: '16px',
    backgroundColor: element.style.backgroundColor,
    borderRadius: `${element.style.borderRadius}px`,
    border: element.style.borderWidth > 0 ? `${element.style.borderWidth}px solid ${element.style.borderColor}` : 'none',
  }

  try {
    return (
      <div 
        className="w-full h-full relative group cursor-pointer" 
        style={chartStyle}
        data-chart-element="true"
        onDoubleClick={(e) => {
          e.stopPropagation()
          onDoubleClick(element.id)
        }}
      >
        {element.chartType === 'bar' && element.chartData?.data && (
          <ProfessionalBarChartD3
            data={element.chartData.data}
            width={element.size.width - 32}
            height={element.size.height - 32}
            type="single"
          />
        )}
        {element.chartType === 'bar-grouped' && element.chartData?.data && (
          <ProfessionalBarChartD3
            data={element.chartData.data}
            width={element.size.width - 32}
            height={element.size.height - 32}
            type="grouped"
          />
        )}
        {element.chartType === 'bar-stacked' && element.chartData?.data && (
          <ProfessionalBarChartD3
            data={element.chartData.data}
            width={element.size.width - 32}
            height={element.size.height - 32}
            type="stacked"
          />
        )}
        {element.chartType === 'waterfall' && element.chartData?.data && (
          <WaterfallChartD3
            data={element.chartData.data}
            width={element.size.width - 32}
            height={element.size.height - 32}
          />
        )}
        {element.chartType === 'line' && element.chartData?.data && (
          <LineChartD3
            data={element.chartData.data}
            width={element.size.width - 32}
            height={element.size.height - 32}
            showPoints={true}
            curved={true}
          />
        )}
        {element.chartType === 'pie' && element.chartData?.data && (
          <PieChartD3
            data={element.chartData.data}
            width={element.size.width - 32}
            height={element.size.height - 32}
            showLabels={true}
            showPercentages={true}
            donut={false}
          />
        )}
        {/* Hover overlay hint */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200 flex items-center justify-center">
          <span className="text-xs text-gray-700 bg-white px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Double-click to edit data
          </span>
        </div>
      </div>
    )
  } catch (error) {
    // Log chart rendering error - in production, send to error tracking
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-50 rounded">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Error rendering chart</p>
          <p className="text-xs text-gray-400 mt-1">Double-click to edit</p>
        </div>
      </div>
    )
  }
}