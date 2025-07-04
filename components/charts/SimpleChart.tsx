"use client"

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export interface ChartData {
  label: string
  value: number
  color?: string
}

interface SimpleChartProps {
  type: 'bar' | 'line' | 'pie'
  data: ChartData[]
  width?: number
  height?: number
  className?: string
}

export function SimpleChart({ 
  type, 
  data, 
  width = 400, 
  height = 300,
  className = ''
}: SimpleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 20, bottom: 40, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    switch (type) {
      case 'bar':
        renderBarChart(g, data, innerWidth, innerHeight)
        break
      case 'line':
        renderLineChart(g, data, innerWidth, innerHeight)
        break
      case 'pie':
        renderPieChart(g, data, innerWidth, innerHeight)
        break
    }
  }, [type, data, width, height])

  return (
    <svg 
      ref={svgRef} 
      width={width} 
      height={height}
      className={className}
    />
  )
}

function renderBarChart(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: ChartData[],
  width: number,
  height: number
) {
  const x = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, width])
    .padding(0.1)

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value) || 0])
    .nice()
    .range([height, 0])

  // X axis
  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))

  // Y axis
  g.append('g')
    .call(d3.axisLeft(y))

  // Bars
  g.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.label) || 0)
    .attr('y', d => y(d.value))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.value))
    .attr('fill', d => d.color || '#3b82f6')
}

function renderLineChart(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: ChartData[],
  width: number,
  height: number
) {
  const x = d3.scalePoint()
    .domain(data.map(d => d.label))
    .range([0, width])

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value) || 0])
    .nice()
    .range([height, 0])

  // Line generator
  const line = d3.line<ChartData>()
    .x(d => x(d.label) || 0)
    .y(d => y(d.value))

  // X axis
  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))

  // Y axis
  g.append('g')
    .call(d3.axisLeft(y))

  // Line
  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#3b82f6')
    .attr('stroke-width', 2)
    .attr('d', line)

  // Dots
  g.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', d => x(d.label) || 0)
    .attr('cy', d => y(d.value))
    .attr('r', 4)
    .attr('fill', '#3b82f6')
}

function renderPieChart(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: ChartData[],
  width: number,
  height: number
) {
  const radius = Math.min(width, height) / 2

  g.attr('transform', `translate(${width / 2},${height / 2})`)

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.label))
    .range(d3.schemeCategory10)

  const pie = d3.pie<ChartData>()
    .value(d => d.value)

  const arc = d3.arc<d3.PieArcDatum<ChartData>>()
    .innerRadius(0)
    .outerRadius(radius)

  // Pie slices
  g.selectAll('.slice')
    .data(pie(data))
    .enter().append('path')
    .attr('class', 'slice')
    .attr('d', arc)
    .attr('fill', d => d.data.color || color(d.data.label) as string)
    .attr('stroke', 'white')
    .attr('stroke-width', 2)

  // Labels
  g.selectAll('.label')
    .data(pie(data))
    .enter().append('text')
    .attr('class', 'label')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .text(d => d.data.label)
}