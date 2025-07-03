"use client"

import React from 'react';
import * as d3 from 'd3';
import { useD3 } from './useD3';

interface D3BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  };
  width?: number;
  height?: number;
}

export function D3BarChart({ data, width = 600, height = 400 }: D3BarChartProps) {
  const ref = useD3(
    (svg) => {
      // Clear previous content
      svg.selectAll("*").remove();

      // Think-cell style constants
      const margin = { top: 40, right: 20, bottom: 50, left: 60 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // Think-cell colors
      const thinkCellBlue = '#5B9BD5';
      const axisColor = '#666666';
      const textColor = '#404040';
      const strokeColor = '#FFFFFF';
      const gridColor = '#F0F0F0';

      // Create main group
      const g = svg
        .attr('width', width)
        .attr('height', height)
        .attr('style', 'background-color: #FFFFFF; font-family: Arial, sans-serif;')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Prepare data
      const dataset = data.datasets[0];
      const values = dataset.data;
      const labels = data.labels;

      // Create scales
      const xScale = d3.scaleBand()
        .domain(labels)
        .range([0, innerWidth])
        .padding(0.3);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(values) as number * 1.1])
        .nice()
        .range([innerHeight, 0]);

      // Add subtle grid lines (think-cell style)
      const yAxis = d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-innerWidth)
        .tickFormat(d => d3.format(',')(d));

      g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis)
        .call(g => g.select('.domain').remove()) // Remove axis line
        .call(g => g.selectAll('.tick line')
          .attr('stroke', gridColor)
          .attr('stroke-width', 1))
        .call(g => g.selectAll('.tick text')
          .attr('fill', textColor)
          .attr('font-size', '11px')
          .attr('x', -10));

      // Create bar groups for 3D effect
      const barGroups = g.selectAll('.bar-group')
        .data(values)
        .enter()
        .append('g')
        .attr('class', 'bar-group');

      // Add subtle 3D shadow (think-cell style)
      barGroups.append('rect')
        .attr('class', 'bar-shadow')
        .attr('x', (d, i) => (xScale(labels[i]) as number) + 2)
        .attr('y', d => yScale(d) - 2)
        .attr('width', xScale.bandwidth())
        .attr('height', d => innerHeight - yScale(d))
        .attr('fill', 'rgba(0, 0, 0, 0.08)');

      // Add main bars
      const bars = barGroups.append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => xScale(labels[i]) as number)
        .attr('y', innerHeight)
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('fill', thinkCellBlue)
        .attr('stroke', strokeColor)
        .attr('stroke-width', 0.5);

      // Animate bars
      bars.transition()
        .duration(750)
        .attr('y', d => yScale(d))
        .attr('height', d => innerHeight - yScale(d));

      // Add value labels on top of bars (think-cell style)
      const valueLabels = barGroups.append('text')
        .attr('class', 'value-label')
        .attr('x', (d, i) => (xScale(labels[i]) as number) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d) - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('font-weight', '500')
        .attr('fill', textColor)
        .style('opacity', 0)
        .text(d => d3.format(',')(d));

      // Animate value labels
      valueLabels.transition()
        .delay(750)
        .duration(250)
        .style('opacity', 1);

      // Add X-axis (minimal, think-cell style)
      g.append('line')
        .attr('x1', 0)
        .attr('y1', innerHeight)
        .attr('x2', innerWidth)
        .attr('y2', innerHeight)
        .attr('stroke', axisColor)
        .attr('stroke-width', 0.5);

      // Add X-axis labels
      g.selectAll('.x-label')
        .data(labels)
        .enter()
        .append('text')
        .attr('class', 'x-label')
        .attr('x', (d, i) => (xScale(labels[i]) as number) + xScale.bandwidth() / 2)
        .attr('y', innerHeight + 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', textColor)
        .text(d => d);

      // Add title
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', '500')
        .attr('fill', textColor)
        .text(dataset.label);

      // Add subtle hover effect
      bars
        .on('mouseover', function(event, d) {
          d3.select(this)
            .transition()
            .duration(100)
            .attr('fill', d3.color(thinkCellBlue)?.darker(0.2)?.toString() || thinkCellBlue);

          // Show tooltip-like highlight
          const i = values.indexOf(d as number);
          g.append('rect')
            .attr('class', 'hover-highlight')
            .attr('x', (xScale(labels[i]) as number) - 2)
            .attr('y', yScale(d) - 2)
            .attr('width', xScale.bandwidth() + 4)
            .attr('height', innerHeight - yScale(d) + 4)
            .attr('fill', 'none')
            .attr('stroke', thinkCellBlue)
            .attr('stroke-width', 2)
            .style('pointer-events', 'none');
        })
        .on('mouseout', function() {
          d3.select(this)
            .transition()
            .duration(100)
            .attr('fill', thinkCellBlue);
          
          g.selectAll('.hover-highlight').remove();
        });

      // Professional touch: Add subtle gradient definition
      const defs = svg.append('defs');
      const gradient = defs.append('linearGradient')
        .attr('id', 'bar-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .style('stop-color', thinkCellBlue)
        .style('stop-opacity', 1);

      gradient.append('stop')
        .attr('offset', '100%')
        .style('stop-color', d3.color(thinkCellBlue)?.darker(0.1)?.toString() || thinkCellBlue)
        .style('stop-opacity', 1);

      // Apply gradient to bars (optional - comment out for flat color)
      // bars.attr('fill', 'url(#bar-gradient)');
    },
    [data, width, height]
  );

  return <svg ref={ref} />;
}