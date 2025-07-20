import React from 'react'
import { BaseSlideProps, CompetitiveLandscapeSlideData } from './types'

interface CompetitiveLandscapeSlideProps extends BaseSlideProps {
  data: CompetitiveLandscapeSlideData
}

export function CompetitiveLandscapeSlide({ data, className = '' }: CompetitiveLandscapeSlideProps) {
  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-lg text-gray-600">{data.subtitle}</p>
        )}
        <div className="w-20 h-1 bg-indigo-600 mt-4"></div>
      </div>

      <div className="flex-1 relative bg-gray-50 rounded-lg p-6">
        {/* Axes labels */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
          {data.yAxis}
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600">
          {data.xAxis}
        </div>

        {/* Grid */}
        <div className="relative w-full h-full">
          {/* Quadrant lines */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-300"></div>
          </div>

          {/* Competitors */}
          {data.competitors.map((competitor, idx) => {
            const isUs = competitor.name === 'Us' || competitor.isUs
            const size = competitor.size === 'large' ? 'w-24 h-24' : 
                        competitor.size === 'small' ? 'w-12 h-12' : 'w-16 h-16'
            const bgColor = isUs ? 'bg-blue-600' : 'bg-gray-400'
            const textColor = isUs ? 'text-white' : 'text-white'
            
            return (
              <div
                key={idx}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{
                  left: `${competitor.x}%`,
                  top: `${100 - competitor.y}%`
                }}
              >
                <div className={`${size} ${bgColor} ${textColor} rounded-full flex items-center justify-center font-semibold text-sm shadow-lg hover:scale-110 transition-transform`}>
                  {competitor.name}
                </div>
                
                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div>{competitor.name}</div>
                  {competitor.description && (
                    <div className="text-gray-300 mt-1">{competitor.description}</div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Quadrant labels */}
          <div className="absolute top-4 left-4 text-sm text-gray-500 font-medium">
            High {data.yAxis} / Low {data.xAxis}
          </div>
          <div className="absolute top-4 right-4 text-sm text-gray-500 font-medium">
            High {data.yAxis} / High {data.xAxis}
          </div>
          <div className="absolute bottom-4 left-4 text-sm text-gray-500 font-medium">
            Low {data.yAxis} / Low {data.xAxis}
          </div>
          <div className="absolute bottom-4 right-4 text-sm text-gray-500 font-medium">
            Low {data.yAxis} / High {data.xAxis}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Our Position</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-400 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Competitors</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Size = Market Share</span>
        </div>
      </div>
    </div>
  )
}