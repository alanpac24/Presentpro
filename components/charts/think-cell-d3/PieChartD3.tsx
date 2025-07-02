'use client'

import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

interface PieData {
  category: string
  value: number
}

interface PieChartD3Props {
  data: PieData[]
  width?: number
  height?: number
  showLabels?: boolean
  showPercentages?: boolean
  donut?: boolean
}

// Think-cell style colors
const COLOR_PALETTE = [
  '#4A6FA5',  // Muted blue
  '#166534',  // Muted green
  '#E07B39',  // Muted orange
  '#C93C37',  // Muted red
  '#7E57C2',  // Muted purple
  '#5D7092',  // Muted gray-blue
  '#D4A574',  // Muted tan
  '#457B9D',  // Muted steel blue
]

const STYLE_CONSTANTS = {
  text: '#333333',
  labelBackground: '#FFFFFF',
  connector: '#999999'
}

export function PieChartD3({ 
  data, 
  width = 800, 
  height = 400,
  showLabels = true,
  showPercentages = true,
  donut = false
}: PieChartD3Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const margin = { top: 40, right: 150, bottom: 40, left: 40 }
    const radius = Math.min(
      width - margin.left - margin.right, 
      height - margin.top - margin.bottom
    ) / 2

    const svg = d3.select(svgRef.current)
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2 - 50},${height / 2})`)

    // Calculate total for percentages
    const total = d3.sum(data, d => d.value)

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.category))
      .range(COLOR_PALETTE.slice(0, data.length))

    // Pie generator
    const pie = d3.pie<PieData>()
      .value(d => d.value)
      .sort(null) // Keep original order

    // Arc generator
    const arc = d3.arc<d3.PieArcDatum<PieData>>()
      .innerRadius(donut ? radius * 0.6 : 0)
      .outerRadius(radius)

    // Label arc (for positioning labels)
    const labelArc = d3.arc<d3.PieArcDatum<PieData>>()
      .innerRadius(radius * 1.1)
      .outerRadius(radius * 1.1)

    // Create pie slices
    const slices = g.selectAll('.slice')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'slice')

    // Draw slices
    slices.append('path')
      .attr('d', arc)
      .attr('fill', d => colorScale(d.data.category) as string)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', 0.9)

    // Add labels with connector lines
    if (showLabels) {
      // Calculate label positions to avoid overlap
      const labelData = pie(data).map(d => {
        const pos = labelArc.centroid(d)
        const midAngle = Math.atan2(pos[1], pos[0])
        const x = Math.cos(midAngle) * (radius * 1.3)
        const y = Math.sin(midAngle) * (radius * 1.3)
        
        return {
          ...d,
          pos: [x, y] as [number, number],
          align: x > 0 ? 'start' : 'end'
        }
      })

      // Draw connector lines
      slices.append('polyline')
        .attr('stroke', STYLE_CONSTANTS.connector)
        .attr('stroke-width', 1)
        .attr('fill', 'none')
        .attr('points', (d, i) => {
          const label = labelData[i]
          const pos = arc.centroid(d)
          const mid = labelArc.centroid(d)
          return `${pos[0]},${pos[1]} ${mid[0]},${mid[1]} ${label.pos[0]},${label.pos[1]}`
        })

      // Add text labels
      const labels = slices.append('text')
        .attr('transform', (d, i) => `translate(${labelData[i].pos})`)
        .attr('text-anchor', (d, i) => labelData[i].align)
        .style('font-size', '12px')
        .style('font-family', 'Arial, sans-serif')
        .style('fill', STYLE_CONSTANTS.text)
        .style('font-weight', '500')

      labels.append('tspan')
        .attr('x', 0)
        .attr('dy', '-0.3em')
        .text(d => d.data.category)

      if (showPercentages) {
        labels.append('tspan')
          .attr('x', 0)
          .attr('dy', '1.3em')
          .text(d => {
            const percentage = ((d.value / total) * 100).toFixed(1)
            return `${d.value} (${percentage}%)`
          })
          .style('font-size', '11px')
          .style('font-weight', 'normal')
      }
    }

    // Add center text for donut charts
    if (donut) {
      const centerText = g.append('text')
        .attr('text-anchor', 'middle')
        .style('font-family', 'Arial, sans-serif')
        .style('fill', STYLE_CONSTANTS.text)

      centerText.append('tspan')
        .attr('x', 0)
        .attr('y', -5)
        .text('Total')
        .style('font-size', '14px')
        .style('font-weight', '500')

      centerText.append('tspan')
        .attr('x', 0)
        .attr('y', 15)
        .text(d3.format(',')(total))
        .style('font-size', '18px')
        .style('font-weight', 'bold')
    }

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - margin.right + 20}, ${margin.top})`)

    const legendItems = legend.selectAll('.legend-item')
      .data(data)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`)

    legendItems.append('rect')
      .attr('width', 16)
      .attr('height', 16)
      .attr('fill', d => colorScale(d.category) as string)
      .style('opacity', 0.9)

    legendItems.append('text')
      .attr('x', 22)
      .attr('y', 12)
      .text(d => d.category)
      .style('font-size', '12px')
      .style('font-family', 'Arial, sans-serif')
      .style('fill', STYLE_CONSTANTS.text)

  }, [data, width, height, showLabels, showPercentages, donut])

  return (
    <svg 
      ref={svgRef} 
      width={width} 
      height={height}
      style={{ 
        backgroundColor: '#FFFFFF',
        fontFamily: 'Arial, sans-serif'
      }}
    />
  )
}