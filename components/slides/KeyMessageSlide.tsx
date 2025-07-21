import React from 'react'
import { BaseSlideProps, KeyMessageSlideData } from './types'
import { Quote } from 'lucide-react'
import { CenteredLayout } from '../slides/shared/SlideLayouts'

interface KeyMessageSlideProps extends BaseSlideProps {
  data: KeyMessageSlideData
}

export function KeyMessageSlide({ data, className = '' }: KeyMessageSlideProps) {
  return (
    <CenteredLayout className={className}>
      <Quote className="w-16 h-16 text-blue-600 mb-8 opacity-20" />
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 max-w-4xl leading-tight">
        <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
          {data.message}
        </span>
      </h1>

      {data.supportingFacts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          {data.supportingFacts.map((fact, idx) => (
            <div key={idx} className="text-center">
              <div className="w-12 h-0.5 bg-gray-300 mx-auto mb-4"></div>
              <p className="text-gray-700">{fact}</p>
            </div>
          ))}
        </div>
      )}

      {data.source && (
        <p className="mt-auto text-sm text-gray-500 italic">
          Source: {data.source}
        </p>
      )}
    </CenteredLayout>
  )
}