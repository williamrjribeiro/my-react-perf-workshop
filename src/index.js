import React from 'react';
import ReactDOM from 'react-dom';
import Stats from "stats.js";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
stats._counter = 0;
document.body.appendChild( stats.dom );

function animate() {
	stats.begin();
	stats._counter++;
	stats.end();
	requestAnimationFrame( animate );
}
animate();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();