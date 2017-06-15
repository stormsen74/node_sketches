/**
 * Created by STORMSEN on 14.06.2017.
 */


var Sketch = require('sketch-js');

class SketchTemplate {

    constructor(_autostart, _autoclear) {

        let autostart = _autostart || false;
        let autoclear = _autoclear || false;

        console.log('SketchTemplate!', 'autostart: ', autostart, ' | autoclear: ', autoclear);

        // https://github.com/soulwire/sketch.js/wiki/API

        this.sketch = Sketch.create({
            container: document.getElementById('screen'),
            interval: 1,
            retina: 'auto',
            autopause: true,
            autostart: autostart,
            autoclear: autoclear
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
    }

    stop() {
        this.sketch.stop();
    }
}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default SketchTemplate;