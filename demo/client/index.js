import React from 'react';
import { render } from 'react-dom';
import DemoEditor from './components/DemoEditor';

// Import your routes so that you can pass them to the <Router /> component
// eslint-disable-next-line import/no-named-as-default

// Only render in the browser
if (typeof document !== 'undefined') {
  render(
    <DemoEditor />,
    document.getElementById('root')
  );
}
