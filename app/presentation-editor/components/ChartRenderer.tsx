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
      data?: Array<{
        category?: string
        name?: string
        value: number
        series?: string
        type?: 'positive' | 'negative' | 'start' | 'end'
      }>
      labels?: string[]
      datasets?: Array<{
        label: string
        data: number[]
        backgroundColor?: string | string[]
        borderColor?: string | string[]
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
  const hasValidData = element.chartData.data && element.chartData.data.length > 0
  const hasValidDatasets = element.chartData.datasets && element.chartData.datasets.length > 0
  
  if (!hasValidData && !hasValidDatasets) {
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
            data={element.chartData.data.map(item => ({
              category: item.category || item.name || '',
              value: item.value,
              series: item.series
            }))}
            width={element.size.width - 32}
            height={element.size.height - 32}
            type="single"
          />
        )}
        {element.chartType === 'bar-grouped' && element.chartData?.data && (
          <ProfessionalBarChartD3
            data={element.chartData.data.map(item => ({
              category: item.category || item.name || '',
              value: item.value,
              series: item.series
            }))}
            width={element.size.width - 32}
            height={element.size.height - 32}
            type="grouped"
          />
        )}
        {element.chartType === 'bar-stacked' && element.chartData?.data && (
          <ProfessionalBarChartD3
            data={element.chartData.data.map(item => ({
              category: item.category || item.name || '',
              value: item.value,
              series: item.series
            }))}
            width={element.size.width - 32}
            height={element.size.height - 32}
            type="stacked"
          />
        )}
        {element.chartType === 'waterfall' && element.chartData?.data && (
          <WaterfallChartD3
            data={element.chartData.data.map((item, index, arr) => ({
              name: item.category || item.name || `Item ${index + 1}`,
              value: item.value,
              type: item.type || (index === 0 ? 'start' : 
                    index === arr.length - 1 ? 'end' : 
                    item.value >= 0 ? 'positive' : 'negative') as 'start' | 'positive' | 'negative' | 'end'
            }))}
            width={element.size.width - 32}
            height={element.size.height - 32}
          />
        )}
        {element.chartType === 'line' && element.chartData?.data && (
          <LineChartD3
            data={element.chartData.data.map(item => ({
              category: item.category || item.name || '',
              value: item.value,
              series: item.series
            }))}
            width={element.size.width - 32}
            height={element.size.height - 32}
            showPoints={true}
            curved={true}
          />
        )}
        {element.chartType === 'pie' && element.chartData?.data && (
          <PieChartD3
            data={element.chartData.data.map(item => ({
              category: item.category || item.name || '',
              value: item.value
            }))}
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