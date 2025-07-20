import React from 'react'
import { BaseSlideProps, MetricsSlideData } from './types'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricsSlideProps extends BaseSlideProps {
  data: MetricsSlideData
}

export function MetricsSlide({ data, className = '' }: MetricsSlideProps) {
  const getColorClasses = (color: string = 'blue') => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      orange: 'bg-orange-50 border-orange-200 text-orange-900',
      red: 'bg-red-50 border-red-200 text-red-900'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getTrendIcon = (trend?: string) => {
    if (!trend) return null
    if (trend.includes('+') || trend.toLowerCase().includes('up')) {
      return <TrendingUp className="w-4 h-4" />
    }
    if (trend.includes('-') || trend.toLowerCase().includes('down')) {
      return <TrendingDown className="w-4 h-4" />
    }
    return <Minus className="w-4 h-4" />
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-lg text-gray-600">{data.subtitle}</p>
        )}
        <div className="w-20 h-1 bg-blue-600 mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {data.metrics.map((metric, idx) => (
          <div
            key={idx}
            className={`rounded-xl border-2 p-6 flex flex-col justify-between ${getColorClasses(metric.color)}`}
          >
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {metric.value}
              </div>
              <div className="text-sm md:text-base font-medium opacity-80">
                {metric.label}
              </div>
            </div>
            {metric.trend && (
              <div className="flex items-center mt-4 text-sm">
                {getTrendIcon(metric.trend)}
                <span className="ml-2">{metric.trend}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}