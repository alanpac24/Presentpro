import React from 'react'
import { BaseSlideProps, QuickWinsSlideData } from './types'
import { Zap, Target, User } from 'lucide-react'

interface QuickWinsSlideProps extends BaseSlideProps {
  data: QuickWinsSlideData
}

export function QuickWinsSlide({ data, className = '' }: QuickWinsSlideProps) {
  const timeframeColors = {
    '30 days': 'bg-green-600',
    '60 days': 'bg-blue-600',
    '90 days': 'bg-purple-600',
    'Immediate': 'bg-red-600',
    'Week 1': 'bg-orange-600'
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
        <div className="w-20 h-1 bg-orange-600 mt-4"></div>
      </div>

      <div className="flex-1 space-y-6 overflow-auto">
        {(data.timeframes || []).map((timeframe, idx) => {
          const bgColor = timeframeColors[timeframe.period as keyof typeof timeframeColors] || 'bg-gray-600'
          
          return (
            <div key={idx} className="space-y-3">
              {/* Timeframe header */}
              <div className="flex items-center">
                <div className={`${bgColor} text-white px-4 py-2 rounded-lg font-semibold flex items-center`}>
                  <Zap className="w-4 h-4 mr-2" />
                  {timeframe.period}
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 ml-4"></div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-4">
                {timeframe.actions.map((action, actionIdx) => (
                  <div key={actionIdx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-2">
                      <Target className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{action.action}</h4>
                      </div>
                    </div>
                    
                    <div className="ml-7 space-y-2">
                      <div className="flex items-center text-sm">
                        <span className="text-gray-500">Impact:</span>
                        <span className="ml-2 font-medium text-green-600">{action.impact}</span>
                      </div>
                      
                      {action.owner && (
                        <div className="flex items-center text-sm">
                          <User className="w-3 h-3 text-gray-400 mr-1" />
                          <span className="text-gray-600">{action.owner}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary bar */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Total Quick Wins: <span className="font-semibold text-gray-900">
              {data.timeframes.reduce((sum, tf) => sum + tf.actions.length, 0)}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {(data.timeframes || []).map((timeframe, idx) => {
              const bgColor = timeframeColors[timeframe.period as keyof typeof timeframeColors] || 'bg-gray-600'
              return (
                <div key={idx} className="flex items-center">
                  <div className={`w-3 h-3 ${bgColor} rounded-full mr-2`}></div>
                  <span className="text-sm text-gray-600">{timeframe.actions.length} in {timeframe.period}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}