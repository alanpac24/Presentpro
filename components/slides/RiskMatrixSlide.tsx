import React from 'react'
import { BaseSlideProps, RiskMatrixSlideData } from './types'
import { AlertTriangle } from 'lucide-react'

interface RiskMatrixSlideProps extends BaseSlideProps {
  data: RiskMatrixSlideData
}

export function RiskMatrixSlide({ data, className = '' }: RiskMatrixSlideProps) {
  const getQuadrantColor = (impact: string, likelihood: string) => {
    const impactLevel = impact.toLowerCase()
    const likelihoodLevel = likelihood.toLowerCase()
    
    if (impactLevel === 'high' && likelihoodLevel === 'high') return 'bg-red-500'
    if (impactLevel === 'high' && likelihoodLevel === 'medium') return 'bg-orange-500'
    if (impactLevel === 'high' && likelihoodLevel === 'low') return 'bg-yellow-500'
    if (impactLevel === 'medium' && likelihoodLevel === 'high') return 'bg-orange-500'
    if (impactLevel === 'medium' && likelihoodLevel === 'medium') return 'bg-yellow-500'
    if (impactLevel === 'medium' && likelihoodLevel === 'low') return 'bg-green-400'
    if (impactLevel === 'low' && likelihoodLevel === 'high') return 'bg-yellow-500'
    if (impactLevel === 'low' && likelihoodLevel === 'medium') return 'bg-green-400'
    return 'bg-green-500'
  }

  const impactLevels = ['Low', 'Medium', 'High']
  const likelihoodLevels = ['Low', 'Medium', 'High']

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-lg text-gray-600">{data.subtitle}</p>
        )}
        <div className="w-20 h-1 bg-red-600 mt-4"></div>
      </div>

      <div className="flex-1 flex">
        {/* Matrix */}
        <div className="flex-1 relative">
          {/* Y-axis label */}
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
            Impact
          </div>

          {/* X-axis label */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-600">
            Likelihood
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 grid-rows-3 gap-1 h-full">
            {impactLevels.reverse().map((impact, iIdx) => (
              likelihoodLevels.map((likelihood, lIdx) => {
                const quadrantRisks = data.risks.filter(
                  r => r.impact.toLowerCase() === impact.toLowerCase() && 
                       r.likelihood.toLowerCase() === likelihood.toLowerCase()
                )
                const bgColor = getQuadrantColor(impact, likelihood)
                
                return (
                  <div 
                    key={`${iIdx}-${lIdx}`}
                    className={`${bgColor} bg-opacity-20 border-2 border-gray-300 p-2 relative group`}
                  >
                    {/* Quadrant label */}
                    <div className="absolute top-1 left-2 text-xs text-gray-600">
                      {iIdx === 0 && lIdx === 0 && 'Low Risk'}
                      {iIdx === 0 && lIdx === 2 && 'Medium Risk'}
                      {iIdx === 2 && lIdx === 0 && 'Medium Risk'}
                      {iIdx === 2 && lIdx === 2 && 'High Risk'}
                    </div>

                    {/* Risks in this quadrant */}
                    <div className="flex flex-wrap gap-1 mt-4">
                      {quadrantRisks.map((risk, rIdx) => (
                        <div 
                          key={rIdx}
                          className={`${bgColor} text-white px-2 py-1 rounded text-xs font-medium cursor-pointer hover:scale-105 transition-transform`}
                          title={risk.description}
                        >
                          {risk.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            )).flat()}
          </div>

          {/* Axis labels */}
          <div className="absolute -bottom-6 left-0 right-0 flex justify-around text-sm text-gray-600">
            {likelihoodLevels.map((level, idx) => (
              <span key={idx}>{level}</span>
            ))}
          </div>
          <div className="absolute -left-16 top-0 bottom-0 flex flex-col justify-around text-sm text-gray-600">
            {impactLevels.map((level, idx) => (
              <span key={idx}>{level}</span>
            ))}
          </div>
        </div>

        {/* Risk details */}
        <div className="w-80 ml-8 space-y-3 overflow-auto">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
            Risk Details
          </h3>
          {data.risks.map((risk, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{risk.name}</h4>
                <div className={`text-xs px-2 py-1 rounded ${getQuadrantColor(risk.impact, risk.likelihood)} text-white`}>
                  {risk.impact[0]}/{risk.likelihood[0]}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
              {risk.mitigation && (
                <div className="text-xs text-gray-500 italic">
                  Mitigation: {risk.mitigation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-gray-600">Low Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
          <span className="text-gray-600">Medium Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
          <span className="text-gray-600">High Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span className="text-gray-600">Critical Risk</span>
        </div>
      </div>
    </div>
  )
}