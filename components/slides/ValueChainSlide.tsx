import React from 'react'
import { BaseSlideProps, ValueChainSlideData } from './types'
import { ArrowRight } from 'lucide-react'

interface ValueChainSlideProps extends BaseSlideProps {
  data: ValueChainSlideData
}

export function ValueChainSlide({ data, className = '' }: ValueChainSlideProps) {
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

      <div className="flex-1 flex flex-col space-y-4">
        {/* Support Activities */}
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Support Activities</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {data.supportActivities.map((activity, idx) => (
              <div key={idx} className="bg-white rounded p-3 text-center">
                <div className="font-medium text-gray-900 text-sm mb-1">{activity.name}</div>
                <div className="text-xs text-gray-600">{activity.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Activities */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Primary Activities</h3>
          <div className="flex-1 flex items-center">
            <div className="flex w-full items-center justify-between">
              {data.primaryActivities.map((activity, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex-1 group">
                    <div className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                      <div className="font-semibold mb-2">{activity.name}</div>
                      <div className="text-sm opacity-90">{activity.description}</div>
                    </div>
                  </div>
                  {idx < data.primaryActivities.length - 1 && (
                    <ArrowRight className="w-8 h-8 text-blue-600 mx-2 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Margin Arrow */}
        <div className="flex justify-end items-center pt-4">
          <div className="flex items-center">
            <ArrowRight className="w-6 h-6 text-green-600 mr-2" />
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
              Margin
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}