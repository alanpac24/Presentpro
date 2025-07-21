import React from 'react'
import { BaseSlideProps, ChartSlideData } from './types'
import { BarChart3, LineChart, PieChart } from 'lucide-react'
import { SlideLayout, SlideHeader } from './shared'

interface ChartSlideProps extends BaseSlideProps {
  data: ChartSlideData
}

export function ChartSlide({ data, className = '' }: ChartSlideProps) {
  // Simple chart visualization without D3
  const maxValue = Math.max(...(data.data.datasets[0]?.data || [1]))
  
  const ChartIcon = {
    bar: BarChart3,
    line: LineChart,
    pie: PieChart
  }[data.chartType] || BarChart3

  return (
    <SlideLayout className={className}>
      <SlideHeader 
        title={data.title}
        subtitle={data.subtitle}
      />

      <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-200">
        {data.chartType === 'bar' && (
          <div className="h-full flex flex-col">
            <div className="flex-1 flex items-end justify-around space-x-2 mb-4">
              {data.data.labels.map((label, idx) => {
                const value = data.data.datasets[0]?.data[idx] || 0
                const height = (value / maxValue) * 100
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      {value}
                    </div>
                    <div 
                      className="w-full bg-blue-600 rounded-t-lg transition-all duration-500 hover:bg-blue-700"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex justify-around border-t border-gray-300 pt-2">
              {data.data.labels.map((label, idx) => (
                <div key={idx} className="text-xs text-gray-600 text-center flex-1">
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.chartType === 'line' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <ChartIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Line Chart: {data.data.datasets[0]?.label}</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {data.data.labels.slice(0, 3).map((label, idx) => (
                  <div key={idx}>
                    <div className="text-gray-500">{label}</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {data.data.datasets[0]?.data[idx] || 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {data.chartType === 'pie' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <ChartIcon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Distribution</p>
              <div className="space-y-2">
                {data.data.labels.map((label, idx) => (
                  <div key={idx} className="flex items-center justify-between max-w-xs mx-auto">
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {data.data.datasets[0]?.data[idx] || 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </SlideLayout>
  )
}