import React from 'react'
import { BaseSlideProps, OrgStructureSlideData } from './types'
import { Users, User, Building } from 'lucide-react'

interface OrgStructureSlideProps extends BaseSlideProps {
  data: OrgStructureSlideData
}

interface OrgNode {
  title: string
  name?: string
  department?: string
  reports?: OrgNode[]
  highlight?: boolean
}

export function OrgStructureSlide({ data, className = '' }: OrgStructureSlideProps) {
  const renderOrgNode = (node: OrgNode, level: number = 0) => {
    const isTopLevel = level === 0
    const hasReports = node.reports && node.reports.length > 0
    const bgColor = node.highlight ? 'bg-blue-600 text-white' : 
                   isTopLevel ? 'bg-gray-800 text-white' : 
                   'bg-white border-2 border-gray-300'

    return (
      <div className="flex flex-col items-center">
        {/* Node */}
        <div className={`${bgColor} rounded-lg p-4 shadow-lg min-w-[180px] text-center`}>
          <div className="flex items-center justify-center mb-2">
            {isTopLevel ? (
              <Building className="w-5 h-5 mr-2" />
            ) : (
              <User className="w-4 h-4 mr-1" />
            )}
            <span className="font-semibold text-sm">{node.title}</span>
          </div>
          {node.name && (
            <div className={`text-sm ${node.highlight || isTopLevel ? 'opacity-90' : 'text-gray-600'}`}>
              {node.name}
            </div>
          )}
          {node.department && (
            <div className={`text-xs mt-1 ${node.highlight || isTopLevel ? 'opacity-80' : 'text-gray-500'}`}>
              {node.department}
            </div>
          )}
        </div>

        {/* Connector and reports */}
        {hasReports && (
          <>
            {/* Vertical line */}
            <div className="w-px h-8 bg-gray-400"></div>
            
            {/* Horizontal line if multiple reports */}
            {node.reports!.length > 1 && (
              <div className="relative w-full">
                <div className="absolute top-0 left-0 right-0 h-px bg-gray-400"></div>
              </div>
            )}

            {/* Reports */}
            <div className="flex space-x-8 mt-8">
              {node.reports!.map((report, idx) => (
                <div key={idx} className="relative">
                  {/* Vertical line from horizontal connector */}
                  {node.reports!.length > 1 && (
                    <div className="absolute left-1/2 -top-8 w-px h-8 bg-gray-400"></div>
                  )}
                  {renderOrgNode(report, level + 1)}
                </div>
              ))}
            </div>
          </>
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
        <div className="w-20 h-1 bg-gray-600 mt-4"></div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex justify-center p-8">
          {renderOrgNode(data.structure)}
        </div>
      </div>

      {/* Stats or summary */}
      {data.stats && (
        <div className="mt-6 flex items-center justify-center space-x-8 bg-gray-50 rounded-lg p-4">
          {data.stats.totalEmployees && (
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-600 mr-2" />
              <div>
                <div className="text-xs text-gray-600">Total Employees</div>
                <div className="font-semibold text-gray-900">{data.stats.totalEmployees}</div>
              </div>
            </div>
          )}
          {data.stats.departments && (
            <div className="flex items-center">
              <Building className="w-5 h-5 text-gray-600 mr-2" />
              <div>
                <div className="text-xs text-gray-600">Departments</div>
                <div className="font-semibold text-gray-900">{data.stats.departments}</div>
              </div>
            </div>
          )}
          {data.stats.reportingLevels && (
            <div>
              <div className="text-xs text-gray-600">Reporting Levels</div>
              <div className="font-semibold text-gray-900">{data.stats.reportingLevels}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}