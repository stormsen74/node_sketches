/**
 * Created by STORMSEN on 14.06.2017.
 */


// var Sketch = require('sketch-js');
var chromatism = require('chromatism');

import SketchTemplate from "./SketchTemplate.js";

class Sketch_1 extends SketchTemplate {

    constructor() {
        super(true, false);

        console.log('Sketch_1!');

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.hue = 0;
        this.sketch.t = 0;
        this.sketch.delta = .01;


        this.sketch.setup = function () {
        };

        this.sketch.mousedown = function () {
        };


        this.sketch.mousemove = function () {

            if (this.running) {

                this.hue = this.hue < 359 ? this.hue += 1 : 0;
                let s = 60;
                let l = 50;
                let color = ({h: this.hue, s: s, l: l});
                this.strokeStyle = chromatism.convert(color).hex;

                this.t += this.delta;
                let w = 1 + abs(sin(this.t) * 10);
                this.lineWidth = w;

                this.beginPath();
                this.moveTo(this._mx, this._my);
                this.lineTo(this.mouse.x, this.mouse.y);
                this.closePath();
                this.stroke();

                this._mx = this.mouse.x;
                this._my = this.mouse.y;
            }


        };


    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketch_1;