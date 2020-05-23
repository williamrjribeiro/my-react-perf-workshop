import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Invitations from './invitations/Invitations';
// import FPSMonitor from "./FPSMonitor";

ReactDOM.render(
  <React.StrictMode>
    <Invitations dealer={{ name: "John Wick", id: 123}} />
  </React.StrictMode>,
  document.getElementById('root')
);
