import React from 'react'
import { BaseSlideProps, AgendaSlideData } from './types'
import { Clock, ChevronRight } from 'lucide-react'
import { SlideLayout, SlideHeader } from './shared'

interface AgendaSlideProps extends BaseSlideProps {
  data: AgendaSlideData
}

export function AgendaSlide({ data, className = '' }: AgendaSlideProps) {
  return (
    <SlideLayout className={className}>
      <SlideHeader 
        title={data.title}
        className="mb-8"
        showDivider={true}
      />

      <div className="flex-1 grid gap-4">
        {data.agendaSections.map((section, index) => (
          <div
            key={index}
            className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-400"
          >
            <div className="flex items-center">
              {/* Section number or icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                {section.icon || (index + 1)}
              </div>
              
              {/* Section content */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {section.section}
                </h3>
                {section.description && (
                  <p className="text-gray-600 mt-1">{section.description}</p>
                )}
              </div>
              
              {/* Time estimate */}
              {section.estimatedTime && (
                <div className="flex items-center text-gray-500 ml-4">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{section.estimatedTime}</span>
                </div>
              )}
              
              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-gray-400 ml-4 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Total time if available */}
      {data.agendaSections.some(s => s.estimatedTime) && (
        <div className="mt-6 text-center text-gray-600">
          <p className="text-sm">
            Total Duration: {
              data.agendaSections
                .filter(s => s.estimatedTime)
                .map(s => s.estimatedTime)
                .join(' + ')
            }
          </p>
        </div>
      )}
    </SlideLayout>
  )
}