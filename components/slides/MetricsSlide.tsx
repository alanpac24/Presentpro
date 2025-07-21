import React from 'react'
import { BaseSlideProps, MetricsSlideData } from './types'
import { SlideLayout, SlideHeader, MetricCard } from './shared'

interface MetricsSlideProps extends BaseSlideProps {
  data: MetricsSlideData
}

export function MetricsSlide({ data, className = '' }: MetricsSlideProps) {
  return (
    <SlideLayout className={className}>
      <SlideHeader 
        title={data.title}
        subtitle={data.subtitle}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        {data.metrics.map((metric, idx) => (
          <MetricCard
            key={idx}
            value={metric.value}
            label={metric.label}
            trend={metric.trend}
            color={metric.color}
          />
        ))}
      </div>
    </SlideLayout>
  )
}