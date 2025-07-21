import React from 'react'
import { cn } from '@/lib/utils'

interface SlideHeaderProps {
  title: string
  subtitle?: string
  className?: string
  showDivider?: boolean
}

export function SlideHeader({ title, subtitle, className = '', showDivider = true }: SlideHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600">{subtitle}</p>
      )}
      {showDivider && <div className="w-20 h-1 bg-blue-600 mt-4"></div>}
    </div>
  )
}

interface SectionHeaderProps {
  title: string
  icon?: React.ReactNode
  className?: string
}

export function SectionHeader({ title, icon, className = '' }: SectionHeaderProps) {
  return (
    <h3 className={cn("text-xl font-semibold text-gray-800 flex items-center mb-4", className)}>
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </h3>
  )
}

interface MetricCardProps {
  label: string
  value: string
  description?: string
  trend?: string
  color?: string
  className?: string
}

export function MetricCard({ label, value, description, trend, color = 'blue', className = '' }: MetricCardProps) {
  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      orange: 'bg-orange-50 border-orange-200 text-orange-900',
      red: 'bg-red-50 border-red-200 text-red-900'
    }
    return colors[color] || colors.blue
  }

  const getTrendIcon = () => {
    if (!trend) return null
    if (trend.includes('+') || trend.toLowerCase().includes('up')) {
      return '↑'
    }
    if (trend.includes('-') || trend.toLowerCase().includes('down')) {
      return '↓'
    }
    return '→'
  }

  return (
    <div className={cn("rounded-xl border-2 p-6 flex flex-col justify-between", getColorClasses(color), className)}>
      <div>
        <div className="text-3xl md:text-4xl font-bold mb-2">
          {value}
        </div>
        <div className="text-sm md:text-base font-medium opacity-80">
          {label}
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-4 text-sm">
          <span className="mr-2">{getTrendIcon()}</span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  detail?: string
  className?: string
}

export function FeatureCard({ title, description, icon, detail, className = '' }: FeatureCardProps) {
  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all", className)}>
      <div className="flex items-start">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
          {detail && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700">
              {detail}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface HighlightBoxProps {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  className?: string
}

export function HighlightBox({ children, variant = 'info', className = '' }: HighlightBoxProps) {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    warning: 'bg-orange-50 border-orange-200 text-orange-900',
    error: 'bg-red-50 border-red-200 text-red-900'
  }

  return (
    <div className={cn("border rounded-lg p-4", variants[variant], className)}>
      {children}
    </div>
  )
}

interface ListItemProps {
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export function ListItem({ children, icon, className = '' }: ListItemProps) {
  return (
    <div className={cn("flex items-start", className)}>
      {icon && <span className="flex-shrink-0 mr-2">{icon}</span>}
      <span className="text-sm text-gray-700">{children}</span>
    </div>
  )
}