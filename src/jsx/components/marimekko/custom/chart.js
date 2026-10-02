import { easeCubicOut, format, formatDefaultLocale, scaleLinear, select } from 'd3';
import { COLUMNS } from './data.js';

formatDefaultLocale({ currency: ['$', ''], decimal: '.', grouping: [3], thousands: ' ' });

export const formatPct = value => `${format('.1f')(value * 100)}%`;

const ROW_GAP = 10;
const ELBOW_STEP = 6;
const LEADER_SPACE = 14 + (COLUMNS.length - 1) * ELBOW_STEP;
const MARGIN = { bottom: 1, left: 34, right: 2 };
const MIN_SLOT_WIDTH = 100;

// Interaction is reported via `onHover`; plot height lets the wrapper fit its chart chrome.
export const drawChart = (svgNode, { animate, maxPlotHeight = 340, onHover, width }) => {
  const plotW = width - MARGIN.left - MARGIN.right;
  const slotW = plotW / COLUMNS.length;
  const stagger = slotW < MIN_SLOT_WIDTH;
  const rows = slotW < 45 ? 3 : stagger ? 2 : 1;
  const LINE_HEIGHT = stagger ? 15 : 17;
  const LABEL_HEIGHT = LINE_HEIGHT * 3;
  const labelArea = rows * LABEL_HEIGHT + (rows - 1) * ROW_GAP;
  const plotTop = labelArea + LEADER_SPACE;
  const plotH = Math.min(maxPlotHeight, Math.max(220, Math.min(340, plotW * 0.55)));
  const height = plotTop + plotH + MARGIN.bottom;

  const x = scaleLinear().domain([0, 1]).range([0, plotW]);
  const y = scaleLinear().domain([0, 1]).range([plotH, 0]);

  const svg = select(svgNode).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`).attr('width', width);
  svg.selectAll('*').remove();
  const root = svg.append('g').attr('transform', `translate(${MARGIN.left},0)`);

  // Grid + y labels (Datawrapper style: dotted lines, labels sitting above the line).
  const grid = root.append('g').attr('class', 'grid').attr('transform', `translate(0,${plotTop})`);
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  grid
    .selectAll('line')
    .data(ticks)
    .join('line')
    .attr('x1', -MARGIN.left)
    .attr('x2', plotW)
    .attr('y1', d => y(d))
    .attr('y2', d => y(d));
  grid
    .selectAll('text')
    .data(ticks)
    .join('text')
    .attr('x', -MARGIN.left)
    .attr('y', d => y(d) - 5)
    .text(d => (d === 1 ? '100%' : d * 100));

  // Columns.
  const columns = root
    .append('g')
    .attr('class', 'columns')
    .attr('transform', `translate(0,${plotTop})`)
    .selectAll('g')
    .data(COLUMNS)
    .join('g')
    .attr('class', 'column')
    .attr('data-column', d => d.key);

  const rects = columns
    .selectAll('rect')
    .data(d => d.segments.map(s => ({ ...s, x0: d.x0, x1: d.x1 })))
    .join('rect')
    .attr('aria-label', d => `${d.columnLabel}, ${d.label}: ${formatPct(d.value)}`)
    .attr('fill', d => d.color)
    .attr('role', 'img')
    .attr('tabindex', 0)
    .attr('width', d => Math.max(0, x(d.x1) - x(d.x0)))
    .attr('x', d => x(d.x0));

  const segmentLabels = columns
    .selectAll('text')
    .data(d => d.segments.map(s => ({ ...s, x0: d.x0, x1: d.x1 })).filter(s => x(s.x1) - x(s.x0) >= 46 && (s.y1 - s.y0) * plotH >= 20))
    .join('text')
    .attr('class', 'segment_label')
    .attr('fill', d => d.textColor)
    .attr('x', d => (x(d.x0) + x(d.x1)) / 2)
    .attr('y', d => y((d.y0 + d.y1) / 2))
    .text(d => formatPct(d.value));

  const setHover = (event, d) => {
    if (svg.attr('data-active-column')) return;
    rects.classed('dimmed', r => r !== d);
    onHover(d, event);
  };
  const clearHover = () => {
    rects.classed('dimmed', false);
    onHover(null);
  };
  rects.on('mouseenter mousemove focus', setHover).on('mouseleave blur', clearHover);

  if (animate) {
    rects
      .attr('height', 0)
      .attr('y', plotH)
      .transition()
      .duration(900)
      .delay((_d, i) => i * 60)
      .ease(easeCubicOut)
      .attr('height', d => Math.max(0, y(d.y0) - y(d.y1)))
      .attr('y', d => y(d.y1));
    segmentLabels.style('opacity', 0).transition().delay(1100).duration(400).style('opacity', 1);
  } else {
    rects.attr('height', d => Math.max(0, y(d.y0) - y(d.y1))).attr('y', d => y(d.y1));
  }

  // Baseline.
  root
    .append('line')
    .attr('class', 'baseline')
    .attr('x1', 0)
    .attr('x2', plotW)
    .attr('y1', plotTop + plotH)
    .attr('y2', plotTop + plotH);

  // Column labels in even slots above the plot, connected with elbow leader lines.
  // Elbows step down from left to right so that the lines never cross.
  const labels = root
    .append('g')
    .attr('class', `column_labels${stagger ? ' narrow' : ''}`)
    .selectAll('g')
    .data(COLUMNS)
    .join('g')
    .attr('data-column', d => d.key)
    .attr('transform', (_d, i) => `translate(${(i + 0.5) * slotW},${(i % rows) * (LABEL_HEIGHT + ROW_GAP)})`);
  labels
    .append('text')
    .attr('class', 'column_label')
    .selectAll('tspan')
    .data(d => [...d.lines.map(text => ({ cls: 'name', text })), { cls: 'share', text: formatPct(d.share) }])
    .join('tspan')
    .attr('class', d => d.cls)
    .attr('dy', (_d, i) => (i ? LINE_HEIGHT : LINE_HEIGHT - 4))
    .attr('x', 0)
    .text(d => d.text);

  root
    .append('g')
    .attr('class', 'leaders')
    .selectAll('path')
    .data(COLUMNS)
    .join('path')
    .attr('data-column', d => d.key)
    .attr('d', (d, i) => {
      const startX = (i + 0.5) * slotW;
      const startY = (i % rows) * (LABEL_HEIGHT + ROW_GAP) + LABEL_HEIGHT + 3;
      const elbowY = labelArea + 8 + i * ELBOW_STEP;
      const endX = x((d.x0 + d.x1) / 2);
      return `M${startX},${startY}V${elbowY}H${endX}V${plotTop - 3}`;
    });
  return { plotHeight: plotH };
};

// Update emphasis without rebuilding the chart or disturbing keyboard focus.
export const highlightColumn = (svgNode, key) => {
  const svg = select(svgNode).attr('data-active-column', key);
  svg.selectAll('.column rect').classed('dimmed', false);
  svg
    .selectAll('[data-column]')
    .classed('story_muted', d => Boolean(key) && d.key !== key)
    .classed('story_highlighted', d => d.key === key);
};
