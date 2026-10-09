import FocusChartStory from '../shared/FocusChartStory.jsx';
import ChartMarimekko from './ChartMarimekko.jsx';

import './styles/story.css';

const STAGES = [
  {
    key: 'introduction',
    column: null,
    headline: 'Who captures the value of an AI advanced server rack?',
    body: 'A server rack is a computing system used in data centres. Each column shows a component. The wider the column, the bigger its share of the value created.'
  },
  {
    key: 'production',
    column: 'production_labour',
    headline: 'Production workers receive 4.3%.'
  },
  {
    key: 'non-production',
    column: 'non_production_labour',
    headline: 'Other workers, such as engineers and managers, receive 9.9%.',
    body: 'Together, workers receive less than 15%.'
  },
  {
    key: 'profit',
    column: 'post_tax_profit',
    headline: 'Profit after tax takes 68%.',
    body: 'One chip designer captures most of it.'
  },
  {
    key: 'conclusion',
    column: null,
    headline: 'Four supplier groups capture 82% of the value.',
    body: 'Most developing economies capture only a marginal share, mainly through raw materials. Taking part in production isn’t the same as capturing its value.'
  }
];

const ChartMarimekkoStory = () => <FocusChartStory label="How value added is distributed in an AI advanced server rack" stages={STAGES} renderChart={step => <ChartMarimekko activeColumn={STAGES[step].column} scrollStory />} />;

export default ChartMarimekkoStory;
