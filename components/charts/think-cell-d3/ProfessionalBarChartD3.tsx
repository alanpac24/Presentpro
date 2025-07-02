'use client'

import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

interface BarData {
  category: string
  value: number
  series?: string
}

interface ProfessionalBarChartD3Props {
  data: BarData[]
  width?: number
  height?: number
  type?: 'single' | 'grouped' | 'stacked'
}

// Think-cell style colors palette
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

export function ProfessionalBarChartD3({ 
  data, 
  width = 800, 
  height = 400,
  type = 'single'
}: ProfessionalBarChartD3Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const margin = { top: 40, right: 120, bottom: 60, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Process data for different chart types
    let processedData: any[] = data
    let series: string[] = []
    
    if (type === 'grouped' || type === 'stacked') {
      series = Array.from(new Set(data.map(d => d.series || '')))
      const categories = Array.from(new Set(data.map(d => d.category)))
      
      if (type === 'stacked') {
        // Calculate cumulative values for stacking
        processedData = categories.map(category => {
          let cumulative = 0
          const stackData = series.map(seriesName => {
            const value = data.find(d => d.category === category && d.series === seriesName)?.value || 0
            const y0 = cumulative
            cumulative += value
            return { category, series: seriesName, value, y0, y1: cumulative }
          })
          return { category, stack: stackData, total: cumulative }
        })
      }
    }

    // Scales
    const xScale = d3.scaleBand()
      .domain(type === 'stacked' ? processedData.map(d => d.category) : data.map(d => d.category))
      .range([0, innerWidth])
      .padding(0.2)

    const yMax = type === 'stacked' 
      ? d3.max(processedData, d => d.total) as number
      : d3.max(data, d => d.value) as number

    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.1])
      .range([innerHeight, 0])

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(series.length > 0 ? series : ['default'])
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
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d3.format('.0f')))
      .style('color', STYLE_CONSTANTS.axis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-family', 'Arial, sans-serif')

    // Draw bars based on type
    if (type === 'single') {
      g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.category)!)
        .attr('y', d => yScale(d.value))
        .attr('width', xScale.bandwidth())
        .attr('height', d => innerHeight - yScale(d.value))
        .attr('fill', COLOR_PALETTE[0])
        .attr('opacity', 0.9)

      // Value labels
      g.selectAll('.label')
        .data(data)
        .enter().append('text')
        .attr('x', d => xScale(d.category)! + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.value) - 5)
        .attr('text-anchor', 'middle')
        .text(d => d.value)
        .style('font-size', '11px')
        .style('font-family', 'Arial, sans-serif')
        .style('fill', STYLE_CONSTANTS.text)
        .style('font-weight', '500')
    } else if (type === 'grouped') {
      const xSubgroup = d3.scaleBand()
        .domain(series)
        .range([0, xScale.bandwidth()])
        .padding(0.05)

      const categoryGroups = g.selectAll('.category-group')
        .data(Array.from(new Set(data.map(d => d.category))))
        .enter().append('g')
        .attr('class', 'category-group')
        .attr('transform', d => `translate(${xScale(d)},0)`)

      categoryGroups.selectAll('rect')
        .data(category => series.map(seriesName => ({
          category,
          series: seriesName,
          value: data.find(d => d.category === category && d.series === seriesName)?.value || 0
        })))
        .enter().append('rect')
        .attr('x', d => xSubgroup(d.series)!)
        .attr('y', d => yScale(d.value))
        .attr('width', xSubgroup.bandwidth())
        .attr('height', d => innerHeight - yScale(d.value))
        .attr('fill', d => colorScale(d.series) as string)
        .attr('opacity', 0.9)
    } else if (type === 'stacked') {
      const stackGroups = g.selectAll('.stack-group')
        .data(processedData)
        .enter().append('g')
        .attr('class', 'stack-group')
        .attr('transform', d => `translate(${xScale(d.category)},0)`)

      stackGroups.selectAll('rect')
        .data(d => d.stack)
        .enter().append('rect')
        .attr('y', d => yScale(d.y1))
        .attr('width', xScale.bandwidth())
        .attr('height', d => yScale(d.y0) - yScale(d.y1))
        .attr('fill', d => colorScale(d.series) as string)
        .attr('opacity', 0.9)
    }

    // Legend for grouped/stacked
    if (series.length > 0) {
      const legend = svg.append('g')
        .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`)

      const legendItems = legend.selectAll('.legend-item')
        .data(series)
        .enter().append('g')
        .attr('class', 'legend-item')
        .attr('transform', (d, i) => `translate(0, ${i * 20})`)

      legendItems.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', d => colorScale(d) as string)
        .attr('opacity', 0.9)

      legendItems.append('text')
        .attr('x', 18)
        .attr('y', 10)
        .text(d => d)
        .style('font-size', '12px')
        .style('font-family', 'Arial, sans-serif')
        .style('fill', STYLE_CONSTANTS.text)
    }

  }, [data, width, height, type])

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