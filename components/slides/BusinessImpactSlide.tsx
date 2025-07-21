import React from 'react'
import { BaseSlideProps, BusinessImpactSlideData } from './types'
import { Target, TrendingDown, TrendingUp, DollarSign } from 'lucide-react'

interface BusinessImpactSlideProps extends BaseSlideProps {
  data: BusinessImpactSlideData
}

export function BusinessImpactSlide({ data, className = '' }: BusinessImpactSlideProps) {
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

      <div className="flex-1 grid gap-4">
        {data.kpis.map((kpi, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                {kpi.name}
              </h3>
              {kpi.improvement && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {kpi.improvement} improvement potential
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Current State */}
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <TrendingDown className="w-5 h-5 text-red-600 mr-1" />
                  <span className="text-sm font-medium text-red-600">Current State</span>
                </div>
                <p className="text-2xl font-bold text-red-700">{kpi.current}</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <div className="w-16 h-0.5 bg-gray-300"></div>
                <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-gray-300"></div>
              </div>

              {/* Ideal State */}
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-1" />
                  <span className="text-sm font-medium text-green-600">Target State</span>
                </div>
                <p className="text-2xl font-bold text-green-700">{kpi.ideal}</p>
              </div>
            </div>

            {kpi.cost && (
              <div className="mt-4 flex items-center justify-center">
                <div className="bg-orange-50 px-4 py-2 rounded-lg flex items-center">
                  <DollarSign className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-orange-700">
                    Cost of Status Quo: {kpi.cost}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-lg text-center">
        <p className="text-sm font-medium text-blue-900">
          Addressing these KPIs can transform your operational efficiency and bottom line
        </p>
      </div>
    </div>
  )
}