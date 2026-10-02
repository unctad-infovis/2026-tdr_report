import { useEffect, useRef, useState } from 'react';
import ChartMarimekko from './ChartMarimekko.jsx';

import './styles/story.css';

const STAGES = [
  {
    key: 'introduction',
    column: null,
    headline: 'Who captures the value of an AI server rack?',
    body: 'Each column shows an income type. Its width represents its share of total traced value added; the colours show how that income is divided among supplier groups. Scroll to explore the contrast between workers and profits.'
  },
  {
    key: 'production',
    column: 'production_labour',
    headline: 'Production workers receive 4.3% of traced value added.',
    body: 'Production labour accounts for a small share of the total. Within this column, assemblers account for 23.2% and memory suppliers for 17.9%, while the fabless company accounts for 8.1%.'
  },
  {
    key: 'non-production',
    column: 'non_production_labour',
    headline: 'Non-production labour accounts for another 9.9%.',
    body: 'The fabless company accounts for 74.5% of this income type. Together, production and non-production labour receive 14.2% of total traced value added, less than 15%.'
  },
  {
    key: 'profit',
    column: 'post_tax_profit',
    headline: 'After-tax profit takes 68% of the total.',
    body: 'This is by far the widest column. The fabless company captures 83.8% of after-tax profit, illustrating how strongly the gains are concentrated.'
  },
  {
    key: 'conclusion',
    column: null,
    headline: 'The AI boom’s gains are highly concentrated.',
    body: 'Four supplier groups account for 82% of value added in this advanced AI server rack. Of the value added traced by income type, after-tax profit accounts for 68%, compared with less than 15% for workers. Participating in production does not necessarily mean capturing a large share of its value.'
  }
];

const ChartMarimekkoStory = () => {
  const [activeStep, setActiveStep] = useState(0);
  const panelRefs = useRef([]);

  useEffect(() => {
    let frame = null;
    let resizeTimer;

    const updateStep = () => {
      frame = null;
      const trigger = window.innerHeight * 0.65;
      let next = 0;
      for (const [index, panel] of panelRefs.current.entries()) {
        if (panel && panel.firstElementChild.getBoundingClientRect().top <= trigger) next = index;
      }
      setActiveStep(next);
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(updateStep);
    };
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(onScroll, 150);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('resize', onResize);
    updateStep();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
      if (frame !== null) cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <section className="chart_marimekko_story" aria-label="How value added is distributed in an AI server rack" data-active-step={STAGES[activeStep].key}>
      <div className="marimekko_story_layout">
        <div className="marimekko_story_visual">
          <ChartMarimekko activeColumn={STAGES[activeStep].column} scrollStory />
        </div>
        <div className="marimekko_story_panels">
          {STAGES.map((stage, index) => (
            <div
              className="marimekko_story_panel"
              key={stage.key}
              data-step={stage.key}
              ref={node => {
                panelRefs.current[index] = node;
              }}
            >
              <div className="marimekko_story_text">
                <p className="marimekko_story_step">
                  {index + 1} / {STAGES.length}
                </p>
                <h3 className="marimekko_story_headline">{stage.headline}</h3>
                <p>{stage.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChartMarimekkoStory;
