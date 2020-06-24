import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.final';
import FPSMonitor from "./FPSMonitor";
import Invitations from './invitations/Invitations.final';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Invitations dealer={{ name: "John Wick", id: 123}} />
    <FPSMonitor />
  </React.StrictMode>,
  document.getElementById('root')
);
