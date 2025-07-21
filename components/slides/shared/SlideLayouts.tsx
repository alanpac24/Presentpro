import React from 'react'
import { cn } from '@/lib/utils'

interface SlideLayoutProps {
  children: React.ReactNode
  className?: string
}

export function SlideLayout({ children, className = '' }: SlideLayoutProps) {
  return (
    <div className={cn("h-full flex flex-col", className)}>
      {children}
    </div>
  )
}

interface TwoColumnLayoutProps {
  left: React.ReactNode
  right: React.ReactNode
  className?: string
  leftClassName?: string
  rightClassName?: string
}

export function TwoColumnLayout({ left, right, className = '', leftClassName = '', rightClassName = '' }: TwoColumnLayoutProps) {
  return (
    <div className={cn("flex-1 grid md:grid-cols-2 gap-6", className)}>
      <div className={leftClassName}>{left}</div>
      <div className={rightClassName}>{right}</div>
    </div>
  )
}

interface GridLayoutProps {
  children: React.ReactNode
  columns?: number
  className?: string
}

export function GridLayout({ children, columns = 3, className = '' }: GridLayoutProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }

  return (
    <div className={cn(`grid ${gridCols[columns as keyof typeof gridCols] || 'md:grid-cols-3'} gap-4`, className)}>
      {children}
    </div>
  )
}

interface CenteredLayoutProps {
  children: React.ReactNode
  className?: string
}

export function CenteredLayout({ children, className = '' }: CenteredLayoutProps) {
  return (
    <div className={cn("h-full flex flex-col justify-center items-center text-center", className)}>
      {children}
    </div>
  )
}