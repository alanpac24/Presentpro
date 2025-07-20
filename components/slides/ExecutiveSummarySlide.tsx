import React from 'react'
import { BaseSlideProps, ExecutiveSummarySlideData } from './types'
import { ArrowRight, TrendingUp } from 'lucide-react'

interface ExecutiveSummarySlideProps extends BaseSlideProps {
  data: ExecutiveSummarySlideData
}

export function ExecutiveSummarySlide({ data, className = '' }: ExecutiveSummarySlideProps) {
  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {data.title}
        </h2>
        <div className="w-20 h-1 bg-blue-600"></div>
      </div>

      {/* Key Message Box */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
        <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-2">
          Key Message
        </h3>
        <p className="text-lg text-blue-800">
          {data.keyMessage}
        </p>
      </div>

      {/* Supporting Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {data.supportingPoints.map((point, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{point.label}</span>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {point.value}
            </div>
            <p className="text-sm text-gray-600">
              {point.description}
            </p>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="mt-auto bg-gray-50 rounded-lg p-6">
        <div className="flex items-start">
          <ArrowRight className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Recommendation</h4>
            <p className="text-gray-700">{data.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  )
}