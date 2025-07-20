"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"

interface BarChartProps {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor?: string
      borderColor?: string
    }>
  }
  width?: number
  height?: number
}

export function BarChart({ data, width = 600, height = 400 }: BarChartProps) {
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
      .scaleBand()
      .domain(data.labels)
      .range([0, innerWidth])
      .padding(0.3)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(dataset.data) || 0])
      .nice()
      .range([innerHeight, 0])

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSize(0))
      .select(".domain")
      .remove()

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

    // Bars
    g.selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.label) || 0)
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => innerHeight - y(d.value))
      .attr("fill", dataset.backgroundColor || "#3b82f6")
      .attr("rx", 4)
      .on("mouseover", function() {
        d3.select(this).attr("opacity", 0.8)
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1)
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

    // Value labels on bars
    g.selectAll(".label")
      .data(chartData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("fill", "#374151")
      .text(d => d.value)

  }, [data, width, height])

  return <svg ref={svgRef} width={width} height={height} />
}