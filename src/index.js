import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import FPSMonitor from "./FPSMonitor";
import Invitations from './invitations/Invitations';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Invitations dealer={{id: 123, name: 'John Wick'}} />
    <FPSMonitor />
  </React.StrictMode>,
  document.getElementById('root')
);
