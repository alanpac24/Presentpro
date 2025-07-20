import React from 'react'
import { BaseSlideProps, ProcessFlowSlideData } from './types'
import { ArrowRight, CheckCircle } from 'lucide-react'

interface ProcessFlowSlideProps extends BaseSlideProps {
  data: ProcessFlowSlideData
}

export function ProcessFlowSlide({ data, className = '' }: ProcessFlowSlideProps) {
  const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-pink-600']

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

      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl">
          {/* Main process flow */}
          <div className="flex items-center justify-between mb-8">
            {data.steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex-1 max-w-xs">
                  <div className={`${colors[idx % colors.length]} text-white rounded-lg p-6 hover:scale-105 transition-transform cursor-pointer`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl font-bold opacity-50">{idx + 1}</span>
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.name}</h3>
                    <p className="text-sm opacity-90">{step.description}</p>
                    
                    {/* Sub-steps */}
                    {step.subSteps && step.subSteps.length > 0 && (
                      <div className="mt-4 space-y-1">
                        {step.subSteps.map((subStep, subIdx) => (
                          <div key={subIdx} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5 mr-2 opacity-70"></div>
                            <span className="text-xs opacity-90">{subStep}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Duration */}
                  {step.duration && (
                    <div className="mt-2 text-center text-sm text-gray-600">
                      {step.duration}
                    </div>
                  )}
                </div>
                
                {idx < data.steps.length - 1 && (
                  <ArrowRight className="w-8 h-8 text-gray-400 mx-4 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Process metrics */}
          {data.metrics && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-6 text-center">
                {data.metrics.totalTime && (
                  <div>
                    <div className="text-sm text-gray-600">Total Time</div>
                    <div className="text-2xl font-bold text-gray-900">{data.metrics.totalTime}</div>
                  </div>
                )}
                {data.metrics.efficiency && (
                  <div>
                    <div className="text-sm text-gray-600">Efficiency Gain</div>
                    <div className="text-2xl font-bold text-green-600">{data.metrics.efficiency}</div>
                  </div>
                )}
                {data.metrics.costSaving && (
                  <div>
                    <div className="text-sm text-gray-600">Cost Saving</div>
                    <div className="text-2xl font-bold text-blue-600">{data.metrics.costSaving}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}