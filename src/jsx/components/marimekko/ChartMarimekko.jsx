import useIsVisible from '@unctad-infovis/general-tools/helpers/UseIsVisible.js';
import { useEffect, useRef, useState } from 'react';

import { drawChart, formatPct, highlightColumn } from './custom/chart.js';
import { CSV, SUPPLIERS } from './custom/data.js';

import './styles/styles.css';

const TITLE = 'After-tax profit takes 68% of the value traced in an AI advanced server rack';
const DESCRIPTION = 'Traced value added in producing one AI advanced server rack by component and supplier group, percentage';
const NOTE =
  'Traced value added represents more than 87 per cent of the total value added (i.e. about $3.3 million) of an NVIDIA GB200 NVL72 server rack. Component width is proportional to its share of traced value added, while vertical segments show the distribution of each component across supplier groups. “Others” combines rack hardware, thermal, power delivery and board electronics.';
const SOURCE = 'UN Trade and Development (UNCTAD)';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ChartMarimekkoMeta = () => (
  <div className="chart_marimekko_meta">
    <div>
      <em>Source:</em> {SOURCE}
    </div>
    <div>
      <em>Note:</em> {NOTE}
    </div>
    <a download="tdr2026_box_figure_I_3_2.csv" href={`data:text/csv;charset=utf-8,${encodeURIComponent(CSV)}`}>
      Get the data
    </a>
  </div>
);

const ChartMarimekko = ({ activeColumn = null, scrollStory = false }) => {
  const [setFigureNode, isVisible] = useIsVisible(0.4);
  const chartRef = useRef(null);
  const svgRef = useRef(null);
  const animatedRef = useRef(false);
  const activeColumnRef = useRef(activeColumn);
  const [width, setWidth] = useState(0);
  const [tooltip, setTooltip] = useState(null);
  const [viewportHeight, setViewportHeight] = useState(() => window.innerHeight);
  const [plotHeightBudget, setPlotHeightBudget] = useState(340);

  useEffect(() => {
    activeColumnRef.current = activeColumn;
    highlightColumn(svgRef.current, activeColumn);
    setTooltip(null);
  }, [activeColumn]);

  useEffect(() => {
    if (!scrollStory) return undefined;
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [scrollStory]);

  useEffect(() => {
    const node = chartRef.current;
    if (!node) return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!width || (!isVisible && !scrollStory)) return;
    const animate = !scrollStory && !animatedRef.current && !prefersReducedMotion();
    animatedRef.current = true;
    const { plotHeight } = drawChart(svgRef.current, {
      animate,
      maxPlotHeight: scrollStory ? plotHeightBudget : 340,
      onHover: (segment, event) => {
        if (!segment) {
          setTooltip(null);
          return;
        }
        const bounds = chartRef.current.getBoundingClientRect();
        const target = event.type === 'focus' ? event.target.getBoundingClientRect() : null;
        const clientX = target ? target.x + target.width / 2 : event.clientX;
        const clientY = target ? target.y + target.height / 2 : event.clientY;
        setTooltip({ left: clientX - bounds.left, segment, top: clientY - bounds.top, width: bounds.width });
      },
      width
    });
    if (scrollStory) {
      const chromeHeight = chartRef.current.closest('.chart_marimekko').getBoundingClientRect().height - plotHeight;
      setPlotHeightBudget(Math.max(140, Math.min(340, Math.floor(viewportHeight - chromeHeight - 32))));
    }
    highlightColumn(svgRef.current, activeColumnRef.current);
    setTooltip(null);
  }, [isVisible, plotHeightBudget, scrollStory, viewportHeight, width]);

  return (
    <figure className={`container_chart_marimekko${scrollStory ? ' chart_marimekko_story_figure' : ''}`} ref={setFigureNode}>
      <div className="parallax_container" style={{ opacity: isVisible || scrollStory ? '1' : '0', top: isVisible || scrollStory ? '0px' : '50px' }}>
        <div className="chart_marimekko">
          <div className="chart_header">
            <svg className="chart_arrow" viewBox="0 0 288.8 289.6" aria-hidden="true">
              <path d="M11.4,289c-2.6,0-5.2-0.4-9.6-0.7c51.3-48.9,101.1-96.5,151.6-144.7C103.8,96.4,54.7,49.5,5.5,2.6C5.7,2.1,6,1.5,6.2,1C7.8,1,9.4,1,11,1C51,1,91,1.1,131,0.9c5.8,0,9.9,1.7,14,5.7c27.5,26.4,55.2,52.7,82.8,79c20.1,19.2,40.2,38.5,60.3,57.7c-0.7,1.1-1,1.9-1.6,2.4c-48.5,46.3-97.1,92.6-145.6,139c-3.5,3.4-7.2,4.5-11.9,4.5C89.8,289,50.6,289.1,11.4,289" />
            </svg>
            <h3>{TITLE}</h3>
          </div>
          <p className="chart_description">{scrollStory ? 'Share of traced value added by component and supplier group, percentage' : DESCRIPTION}</p>
          <ul className="chart_legend">
            {SUPPLIERS.map(s => (
              <li key={s.key}>
                <span className="swatch" style={{ backgroundColor: s.color }} />
                {s.label}
              </li>
            ))}
          </ul>
          <div className="chart_body" ref={chartRef}>
            <svg ref={svgRef} role="img" aria-label={`${TITLE}. ${DESCRIPTION}.`} />
            {tooltip && (
              <div
                className="chart_tooltip"
                style={{
                  left: Math.min(Math.max(tooltip.left, 110), tooltip.width - 110),
                  top: tooltip.top
                }}
              >
                <div className="tooltip_title">{tooltip.segment.columnLabel}</div>
                <div className="tooltip_row">
                  <span className="swatch" style={{ backgroundColor: tooltip.segment.color }} />
                  {tooltip.segment.label}
                  <strong>{formatPct(tooltip.segment.value)}</strong>
                </div>
                <div className="tooltip_total">{`${formatPct(tooltip.segment.shareOfTotal)} of total traced value added`}</div>
              </div>
            )}
          </div>
          <ChartMarimekkoMeta />
        </div>
      </div>
    </figure>
  );
};

export default ChartMarimekko;
