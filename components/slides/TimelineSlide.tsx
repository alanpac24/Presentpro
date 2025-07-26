import React from 'react'
import { BaseSlideProps, TimelineSlideData } from './types'
import { Calendar, CheckCircle } from 'lucide-react'
import { SlideLayout } from '../slides/shared/SlideLayouts'
import { SlideHeader, ListItem } from '../slides/shared/SlideComponents'

interface TimelineSlideProps extends BaseSlideProps {
  data: TimelineSlideData
}

export function TimelineSlide({ data, className = '' }: TimelineSlideProps) {
  return (
    <SlideLayout className={className}>
      <SlideHeader title={data.title} subtitle={data.subtitle} />

      <div className="flex-1 overflow-auto">
        <div className="space-y-6">
          {(data.phases || []).map((phase, idx) => (
            <div key={idx} className="flex">
              <div className="flex flex-col items-center mr-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                {idx < data.phases.length - 1 && (
                  <div className="w-0.5 h-24 bg-gray-300 mt-2"></div>
                )}
              </div>
              
              <div className="flex-1 bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {phase.phase}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {phase.duration}
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {phase.activities.map((activity, actIdx) => (
                    <ListItem key={actIdx} icon={<CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />}>
                      {activity}
                    </ListItem>
                  ))}
                </ul>
                
                {phase.milestone && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-sm font-medium text-blue-600">
                      Milestone: {phase.milestone}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}