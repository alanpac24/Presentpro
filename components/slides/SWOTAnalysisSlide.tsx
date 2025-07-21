import React from 'react'
import { BaseSlideProps, SWOTAnalysisSlideData } from './types'
import { Shield, AlertTriangle, TrendingUp, Zap } from 'lucide-react'
import { SlideLayout, SlideHeader } from './shared'

interface SWOTAnalysisSlideProps extends BaseSlideProps {
  data: SWOTAnalysisSlideData
}

export function SWOTAnalysisSlide({ data, className = '' }: SWOTAnalysisSlideProps) {
  const quadrants = [
    {
      title: 'Strengths',
      items: data.strengths,
      icon: Shield,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900'
    },
    {
      title: 'Weaknesses',
      items: data.weaknesses,
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900'
    },
    {
      title: 'Opportunities',
      items: data.opportunities,
      icon: TrendingUp,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900'
    },
    {
      title: 'Threats',
      items: data.threats,
      icon: Zap,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconColor: 'text-orange-600',
      titleColor: 'text-orange-900'
    }
  ]

  return (
    <SlideLayout className={className}>
      <SlideHeader title={data.title} />

      <div className="flex-1 grid grid-cols-2 gap-4">
        {quadrants.map((quadrant, idx) => {
          const Icon = quadrant.icon
          return (
            <div
              key={idx}
              className={`${quadrant.bgColor} ${quadrant.borderColor} border-2 rounded-lg p-6 flex flex-col`}
            >
              <div className="flex items-center mb-4">
                <Icon className={`w-6 h-6 ${quadrant.iconColor} mr-3`} />
                <h3 className={`text-xl font-semibold ${quadrant.titleColor}`}>
                  {quadrant.title}
                </h3>
              </div>
              <ul className="space-y-2 flex-1">
                {quadrant.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start">
                    <span className={`${quadrant.iconColor} mr-2`}>•</span>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      {/* Center divider lines */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="absolute h-full w-0.5 bg-gray-300 -translate-x-1/2"></div>
        <div className="absolute w-full h-0.5 bg-gray-300 -translate-y-1/2"></div>
      </div>
    </SlideLayout>
  )
}