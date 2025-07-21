import React from 'react'
import { BaseSlideProps, WhyNowSlideData } from './types'
import { Clock, AlertTriangle, TrendingUp, Calendar } from 'lucide-react'
import { SlideLayout, SlideHeader } from './shared'

interface WhyNowSlideProps extends BaseSlideProps {
  data: WhyNowSlideData
}

export function WhyNowSlide({ data, className = '' }: WhyNowSlideProps) {
  // Add defensive checks for arrays
  const urgencyFactors = data.urgencyFactors || []
  const opportunities = data.opportunities || []
  const costOfDelay = data.costOfDelay || {}
  const lostOpportunities = costOfDelay.lostOpportunities || []

  return (
    <SlideLayout className={className}>
      <SlideHeader 
        title={data.title}
        subtitle={data.subtitle}
      />

      <div className="flex-1 grid md:grid-cols-2 gap-6">
        {/* Left Column - Urgency Factors */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-3">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Why Act Now
          </h3>
          {urgencyFactors.map((factor, index) => (
            <div key={index} className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
              <h4 className="font-semibold text-gray-900 mb-1">{factor.factor}</h4>
              <p className="text-sm text-gray-700">{factor.impact}</p>
              {factor.timeline && (
                <div className="mt-2 flex items-center text-xs text-orange-700">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{factor.timeline}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Column - Opportunities */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-3">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Opportunities Available Now
          </h3>
          {opportunities.map((opp, index) => (
            <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-1">{opp.opportunity}</h4>
              <p className="text-sm text-gray-700">{opp.benefit}</p>
              {opp.expiryDate && (
                <div className="mt-2 flex items-center text-xs text-green-700">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Available until: {opp.expiryDate}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cost of Delay */}
      {costOfDelay && (Object.keys(costOfDelay).length > 0) && (
        <div className="mt-6 bg-red-50 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-red-900 mb-3">Cost of Delay</h4>
          <div className="grid md:grid-cols-3 gap-4">
            {costOfDelay.dailyCost && (
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{costOfDelay.dailyCost}</p>
                <p className="text-sm text-gray-700">Per Day</p>
              </div>
            )}
            {costOfDelay.monthlyCost && (
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{costOfDelay.monthlyCost}</p>
                <p className="text-sm text-gray-700">Per Month</p>
              </div>
            )}
            {costOfDelay.yearlyCost && (
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{costOfDelay.yearlyCost}</p>
                <p className="text-sm text-gray-700">Per Year</p>
              </div>
            )}
          </div>
          {lostOpportunities.length > 0 && (
            <div className="mt-4 space-y-1">
              <p className="font-medium text-red-900">Lost Opportunities:</p>
              {lostOpportunities.map((opp, index) => (
                <p key={index} className="text-sm text-red-700">• {opp}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-6 bg-blue-600 text-white rounded-lg p-4 text-center">
        <p className="text-lg font-semibold">
          {data.callToAction || "Start your transformation journey today"}
        </p>
      </div>
    </SlideLayout>
  )
}