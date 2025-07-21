import React from 'react'
import { BaseSlideProps, ProductDeepDiveSlideData } from './types'
import { Layers, Zap, Shield, Settings, ArrowRight } from 'lucide-react'
import { SlideLayout, SlideHeader } from './shared'

interface ProductDeepDiveSlideProps extends BaseSlideProps {
  data: ProductDeepDiveSlideData
}

export function ProductDeepDiveSlide({ data, className = '' }: ProductDeepDiveSlideProps) {
  // Add defensive checks
  const coreFeatures = data.coreFeatures || []
  const businessBenefits = data.businessBenefits || []
  const technicalDetails = data.technicalDetails || { architecture: '', security: '', integrations: [] }
  const integrations = technicalDetails.integrations || []

  const getFeatureIcon = (index: number) => {
    const icons = [Layers, Zap, Shield, Settings]
    const Icon = icons[index % icons.length]
    return <Icon className="w-6 h-6" />
  }

  return (
    <SlideLayout className={className}>
      <SlideHeader 
        title={data.title}
        subtitle={data.subtitle || data.productName}
      />

      <div className="flex-1 grid md:grid-cols-2 gap-8">
        {/* Left side - Features */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Core Capabilities</h3>
          {coreFeatures.map((feature, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  {getFeatureIcon(index)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{feature.feature}</h4>
                  <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                  {feature.howItWorks && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700">
                      <span className="font-medium">How it works:</span> {feature.howItWorks}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right side - Benefits & Architecture */}
        <div className="space-y-6">
          {/* Benefits */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Benefits</h3>
            <div className="space-y-2">
              {businessBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center bg-green-50 rounded-lg p-3">
                  <ArrowRight className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Details */}
          {technicalDetails && (Object.keys(technicalDetails).length > 0) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Technical Overview</h4>
              <div className="space-y-2">
                {technicalDetails.architecture && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Architecture:</span>
                    <span className="text-gray-600 ml-2">{technicalDetails.architecture}</span>
                  </div>
                )}
                {technicalDetails.security && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Security:</span>
                    <span className="text-gray-600 ml-2">{technicalDetails.security}</span>
                  </div>
                )}
                {integrations.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Integrations:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {integrations.map((integration, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {integration}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Demo Available */}
          {data.demoAvailable && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-900 font-medium">Live Demo Available</p>
              <p className="text-sm text-blue-700 mt-1">See these features in action</p>
            </div>
          )}
        </div>
      </div>
    </SlideLayout>
  )
}