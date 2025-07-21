import React from 'react'
import { BaseSlideProps, TitleSlideData } from './types'
import { Target } from 'lucide-react'
import { CenteredLayout } from './shared'

interface TitleSlideProps extends BaseSlideProps {
  data: TitleSlideData
}

export function TitleSlide({ data, className = '' }: TitleSlideProps) {
  return (
    <CenteredLayout className={className}>
      <div className="mb-8">
        <Target className="w-20 h-20 text-blue-600 mx-auto mb-6" />
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
        <span className="bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
          {data.title}
        </span>
      </h1>
      
      {data.subtitle && (
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl">
          {data.subtitle}
        </p>
      )}
      
      <div className="mt-auto space-y-2 text-gray-500">
        {data.company && (
          <p className="text-lg">Prepared for {data.company}</p>
        )}
        {data.presenter && (
          <p className="text-base">By {data.presenter}</p>
        )}
        {data.date && (
          <p className="text-sm">{data.date}</p>
        )}
      </div>
    </CenteredLayout>
  )
}