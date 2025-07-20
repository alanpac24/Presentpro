import React from 'react'
import { BaseSlideProps, HypothesisTreeSlideData } from './types'
import { GitBranch, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface HypothesisTreeSlideProps extends BaseSlideProps {
  data: HypothesisTreeSlideData
}

export function HypothesisTreeSlide({ data, className = '' }: HypothesisTreeSlideProps) {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'proven': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'disproven': return <XCircle className="w-4 h-4 text-red-600" />
      case 'partial': return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default: return <GitBranch className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'proven': return 'border-green-500 bg-green-50'
      case 'disproven': return 'border-red-500 bg-red-50'
      case 'partial': return 'border-yellow-500 bg-yellow-50'
      default: return 'border-gray-300 bg-white'
    }
  }

  const renderBranch = (branch: any, level: number = 0) => {
    const marginLeft = level * 48
    
    return (
      <div key={branch.hypothesis} className="relative">
        {level > 0 && (
          <div className="absolute -left-6 top-6 w-6 border-t-2 border-gray-300"></div>
        )}
        
        <div className={`relative border-2 rounded-lg p-4 mb-4 ${getStatusColor(branch.status)}`} style={{ marginLeft: `${marginLeft}px` }}>
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-gray-900 flex-1">{branch.hypothesis}</h4>
            {getStatusIcon(branch.status)}
          </div>
          
          {branch.evidence && (
            <div className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Evidence:</span> {branch.evidence}
            </div>
          )}
          
          {branch.dataRequired && (
            <div className="text-xs text-gray-500 italic">
              Data needed: {branch.dataRequired}
            </div>
          )}
        </div>

        {branch.subHypotheses && branch.subHypotheses.length > 0 && (
          <div className="relative">
            {level < 2 && (
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-300" style={{ marginLeft: `${marginLeft}px` }}></div>
            )}
            {branch.subHypotheses.map((sub: any, idx: number) => (
              <div key={idx}>
                {renderBranch(sub, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    )
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
        <div className="w-20 h-1 bg-indigo-600 mt-4"></div>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Main hypothesis */}
        <div className="bg-indigo-600 text-white rounded-lg p-6 mb-6">
          <div className="flex items-center mb-2">
            <GitBranch className="w-6 h-6 mr-2" />
            <h3 className="text-xl font-semibold">Core Hypothesis</h3>
          </div>
          <p className="text-lg">{data.mainHypothesis}</p>
        </div>

        {/* Branches */}
        <div className="space-y-2">
          {data.branches.map((branch, idx) => (
            <div key={idx}>
              {renderBranch(branch)}
            </div>
          ))}
        </div>
      </div>

      {/* Status summary */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-sm bg-gray-50 rounded-lg p-3">
        <div className="flex items-center">
          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
          <span className="text-gray-600">Proven</span>
        </div>
        <div className="flex items-center">
          <AlertCircle className="w-4 h-4 text-yellow-600 mr-1" />
          <span className="text-gray-600">Partially Proven</span>
        </div>
        <div className="flex items-center">
          <XCircle className="w-4 h-4 text-red-600 mr-1" />
          <span className="text-gray-600">Disproven</span>
        </div>
        <div className="flex items-center">
          <GitBranch className="w-4 h-4 text-gray-400 mr-1" />
          <span className="text-gray-600">To Be Tested</span>
        </div>
      </div>
    </div>
  )
}