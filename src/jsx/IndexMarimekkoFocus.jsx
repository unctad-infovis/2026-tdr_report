import { createRoot } from 'react-dom/client';

import '@unctad-infovis/general-tools/styles/styles.css';
import './App.css';
import ChartMarimekkoStory from './components/marimekko/ChartMarimekkoStory.jsx';
import './MarimekkoFocus.css';

const container = document.getElementById(`app-root-${__PROJECT_NAME__}-marimekko-focus`);
createRoot(container).render(
  <div
    className="app"
    style={{
      '--main-color': 'var(--un-color-red-dark)',
      '--secondary-color': 'var(--un-color-red-darkest)',
      '--ms-column': '920px',
      '--ms-theme-text': 'var(--un-color-red-text-dark)',
      '--ms-cta': 'var(--un-color-yellow)',
      '--ms-card-ratio': '1 / 1'
    }}
  >
    <ChartMarimekkoStory />
  </div>
);
