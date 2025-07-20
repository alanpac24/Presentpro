import React from 'react'
import { BaseSlideProps, MatrixSlideData } from './types'

interface MatrixSlideProps extends BaseSlideProps {
  data: MatrixSlideData
}

export function MatrixSlide({ data, className = '' }: MatrixSlideProps) {
  const getQuadrantColor = (x: number, y: number, index: number) => {
    if (data.quadrants && data.quadrants.length === 4) {
      if (x < 0.5 && y < 0.5) return data.quadrants[2].color // Bottom left
      if (x >= 0.5 && y < 0.5) return data.quadrants[3].color // Bottom right
      if (x < 0.5 && y >= 0.5) return data.quadrants[0].color // Top left
      if (x >= 0.5 && y >= 0.5) return data.quadrants[1].color // Top right
    }
    return ['blue', 'green', 'orange', 'red'][index % 4]
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
        <div className="w-20 h-1 bg-blue-600 mt-4"></div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative bg-gray-50 rounded-lg p-8">
          {/* Y-axis label */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-700">
            {data.yAxis.label}
          </div>

          {/* Matrix grid */}
          <div className="relative w-full h-full border-2 border-gray-400">
            {/* Quadrant lines */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-400"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-400"></div>

            {/* Quadrant labels */}
            {data.quadrants && (
              <>
                <div className="absolute top-2 left-2 text-sm font-medium text-gray-600">
                  {data.quadrants[0]?.name}
                </div>
                <div className="absolute top-2 right-2 text-sm font-medium text-gray-600">
                  {data.quadrants[1]?.name}
                </div>
                <div className="absolute bottom-2 left-2 text-sm font-medium text-gray-600">
                  {data.quadrants[2]?.name}
                </div>
                <div className="absolute bottom-2 right-2 text-sm font-medium text-gray-600">
                  {data.quadrants[3]?.name}
                </div>
              </>
            )}

            {/* Plot items */}
            {data.items.map((item, idx) => {
              const size = item.size || 40
              const color = item.color || getQuadrantColor(item.x, item.y, idx)
              
              return (
                <div
                  key={idx}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: `${item.x * 100}%`,
                    top: `${(1 - item.y) * 100}%`, // Invert Y axis
                  }}
                >
                  <div
                    className={`rounded-full flex items-center justify-center text-white font-semibold shadow-lg hover:scale-110 transition-transform cursor-pointer`}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: color,
                      fontSize: `${Math.max(10, size / 4)}px`
                    }}
                  >
                    {item.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.name}
                  </div>
                </div>
              )
            })}
          </div>

          {/* X-axis labels */}
          <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-sm text-gray-600">
            <span>{data.xAxis.labels[0]}</span>
            <span className="font-medium">{data.xAxis.label}</span>
            <span>{data.xAxis.labels[1]}</span>
          </div>

          {/* Y-axis labels */}
          <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-sm text-gray-600">
            <span>{data.yAxis.labels[1]}</span>
            <span>{data.yAxis.labels[0]}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: item.color || getQuadrantColor(item.x, item.y, idx) }}
              />
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}