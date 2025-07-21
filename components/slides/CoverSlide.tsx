import React from 'react'
import { BaseSlideProps, CoverSlideData } from './types'
import { SlideLayout } from './shared'

interface CoverSlideProps extends BaseSlideProps {
  data: CoverSlideData
}

export function CoverSlide({ data, className = '' }: CoverSlideProps) {
  return (
    <SlideLayout className={`justify-between p-12 bg-gradient-to-br from-gray-50 to-white ${className}`}>
      {/* Header with logos */}
      <div className="flex justify-between items-start">
        {data.clientLogo && (
          <div className="h-16">
            <img src={data.clientLogo} alt={data.clientName} className="h-full object-contain" />
          </div>
        )}
        {data.vendorLogo && (
          <div className="h-16">
            <img src={data.vendorLogo} alt={data.vendorName} className="h-full object-contain" />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          {data.proposalTitle}
        </h1>
        
        {data.proposalSubtitle && (
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            {data.proposalSubtitle}
          </p>
        )}
        
        <div className="text-lg text-gray-700">
          <p className="font-semibold text-2xl mb-2">Prepared for</p>
          <p className="text-3xl font-bold text-blue-600">{data.clientName}</p>
        </div>
        
        {data.dealReferenceId && (
          <p className="mt-4 text-sm text-gray-500">
            Reference: {data.dealReferenceId}
          </p>
        )}
      </div>

      {/* Footer with contact info */}
      <div className="flex justify-between items-end text-sm">
        <div className="text-gray-600">
          <p className="font-medium">{data.salesRepName}</p>
          <p>{data.salesRepTitle}</p>
          {data.salesRepContact && (
            <p className="text-blue-600">{data.salesRepContact}</p>
          )}
        </div>
        
        <div className="text-right text-gray-600">
          <p>{data.proposalDate}</p>
          <p className="font-medium">{data.vendorName}</p>
        </div>
      </div>
    </SlideLayout>
  )
}