import '../index.css';

import App from './App'
import FPSMonitor from "./FPSMonitor";
import Invitations from './invitations/Invitations'
import React from 'react';

export default () => (
    <React.StrictMode>
        <App />
        <Invitations dealer={{id: 123, name: "John Wick"}} />
        <FPSMonitor />
    </React.StrictMode>
);