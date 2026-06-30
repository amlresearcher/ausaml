import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { ScenarioData, GraphNode } from '../../data/types'
import { nodeColor } from '../../data/transforms'

interface LayoutNode extends GraphNode {
  x: number
  y: number
}

interface LayoutLink {
  source: LayoutNode
  target: LayoutNode
  amount: number
  tx_type: string
  datetime: string
}

const NODE_R = 14

// Lane 0 = source/left, 1 = middle, 2 = destination/right
const ROLE_LANE: Record<string, number> = {
  depositor:    0,
  source:       0,
  structurer:   0,
  mule:         1,
  controller:   1,
  intermediary: 1,
  aggregator:   1,
  merger:       1,
  beneficiary:  2,
  destination:  2,
  unknown:      1,
}

function roleLane(role: string): number {
  return ROLE_LANE[role] ?? 1
}

function fmtAmount(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`
  return `$${n.toFixed(0)}`
}

function edgePath(s: LayoutNode, t: LayoutNode): string {
  const dx = t.x - s.x
  const dy = t.y - s.y
  const len = Math.sqrt(dx * dx + dy * dy) || 1

  // Start/end at node boundary
  const sx = s.x + (dx / len) * NODE_R
  const sy = s.y + (dy / len) * NODE_R
  const ex = t.x - (dx / len) * (NODE_R + 1)
  const ey = t.y - (dy / len) * (NODE_R + 1)

  // Cubic bezier — control points pulled horizontally toward midpoint
  // This keeps edges readable when source and target are in adjacent lanes
  const mx = (s.x + t.x) / 2
  return `M ${sx},${sy} C ${mx},${sy} ${mx},${ey} ${ex},${ey}`
}

function edgeLabelPos(s: LayoutNode, t: LayoutNode): [number, number] {
  const mx = (s.x + t.x) / 2
  const my = (s.y + t.y) / 2
  return [mx, my]
}

export function GraphView({ scenario }: { scenario: ScenarioData }) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = svgRef.current.getBoundingClientRect()
    const w = width || 700
    const h = height || 450

    const padX = w * 0.12
    const padY = h * 0.1

    // --- Layout: assign fixed positions ---
    const byLane = new Map<number, GraphNode[]>([[0, []], [1, []], [2, []]])
    for (const n of scenario.nodes) {
      const lane = roleLane(n.role)
      const bucket = byLane.get(lane) ?? byLane.get(1)!
      bucket.push(n)
    }

    // Determine how many lanes actually have nodes, re-centre single-lane cases
    const activeLanes = [0, 1, 2].filter(l => (byLane.get(l)?.length ?? 0) > 0)
    const laneCount = activeLanes.length

    const layoutNodes = new Map<string, LayoutNode>()
    activeLanes.forEach((lane, laneIdx) => {
      const nodes = byLane.get(lane)!
      const laneX = laneCount === 1
        ? w / 2
        : padX + (laneIdx / (laneCount - 1)) * (w - padX * 2)

      nodes.forEach((n, i) => {
        const laneY = padY + (i + 0.5) * (h - padY * 2) / nodes.length
        layoutNodes.set(n.id, { ...n, x: laneX, y: laneY })
      })
    })

    const links: LayoutLink[] = scenario.edges
      .filter(e =>
        layoutNodes.has(e.source) &&
        layoutNodes.has(e.target) &&
        e.source !== e.target
      )
      .map(e => ({
        source: layoutNodes.get(e.source)!,
        target: layoutNodes.get(e.target)!,
        amount: e.amount,
        tx_type: e.tx_type,
        datetime: e.datetime,
      }))

    const amounts = links.map(l => l.amount)
    const minAmt = Math.max(1, d3.min(amounts) ?? 1)
    const maxAmt = Math.max(minAmt + 1, d3.max(amounts) ?? 2)
    const strokeScale = d3.scaleLog().domain([minAmt, maxAmt]).range([1.5, 4]).clamp(true)

    // --- SVG setup ---
    const g = svg.append('g')

    svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.2, 4])
        .on('zoom', e => g.attr('transform', e.transform))
    )

    const defs = svg.append('defs')
    defs.append('marker')
      .attr('id', 'arrow-tx')
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 8).attr('refY', 0)
      .attr('markerWidth', 5).attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path').attr('d', 'M0,-4L8,0L0,4').attr('fill', '#0d9488')

    // Lane header labels
    const laneLabels: Record<number, string> = { 0: 'Source', 1: 'Intermediary', 2: 'Destination' }
    activeLanes.forEach((lane, laneIdx) => {
      const laneX = laneCount === 1
        ? w / 2
        : padX + (laneIdx / (laneCount - 1)) * (w - padX * 2)
      g.append('text')
        .attr('x', laneX).attr('y', padY * 0.45)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('font-family', 'Inter, sans-serif')
        .attr('font-weight', '600')
        .attr('fill', '#94a3b8')
        .attr('letter-spacing', '0.05em')
        .text(laneLabels[lane] ?? '')
    })

    // Edges
    const linkG = g.append('g').attr('class', 'links')
    linkG.selectAll('path')
      .data(links)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', '#0d9488')
      .attr('stroke-opacity', 0.45)
      .attr('stroke-width', d => strokeScale(d.amount))
      .attr('marker-end', 'url(#arrow-tx)')
      .attr('d', d => edgePath(d.source, d.target))

    // Edge amount labels
    const edgeLabelG = g.append('g').attr('class', 'edge-labels')
    const labelGroups = edgeLabelG.selectAll('g')
      .data(links)
      .join('g')
      .attr('transform', d => {
        const [lx, ly] = edgeLabelPos(d.source, d.target)
        return `translate(${lx},${ly})`
      })

    labelGroups.append('rect')
      .attr('x', -19).attr('y', -8)
      .attr('width', 38).attr('height', 16)
      .attr('fill', 'white').attr('rx', 3).attr('opacity', 0.9)

    labelGroups.append('text')
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
      .attr('font-size', '9px').attr('font-family', 'Inter, monospace')
      .attr('fill', '#0f766e').attr('font-weight', '700')
      .text(d => fmtAmount(d.amount))

    // Nodes (draggable)
    const nodes = Array.from(layoutNodes.values())

    const nodeG = g.append('g').attr('class', 'nodes')
      .selectAll<SVGGElement, LayoutNode>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'grab')
      .attr('transform', d => `translate(${d.x},${d.y})`)

    nodeG.append('circle')
      .attr('r', NODE_R)
      .attr('fill', d => nodeColor(d.role))
      .attr('stroke', '#fff').attr('stroke-width', 2.5)

    nodeG.append('text')
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
      .attr('font-size', '7px').attr('fill', 'white')
      .attr('font-weight', '800').attr('font-family', 'Inter, sans-serif')
      .text('ACC')

    nodeG.append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('x', 0).attr('y', NODE_R + 13)
      .attr('font-size', '10px').attr('fill', '#1e293b')
      .attr('font-family', 'Inter, sans-serif').attr('font-weight', '600')

    nodeG.append('text')
      .text(d => d.role)
      .attr('text-anchor', 'middle')
      .attr('x', 0).attr('y', NODE_R + 25)
      .attr('font-size', '8px').attr('fill', '#94a3b8')
      .attr('font-family', 'Inter, sans-serif')

    nodeG.append('title').text(d => `${d.label}\nRole: ${d.role}`)

    // Drag to reposition individual nodes
    nodeG.call(
      d3.drag<SVGGElement, LayoutNode>()
        .on('start', function () { d3.select(this).attr('cursor', 'grabbing') })
        .on('drag', function (event, d) {
          d.x = event.x; d.y = event.y
          d3.select(this).attr('transform', `translate(${d.x},${d.y})`)
          // Redraw edges touching this node
          linkG.selectAll<SVGPathElement, LayoutLink>('path')
            .filter(l => l.source.id === d.id || l.target.id === d.id)
            .attr('d', l => edgePath(l.source, l.target))
          edgeLabelG.selectAll<SVGGElement, LayoutLink>('g')
            .filter(l => l.source.id === d.id || l.target.id === d.id)
            .attr('transform', l => {
              const [lx, ly] = edgeLabelPos(l.source, l.target)
              return `translate(${lx},${ly})`
            })
        })
        .on('end', function () { d3.select(this).attr('cursor', 'grab') })
    )
  }, [scenario])

  return <svg ref={svgRef} className="w-full h-full" style={{ minHeight: '400px' }} />
}
