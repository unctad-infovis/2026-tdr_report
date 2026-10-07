import { createRoot } from 'react-dom/client';

import '@unctad-infovis/general-tools/styles/styles.css';
import './App.css';
import ChartMarimekko from './components/marimekko/ChartMarimekko.jsx';

const container = document.getElementById(`app-root-${__PROJECT_NAME__}-marimekko-chart`);
createRoot(container).render(
  <div
    className="app"
    style={{
      '--main-color': 'var(--un-color-red-dark)',
      '--secondary-color': 'var(--un-color-red-darkest)',
      '--un-column-width': '920px',
      '--un-chapter-card-ratio': '1 / 1'
    }}
  >
    <ChartMarimekko />
  </div>
);
