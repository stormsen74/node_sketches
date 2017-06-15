/**
 * Created by STORMSEN on 14.06.2017.
 */


// var Sketch = require('sketch-js');
var chromatism = require('chromatism');

import SketchTemplate from "./SketchTemplate.js";
import MathUtils from "./utils/mathUtils";
import {Vector2} from "./math/vector2";

class Sketch_2 extends SketchTemplate {

    /*--------------------------------------------

     φ = n * 137.5°
     r = c * √n

     n is the ordering number of a floret, counting outward from the
     center. This is the reverse of floret age in a real plant

     φ is the angle between a reference direction and the position vector
     of the nth floret in a polar coordinate system originating at
     the center of the capitulum. It follows that the divergence angle
     between the position vectors of any two successive florets is
     constant, α = 137.5°.

     r is the distance between the center of the capitulum and the
     center of the nth floret, given a constant scaling parameter c.

     fibonacciAngle = 360 / (goldenRatio * goldenRatio);
     --------------------------------------------*/

    constructor() {
        super(true, true);

        console.log('Sketch_2!');

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.goldenRatio = 1.61803398875;
        this.sketch.fibonacciAngle = 137.5;
        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);

        /*--------------------------------------------
         ~ confif stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            BASE: 5,
            NUM_POINTS: 360,
            R: 12,
            POINT_SCALE: 1
        };
        this.initControls();

        /*--------------------------------------------
         ~ sketch methods
         --------------------------------------------*/

        this.sketch.setup = function () {
            console.log('setup');
            this.plotPoint(this.vCenter.x, this.vCenter.y, 5, 1, '#ff0000', '#0000ff');

        };

        this.sketch.mousedown = function () {
            this.start();
        };

        this.sketch.mousemove = function () {
        };

        this.sketch.draw = function () {

            let minPointSize = 1;
            let maxPointSize = 7;

            for (var n = 1; n < this.CONFIG.NUM_POINTS; n++) {

                let r = this.CONFIG.R * Math.sqrt(n);
                let theta = this.fibonacciAngle * n * this.CONFIG.BASE;
                let x = r * Math.cos(theta);
                let y = r * Math.sin(theta);


                let h = MathUtils.convertToRange(n, [0, this.CONFIG.NUM_POINTS], [25, 60])
                let s = 60;
                let l = 50;
                let color = ({h: h, s: s, l: l});

                // color = color.setHue(convertToRange(n, [0, CONFIG.NUM_POINTS], [25, 60]));
                // colorShape = color.setLightness(.3);

                // demo.plotPoint(vCenter.x + x, vCenter.y + y, n / CONFIG.NUM_POINTS * maxPointSize, color.toCSS(), colorShape.toCSS());

                this.plotPoint(
                    this.vCenter.x + x,
                    this.vCenter.y + y,
                    (minPointSize + n / this.CONFIG.NUM_POINTS * maxPointSize) * this.CONFIG.POINT_SCALE,
                    0,
                    chromatism.invert(color).hex,
                    chromatism.convert(color).hex
                );

            }
        };

    }

    /*--------------------------------------------
     ~ class methods
     --------------------------------------------*/

    initControls() {
        this.gui = new dat.GUI({
            width: 360,
            closed: false
        });

        //this.gui.add(this.sketch.CONFIG, 'BASE').min(1).max(12).step(1).name('BASE').onChange(this.updateParams.bind(this));

        this.gui.add(this.sketch.CONFIG, 'BASE').min(1).max(12).step(1).name('BASE');
        this.gui.add(this.sketch.CONFIG, 'NUM_POINTS').min(0).max(720).step(1).name('NUM_POINTS');
        this.gui.add(this.sketch.CONFIG, 'R').min(0).max(36).step(.1).name('R');
        this.gui.add(this.sketch.CONFIG, 'POINT_SCALE').min(0).max(2).step(.01).name('POINT_SCALE');
    }

    updateParams() {

    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketch_2;