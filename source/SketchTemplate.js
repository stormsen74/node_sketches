/**
 * Created by STORMSEN on 14.06.2017.
 */


var Sketch = require('sketch-js');

class SketchTemplate {

    constructor() {

        console.log('SketchTemplate!');

        // https://github.com/soulwire/sketch.js/wiki/API
        
        this.sketch = Sketch.create({
            container: document.getElementById('screen'),
            interval: 1,
            retina: 'auto',
            autostart: false,
            autopause: false,
            autoclear: false,
            running: false
        });


        this.sketch.setup = function () {
        };

        this.sketch.start = function () {
        };

        this.sketch.update = function () {
        };

        this.sketch.draw = function () {
        };


    }

    start() {
        this.sketch.start();
        this.sketch.running = true;
    }

    stop() {
        this.sketch.stop();
        this.sketch.running = false;
    }
}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default SketchTemplate;