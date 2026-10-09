import { line, scaleLinear } from 'd3';
import { useEffect, useId, useRef, useState } from 'react';
import FocusChartStory from '../shared/FocusChartStory.jsx';
import { CSV, DATA, NOTE } from './data.js';

import './ChartFocusTrade.css';

const TITLE = 'Trade reaches farther as partner compatibility rises';
const STAGES = [
  {
    key: 'introduction',
    headline: 'Is trade becoming more or less global?',
    body: 'This chart tracks two dimensions of global goods trade: the geographic distance between trading partners and their geoeconomic compatibility.'
  },
  {
    key: 'distance',
    headline: 'Since 2015, goods have travelled farther between trading partners.',
    body: 'Companies still source from suppliers farther from home as cost advantages remain high.'
  },
  {
    key: 'compatibility',
    headline: 'And since 2021, trade has shifted toward more geoeconomically compatible partners.',
    body: 'Geoeconomic risk and policy uncertainty are playing a larger role in sourcing decisions.'
  },
  {
    key: 'conclusion',
    headline: 'Trade reaches farther, but it’s becoming more geoeconomically sensitive.',
    body: 'Geoeconomic factors are stronger for high-tech and strategic goods, and weaker for low-tech goods.'
  }
];
const SERIES = [
  { key: 'distance', label: 'Geographic distance', column: 1 },
  { key: 'compatibility', label: 'Geoeconomic compatibility', column: 2 }
];

