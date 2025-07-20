import React from 'react'
import { BaseSlideProps, ROICalculationSlideData } from './types'
import { DollarSign, TrendingUp, Calendar } from 'lucide-react'

interface ROICalculationSlideProps extends BaseSlideProps {
  data: ROICalculationSlideData
}

export function ROICalculationSlide({ data, className = '' }: ROICalculationSlideProps) {
  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-lg text-gray-600">{data.subtitle}</p>
        )}
        <div className="w-20 h-1 bg-green-600 mt-4"></div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Investment & Returns */}
        <div className="space-y-4">
          {/* Initial Investment */}
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="font-semibold text-red-900">{data.investment.label}</h3>
            </div>
            <div className="text-3xl font-bold text-red-700">{data.investment.value}</div>
          </div>

          {/* Annual Returns */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Projected Returns</h3>
            <div className="space-y-2">
              {data.returns.map((ret, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-600">{ret.year}</span>
                  <span className="font-semibold text-green-600">{ret.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-4">
          {/* ROI */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-900">Return on Investment</h3>
            </div>
            <div className="text-4xl font-bold text-green-700">{data.metrics.roi}</div>
          </div>

          {/* Payback Period */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Payback Period</h3>
            </div>
            <div className="text-3xl font-bold text-blue-700">{data.metrics.payback}</div>
          </div>

          {/* NPV if available */}
          {data.metrics.npv && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
              <h3 className="font-semibold text-purple-900 mb-1">Net Present Value</h3>
              <div className="text-2xl font-bold text-purple-700">{data.metrics.npv}</div>
            </div>
          )}
        </div>
      </div>

      {/* ROI Visualization */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">Investment</div>
            <div className="text-xl font-bold text-red-600">{data.investment.value}</div>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Returns</div>
            <div className="text-xl font-bold text-green-600">{data.metrics.roi}</div>
          </div>
        </div>
      </div>
    </div>
  )
}