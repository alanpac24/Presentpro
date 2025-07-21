import React from 'react'
import { BaseSlideProps, InvestmentSummarySlideData } from './types'
import { Package, Calendar, Shield, HeadphonesIcon } from 'lucide-react'

interface InvestmentSummarySlideProps extends BaseSlideProps {
  data: InvestmentSummarySlideData
}

export function InvestmentSummarySlide({ data, className = '' }: InvestmentSummarySlideProps) {
  const getPackageIcon = (packageName: string) => {
    if (packageName.toLowerCase().includes('premium') || packageName.toLowerCase().includes('enterprise')) {
      return <Shield className="w-6 h-6" />
    }
    return <Package className="w-6 h-6" />
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
        <div className="w-20 h-1 bg-blue-600 mt-4"></div>
      </div>

      <div className="flex-1 space-y-6">
        {/* Package Details */}
        {data.packages && data.packages.map((pkg, index) => (
          <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  {getPackageIcon(pkg.packageName)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{pkg.packageName}</h3>
                  {pkg.description && (
                    <p className="text-sm text-gray-600">{pkg.description}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{pkg.totalPrice}</p>
                {pkg.pricePerUser && (
                  <p className="text-sm text-gray-600">{pkg.pricePerUser}/user</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Included Items */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">What's Included</h4>
                <ul className="space-y-1">
                  {pkg.includedItems && pkg.includedItems.map((item, iIndex) => (
                    <li key={iIndex} className="text-sm text-gray-700 flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Terms */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Terms</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  {pkg.paymentTerms && (
                    <p><span className="font-medium">Payment:</span> {pkg.paymentTerms}</p>
                  )}
                  {pkg.contractLength && (
                    <p><span className="font-medium">Contract:</span> {pkg.contractLength}</p>
                  )}
                  {pkg.validUntil && (
                    <p className="text-orange-600"><span className="font-medium">Valid Until:</span> {pkg.validUntil}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Optional Add-ons */}
            {pkg.optionalAddOns && pkg.optionalAddOns.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-2">Optional Add-ons</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  {pkg.optionalAddOns.map((addon, aIndex) => (
                    <div key={aIndex} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{addon.item}</span>
                      <span className="font-medium text-gray-900">{addon.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Executive Sponsor Incentive */}
        {data.executiveSponsorIncentive && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2">Executive Sponsor Program</h4>
            <p className="text-sm text-purple-700">{data.executiveSponsorIncentive}</p>
          </div>
        )}

        {/* Additional Services */}
        {data.additionalServices && data.additionalServices.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <HeadphonesIcon className="w-5 h-5 mr-2 text-gray-600" />
              Additional Services Available
            </h4>
            <div className="grid md:grid-cols-3 gap-3">
              {data.additionalServices.map((service, index) => (
                <div key={index} className="text-sm">
                  <p className="font-medium text-gray-800">{service.service}</p>
                  {service.price && <p className="text-gray-600">{service.price}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Terms & Conditions */}
        {data.termsConditions && (
          <div className="text-xs text-gray-500 text-center">
            <p>{data.termsConditions}</p>
          </div>
        )}
      </div>
    </div>
  )
}