const TradeChart = ({ step }) => {
  const figureRef = useRef(null);
  const tooltipId = useId();
  const [selectedYear, setSelectedYear] = useState(null);
  const [width, setWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(figureRef.current);
    const onResize = () => {
      setViewportHeight(window.innerHeight);
      setSelectedYear(null);
    };
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReducedMotion(media.matches);
    window.addEventListener('resize', onResize);
    media.addEventListener('change', onMotion);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      media.removeEventListener('change', onMotion);
    };
  }, []);
  const chartWidth = Math.max(200, width - 32);
  const height = Math.max(180, Math.min(350, viewportHeight - 360));
  const plotRight = chartWidth - 56;
  const x = scaleLinear().domain([2015, 2025]).range([35, plotRight]);
  const y = scaleLinear()
    .domain([99, 103])
    .range([height - 32, 14]);
  const state = reducedMotion ? 3 : step;
  const ticks = chartWidth < 400 ? [2015, 2020, 2025] : [2015, 2017, 2019, 2021, 2023, 2025];
  const selectedRow = selectedYear === null || state === 0 ? null : DATA[selectedYear - 2015];
  const tooltipSeries = selectedRow ? SERIES.filter(series => series.key === 'distance' || (state >= 2 && (state !== 2 || selectedYear <= 2018))) : [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset interaction when the chart context changes.
  useEffect(() => {
    setSelectedYear(null);
  }, [step, width, viewportHeight, reducedMotion]);

  const selectPointerYear = event => {
    const bounds = event.currentTarget.ownerSVGElement.getBoundingClientRect();
    const chartX = ((event.clientX - bounds.left) * chartWidth) / bounds.width;
    setSelectedYear(Math.max(2015, Math.min(2025, Math.round(x.invert(chartX)))));
  };
  const handleKeyDown = event => {
    if (event.key === 'Escape') {
      setSelectedYear(null);
      return;
    }
    const current = selectedYear ?? 2015;
    const next = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 2015, End: 2025 }[event.key];
    if (next !== undefined) {
      event.preventDefault();
      setSelectedYear(Math.max(2015, Math.min(2025, next)));
    }
  };

  return (
    <figure className="trade_chart" ref={figureRef} data-chart-state={state}>
      <div className="trade_header">
        <svg viewBox="0 0 288.8 289.6" aria-hidden="true">
          <path d="M11.4,289c-2.6,0-5.2-0.4-9.6-0.7c51.3-48.9,101.1-96.5,151.6-144.7C103.8,96.4,54.7,49.5,5.5,2.6C5.7,2.1,6,1.5,6.2,1C7.8,1,9.4,1,11,1C51,1,91,1.1,131,0.9c5.8,0,9.9,1.7,14,5.7c27.5,26.4,55.2,52.7,82.8,79c20.1,19.2,40.2,38.5,60.3,57.7c-0.7,1.1-1,1.9-1.6,2.4c-48.5,46.3-97.1,92.6-145.6,139c-3.5,3.4-7.2,4.5-11.9,4.5C89.8,289,50.6,289.1,11.4,289" />
        </svg>
        <h3>{TITLE}</h3>
      </div>
      <p className="trade_description">Global goods trade, index: 2015=100, 2015–2025</p>
      <ul className="trade_legend">
        {SERIES.map(series => (
          <li className={series.key} key={series.key}>
            <span />
            {series.label}
          </li>
        ))}
      </ul>
      <div className="trade_plot_wrap">
        <svg
          className="trade_plot"
          width={chartWidth}
          height={height}
          viewBox={`0 0 ${chartWidth} ${height}`}
          aria-label="Global goods trade, 2015–2025. Both indices start at 100 in 2015. Geographic distance dips in 2016 and rises to 102.8 in 2025. Geoeconomic compatibility dips around 2021 before rising to 102.4 in 2025."
        >
          <g className="trade_grid">
            {[99, 100, 101, 102, 103].map(value => (
              <g key={value} className={value === 100 ? 'baseline' : ''}>
                <line x1="0" x2={plotRight} y1={y(value)} y2={y(value)} />
                <text x="0" y={y(value) - 4}>
                  {value}
                </text>
              </g>
            ))}
          </g>
          <g className="trade_years">
            {ticks.map(year => (
              <text key={year} x={x(year)} y={height - 8} textAnchor={year === 2015 ? 'start' : year === 2025 ? 'end' : 'middle'}>
                {year}
              </text>
            ))}
          </g>
          {SERIES.map(series => {
            const path = line()
              .x(row => x(row[0]))
              .y(row => y(row[series.column]));
            const fullPath = path(DATA);
            const lengths = DATA.slice(1).map((row, index) => Math.hypot(x(row[0]) - x(DATA[index][0]), y(row[series.column]) - y(DATA[index][series.column])));
            const earlyShare = lengths.slice(0, 3).reduce((sum, length) => sum + length, 0) / lengths.reduce((sum, length) => sum + length, 0);
            const offset = series.key === 'distance' ? (state < 1 ? 1 : 0) : state < 2 ? 1 : state === 2 ? 1 - earlyShare : 0;
            const visible = series.key === 'distance' ? state >= 1 : state >= 2;
            const muted = series.key === 'distance' && state === 2;
            return (
              <g key={series.key} className={`trade_series ${series.key}${visible ? '' : ' hidden'}${muted ? ' muted' : ''}`}>
                <path className="trade_line" d={fullPath} pathLength="1" style={{ '--line-offset': offset }} />
                <text className={`trade_endpoint${state === 3 ? '' : ' hidden'}`} x={plotRight + 8} y={y(DATA[10][series.column]) + (series.key === 'distance' ? -2 : 10)}>
                  {DATA[10][series.column].toFixed(1)}
                </text>
              </g>
            );
          })}
          {selectedRow && (
            <g className="trade_tracking">
              <line x1={x(selectedYear)} x2={x(selectedYear)} y1="14" y2={height - 32} />
              {tooltipSeries.map(series => (
                <circle key={series.key} className={series.key} cx={x(selectedYear)} cy={y(selectedRow[series.column])} r="5" />
              ))}
            </g>
          )}
          {state > 0 && (
            <rect
              className="trade_hit_area"
              x="35"
              y="14"
              width={plotRight - 35}
              height={height - 46}
              fill="transparent"
              role="slider"
              tabIndex={0}
              aria-label="Explore yearly trade indices. Use left and right arrow keys to change year, Home or End to jump, and Escape to dismiss."
              aria-valuemin={2015}
              aria-valuemax={2025}
              aria-valuenow={selectedYear ?? 2015}
              aria-valuetext={selectedRow ? `${selectedYear}. ${tooltipSeries.map(series => `${series.label}: ${selectedRow[series.column].toFixed(1)}`).join('. ')}` : '2015'}
              aria-describedby={selectedRow ? tooltipId : undefined}
              onPointerMove={selectPointerYear}
              onPointerDown={selectPointerYear}
              onPointerLeave={event => {
                if (event.pointerType !== 'touch') setSelectedYear(null);
              }}
              onPointerCancel={() => setSelectedYear(null)}
              onFocus={() => setSelectedYear(year => year ?? 2015)}
              onBlur={() => setSelectedYear(null)}
              onKeyDown={handleKeyDown}
            />
          )}
        </svg>
        {selectedRow && (
          <div className="trade_tooltip" id={tooltipId} role="tooltip" style={{ left: Math.max(0, Math.min(x(selectedYear) - Math.min(260, chartWidth) / 2, chartWidth - Math.min(260, chartWidth))) }}>
            <strong>{selectedYear}</strong>
            {tooltipSeries.map(series => (
              <div className={`tooltip_row ${series.key}`} key={series.key}>
                <span className="tooltip_key" />
                <span>{series.label}</span>
                <strong>{selectedRow[series.column].toFixed(1)}</strong>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="trade_meta">
        <div>
          <em>Source:</em> UN Trade and Development (UNCTAD)
        </div>
        <div>
          <em>Note:</em> {NOTE}
        </div>
        <a href={`data:text/csv;charset=utf-8,${encodeURIComponent(CSV)}`} download="tdr2026_figure_II_9.csv">
          Get the data
        </a>
      </div>
    </figure>
  );
};

const ChartFocusTrade = () => <FocusChartStory className="trade_focus_story" label={TITLE} stages={STAGES} renderChart={step => <TradeChart step={step} />} />;

export default ChartFocusTrade;
