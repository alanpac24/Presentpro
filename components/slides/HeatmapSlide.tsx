import React from 'react'
import { BaseSlideProps, HeatmapSlideData } from './types'

interface HeatmapSlideProps extends BaseSlideProps {
  data: HeatmapSlideData
}

export function HeatmapSlide({ data, className = '' }: HeatmapSlideProps) {
  const getColor = (value: number) => {
    if (value >= 80) return 'bg-green-600'
    if (value >= 60) return 'bg-green-400'
    if (value >= 40) return 'bg-yellow-400'
    if (value >= 20) return 'bg-orange-400'
    return 'bg-red-500'
  }

  const getTextColor = (value: number) => {
    return value >= 60 ? 'text-white' : 'text-gray-900'
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

      <div className="flex-1 flex flex-col">
        {/* Matrix */}
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left font-semibold text-gray-700"></th>
                {data.columns.map((col, idx) => (
                  <th key={idx} className="p-3 text-center font-semibold text-gray-700 border-b-2 border-gray-200">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="p-3 font-medium text-gray-700 border-r-2 border-gray-200">
                    {row.label}
                  </td>
                  {row.values.map((cell, colIdx) => (
                    <td key={colIdx} className="p-2">
                      <div className={`${getColor(cell.value)} ${getTextColor(cell.value)} rounded-lg p-3 text-center transition-all hover:scale-105`}>
                        <div className="font-bold text-lg">{cell.value}</div>
                        {cell.label && (
                          <div className="text-xs mt-1 opacity-90">{cell.label}</div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-auto pt-6 flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Low</span>
            <div className="flex space-x-1">
              <div className="w-6 h-6 bg-red-500 rounded"></div>
              <div className="w-6 h-6 bg-orange-400 rounded"></div>
              <div className="w-6 h-6 bg-yellow-400 rounded"></div>
              <div className="w-6 h-6 bg-green-400 rounded"></div>
              <div className="w-6 h-6 bg-green-600 rounded"></div>
            </div>
            <span className="text-sm text-gray-600">High</span>
          </div>
        </div>
      </div>
    </div>
  )
}