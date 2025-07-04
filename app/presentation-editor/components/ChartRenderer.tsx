'use client'

import React from 'react'
import { BarChart3 } from 'lucide-react'
import { SimpleChart, ChartData } from '@/components/charts/SimpleChart'

interface ChartRendererProps {
  element: {
    id: string
    chartType?: string
    chartData?: {
      data?: Array<{
        category?: string
        name?: string
        value: number
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
  if (!element.chartType || !element.chartData?.data) {
    return (
      <div 
        className="flex items-center justify-center h-full bg-gray-100"
        onDoubleClick={() => onDoubleClick(element.id)}
      >
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Double-click to add data</p>
        </div>
      </div>
    )
  }

  // Convert data to SimpleChart format
  const chartData: ChartData[] = element.chartData.data.map(item => ({
    label: item.category || item.name || 'Item',
    value: item.value
  }))

  // Map chart types
  const chartTypeMap: Record<string, 'bar' | 'line' | 'pie'> = {
    bar: 'bar',
    line: 'line',
    pie: 'pie',
    waterfall: 'bar', // Simplify waterfall to bar
    column: 'bar'
  }

  const simpleChartType = chartTypeMap[element.chartType] || 'bar'

  return (
    <div 
      className="w-full h-full flex items-center justify-center"
      style={{
        backgroundColor: element.style.backgroundColor,
        borderRadius: `${element.style.borderRadius}px`,
        borderWidth: `${element.style.borderWidth}px`,
        borderColor: element.style.borderColor,
        borderStyle: 'solid'
      }}
      onDoubleClick={() => onDoubleClick(element.id)}
    >
      <SimpleChart
        type={simpleChartType}
        data={chartData}
        width={element.size.width - 40}
        height={element.size.height - 40}
      />
    </div>
  )
}