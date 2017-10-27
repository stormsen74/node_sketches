/**
 * Created by STORMSEN on 14.06.2017.
 */


var Sketch = require('sketch-js');
import mathUtils from "./utils/mathUtils";

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

        //this.sketch.globalCompositeOperation = 'lighter';


        this.sketch.setup = function () {
        };

        this.sketch.start = function () {
        };

        this.sketch.update = function () {
        };

        this.sketch.plotPoint = function (x, y, radius, strokeWidth, strokeColor, fillColor) {
            let _radius = radius || 10;
            let _strokeWidth = strokeWidth || 'noStroke';
            let _strokeColor = strokeColor || '#fff';
            let _fillColor = fillColor || 'noFill';

            this.lineWidth = _strokeWidth;
            this.strokeStyle = _strokeColor;
            this.fillStyle = _fillColor;

            this.beginPath();
            this.arc(x, y, _radius, 0, TWO_PI);
            if (_fillColor != 'noFill') this.fill();
            if (_strokeWidth != 'noStroke') this.stroke();

        };


        this.sketch.lineFromTo = function (vStart, vEnd) {

            this.strokeStyle = '#ffffff';
            this.lineWidth = .5;

            this.moveTo(vStart.x, vStart.y);
            this.lineTo(vEnd.x, vEnd.y);
            this.stroke();

        }

        this.sketch.line = function (x, y, a) {

            let _a = a || 0;
            let lineLength = 100;

            this.strokeStyle = '#ffffff';
            this.lineWidth = 2;

            this.save();

            this.translate(x, y);
            this.rotate(_a);
            this.beginPath();
            this.moveTo(-lineLength * .5, 0);
            this.lineTo(lineLength * .5, 0);
            this.closePath();
            this.stroke();

            this.restore();
        }


    }

    start() {
        this.sketch.start();
    }

    stop() {
        this.sketch.stop();
    }

    toggle() {
        this.sketch.toggle();
    }

    clear() {
        this.sketch.clear();
    }

    destroy() {
        this.sketch.destroy();
    }
}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default SketchTemplate;