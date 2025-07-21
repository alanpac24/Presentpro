import React from 'react'
import { BaseSlideProps, CaseStudySlideData } from './types'
import { Building2, TrendingUp, Clock, Users } from 'lucide-react'

interface CaseStudySlideProps extends BaseSlideProps {
  data: CaseStudySlideData
}

export function CaseStudySlide({ data, className = '' }: CaseStudySlideProps) {
  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {data.title}
        </h2>
        <div className="w-20 h-1 bg-blue-600"></div>
      </div>

      <div className="flex-1 space-y-6">
        {/* Client Info */}
        <div className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <Building2 className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{data.customerName}</h3>
              {data.customerLogo && (
                <img src={data.customerLogo} alt={data.customerName} className="h-8 mt-2" />
              )}
            </div>
          </div>
        </div>

        {/* Challenge & Solution */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-red-900 mb-3">Challenge</h4>
            <p className="text-gray-700">{data.challenge}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-green-900 mb-3">Solution</h4>
            <p className="text-gray-700">{data.solution}</p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-4">Results & Impact</h4>
          <div className="grid md:grid-cols-3 gap-4">
            {data.metrics && data.metrics.map((metric, index) => (
              <div key={index} className="text-center bg-white rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-700">{metric.metric}</div>
                {metric.improvement && (
                  <div className="text-xs text-green-600 mt-1">{metric.improvement}</div>
                )}
              </div>
            ))}
          </div>
          
          {data.quote && (
            <div className="mt-6 border-l-4 border-blue-600 pl-4">
              <p className="text-gray-700 italic">"{data.quote}"</p>
              {data.quoteAuthor && (
                <p className="text-sm text-gray-600 mt-2">
                  — {data.quoteAuthor}
                  {data.quoteTitle && <span>, {data.quoteTitle}</span>}
                </p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}