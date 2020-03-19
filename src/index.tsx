import './index.css';

import LogRocket from 'logrocket';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { pageview } from './util/misc';

ReactDOM.render(<App />, document.getElementById('root'));

// Set up logrocket: https://app.logrocket.com/
LogRocket.init('ltma3j/eevaluator');

// Log pageview to Google Analytics
pageview();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
