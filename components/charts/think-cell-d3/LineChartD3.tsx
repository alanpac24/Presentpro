'use client'

import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

interface LineData {
  category: string
  value: number
  series?: string
}

interface LineChartD3Props {
  data: LineData[]
  width?: number
  height?: number
  showPoints?: boolean
  curved?: boolean
}

// Think-cell style colors
const COLOR_PALETTE = [
  '#4A6FA5',  // Muted blue
  '#166534',  // Muted green
  '#E07B39',  // Muted orange
  '#C93C37',  // Muted red
  '#7E57C2',  // Muted purple
  '#5D7092',  // Muted gray-blue
]

const STYLE_CONSTANTS = {
  text: '#333333',
  axis: '#666666',
  gridLine: '#E0E0E0',
  background: '#FFFFFF'
}

export function LineChartD3({ 
  data, 
  width = 800, 
  height = 400,
  showPoints = true,
  curved = true
}: LineChartD3Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const margin = { top: 40, right: 120, bottom: 60, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Group data by series if present
    const series = d3.group(data, d => d.series || 'default')
    const categories = Array.from(new Set(data.map(d => d.category)))
    
    // Scales
    const xScale = d3.scalePoint()
      .domain(categories)
      .range([0, innerWidth])
      .padding(0.5)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) as number * 1.1])
      .range([innerHeight, 0])

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(Array.from(series.keys()))
      .range(COLOR_PALETTE)

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickFormat(() => ''))
      .style('stroke-dasharray', '2,2')
      .style('opacity', 0.3)
      .selectAll('line')
      .style('stroke', STYLE_CONSTANTS.gridLine)

    // Draw axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .style('color', STYLE_CONSTANTS.axis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-family', 'Arial, sans-serif')

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d3.format('.0f')))
      .style('color', STYLE_CONSTANTS.axis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-family', 'Arial, sans-serif')

    // Line generator
    const line = curved
      ? d3.line<LineData>()
          .x(d => xScale(d.category)!)
          .y(d => yScale(d.value))
          .curve(d3.curveMonotoneX)
      : d3.line<LineData>()
          .x(d => xScale(d.category)!)
          .y(d => yScale(d.value))

    // Draw lines for each series
    series.forEach((values, key) => {
      const color = colorScale(key) as string
      
      // Sort values by category order
      const sortedValues = categories
        .map(cat => values.find(v => v.category === cat))
        .filter(v => v !== undefined) as LineData[]

      // Draw line
      g.append('path')
        .datum(sortedValues)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2.5)
        .attr('d', line)
        .style('opacity', 0.9)

      // Draw points if enabled
      if (showPoints) {
        g.selectAll(`.point-${key}`)
          .data(sortedValues)
          .enter().append('circle')
          .attr('class', `point-${key}`)
          .attr('cx', d => xScale(d.category)!)
          .attr('cy', d => yScale(d.value))
          .attr('r', 4)
          .attr('fill', color)
          .style('opacity', 0.9)

        // Add value labels
        g.selectAll(`.label-${key}`)
          .data(sortedValues)
          .enter().append('text')
          .attr('class', `label-${key}`)
          .attr('x', d => xScale(d.category)!)
          .attr('y', d => yScale(d.value) - 10)
          .attr('text-anchor', 'middle')
          .text(d => d.value)
          .style('font-size', '11px')
          .style('font-family', 'Arial, sans-serif')
          .style('fill', STYLE_CONSTANTS.text)
          .style('font-weight', '500')
      }
    })

    // Legend for multiple series
    if (series.size > 1) {
      const legend = svg.append('g')
        .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`)

      const legendItems = legend.selectAll('.legend-item')
        .data(Array.from(series.keys()))
        .enter().append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`)

      legendItems.append('line')
        .attr('x1', 0)
        .attr('y1', 6)
        .attr('x2', 16)
        .attr('y2', 6)
        .attr('stroke', d => colorScale(d) as string)
        .attr('stroke-width', 2.5)

      legendItems.append('circle')
        .attr('cx', 8)
        .attr('cy', 6)
        .attr('r', 4)
        .attr('fill', d => colorScale(d) as string)

      legendItems.append('text')
        .attr('x', 22)
        .attr('y', 10)
        .text(d => d)
        .style('font-size', '12px')
        .style('font-family', 'Arial, sans-serif')
        .style('fill', STYLE_CONSTANTS.text)
    }

  }, [data, width, height, showPoints, curved])

  return (
    <svg 
      ref={svgRef} 
      width={width} 
      height={height}
      style={{ 
        backgroundColor: STYLE_CONSTANTS.background,
        fontFamily: 'Arial, sans-serif'
      }}
    />
  )
}