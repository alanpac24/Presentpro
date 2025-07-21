import React from 'react'
import { BaseSlideProps, ThankYouSlideData } from './types'
import { Heart, Star, Handshake } from 'lucide-react'

interface ThankYouSlideProps extends BaseSlideProps {
  data: ThankYouSlideData
}

export function ThankYouSlide({ data, className = '' }: ThankYouSlideProps) {
  return (
    <div className={`h-full flex flex-col justify-center items-center text-center ${className}`}>
      {/* Icon */}
      <div className="mb-8">
        {data.icon === 'heart' && <Heart className="w-20 h-20 text-blue-600 mx-auto" />}
        {data.icon === 'star' && <Star className="w-20 h-20 text-blue-600 mx-auto" />}
        {data.icon === 'handshake' && <Handshake className="w-20 h-20 text-blue-600 mx-auto" />}
        {!data.icon && <Heart className="w-20 h-20 text-blue-600 mx-auto" />}
      </div>

      {/* Main Message */}
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
        {data.title}
      </h1>

      {data.subtitle && (
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          {data.subtitle}
        </p>
      )}

      {/* Additional Messages */}
      {data.messages && data.messages.length > 0 && (
        <div className="space-y-3 mb-8">
          {data.messages.map((message, index) => (
            <p key={index} className="text-lg text-gray-700">
              {message}
            </p>
          ))}
        </div>
      )}

      {/* Contact Info */}
      {data.contactPrompt && (
        <div className="bg-blue-50 rounded-lg p-6 max-w-lg">
          <p className="text-gray-800 mb-3">{data.contactPrompt}</p>
          {data.contactInfo && (
            <div className="space-y-2">
              {data.contactInfo.email && (
                <p className="text-blue-600 font-medium">{data.contactInfo.email}</p>
              )}
              {data.contactInfo.phone && (
                <p className="text-blue-600 font-medium">{data.contactInfo.phone}</p>
              )}
              {data.contactInfo.website && (
                <p className="text-blue-600 font-medium">{data.contactInfo.website}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Closing Statement */}
      {data.closingStatement && (
        <div className="mt-8">
          <p className="text-xl font-semibold text-gray-900 italic">
            "{data.closingStatement}"
          </p>
        </div>
      )}

      {/* Logo */}
      {data.companyLogo && (
        <div className="mt-12">
          <img 
            src={data.companyLogo} 
            alt="Company Logo"
            className="h-12 opacity-50"
          />
        </div>
      )}
    </div>
  )
}