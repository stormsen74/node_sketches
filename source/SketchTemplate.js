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
            autostart: true,
            autopause: false,
            autoclear: true,
            running: false
        });

        this.sketch.lineCap = 'round';
        this.sketch.lineJoin = 'round';


        this.sketch.setup = function () {
        };

        this.sketch.start = function () {
        };

        this.sketch.update = function () {
        };

        this.sketch.plotPoint = function (x, y, radius, strokeWidth, strokeColor, fillColor) {
            let _radius = radius || 10;
            let _strokeWidth = strokeWidth || 0;
            let _strokeColor = strokeColor || '#fff';
            let _fillColor = fillColor || '#fff';

            this.lineWidth = _strokeWidth;
            this.strokeStyle = _strokeColor;
            this.fillStyle = _fillColor;

            this.beginPath();
            this.arc(x, y, _radius, 0, TWO_PI);
            this.fill();
            if (_strokeWidth > 0) {
                this.stroke();
            }
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