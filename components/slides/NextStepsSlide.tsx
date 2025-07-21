import React from 'react'
import { BaseSlideProps, NextStepsSlideData } from './types'
import { ArrowRight, Calendar, Users, FileCheck } from 'lucide-react'

interface NextStepsSlideProps extends BaseSlideProps {
  data: NextStepsSlideData
}

export function NextStepsSlide({ data, className = '' }: NextStepsSlideProps) {
  const getActionIcon = (action: string) => {
    const actionLower = action.toLowerCase()
    if (actionLower.includes('meeting') || actionLower.includes('call')) return <Users className="w-5 h-5" />
    if (actionLower.includes('schedule') || actionLower.includes('date')) return <Calendar className="w-5 h-5" />
    if (actionLower.includes('review') || actionLower.includes('contract')) return <FileCheck className="w-5 h-5" />
    return <ArrowRight className="w-5 h-5" />
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
        {/* Immediate Actions */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Immediate Actions</h3>
          <div className="space-y-3">
            {data.immediateActions.map((action, index) => (
              <div key={index} className="flex items-start bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    {getActionIcon(action.action)}
                    <span className="ml-2">{action.action}</span>
                  </h4>
                  {action.owner && (
                    <p className="text-sm text-gray-600 mt-1">Owner: {action.owner}</p>
                  )}
                  {action.timeline && (
                    <p className="text-sm text-blue-600 mt-1">Timeline: {action.timeline}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Criteria */}
        {data.decisionCriteria && data.decisionCriteria.length > 0 && (
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Decision Criteria</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {data.decisionCriteria.map((criteria, index) => (
                <div key={index} className="flex items-center bg-white rounded-lg p-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  <span className="text-gray-700">{criteria}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stakeholders */}
        {data.stakeholders && data.stakeholders.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Stakeholders</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {data.stakeholders.map((stakeholder, index) => (
                <div key={index} className="bg-white rounded-lg p-3">
                  <p className="font-medium text-gray-900">{stakeholder.name}</p>
                  <p className="text-sm text-gray-600">{stakeholder.role}</p>
                  {stakeholder.involvement && (
                    <p className="text-xs text-blue-600 mt-1">{stakeholder.involvement}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {data.proposedTimeline && (
          <div className="bg-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-orange-600" />
              Proposed Timeline
            </h4>
            <div className="space-y-2">
              {data.proposedTimeline.contractSigning && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Contract Signing</span>
                  <span className="font-medium text-orange-700">{data.proposedTimeline.contractSigning}</span>
                </div>
              )}
              {data.proposedTimeline.kickoff && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Project Kickoff</span>
                  <span className="font-medium text-orange-700">{data.proposedTimeline.kickoff}</span>
                </div>
              )}
              {data.proposedTimeline.goLive && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Go Live</span>
                  <span className="font-medium text-orange-700">{data.proposedTimeline.goLive}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-blue-600 text-white rounded-lg p-6 text-center">
          <p className="text-xl font-semibold mb-2">{data.callToAction || "Let's move forward together"}</p>
          {data.contactInfo && (
            <p className="text-sm opacity-90">
              Contact: {data.contactInfo.email} {data.contactInfo.phone && `| ${data.contactInfo.phone}`}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}