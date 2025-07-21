import React from 'react'
import { BaseSlideProps, ComparisonSlideData } from './types'
import { Check, X } from 'lucide-react'
import { SlideLayout } from '../slides/shared/SlideLayouts'
import { SlideHeader } from '../slides/shared/SlideComponents'

interface ComparisonSlideProps extends BaseSlideProps {
  data: ComparisonSlideData
}

export function ComparisonSlide({ data, className = '' }: ComparisonSlideProps) {
  return (
    <SlideLayout className={className}>
      <SlideHeader title={data.title} subtitle={data.subtitle} />

      <div className="flex-1 overflow-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
            <div className="p-4 font-semibold text-gray-700">
              Feature
            </div>
            <div className="p-4 font-semibold text-red-700 bg-red-50 text-center">
              {data.leftTitle}
            </div>
            <div className="p-4 font-semibold text-green-700 bg-green-50 text-center">
              {data.rightTitle}
            </div>
          </div>
          
          {data.comparisons.map((comparison, idx) => (
            <div 
              key={idx} 
              className={`grid grid-cols-3 border-b border-gray-100 ${
                idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className="p-4 font-medium text-gray-900">
                {comparison.feature}
              </div>
              <div className="p-4 text-gray-600 text-center flex items-center justify-center">
                {comparison.left.toLowerCase() === 'yes' || comparison.left === '✓' ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : comparison.left.toLowerCase() === 'no' || comparison.left === '✗' ? (
                  <X className="w-5 h-5 text-red-600" />
                ) : (
                  <span className="text-sm">{comparison.left}</span>
                )}
              </div>
              <div className="p-4 text-gray-600 text-center flex items-center justify-center">
                {comparison.right.toLowerCase() === 'yes' || comparison.right === '✓' ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : comparison.right.toLowerCase() === 'no' || comparison.right === '✗' ? (
                  <X className="w-5 h-5 text-red-600" />
                ) : (
                  <span className="text-sm">{comparison.right}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}