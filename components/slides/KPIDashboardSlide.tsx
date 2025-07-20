import React from 'react'
import { BaseSlideProps, KPIDashboardSlideData } from './types'
import { TrendingUp, TrendingDown, Minus, Target } from 'lucide-react'

interface KPIDashboardSlideProps extends BaseSlideProps {
  data: KPIDashboardSlideData
}

export function KPIDashboardSlide({ data, className = '' }: KPIDashboardSlideProps) {
  const getTrendIcon = (trend?: string) => {
    if (!trend) return null
    if (trend.includes('+') || trend.includes('up')) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (trend.includes('-') || trend.includes('down')) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getTrendColor = (trend?: string) => {
    if (!trend) return 'text-gray-600'
    if (trend.includes('+') || trend.includes('up')) return 'text-green-600'
    if (trend.includes('-') || trend.includes('down')) return 'text-red-600'
    return 'text-gray-600'
  }

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100'
    if (status === 'on-track' || status === 'good') return 'bg-green-100 border-green-300'
    if (status === 'at-risk' || status === 'warning') return 'bg-yellow-100 border-yellow-300'
    if (status === 'off-track' || status === 'critical') return 'bg-red-100 border-red-300'
    return 'bg-gray-100 border-gray-300'
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

      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.kpis.map((kpi, idx) => (
          <div key={idx} className={`${getStatusColor(kpi.status)} border-2 rounded-lg p-4 hover:shadow-lg transition-shadow`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{kpi.name}</h3>
              {kpi.target && (
                <Target className="w-4 h-4 text-gray-400" />
              )}
            </div>
            
            <div className="mb-3">
              <div className="text-3xl font-bold text-gray-900">{kpi.value}</div>
              {kpi.unit && (
                <span className="text-sm text-gray-600 ml-1">{kpi.unit}</span>
              )}
            </div>

            <div className="space-y-2">
              {kpi.trend && (
                <div className="flex items-center space-x-2">
                  {getTrendIcon(kpi.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(kpi.trend)}`}>
                    {kpi.trend}
                  </span>
                </div>
              )}

              {kpi.target && (
                <div className="text-sm text-gray-600">
                  Target: <span className="font-medium">{kpi.target}</span>
                </div>
              )}

              {kpi.comparison && (
                <div className="text-sm text-gray-600">
                  {kpi.comparison}
                </div>
              )}
            </div>

            {/* Progress bar if applicable */}
            {kpi.progress !== undefined && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, kpi.progress)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1 text-right">
                  {kpi.progress}%
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary footer */}
      {data.summary && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700">{data.summary}</p>
        </div>
      )}
    </div>
  )
}