import React from 'react'
import { BaseSlideProps, ImplementationTimelineSlideData } from './types'
import { Calendar, CheckCircle, Clock, Users, AlertCircle } from 'lucide-react'

interface ImplementationTimelineSlideProps extends BaseSlideProps {
  data: ImplementationTimelineSlideData
}

export function ImplementationTimelineSlide({ data, className = '' }: ImplementationTimelineSlideProps) {
  const getPhaseIcon = (phase: string) => {
    const phaseLower = phase.toLowerCase()
    if (phaseLower.includes('planning') || phaseLower.includes('discovery')) return <Calendar className="w-5 h-5" />
    if (phaseLower.includes('implement') || phaseLower.includes('build')) return <Clock className="w-5 h-5" />
    if (phaseLower.includes('training') || phaseLower.includes('onboard')) return <Users className="w-5 h-5" />
    if (phaseLower.includes('launch') || phaseLower.includes('deploy')) return <CheckCircle className="w-5 h-5" />
    return <Calendar className="w-5 h-5" />
  }

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

      <div className="flex-1 space-y-6">
        {/* Overview */}
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-lg font-semibold text-blue-900">
            Total Implementation Duration: {data.totalDuration}
          </p>
          {data.startDate && (
            <p className="text-sm text-blue-700 mt-1">
              Proposed Start Date: {data.startDate}
            </p>
          )}
        </div>

        {/* Timeline Phases */}
        <div className="space-y-4">
          {data.phases.map((phase, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              {index < data.phases.length - 1 && (
                <div className="absolute left-6 top-14 w-0.5 h-full bg-gray-300"></div>
              )}
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start">
                  {/* Phase Icon */}
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    {getPhaseIcon(phase.phase)}
                  </div>
                  
                  {/* Phase Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{phase.phase}</h3>
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {phase.duration}
                      </span>
                    </div>
                    
                    {phase.description && (
                      <p className="text-sm text-gray-700 mb-3">{phase.description}</p>
                    )}
                    
                    {/* Deliverables */}
                    {phase.deliverables && phase.deliverables.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-800 mb-1">Key Deliverables:</p>
                        <ul className="space-y-1">
                          {phase.deliverables.map((deliverable, dIndex) => (
                            <li key={dIndex} className="text-sm text-gray-600 flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1 flex-shrink-0 mt-0.5" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Milestones */}
                    {phase.milestones && phase.milestones.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {phase.milestones.map((milestone, mIndex) => (
                          <span key={mIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {milestone}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Success Factors */}
        {data.keySuccessFactors && data.keySuccessFactors.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Key Success Factors
            </h4>
            <div className="grid md:grid-cols-2 gap-2">
              {data.keySuccessFactors.map((factor, index) => (
                <div key={index} className="flex items-center text-sm text-gray-700">
                  <span className="text-green-600 mr-2">✓</span>
                  {factor}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risks & Mitigations */}
        {data.risks && data.risks.length > 0 && (
          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
              Risk Management
            </h4>
            <div className="space-y-2">
              {data.risks.map((risk, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-orange-800">{risk.risk}:</span>
                  <span className="text-gray-700 ml-2">{risk.mitigation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}