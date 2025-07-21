import React from 'react'
import { BaseSlideProps, CustomerVoiceSlideData } from './types'
import { Quote, Users, AlertCircle } from 'lucide-react'

interface CustomerVoiceSlideProps extends BaseSlideProps {
  data: CustomerVoiceSlideData
}

export function CustomerVoiceSlide({ data, className = '' }: CustomerVoiceSlideProps) {
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

      <div className="flex-1 grid md:grid-cols-2 gap-6">
        {/* Customer Quotes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
            <Quote className="w-5 h-5 mr-2 text-blue-600" />
            What We Heard
          </h3>
          {data.customerQuotes.map((quote, index) => (
            <div key={index} className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
              <p className="text-gray-700 italic">"{quote}"</p>
            </div>
          ))}
        </div>

        {/* Pain Points */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-3">
            <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
            Key Pain Points
          </h3>
          {data.painPoints.map((point, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="font-semibold text-gray-900 mb-1">
                {point.functionalArea}
              </div>
              <div className="text-sm text-gray-700 mb-2">
                {point.challenge}
              </div>
              <div className="text-xs text-red-600 font-medium">
                Impact: {point.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stakeholders */}
      {data.stakeholders && data.stakeholders.length > 0 && (
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span className="font-medium mr-2">Key Stakeholders:</span>
            {data.stakeholders.map((stakeholder, index) => (
              <span key={index} className="mr-3">
                <span className="font-semibold">{stakeholder.name}</span>
                <span className="text-gray-500"> ({stakeholder.role})</span>
                {index < data.stakeholders!.length - 1 && ','}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}