import React from 'react'
import { BaseSlideProps, ROISlideData } from './types'
import { TrendingUp, DollarSign, Clock, PiggyBank, ArrowUp, BarChart3 } from 'lucide-react'
import { SlideLayout, SlideHeader } from './shared'

interface ROISlideProps extends BaseSlideProps {
  data: ROISlideData
}

export function ROISlide({ data, className = '' }: ROISlideProps) {
  // Add defensive checks
  const totalInvestment = data.totalInvestment || {
    software: '$0',
    implementation: '$0',
    training: '$0'
  }
  const annualSavings = data.annualSavings || []
  const additionalBenefits = data.additionalBenefits || []
  const assumptions = data.assumptions || []

  return (
    <SlideLayout className={className}>
      <SlideHeader 
        title={data.title}
        subtitle={data.subtitle}
      />

      <div className="flex-1 grid md:grid-cols-2 gap-6">
        {/* Left side - Investment & Savings */}
        <div className="space-y-4">
          {/* Total Investment */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-gray-600" />
              Total Investment
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Software License</span>
                <span className="font-semibold">{totalInvestment.software}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Implementation</span>
                <span className="font-semibold">{totalInvestment.implementation}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Training</span>
                <span className="font-semibold">{totalInvestment.training}</span>
              </div>
              {totalInvestment.firstYearTotal && (
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">First Year Total</span>
                    <span className="font-bold text-xl text-gray-900">{totalInvestment.firstYearTotal}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Annual Savings */}
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PiggyBank className="w-5 h-5 mr-2 text-green-600" />
              Annual Savings
            </h3>
            <div className="space-y-3">
              {annualSavings.map((saving, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700">{saving.category}</span>
                    <span className="font-semibold text-green-600">{saving.amount}</span>
                  </div>
                  {saving.description && (
                    <p className="text-xs text-gray-600">{saving.description}</p>
                  )}
                </div>
              ))}
              {data.totalAnnualSavings && (
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Annual Savings</span>
                    <span className="font-bold text-xl text-green-600">{data.totalAnnualSavings}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Key Metrics */}
        <div className="space-y-4">
          {/* Payback Period */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-900">Payback Period</h4>
            <p className="text-3xl font-bold text-blue-600 mt-2">{data.paybackPeriod}</p>
          </div>

          {/* Three Year ROI */}
          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="text-lg font-semibold text-gray-900">3-Year ROI</h4>
            <p className="text-3xl font-bold text-purple-600 mt-2">{data.threeYearROI}</p>
          </div>

          {/* Net Present Value */}
          {data.netPresentValue && (
            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h4 className="text-lg font-semibold text-gray-900">Net Present Value</h4>
              <p className="text-3xl font-bold text-orange-600 mt-2">{data.netPresentValue}</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Benefits */}
      {additionalBenefits.length > 0 && (
        <div className="mt-6 bg-yellow-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Additional Non-Quantified Benefits</h4>
          <div className="grid md:grid-cols-2 gap-2">
            {additionalBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-sm text-gray-700">
                <ArrowUp className="w-4 h-4 text-yellow-600 mr-2" />
                {benefit}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assumptions */}
      {assumptions.length > 0 && (
        <div className="mt-4 text-xs text-gray-500">
          <p className="font-medium">Key Assumptions:</p>
          <ul className="mt-1">
            {assumptions.map((assumption, index) => (
              <li key={index}>• {assumption}</li>
            ))}
          </ul>
        </div>
      )}
    </SlideLayout>
  )
}