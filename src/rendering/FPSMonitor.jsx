import { useEffect } from 'react';
import Stats from "stats.js";

const stats = new Stats();
stats.showPanel( 0 ); // 0 shows the FPS monitor graph
stats._counter = 0;

function animate() {
	stats.begin();
	stats._counter++;
	stats.end();
	requestAnimationFrame( animate );
}

const FPSMonitor = () => {
    useEffect(() => {
        document.body.appendChild( stats.dom );
        animate();
    }, []);

    return null;
};

export default FPSMonitor;