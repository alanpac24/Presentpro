import React from 'react'
import { BaseSlideProps, ValuePropSlideData } from './types'
import { Gem, Target, Rocket, BarChart3 } from 'lucide-react'

interface ValuePropSlideProps extends BaseSlideProps {
  data: ValuePropSlideData
}

export function ValuePropSlide({ data, className = '' }: ValuePropSlideProps) {
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

      {/* Main Value Statement */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-8 mb-6 shadow-lg">
        <div className="flex items-center mb-4">
          <Gem className="w-10 h-10 mr-3" />
          <h3 className="text-2xl font-bold">Our Value Proposition</h3>
        </div>
        <p className="text-xl leading-relaxed">{data.mainValue}</p>
      </div>

      <div className="flex-1 grid md:grid-cols-3 gap-4">
        {/* Value Pillars */}
        {data.valuePillars.map((pillar, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                {index === 0 && <Target className="w-5 h-5 text-blue-600" />}
                {index === 1 && <Rocket className="w-5 h-5 text-blue-600" />}
                {index === 2 && <BarChart3 className="w-5 h-5 text-blue-600" />}
              </div>
              <h4 className="font-semibold text-gray-900">{pillar.pillar}</h4>
            </div>
            <p className="text-sm text-gray-700 mb-3">{pillar.description}</p>
            {pillar.metrics && pillar.metrics.length > 0 && (
              <div className="space-y-1">
                {pillar.metrics.map((metric, mIndex) => (
                  <div key={mIndex} className="bg-blue-50 rounded px-3 py-1 text-xs text-blue-700">
                    {metric}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Before/After Comparison */}
      {data.beforeAfter && (
        <div className="mt-6 bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">The Transformation</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-lg p-4">
              <h5 className="font-semibold text-red-900 mb-2">Before</h5>
              <ul className="space-y-2">
                {data.beforeAfter.before.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="font-semibold text-green-900 mb-2">After</h5>
              <ul className="space-y-2">
                {data.beforeAfter.after.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Unique Selling Point */}
      {data.uniqueSellingPoint && (
        <div className="mt-4 text-center">
          <p className="text-sm font-medium text-blue-600 italic">
            "{data.uniqueSellingPoint}"
          </p>
        </div>
      )}
    </div>
  )
}