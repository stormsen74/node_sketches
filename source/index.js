/**
 * Created by STORMSEN on 13.06.2017.
 */


import Sketches from './Sketches';

// http://www.2ality.com/


const init = () => {
    const demo = new Sketches();
    const update = () => {
        // raf(update);
        // demo.update();
        // demo.render();
    };
    const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // demo.resize(width, height)
    };
    // window.addEventListener('resize', resize);
    // resize();
    // update();
};




if (document.readyState === 'complete') init();
else window.addEventListener('load', init);