import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import FPSMonitor from "./FPSMonitor";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <FPSMonitor />
  </React.StrictMode>,
  document.getElementById('root')
);
