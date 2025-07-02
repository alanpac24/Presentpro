'use client'

import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'

interface WaterfallData {
  name: string
  value: number
  type: 'start' | 'positive' | 'negative' | 'end'
}

interface WaterfallChartD3Props {
  data: WaterfallData[]
  width?: number
  height?: number
}

// Think-cell style colors
const COLORS = {
  start: '#4A6FA5',      // Muted blue
  end: '#4A6FA5',        // Muted blue
  positive: '#166534',   // Muted green
  negative: '#C93C37',   // Muted red
  connector: '#999999',  // Gray for connectors
  text: '#333333',       // Dark gray for text
  axis: '#666666'        // Medium gray for axes
}

export function WaterfallChartD3({ 
  data, 
  width = 800, 
  height = 400 
}: WaterfallChartD3Props) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove()

    const margin = { top: 40, right: 40, bottom: 60, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const svg = d3.select(svgRef.current)
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Calculate cumulative values
    let cumulative = 0
    const processedData = data.map((d, i) => {
      const previousCumulative = cumulative
      if (d.type !== 'start' && d.type !== 'end') {
        cumulative += d.value
      } else if (d.type === 'end') {
        cumulative = d.value
      }
      return {
        ...d,
        cumulative: cumulative,
        previousCumulative: previousCumulative,
        x0: i,
        x1: i + 1
      }
    })

    // Scales
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerWidth])
      .padding(0.2)

    const yExtent = d3.extent([
      ...processedData.map(d => d.cumulative),
      ...processedData.map(d => d.previousCumulative),
      0
    ]) as [number, number]

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] * 1.1, yExtent[1] * 1.1])
      .range([innerHeight, 0])

    // Draw axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .style('color', COLORS.axis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-family', 'Arial, sans-serif')

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d3.format('.0f')))
      .style('color', COLORS.axis)
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-family', 'Arial, sans-serif')

    // Draw bars
    const bars = g.selectAll('.bar')
      .data(processedData)
      .enter().append('g')
      .attr('class', 'bar')

    bars.append('rect')
      .attr('x', d => xScale(d.name)!)
      .attr('y', d => {
        if (d.type === 'start' || d.type === 'end') {
          return yScale(d.value)
        }
        return yScale(Math.max(d.cumulative, d.previousCumulative))
      })
      .attr('width', xScale.bandwidth())
      .attr('height', d => {
        if (d.type === 'start' || d.type === 'end') {
          return Math.abs(yScale(0) - yScale(d.value))
        }
        return Math.abs(yScale(d.cumulative) - yScale(d.previousCumulative))
      })
      .attr('fill', d => COLORS[d.type])
      .attr('opacity', 0.9)

    // Draw connectors
    const connectors = g.selectAll('.connector')
      .data(processedData.slice(0, -1))
      .enter().append('line')
      .attr('class', 'connector')
      .attr('x1', d => xScale(d.name)! + xScale.bandwidth())
      .attr('y1', d => {
        if (d.type === 'start') return yScale(d.value)
        return yScale(d.cumulative)
      })
      .attr('x2', (d, i) => xScale(processedData[i + 1].name)!)
      .attr('y2', d => {
        if (d.type === 'start') return yScale(d.value)
        return yScale(d.cumulative)
      })
      .attr('stroke', COLORS.connector)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')

    // Add value labels
    bars.append('text')
      .attr('x', d => xScale(d.name)! + xScale.bandwidth() / 2)
      .attr('y', d => {
        if (d.type === 'start' || d.type === 'end') {
          return yScale(d.value) - 5
        }
        const midpoint = (d.cumulative + d.previousCumulative) / 2
        return yScale(midpoint)
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(d => d.value > 0 ? `+${d.value}` : d.value)
      .style('font-size', '12px')
      .style('font-family', 'Arial, sans-serif')
      .style('fill', COLORS.text)
      .style('font-weight', '500')

  }, [data, width, height])

  return (
    <svg 
      ref={svgRef} 
      width={width} 
      height={height}
      style={{ 
        backgroundColor: 'white',
        fontFamily: 'Arial, sans-serif'
      }}
    />
  )
}