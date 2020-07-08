import React from 'react';

import { Router } from '@reach/router';

import CramOMatic from './CramOMatic';
import Eevaluator from './Eevaluator';

const App = () => (
  <Router>
    <Eevaluator path="/" />
    <CramOMatic path="cram-o-matic/" />
  </Router>
);

export default App;
