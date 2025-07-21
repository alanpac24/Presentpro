import React from 'react'
import { BaseSlideProps, IndustryTrendsSlideData } from './types'
import { TrendingUp, BarChart3, ExternalLink } from 'lucide-react'

interface IndustryTrendsSlideProps extends BaseSlideProps {
  data: IndustryTrendsSlideData
}

export function IndustryTrendsSlide({ data, className = '' }: IndustryTrendsSlideProps) {
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

      <div className="flex-1 space-y-4">
        {data.trends.map((trend, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-r from-blue-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {trend.trend}
                </h3>
                
                <p className="text-gray-700 mb-3">
                  {trend.impact}
                </p>
                
                {trend.statistic && (
                  <div className="flex items-center bg-white rounded-lg px-4 py-2 inline-flex">
                    <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="font-bold text-blue-600 text-lg">{trend.statistic}</span>
                  </div>
                )}
                
                {trend.source && (
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    <span>Source: {trend.source}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 font-medium">
          These trends directly impact your business strategy and technology decisions
        </p>
      </div>
    </div>
  )
}