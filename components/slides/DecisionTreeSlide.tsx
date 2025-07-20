import React from 'react'
import { BaseSlideProps, DecisionTreeSlideData } from './types'
import { Square, Circle, ChevronRight } from 'lucide-react'

interface DecisionTreeSlideProps extends BaseSlideProps {
  data: DecisionTreeSlideData
}

interface TreeNode {
  type: 'decision' | 'chance' | 'outcome'
  label: string
  value?: string
  probability?: string
  branches?: TreeNode[]
}

export function DecisionTreeSlide({ data, className = '' }: DecisionTreeSlideProps) {
  const renderNode = (node: TreeNode, level: number = 0, isLast: boolean = false) => {
    const nodeIcon = node.type === 'decision' ? 
      <Square className="w-6 h-6 text-blue-600" /> : 
      node.type === 'chance' ? 
      <Circle className="w-6 h-6 text-orange-600" /> : 
      null

    const nodeColor = node.type === 'decision' ? 'bg-blue-100 border-blue-300' : 
                     node.type === 'chance' ? 'bg-orange-100 border-orange-300' : 
                     'bg-green-100 border-green-300'

    return (
      <div className="relative flex items-start">
        {/* Connection line from parent */}
        {level > 0 && (
          <div className="absolute -left-12 top-8 w-12 border-t-2 border-gray-400"></div>
        )}

        <div className="flex flex-col">
          {/* Node */}
          <div className={`${nodeColor} border-2 rounded-lg p-4 min-w-[200px] shadow-md`}>
            <div className="flex items-center mb-2">
              {nodeIcon}
              <span className="ml-2 font-semibold text-gray-900">{node.label}</span>
            </div>
            {node.probability && (
              <div className="text-sm text-gray-600">P = {node.probability}</div>
            )}
            {node.value && (
              <div className="text-sm font-medium text-gray-700 mt-1">{node.value}</div>
            )}
          </div>

          {/* Branches */}
          {node.branches && node.branches.length > 0 && (
            <div className="relative ml-12 mt-4 space-y-4">
              {/* Vertical line */}
              {node.branches.length > 1 && (
                <div className="absolute left-0 top-8 bottom-8 w-px bg-gray-400"></div>
              )}
              
              {node.branches.map((branch, idx) => (
                <div key={idx} className="relative">
                  {renderNode(branch, level + 1, idx === node.branches!.length - 1)}
                </div>
              ))}
            </div>
          )}
        </div>
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
        <div className="w-20 h-1 bg-purple-600 mt-4"></div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex justify-center">
          <div className="inline-block">
            {renderNode(data.tree)}
          </div>
        </div>
      </div>

      {/* Legend and expected value */}
      <div className="mt-6 flex items-center justify-between bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center">
            <Square className="w-4 h-4 text-blue-600 mr-1" />
            <span className="text-gray-600">Decision Node</span>
          </div>
          <div className="flex items-center">
            <Circle className="w-4 h-4 text-orange-600 mr-1" />
            <span className="text-gray-600">Chance Node</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-1"></div>
            <span className="text-gray-600">Outcome</span>
          </div>
        </div>
        
        {data.expectedValue && (
          <div className="text-right">
            <div className="text-sm text-gray-600">Expected Value</div>
            <div className="text-xl font-bold text-gray-900">{data.expectedValue}</div>
          </div>
        )}
      </div>
    </div>
  )
}