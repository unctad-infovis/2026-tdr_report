import { createRoot } from 'react-dom/client';

import '@unctad-infovis/general-tools/styles/styles.css';
import './App.css';
import ChartMarimekkoStory from './components/marimekko/ChartMarimekkoStory.jsx';
import './MarimekkoFocus.css';

const container = document.getElementById(`app-root-${__PROJECT_NAME__}-marimekko-focus`);
createRoot(container).render(
  <div className="app" style={{ '--main-color': 'var(--un-color-red-dark)', '--secondary-color': 'var(--un-color-red-darkest)' }}>
    <ChartMarimekkoStory />
  </div>
);
