import FocusChartStory from '../shared/FocusChartStory.jsx';
import ChartMarimekko from './ChartMarimekko.jsx';

import './styles/story.css';

const STAGES = [
  {
    key: 'introduction',
    column: null,
    headline: 'Who captures the value of an AI server rack?',
    body: 'Each column is a type of income. The wider the column, the bigger its share of the value created.'
  },
  {
    key: 'production',
    column: 'production_labour',
    headline: 'Production workers receive 4.3%.'
  },
  {
    key: 'non-production',
    column: 'non_production_labour',
    headline: 'Other staff, such as engineers and managers, receive 9.9%.',
    body: 'All workers together: less than 15%.'
  },
  {
    key: 'profit',
    column: 'post_tax_profit',
    headline: 'After-tax profit takes 68%.',
    body: 'One chip designer captures most of it.'
  },
  {
    key: 'conclusion',
    column: null,
    headline: 'Four supplier groups capture 82% of the value.',
    body: "Most developing economies capture less than 1%, mainly by supplying raw materials. Taking part in production isn't the same as capturing its value."
  }
];

const ChartMarimekkoStory = () => <FocusChartStory label="How value added is distributed in an AI server rack" stages={STAGES} renderChart={step => <ChartMarimekko activeColumn={STAGES[step].column} scrollStory />} />;

export default ChartMarimekkoStory;
