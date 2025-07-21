import React from 'react'
import { BaseSlideProps, SolutionOverviewSlideData } from './types'
import { Sparkles, CheckCircle } from 'lucide-react'
import { SlideLayout, SlideHeader } from './shared'

interface SolutionOverviewSlideProps extends BaseSlideProps {
  data: SolutionOverviewSlideData
}

export function SolutionOverviewSlide({ data, className = '' }: SolutionOverviewSlideProps) {
  // Add defensive checks
  const keyFeatures = data.keyFeatures || []

  return (
    <SlideLayout className={className}>
      <SlideHeader 
        title={data.title}
        subtitle={data.subtitle}
      />

      <div className="flex-1 grid md:grid-cols-2 gap-8">
        {/* Left side - Solution info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-blue-600 flex items-center mb-2">
              <Sparkles className="w-6 h-6 mr-2" />
              {data.solutionName}
            </h3>
            {data.tagline && (
              <p className="text-lg text-gray-700 italic">{data.tagline}</p>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900">Key Features</h4>
            {keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  {feature.icon ? (
                    <span className="text-blue-600">{feature.icon}</span>
                  ) : (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900">{feature.feature}</h5>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Screenshot */}
        <div className="flex items-center justify-center">
          {data.screenshot ? (
            <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden shadow-xl">
              <img 
                src={data.screenshot} 
                alt={data.solutionName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <p className="text-xl font-semibold text-blue-900">{data.solutionName}</p>
                <p className="text-blue-700">Visual Coming Soon</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 font-medium">
          A comprehensive solution designed specifically for your needs
        </p>
      </div>
    </SlideLayout>
  )
}