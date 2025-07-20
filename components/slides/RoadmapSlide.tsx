import React from 'react'
import { BaseSlideProps, RoadmapSlideData } from './types'
import { Calendar, CheckCircle, Circle } from 'lucide-react'

interface RoadmapSlideProps extends BaseSlideProps {
  data: RoadmapSlideData
}

export function RoadmapSlide({ data, className = '' }: RoadmapSlideProps) {
  const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600']
  
  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-lg text-gray-600">{data.subtitle}</p>
        )}
        <div className="w-20 h-1 bg-blue-600 mt-4"></div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Timeline header */}
        <div className="flex mb-6">
          {data.phases.map((phase, idx) => (
            <div key={idx} className="flex-1 text-center">
              <div className={`${colors[idx % colors.length]} text-white py-3 px-4 rounded-t-lg`}>
                <div className="font-semibold">{phase.name}</div>
                <div className="text-sm opacity-90">{phase.duration}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Workstreams */}
        <div className="space-y-4">
          {/* Get unique workstreams */}
          {(() => {
            const workstreamNames = new Set<string>()
            data.phases.forEach(phase => {
              phase.workstreams.forEach(ws => workstreamNames.add(ws.name))
            })
            
            return Array.from(workstreamNames).map((workstreamName, wsIdx) => (
              <div key={wsIdx} className="flex items-stretch">
                {/* Workstream label */}
                <div className="w-32 pr-4 flex-shrink-0">
                  <div className="bg-gray-100 rounded-lg p-3 h-full flex items-center">
                    <span className="text-sm font-medium text-gray-700">{workstreamName}</span>
                  </div>
                </div>

                {/* Activities per phase */}
                <div className="flex flex-1">
                  {data.phases.map((phase, phaseIdx) => {
                    const workstream = phase.workstreams.find(ws => ws.name === workstreamName)
                    return (
                      <div key={phaseIdx} className="flex-1 px-2">
                        <div className={`border-l-4 ${colors[phaseIdx % colors.length].replace('bg-', 'border-')} bg-gray-50 rounded-r-lg p-3 min-h-[80px]`}>
                          {workstream?.activities.map((activity, actIdx) => (
                            <div key={actIdx} className="flex items-start mb-2 last:mb-0">
                              <Circle className="w-3 h-3 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-xs text-gray-700">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          })()}
        </div>

        {/* Milestones */}
        <div className="mt-6 flex">
          <div className="w-32 flex-shrink-0"></div>
          <div className="flex flex-1">
            {data.phases.map((phase, idx) => (
              <div key={idx} className="flex-1 px-2">
                <div className="flex items-center justify-center">
                  <CheckCircle className={`w-6 h-6 ${colors[idx % colors.length].replace('bg-', 'text-')}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}