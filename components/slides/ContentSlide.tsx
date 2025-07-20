import React from 'react'
import { BaseSlideProps, ContentSlideData } from './types'

interface ContentSlideProps extends BaseSlideProps {
  data: ContentSlideData
}

export function ContentSlide({ data, className = '' }: ContentSlideProps) {
  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {data.title}
        </h2>
        <div className="w-20 h-1 bg-blue-600 mt-4"></div>
      </div>

      <div className="flex-1 overflow-auto">
        {data.content && (
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {data.content}
          </p>
        )}

        {data.bullets && data.bullets.length > 0 && (
          <ul className="space-y-4">
            {data.bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start group">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <span className="text-lg text-gray-700 leading-relaxed">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}