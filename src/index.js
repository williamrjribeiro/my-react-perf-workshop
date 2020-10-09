import './index.css';

import Loading from './loading/Loading.2';
import MyErrorBoundary from './loading/MyErrorBoundary'
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <MyErrorBoundary><Loading /></MyErrorBoundary>,
  document.getElementById('root')
);
