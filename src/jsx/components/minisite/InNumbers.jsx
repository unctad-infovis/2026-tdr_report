import RollingNumber from '@unctad-infovis/general-tools/components/RollingNumber.jsx';
import useIsVisible from '@unctad-infovis/general-tools/helpers/UseIsVisible.js';

import './InNumbers.css';

const ICONS = {
  drop: <path d="M12 3c3.5 4.6 6 8.2 6 11.2A6 6 0 0 1 6 14.2C6 11.2 8.5 7.6 12 3Z" />,
  pulse: <path d="M2 13h4l3-8 4 15 3-9 2 2h4" />,
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  )
};

const InNumbers = ({ bars = [], barsCaption, facts = [], headline, headlineDecimals = 1, headlineText, headlineUnit, title = 'In numbers' }) => {
  const [setNode, isVisible] = useIsVisible(0.3);
  const maxBar = Math.max(...bars.map(b => b.value));

  return (
    <section className={`in_numbers${isVisible ? ' visible' : ''}`} ref={setNode}>
      <h3 className="in_numbers_title">
        <span className="in_numbers_arrow" aria-hidden="true" />
        {title}
      </h3>
      <div className="in_numbers_main">
        <div className="in_numbers_headline">
          <p className="in_numbers_value">
            <span className="visually_hidden">{`${headline}${headlineUnit ?? ''}`}</span>
            <span aria-hidden="true">
              <RollingNumber decimals={headlineDecimals} inView={isVisible} target={headline} />
              {headlineUnit && <span className="in_numbers_unit">{headlineUnit}</span>}
            </span>
          </p>
          <p className="in_numbers_text">{headlineText}</p>
        </div>
        {bars.length > 0 && (
          <figure className="in_numbers_bars">
            <ul aria-label={barsCaption}>
              {bars.map(bar => (
                <li className={bar.highlight ? 'highlight' : undefined} key={bar.label}>
                  <span className="bar_value">{bar.value.toFixed(1)}</span>
                  <span className="bar" style={{ '--bar-height': `${(bar.value / maxBar) * 100}%` }} />
                  <span className="bar_label">{bar.label}</span>
                </li>
              ))}
            </ul>
            {barsCaption && <figcaption>{barsCaption}</figcaption>}
          </figure>
        )}
      </div>
      {facts.length > 0 && (
        <ul className="in_numbers_facts">
          {facts.map(fact => (
            <li className="fact" key={fact.text}>
              {fact.icon && ICONS[fact.icon] && (
                <svg aria-hidden="true" className="fact_icon" viewBox="0 0 24 24">
                  {ICONS[fact.icon]}
                </svg>
              )}
              <p className="fact_value">
                {fact.from ? (
                  <>
                    {fact.from}
                    <span className="fact_arrow" aria-hidden="true">
                      →
                    </span>
                    <span className="visually_hidden"> to </span>
                    {fact.to}
                  </>
                ) : (
                  fact.value
                )}
              </p>
              <p className="fact_text">{fact.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default InNumbers;
