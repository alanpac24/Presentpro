import React from 'react'
import { BaseSlideProps, WhyUsSlideData } from './types'
import { Award, Star, CheckCircle2, TrendingUp } from 'lucide-react'
import { SlideLayout, SlideHeader } from './shared'

interface WhyUsSlideProps extends BaseSlideProps {
  data: WhyUsSlideData
}

export function WhyUsSlide({ data, className = '' }: WhyUsSlideProps) {
  // Add defensive checks for arrays
  const differentiators = data.differentiators || []
  const clientResults = data.clientResults || []
  const awards = data.awards || []

  const getDifferentiatorIcon = (index: number) => {
    const icons = [Award, Star, CheckCircle2, TrendingUp]
    const Icon = icons[index % icons.length]
    return <Icon className="w-6 h-6" />
  }

  return (
    <SlideLayout className={className}>
      <SlideHeader 
        title={data.title}
        subtitle={data.subtitle}
      />

      <div className="flex-1 space-y-6">
        {/* Key Differentiators */}
        <div className="grid md:grid-cols-2 gap-4">
          {differentiators.map((diff, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-lg transition-all">
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  {diff.icon ? (
                    <span className="text-blue-600">{diff.icon}</span>
                  ) : (
                    getDifferentiatorIcon(index)
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 flex-1">{diff.differentiator}</h3>
              </div>
              <p className="text-gray-700 mb-3">{diff.description}</p>
              {diff.proof && (
                <div className="bg-blue-50 rounded-lg p-3 text-sm">
                  <span className="font-medium text-blue-900">Proof: </span>
                  <span className="text-blue-700">{diff.proof}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Client Results */}
        {clientResults.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Proven Results</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {clientResults.map((result, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{result.metric}</div>
                  <div className="text-sm text-gray-700 mt-1">{result.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards & Recognition */}
        {awards.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              Recognition & Awards
            </h4>
            <div className="flex flex-wrap gap-3">
              {awards.map((award, index) => (
                <div key={index} className="bg-white rounded-lg px-4 py-2 border border-yellow-300">
                  <span className="font-medium text-gray-800">{award.award}</span>
                  {award.year && <span className="text-sm text-gray-600 ml-2">({award.year})</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partnership Level */}
        {data.partnershipLevel && (
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Our Partnership Level</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{data.partnershipLevel}</p>
          </div>
        )}
      </div>
    </SlideLayout>
  )
}