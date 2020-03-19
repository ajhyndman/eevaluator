import './index.css';
import '@wisersolutions/heap-analytics/lib/heap';

import LogRocket from 'logrocket';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { pageview } from './util/misc';

ReactDOM.render(<App />, document.getElementById('root'));

if (process.env.NODE_ENV === 'production') {
  // Set up logrocket: https://app.logrocket.com/
  LogRocket.init('ltma3j/eevaluator');

  // Set up Heap Analytivcs: https://heap.io/
  // @ts-ignore: Don't try to follow the types on this global
  window?.heap?.load('3355348701');
}

// Log pageview to Google Analytics
pageview();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
