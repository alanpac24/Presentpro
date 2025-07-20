import React from 'react'
import { BaseSlideProps, CostBenefitSlideData } from './types'
import { DollarSign, TrendingUp, Scale } from 'lucide-react'

interface CostBenefitSlideProps extends BaseSlideProps {
  data: CostBenefitSlideData
}

export function CostBenefitSlide({ data, className = '' }: CostBenefitSlideProps) {
  const totalCosts = data.costs.reduce((sum, cost) => sum + cost.amount, 0)
  const totalBenefits = data.benefits.reduce((sum, benefit) => sum + benefit.amount, 0)
  const netBenefit = totalBenefits - totalCosts
  const ratio = totalCosts > 0 ? (totalBenefits / totalCosts).toFixed(2) : '∞'

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
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
        <div className="w-20 h-1 bg-emerald-600 mt-4"></div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Costs */}
        <div className="space-y-3">
          <div className="flex items-center mb-4">
            <DollarSign className="w-6 h-6 text-red-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Costs</h3>
          </div>
          
          {data.costs.map((cost, idx) => (
            <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-red-900">{cost.category}</h4>
                  <p className="text-sm text-red-700 mt-1">{cost.description}</p>
                </div>
                <div className="text-lg font-bold text-red-800 whitespace-nowrap ml-4">
                  {formatCurrency(cost.amount)}
                </div>
              </div>
              {cost.timing && (
                <div className="text-xs text-red-600 mt-2">Timing: {cost.timing}</div>
              )}
            </div>
          ))}
          
          <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-red-900">Total Costs</span>
              <span className="text-xl font-bold text-red-800">{formatCurrency(totalCosts)}</span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Benefits</h3>
          </div>
          
          {data.benefits.map((benefit, idx) => (
            <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-green-900">{benefit.category}</h4>
                  <p className="text-sm text-green-700 mt-1">{benefit.description}</p>
                </div>
                <div className="text-lg font-bold text-green-800 whitespace-nowrap ml-4">
                  {formatCurrency(benefit.amount)}
                </div>
              </div>
              {benefit.timing && (
                <div className="text-xs text-green-600 mt-2">Timing: {benefit.timing}</div>
              )}
            </div>
          ))}
          
          <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-green-900">Total Benefits</span>
              <span className="text-xl font-bold text-green-800">{formatCurrency(totalBenefits)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary metrics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <Scale className="w-8 h-8 text-gray-600 mx-auto mb-2" />
          <div className="text-sm text-gray-600">Net Benefit</div>
          <div className={`text-2xl font-bold ${netBenefit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netBenefit)}
          </div>
        </div>
        
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <div className="text-sm text-blue-600">Benefit-Cost Ratio</div>
          <div className="text-3xl font-bold text-blue-800">{ratio}:1</div>
          <div className="text-xs text-blue-600 mt-1">
            {parseFloat(ratio) > 1 ? 'Favorable' : 'Unfavorable'}
          </div>
        </div>
        
        <div className="bg-purple-100 rounded-lg p-4 text-center">
          <div className="text-sm text-purple-600">ROI</div>
          <div className="text-3xl font-bold text-purple-800">
            {totalCosts > 0 ? ((netBenefit / totalCosts) * 100).toFixed(0) : '∞'}%
          </div>
          <div className="text-xs text-purple-600 mt-1">Return on Investment</div>
        </div>
      </div>
    </div>
  )
}