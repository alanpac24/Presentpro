import React from 'react'
import { BaseSlideProps, BenchmarkSlideData } from './types'
import { BarChart3, TrendingUp, Award } from 'lucide-react'

interface BenchmarkSlideProps extends BaseSlideProps {
  data: BenchmarkSlideData
}

export function BenchmarkSlide({ data, className = '' }: BenchmarkSlideProps) {
  const maxValue = Math.max(...data.metrics.flatMap(m => [m.us, m.benchmark, m.bestInClass]))
  
  const getBarWidth = (value: number) => {
    return `${(value / maxValue) * 100}%`
  }

  const getBarColor = (type: 'us' | 'benchmark' | 'bestInClass') => {
    switch (type) {
      case 'us': return 'bg-blue-600'
      case 'benchmark': return 'bg-gray-400'
      case 'bestInClass': return 'bg-green-600'
    }
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-lg text-gray-600">{data.subtitle}</p>
        )}
        <div className="w-20 h-1 bg-teal-600 mt-4"></div>
      </div>

      <div className="flex-1 space-y-6 overflow-auto">
        {data.metrics.map((metric, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 text-gray-600 mr-2" />
              {metric.category}
            </h3>

            <div className="space-y-3">
              {/* Us */}
              <div className="flex items-center">
                <div className="w-24 text-sm text-gray-600">Us</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className={`${getBarColor('us')} h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium`}
                    style={{ width: getBarWidth(metric.us) }}
                  >
                    {metric.us}{metric.unit || ''}
                  </div>
                </div>
              </div>

              {/* Benchmark */}
              <div className="flex items-center">
                <div className="w-24 text-sm text-gray-600">Industry Avg</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className={`${getBarColor('benchmark')} h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium`}
                    style={{ width: getBarWidth(metric.benchmark) }}
                  >
                    {metric.benchmark}{metric.unit || ''}
                  </div>
                </div>
              </div>

              {/* Best in Class */}
              <div className="flex items-center">
                <div className="w-24 text-sm text-gray-600 flex items-center">
                  Best in Class
                  <Award className="w-3 h-3 text-yellow-500 ml-1" />
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className={`${getBarColor('bestInClass')} h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-medium`}
                    style={{ width: getBarWidth(metric.bestInClass) }}
                  >
                    {metric.bestInClass}{metric.unit || ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Gap analysis */}
            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="text-gray-600">
                Gap to benchmark: 
                <span className={`ml-1 font-medium ${metric.us < metric.benchmark ? 'text-red-600' : 'text-green-600'}`}>
                  {Math.abs(metric.us - metric.benchmark).toFixed(1)}{metric.unit || ''}
                  {metric.us >= metric.benchmark && <TrendingUp className="w-3 h-3 inline ml-1" />}
                </span>
              </div>
              <div className="text-gray-600">
                Gap to best: 
                <span className="ml-1 font-medium text-orange-600">
                  {(metric.bestInClass - metric.us).toFixed(1)}{metric.unit || ''}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {data.insights && data.insights.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Key Insights</h4>
          <ul className="space-y-1">
            {data.insights.map((insight, idx) => (
              <li key={idx} className="text-sm text-blue-800 flex items-start">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}