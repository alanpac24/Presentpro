import React from 'react'
import { BaseSlideProps, StakeholderMapSlideData } from './types'
import { Users, UserCheck, UserX, UserMinus } from 'lucide-react'

interface StakeholderMapSlideProps extends BaseSlideProps {
  data: StakeholderMapSlideData
}

export function StakeholderMapSlide({ data, className = '' }: StakeholderMapSlideProps) {
  const getInfluencePosition = (influence: string) => {
    switch (influence.toLowerCase()) {
      case 'high': return '85%'
      case 'medium': return '50%'
      case 'low': return '15%'
      default: return '50%'
    }
  }

  const getInterestPosition = (interest: string) => {
    switch (interest.toLowerCase()) {
      case 'high': return '85%'
      case 'medium': return '50%'
      case 'low': return '15%'
      default: return '50%'
    }
  }

  const getStakeholderIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'supportive': return <UserCheck className="w-4 h-4 text-green-600" />
      case 'opposed': return <UserX className="w-4 h-4 text-red-600" />
      case 'neutral': return <UserMinus className="w-4 h-4 text-gray-600" />
      default: return <Users className="w-4 h-4 text-blue-600" />
    }
  }

  const getStakeholderColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'supportive': return 'bg-green-100 border-green-300 text-green-900'
      case 'opposed': return 'bg-red-100 border-red-300 text-red-900'
      case 'neutral': return 'bg-gray-100 border-gray-300 text-gray-900'
      default: return 'bg-blue-100 border-blue-300 text-blue-900'
    }
  }

  const getQuadrantStrategy = (influence: string, interest: string) => {
    const high = influence === 'high' && interest === 'high'
    const lowInfluenceHighInterest = influence === 'low' && interest === 'high'
    const highInfluenceLowInterest = influence === 'high' && interest === 'low'
    const low = influence === 'low' && interest === 'low'

    if (high) return 'Manage Closely'
    if (lowInfluenceHighInterest) return 'Keep Informed'
    if (highInfluenceLowInterest) return 'Keep Satisfied'
    if (low) return 'Monitor'
    return ''
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
        <div className="w-20 h-1 bg-purple-600 mt-4"></div>
      </div>

      <div className="flex-1 flex">
        {/* Matrix */}
        <div className="flex-1 relative bg-gray-50 rounded-lg p-8">
          {/* Axes labels */}
          <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
            Influence
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600">
            Interest
          </div>

          {/* Grid */}
          <div className="absolute inset-8">
            {/* Quadrant lines */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-300"></div>

            {/* Quadrant labels */}
            <div className="absolute top-2 left-2 text-xs text-gray-500 font-medium">
              Keep Satisfied
            </div>
            <div className="absolute top-2 right-2 text-xs text-gray-500 font-medium">
              Manage Closely
            </div>
            <div className="absolute bottom-2 left-2 text-xs text-gray-500 font-medium">
              Monitor
            </div>
            <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-medium">
              Keep Informed
            </div>

            {/* Stakeholders */}
            {data.stakeholders.map((stakeholder, idx) => (
              <div
                key={idx}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{
                  left: getInterestPosition(stakeholder.interest),
                  top: `${100 - parseInt(getInfluencePosition(stakeholder.influence))}%`
                }}
              >
                <div className={`${getStakeholderColor(stakeholder.sentiment)} border-2 rounded-lg px-3 py-2 flex items-center space-x-2 shadow-md hover:shadow-lg transition-shadow`}>
                  {getStakeholderIcon(stakeholder.sentiment)}
                  <span className="text-sm font-medium">{stakeholder.name}</span>
                </div>

                {/* Tooltip */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-3 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  <div className="font-semibold mb-1">{stakeholder.name}</div>
                  <div>Influence: {stakeholder.influence}</div>
                  <div>Interest: {stakeholder.interest}</div>
                  {stakeholder.role && <div>Role: {stakeholder.role}</div>}
                  <div className="mt-2 text-yellow-300">
                    Strategy: {getQuadrantStrategy(stakeholder.influence, stakeholder.interest)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Axis labels */}
          <div className="absolute bottom-6 left-8 text-sm text-gray-600">Low</div>
          <div className="absolute bottom-6 right-8 text-sm text-gray-600">High</div>
          <div className="absolute left-6 bottom-8 text-sm text-gray-600">Low</div>
          <div className="absolute left-6 top-8 text-sm text-gray-600">High</div>
        </div>

        {/* Stakeholder list */}
        <div className="w-64 ml-6 space-y-2 overflow-auto">
          <h3 className="font-semibold text-gray-900 mb-3">Engagement Strategy</h3>
          {data.stakeholders.map((stakeholder, idx) => (
            <div key={idx} className={`${getStakeholderColor(stakeholder.sentiment)} border rounded p-2`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{stakeholder.name}</span>
                {getStakeholderIcon(stakeholder.sentiment)}
              </div>
              <div className="text-xs space-y-1">
                <div className="text-gray-600">
                  {getQuadrantStrategy(stakeholder.influence, stakeholder.interest)}
                </div>
                {stakeholder.role && (
                  <div className="text-gray-500">{stakeholder.role}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <UserCheck className="w-4 h-4 text-green-600 mr-1" />
          <span className="text-gray-600">Supportive</span>
        </div>
        <div className="flex items-center">
          <UserMinus className="w-4 h-4 text-gray-600 mr-1" />
          <span className="text-gray-600">Neutral</span>
        </div>
        <div className="flex items-center">
          <UserX className="w-4 h-4 text-red-600 mr-1" />
          <span className="text-gray-600">Opposed</span>
        </div>
      </div>
    </div>
  )
}