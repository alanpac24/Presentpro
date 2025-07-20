import React from 'react'
import { BaseSlideProps, WaterfallChartSlideData } from './types'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface WaterfallChartSlideProps extends BaseSlideProps {
  data: WaterfallChartSlideData
}

export function WaterfallChartSlide({ data, className = '' }: WaterfallChartSlideProps) {
  // Calculate cumulative values
  let cumulative = 0
  const processedItems = data.items.map(item => {
    if (item.type === 'start') {
      cumulative = item.value
      return { ...item, start: 0, end: item.value }
    } else if (item.type === 'end') {
      return { ...item, start: 0, end: item.value }
    } else {
      const start = cumulative
      cumulative += item.value
      return { ...item, start, end: cumulative }
    }
  })

  const maxValue = Math.max(...processedItems.map(item => Math.max(item.start || 0, item.end || 0)))
  const minValue = Math.min(...processedItems.map(item => Math.min(item.start || 0, item.end || 0)))
  const range = maxValue - minValue
  const baselineY = minValue < 0 ? Math.abs(minValue) / range * 100 : 0

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-lg text-gray-600">{data.subtitle}</p>
        )}
        <div className="w-20 h-1 bg-blue-600 mt-4"></div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-50 rounded-lg p-6">
          <div className="h-full flex items-end justify-around space-x-2">
            {processedItems.map((item, idx) => {
              const height = Math.abs(item.value) / range * 80
              const bottom = ((item.start || 0) - minValue) / range * 80
              const isNegative = item.value < 0
              
              let barColor = 'bg-gray-600'
              if (item.type === 'start' || item.type === 'end') barColor = 'bg-blue-600'
              else if (item.type === 'increase') barColor = 'bg-green-600'
              else if (item.type === 'decrease') barColor = 'bg-red-600'

              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  {/* Value label */}
                  <div className="mb-2 text-sm font-semibold text-gray-700">
                    {isNegative ? '-' : '+'}{data.units || ''}{Math.abs(item.value).toLocaleString()}
                  </div>
                  
                  {/* Bar container */}
                  <div className="relative w-full h-64">
                    {/* Connecting line */}
                    {idx > 0 && idx < processedItems.length - 1 && (
                      <div 
                        className="absolute left-1/2 border-l-2 border-dashed border-gray-400"
                        style={{
                          bottom: `${bottom}%`,
                          height: '2px',
                          width: '100%',
                          transform: 'translateX(-50%)'
                        }}
                      />
                    )}
                    
                    {/* Bar */}
                    <div 
                      className={`absolute bottom-0 left-1/4 right-1/4 ${barColor} rounded-t transition-all duration-500 flex items-center justify-center`}
                      style={{
                        height: `${height}%`,
                        bottom: `${bottom}%`
                      }}
                    >
                      {item.type === 'increase' && <TrendingUp className="w-4 h-4 text-white" />}
                      {item.type === 'decrease' && <TrendingDown className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                  
                  {/* Label */}
                  <div className="mt-4 text-xs text-gray-600 text-center">
                    {item.label}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Baseline */}
          {minValue < 0 && (
            <div 
              className="absolute left-0 right-0 border-t-2 border-gray-400"
              style={{ bottom: `${baselineY}%` }}
            />
          )}
        </div>
      </div>
    </div>
  )
}