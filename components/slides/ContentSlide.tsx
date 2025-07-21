import React from 'react'
import { BaseSlideProps, ContentSlideData } from './types'
import { SlideLayout, SlideHeader, ListItem } from './shared'

interface ContentSlideProps extends BaseSlideProps {
  data: ContentSlideData
}

export function ContentSlide({ data, className = '' }: ContentSlideProps) {
  return (
    <SlideLayout className={className}>
      <SlideHeader title={data.title} />

      <div className="flex-1 overflow-auto">
        {data.content && (
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            {data.content}
          </p>
        )}

        {data.bullets && data.bullets.length > 0 && (
          <ul className="space-y-4">
            {data.bullets.map((bullet, idx) => (
              <ListItem key={idx} icon={<div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />}>
                {bullet}
              </ListItem>
            ))}
          </ul>
        )}
      </div>
    </SlideLayout>
  )
}