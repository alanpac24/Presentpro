"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface LineChartProps {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      borderColor?: string
      backgroundColor?: string
    }>
  }
  width?: number
  height?: number
}

export function LineChart({ data, width = 600, height = 400 }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || !data) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const margin = { top: 20, right: 30, bottom: 60, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    const dataset = data.datasets[0]
    const chartData = data.labels.map((label, i) => ({
      label,
      value: dataset.data[i]
    }))

    // Scales
    const x = d3
      .scalePoint()
      .domain(data.labels)
      .range([0, innerWidth])

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(dataset.data) || 0])
      .nice()
      .range([innerHeight, 0])

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      )
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.3)
      .select(".domain")
      .remove()

    // Line
    const line = d3
      .line<{ label: string; value: number }>()
      .x(d => x(d.label) || 0)
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX)

    // Area under line
    const area = d3
      .area<{ label: string; value: number }>()
      .x(d => x(d.label) || 0)
      .y0(innerHeight)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX)

    // Add gradient
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", innerHeight)

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", dataset.borderColor || "#3b82f6")
      .attr("stop-opacity", 0.3)

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", dataset.borderColor || "#3b82f6")
      .attr("stop-opacity", 0)

    // Draw area
    g.append("path")
      .datum(chartData)
      .attr("fill", "url(#line-gradient)")
      .attr("d", area)

    // Draw line
    g.append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", dataset.borderColor || "#3b82f6")
      .attr("stroke-width", 3)
      .attr("d", line)

    // Dots
    g.selectAll(".dot")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.label) || 0)
      .attr("cy", d => y(d.value))
      .attr("r", 5)
      .attr("fill", dataset.borderColor || "#3b82f6")
      .on("mouseover", function() {
        d3.select(this).attr("r", 7)
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 5)
      })

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#6b7280")

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#6b7280")

    // Value labels
    g.selectAll(".label")
      .data(chartData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => x(d.label) || 0)
      .attr("y", d => y(d.value) - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "600")
      .style("fill", "#374151")
      .text(d => d.value)

  }, [data, width, height])

  return <svg ref={svgRef} width={width} height={height} />
}