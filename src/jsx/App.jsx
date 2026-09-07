import BackToTop from '@unctad-infovis/general-tools/components/BackToTop.jsx';
import ChartDataWrapper from '@unctad-infovis/general-tools/components/ChartDataWrapper.jsx';
import Image from '@unctad-infovis/general-tools/components/Image.jsx';
import ProgressBar from '@unctad-infovis/general-tools/components/ProgressBar.jsx';
import Quote from '@unctad-infovis/general-tools/components/Quote.jsx';
import Footer from '@unctad-infovis/minisite-tools/components/Footer.jsx';
import Header from '@unctad-infovis/minisite-tools/components/Header.jsx';
import HeaderChapter from '@unctad-infovis/minisite-tools/components/HeaderChapter.jsx';
import SideScrollingText from '@unctad-infovis/minisite-tools/components/SideScrollingText.jsx';

import { useEffect, useRef } from 'react';

import Article from '../Article.mdx';

// Project-specific chart components go here as they are built, e.g.:
// import ChartExample from './components/ChartExample.jsx';

import '@unctad-infovis/general-tools/styles/styles.css';
import '@unctad-infovis/minisite-tools/components/minisite.css';
import './App.css';

const components = {
  BackToTop,
  ChartDataWrapper,
  Footer,
  Header,
  HeaderChapter,
  Image,
  ProgressBar,
  Quote,
  SideScrollingText
};

const App = ({ meta }) => {
  const appRef = useRef();

  useEffect(() => {
    const elements = appRef.current.querySelectorAll('.container_chapter > p, .container_chapter > ul, .container_chapter > ol, .container_chapter > h3, .container_chapter > figure > blockquote, .container_chapter > .highlight_container');

    // Trigger when 50% of the element is visible.
    const options = { threshold: 0.5 };

    const observerCallback = entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, options);
    for (const el of elements) {
      observer.observe(el);
    }
    setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 500);
  }, []);

  window.appRef = appRef;

  return (
    <div
      className="app"
      style={{
        '--main-color': 'var(--un-color-red-dark)',
        '--secondary-color': 'var(--un-color-red-darkest)'
      }}
      ref={appRef}
    >
      <Article components={components} meta={meta} />
    </div>
  );
};

export default App;
