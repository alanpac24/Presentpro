import React from 'react'
import { BaseSlideProps, MarketSizingSlideData } from './types'
import { Globe, Users, Target, TrendingUp } from 'lucide-react'
import { SlideLayout, SlideHeader } from './shared'

interface MarketSizingSlideProps extends BaseSlideProps {
  data: MarketSizingSlideData
}

export function MarketSizingSlide({ data, className = '' }: MarketSizingSlideProps) {
  // Add defensive checks for required data
  const tam = data.tam || { value: '$0', description: 'Total addressable market' }
  const sam = data.sam || { value: '$0', description: 'Serviceable addressable market' }
  const som = data.som || { value: '$0', description: 'Serviceable obtainable market' }

  return (
    <SlideLayout className={className}>
      <SlideHeader 
        title={data.title}
        subtitle={data.subtitle}
      />

      <div className="flex-1 flex flex-col justify-center">
        {/* Funnel visualization */}
        <div className="max-w-2xl mx-auto w-full">
          {/* TAM */}
          <div className="relative">
            <div className="bg-blue-100 border-2 border-blue-300 rounded-t-2xl py-8 px-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Globe className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-blue-900">Total Addressable Market (TAM)</h3>
              </div>
              <div className="text-3xl font-bold text-blue-800 mb-2">{tam.value}</div>
              <p className="text-sm text-blue-700">{tam.description}</p>
            </div>
          </div>

          {/* SAM */}
          <div className="relative -mt-1">
            <div className="bg-green-100 border-2 border-green-300 py-6 px-8 mx-8 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-900">Serviceable Addressable Market (SAM)</h3>
              </div>
              <div className="text-2xl font-bold text-green-800 mb-2">{sam.value}</div>
              <p className="text-sm text-green-700">{sam.description}</p>
            </div>
          </div>

          {/* SOM */}
          <div className="relative -mt-1">
            <div className="bg-orange-100 border-2 border-orange-300 rounded-b-2xl py-6 px-10 mx-16 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold text-orange-900">Serviceable Obtainable Market (SOM)</h3>
              </div>
              <div className="text-2xl font-bold text-orange-800 mb-2">{som.value}</div>
              <p className="text-sm text-orange-700">{som.description}</p>
            </div>
          </div>
        </div>

        {/* Growth indicator */}
        {data.growth && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center bg-green-50 border border-green-200 rounded-lg px-6 py-3">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">
                Expected Growth: {data.growth}
              </span>
            </div>
          </div>
        )}
      </div>
    </SlideLayout>
  )
}