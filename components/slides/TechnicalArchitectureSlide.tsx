import React from 'react'
import { BaseSlideProps, TechnicalArchitectureSlideData } from './types'
import { Server, Cloud, Shield, Database, Network, Cpu } from 'lucide-react'

interface TechnicalArchitectureSlideProps extends BaseSlideProps {
  data: TechnicalArchitectureSlideData
}

export function TechnicalArchitectureSlide({ data, className = '' }: TechnicalArchitectureSlideProps) {
  const getLayerIcon = (layerName: string) => {
    const name = layerName.toLowerCase()
    if (name.includes('cloud') || name.includes('infrastructure')) return <Cloud className="w-5 h-5" />
    if (name.includes('security')) return <Shield className="w-5 h-5" />
    if (name.includes('data') || name.includes('database')) return <Database className="w-5 h-5" />
    if (name.includes('network')) return <Network className="w-5 h-5" />
    if (name.includes('process') || name.includes('compute')) return <Cpu className="w-5 h-5" />
    return <Server className="w-5 h-5" />
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

      <div className="flex-1 grid md:grid-cols-2 gap-6">
        {/* Architecture Diagram/Layers */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">System Architecture</h3>
          {data.architectureLayers && data.architectureLayers.map((layer, index) => (
            <div key={index} className="bg-gradient-to-r from-blue-50 to-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  {getLayerIcon(layer.layer)}
                </div>
                <h4 className="font-semibold text-gray-900">{layer.layer}</h4>
              </div>
              <p className="text-sm text-gray-700 mb-2">{layer.description}</p>
              {layer.technologies && layer.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {layer.technologies.map((tech, tIndex) => (
                    <span key={tIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Key Features & Security */}
        <div className="space-y-4">
          {/* Key Technical Features */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Key Technical Features</h4>
            <ul className="space-y-2">
              {data.keyFeatures && data.keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="text-blue-600 mr-2 mt-0.5">▪</span>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Security Measures */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-600" />
              Security & Compliance
            </h4>
            <ul className="space-y-2">
              {data.securityMeasures && data.securityMeasures.map((measure, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">{measure}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Performance Metrics */}
          {data.performanceMetrics && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Performance Metrics</h4>
              <div className="space-y-2">
                {data.performanceMetrics.uptime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Uptime SLA</span>
                    <span className="font-semibold text-purple-700">{data.performanceMetrics.uptime}</span>
                  </div>
                )}
                {data.performanceMetrics.responseTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Avg Response Time</span>
                    <span className="font-semibold text-purple-700">{data.performanceMetrics.responseTime}</span>
                  </div>
                )}
                {data.performanceMetrics.scalability && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Scalability</span>
                    <span className="font-semibold text-purple-700">{data.performanceMetrics.scalability}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deployment Options */}
      {data.deploymentOptions && data.deploymentOptions.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-2">Deployment Options</h4>
          <div className="grid md:grid-cols-3 gap-3">
            {data.deploymentOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-lg p-3 text-center">
                <p className="font-medium text-gray-800">{option}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}