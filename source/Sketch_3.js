/**
 * Created by STORMSEN on 14.06.2017.
 */


// var Sketch = require('sketch-js');
var chromatism = require('chromatism');

import SketchTemplate from "./SketchTemplate.js";
import {Vector2} from "./math/vector2";

class Sketch_3 extends SketchTemplate {

    /*--------------------------------------------


     --------------------------------------------*/

    constructor() {
        super(true, true);

        console.log('Sketch_3!');

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.phi = 0;
        this.sketch.numSteps = 500;
        this.sketch.stepLength = 2 * Math.PI / this.sketch.numSteps;
        this.sketch.stepper = 0;
        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);
        this.sketch.vPlot = new Vector2(0, 0);

        /*--------------------------------------------
         ~ confif stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            A: 1,
            B: 1,
            DELTA: Math.PI * .5,
            SPEED: 1,
            MULTIPLYER: 150,
            NUM_SAMPLES: 500
        };
        this.initControls();

        /*--------------------------------------------
         ~ sketch methods
         --------------------------------------------*/

        this.sketch.setup = function () {
            console.log('setup');
        };

        this.sketch.mousedown = function () {
        };

        this.sketch.mousemove = function () {
        };

        this.sketch.update = function () {
            this.stepLength = 2 * Math.PI / this.CONFIG.NUM_SAMPLES;
            this.stepper += this.stepLength * this.CONFIG.SPEED;
        };

        this.sketch.draw = function () {

            for (var i = 0; i < this.CONFIG.NUM_SAMPLES; i++) {

                this.phi += this.stepLength;

                this.vPlot.x = 1 * sin(this.CONFIG.A * this.phi + this.CONFIG.DELTA + this.stepper);
                this.vPlot.y = 1 * sin(this.CONFIG.B * this.phi);

                this.vPlot.multiplyScalar(this.CONFIG.MULTIPLYER);

                let vResult = Vector2.add(this.vCenter, this.vPlot);
                this.plotPoint(vResult.x, vResult.y, 1);
                this.lineFromTo(this.vCenter, vResult);

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

        this.gui.add(this.sketch.CONFIG, 'A').min(1).max(15).step(1).name('A');
        this.gui.add(this.sketch.CONFIG, 'B').min(1).max(15).step(1).name('B');
        this.gui.add(this.sketch.CONFIG, 'DELTA').min(0).max(Math.PI * 2).step(.01).name('DELTA');
        this.gui.add(this.sketch.CONFIG, 'SPEED').min(0).max(3).step(.01).name('SPEED');
        this.gui.add(this.sketch.CONFIG, 'MULTIPLYER').min(-300).max(300).step(1).name('MULTIPLYER');
        this.gui.add(this.sketch.CONFIG, 'NUM_SAMPLES').min(1).max(1000).step(1).name('NUM_SAMPLES');
    }

    updateParams() {
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketch_3;