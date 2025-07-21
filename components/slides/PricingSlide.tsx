import React from 'react'
import { BaseSlideProps, PricingSlideData } from './types'
import { Check, Star, Zap } from 'lucide-react'
import { SlideLayout, SlideHeader } from './shared'

interface PricingSlideProps extends BaseSlideProps {
  data: PricingSlideData
}

export function PricingSlide({ data, className = '' }: PricingSlideProps) {
  // Add defensive checks for arrays
  const pricingTiers = data.pricingTiers || []
  const volumeDiscounts = data.volumeDiscounts || []
  const paymentTerms = data.paymentTerms || {}

  const getTierIcon = (tier: string) => {
    if (tier.toLowerCase().includes('enterprise') || tier.toLowerCase().includes('premium')) {
      return <Star className="w-6 h-6" />
    } else if (tier.toLowerCase().includes('pro') || tier.toLowerCase().includes('business')) {
      return <Zap className="w-6 h-6" />
    }
    return null
  }

  return (
    <SlideLayout className={className}>
      <SlideHeader 
        title={data.title}
        subtitle={data.subtitle}
      />

      <div className="flex-1 space-y-6">
        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-4">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index} 
              className={`bg-white border-2 rounded-lg p-6 relative transition-all ${
                tier.isRecommended 
                  ? 'border-blue-500 shadow-xl scale-105' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
              }`}
            >
              {tier.isRecommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Recommended
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-3">
                  {getTierIcon(tier.tierName)}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{tier.tierName}</h3>
                {tier.description && (
                  <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                )}
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">{tier.price}</div>
                {tier.billingPeriod && (
                  <p className="text-sm text-gray-600">{tier.billingPeriod}</p>
                )}
                {tier.setupFee && (
                  <p className="text-xs text-gray-500 mt-1">Setup fee: {tier.setupFee}</p>
                )}
              </div>

              {tier.features && tier.features.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {(tier.features || []).map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start text-sm">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {tier.limitations && tier.limitations.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 mb-2">Limitations:</p>
                  <ul className="space-y-1">
                    {(tier.limitations || []).map((limitation, lIndex) => (
                      <li key={lIndex} className="text-xs text-gray-500">
                        • {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Volume Discounts */}
        {volumeDiscounts.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Volume Discounts Available</h4>
            <div className="grid md:grid-cols-4 gap-2">
              {volumeDiscounts.map((discount, index) => (
                <div key={index} className="text-center">
                  <p className="text-sm text-gray-700">{discount.volume}</p>
                  <p className="font-semibold text-blue-600">{discount.discount}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Terms */}
        {paymentTerms && Object.keys(paymentTerms).length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Payment Options</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {(paymentTerms.options || []).map((option, index) => (
                  <li key={index}>• {option}</li>
                ))}
              </ul>
            </div>
            {paymentTerms.contractLength && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contract Terms</h4>
                <p className="text-sm text-gray-700">{paymentTerms.contractLength}</p>
                {paymentTerms.earlyTermination && (
                  <p className="text-xs text-gray-500 mt-1">
                    Early termination: {paymentTerms.earlyTermination}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Custom Quote */}
        {data.customQuote && (
          <div className="text-center bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 font-medium">
              Need a custom solution? {data.customQuote}
            </p>
          </div>
        )}
      </div>
    </SlideLayout>
  )
}