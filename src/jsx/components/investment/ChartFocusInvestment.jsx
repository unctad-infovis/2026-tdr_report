import { scaleLinear } from 'd3';
import { useEffect, useRef, useState } from 'react';
import FocusChartStory from '../shared/FocusChartStory.jsx';
import { CSV, GROUPS, SECTORS, SOURCE } from './data.js';

import '../trade/ChartFocusTrade.css';
import './ChartFocusInvestment.css';

const TITLE = 'Developed economies capture most strategic investment';
const STAGES = [
  { key: 'baseline', headline: 'In most industries, new investment projects are split almost evenly.', body: '49% goes to developed economies, 51% to developing ones.' },
  { key: 'strategic', headline: 'But in the industries governments now see as strategic, the picture changes.' },
  { key: 'technology', headline: 'In semiconductors and advanced technologies, developed economies attract almost four fifths of foreign investment.' },
  { key: 'ai-energy', headline: 'They also get most of it in AI development and infrastructure, and in clean energy technology.' },
  { key: 'minerals', headline: 'Developing economies lead in only one: critical minerals.' },
  { key: 'conclusion', headline: 'But extracting critical minerals isn’t the same as capturing their value.' }
];

const InvestmentChart = ({ step }) => {
  const figureRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(figureRef.current);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReducedMotion(media.matches);
    media.addEventListener('change', onMotion);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', onMotion);
    };
  }, []);

  const state = reducedMotion ? 5 : step;
  const chartWidth = Math.max(200, width - 32);
  const narrow = chartWidth < 400;
  const labelWidth = narrow ? 112 : 210;
  const rowHeight = narrow ? 82 : 64;
  const top = 30;
  const bandHeadingHeight = 24;
  const plotBottom = top + SECTORS.length * rowHeight + bandHeadingHeight;
  const height = plotBottom + 32;
  const x = scaleLinear()
    .domain([0, 100])
    .range([labelWidth, chartWidth - 24]);
  const ticks = narrow ? [0, 50, 100] : [0, 25, 50, 75, 100];

  return (
    <figure className="trade_chart investment_chart" ref={figureRef} data-chart-state={state}>
      <div className="trade_header">
        <svg viewBox="0 0 288.8 289.6" aria-hidden="true">
          <path d="M11.4,289c-2.6,0-5.2-0.4-9.6-0.7c51.3-48.9,101.1-96.5,151.6-144.7C103.8,96.4,54.7,49.5,5.5,2.6C5.7,2.1,6,1.5,6.2,1C7.8,1,9.4,1,11,1C51,1,91,1.1,131,0.9c5.8,0,9.9,1.7,14,5.7c27.5,26.4,55.2,52.7,82.8,79c20.1,19.2,40.2,38.5,60.3,57.7c-0.7,1.1-1,1.9-1.6,2.4c-48.5,46.3-97.1,92.6-145.6,139c-3.5,3.4-7.2,4.5-11.9,4.5C89.8,289,50.6,289.1,11.4,289" />
        </svg>
        <h3>{TITLE}</h3>
      </div>
      <p className="trade_description">Announced greenfield investment, share of sector totals, percentage, 2020–2025</p>
      <ul className="trade_legend">
        {GROUPS.map(group => (
          <li className={group.key === 'developing' ? 'compatibility' : ''} key={group.key}>
            <span />
            {group.label}
          </li>
        ))}
      </ul>
      <svg
        className="investment_plot"
        width={chartWidth}
        height={height}
        viewBox={`0 0 ${chartWidth} ${height}`}
        role="img"
        aria-label="Share of announced greenfield investment by sector, 2020–2025. Developed and developing economies receive 49% and 51% in non-strategic sectors; 79% and 21% in semiconductors; 77% and 23% in advanced technologies; 64% and 36% in AI; 61% and 39% in energy transition; and 41% and 59% in critical minerals."
      >
        <g className={`strategic_band${state < 1 ? ' hidden' : ''}`}>
          <rect x="0" y={top + rowHeight} width={chartWidth} height={rowHeight * 5 + bandHeadingHeight} />
          <text x="4" y={top + rowHeight + 14}>
            Strategic sectors
          </text>
        </g>
        <g className="investment_grid">
          {ticks.map(tick => (
            <g key={tick}>
              <line x1={x(tick)} x2={x(tick)} y1={top} y2={plotBottom} />
              <text x={x(tick)} y={height - 8} textAnchor="middle">
                {tick}%
              </text>
            </g>
          ))}
        </g>
        {SECTORS.map((sector, index) => {
          const visible = state >= sector.stage;
          const current = sector.stage === state && state >= 2 && state < 5;
          const rowY = top + index * rowHeight + (index ? bandHeadingHeight : 0);
          const labelLines = narrow ? (sector.narrowLines ?? sector.lines) : sector.lines;
          return (
            <g key={sector.key} data-sector={sector.key} className={`investment_sector${visible ? '' : ' hidden'}${current ? ' current' : ''}`} transform={`translate(0,${rowY})`}>
              <text className="sector_label" x="4" y={rowHeight / 2 - (labelLines.length - 1) * 8 + 4}>
                {labelLines.map((text, lineIndex) => (
                  <tspan key={text} x="4" dy={lineIndex ? '1.2em' : 0}>
                    {text}
                  </tspan>
                ))}
              </text>
              {GROUPS.map((group, groupIndex) => {
                const value = sector[group.key];
                const barY = rowHeight / 2 - 20 + groupIndex * 23;
                return (
                  <g key={group.key} className={`investment_bar ${group.key}`}>
                    <rect x={x(0)} y={barY} width={x(value) - x(0)} height="18" style={{ '--bar-scale': visible ? 1 : 0 }} />
                    <text x={x(value) + 4} y={barY + 13}>
                      {value}%
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
      <div className="trade_meta">
        <div>
          <em>Source:</em> {SOURCE}
        </div>
        <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(CSV)}`} download="tdr2026_figure_III_6.csv">
          Get the data
        </a>
      </div>
    </figure>
  );
};

const ChartFocusInvestment = () => <FocusChartStory className="trade_focus_story investment_focus_story" label={TITLE} stages={STAGES} renderChart={step => <InvestmentChart step={step} />} />;

export default ChartFocusInvestment;
