import React from 'react'
import { BaseSlideProps, InitiativePrioritizationSlideData } from './types'
import { Zap, Clock, DollarSign } from 'lucide-react'

interface InitiativePrioritizationSlideProps extends BaseSlideProps {
  data: InitiativePrioritizationSlideData
}

export function InitiativePrioritizationSlide({ data, className = '' }: InitiativePrioritizationSlideProps) {
  const getEffortPosition = (effort: string) => {
    switch (effort.toLowerCase()) {
      case 'high': return '85%'
      case 'medium': return '50%'
      case 'low': return '15%'
      default: return '50%'
    }
  }

  const getImpactPosition = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return '85%'
      case 'medium': return '50%'
      case 'low': return '15%'
      default: return '50%'
    }
  }

  const getQuadrantColor = (effort: string, impact: string) => {
    const e = effort.toLowerCase()
    const i = impact.toLowerCase()
    
    if (e === 'low' && i === 'high') return 'bg-green-600' // Quick wins
    if (e === 'high' && i === 'high') return 'bg-blue-600' // Major projects
    if (e === 'low' && i === 'low') return 'bg-gray-400' // Fill-ins
    return 'bg-orange-600' // Question marks
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
        <div className="w-20 h-1 bg-teal-600 mt-4"></div>
      </div>

      <div className="flex-1 relative bg-gray-50 rounded-lg p-8">
        {/* Axes labels */}
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
          Impact
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600">
          Effort Required
        </div>

        {/* Grid */}
        <div className="absolute inset-8">
          {/* Quadrant lines */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-300"></div>

          {/* Quadrant labels */}
          <div className="absolute top-2 left-2 text-xs text-gray-500 font-medium">
            Quick Wins
          </div>
          <div className="absolute top-2 right-2 text-xs text-gray-500 font-medium">
            Major Projects
          </div>
          <div className="absolute bottom-2 left-2 text-xs text-gray-500 font-medium">
            Fill-ins
          </div>
          <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-medium">
            Question Marks
          </div>

          {/* Initiatives */}
          {data.initiatives.map((initiative, idx) => (
            <div
              key={idx}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{
                left: getEffortPosition(initiative.effort),
                top: `${100 - parseInt(getImpactPosition(initiative.impact))}%`
              }}
            >
              <div className={`${getQuadrantColor(initiative.effort, initiative.impact)} text-white rounded-lg px-4 py-2 shadow-lg hover:scale-110 transition-transform`}>
                <div className="font-semibold text-sm">{initiative.name}</div>
                {initiative.value && (
                  <div className="text-xs opacity-90 mt-1">{initiative.value}</div>
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white p-3 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="font-semibold mb-1">{initiative.name}</div>
                <div>Impact: {initiative.impact}</div>
                <div>Effort: {initiative.effort}</div>
                {initiative.timeframe && <div>Timeframe: {initiative.timeframe}</div>}
                {initiative.owner && <div>Owner: {initiative.owner}</div>}
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

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <Zap className="w-4 h-4 text-green-600 mr-1" />
          <span className="text-gray-600">Quick Wins (Low effort, High impact)</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 text-blue-600 mr-1" />
          <span className="text-gray-600">Major Projects (High effort, High impact)</span>
        </div>
        {data.totalValue && (
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-gray-600 mr-1" />
            <span className="text-gray-600">Total Value: {data.totalValue}</span>
          </div>
        )}
      </div>
    </div>
  )
}