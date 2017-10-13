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
            A: 7,
            B: 6,
            DELTA: Math.PI * .5,
            SPEED: 0.09,
            SPEED_M: 1,
            M_X: 150,
            M_Y: 150,
            NUM_SAMPLES: 10,
            DRAW_CENTER_LINES: true,
            DRAW_OUT_LINES: true
        };
        this.initControls();
        this.sketch.datContainer = document.getElementById('dat-container');

        /*--------------------------------------------
         ~ sketch methods
         --------------------------------------------*/

        this.sketch.setup = function () {
        };

        this.sketch.mousedown = function () {
        };


        this.sketch.update = function () {
            this.stepLength = 2 * Math.PI / this.CONFIG.NUM_SAMPLES;
            this.stepper += this.stepLength * this.CONFIG.SPEED * this.CONFIG.SPEED_M;
        };

        this.sketch.draw = function () {

            var oldRes = new Vector2();
            var start = new Vector2();

            for (var i = 0; i < this.CONFIG.NUM_SAMPLES; i++) {

                this.phi += this.stepLength;

                this.vPlot.x = 1 * sin(this.CONFIG.A * this.phi + this.CONFIG.DELTA + this.stepper);
                this.vPlot.y = 1 * sin(this.CONFIG.B * this.phi);

                let m = new Vector2(this.CONFIG.M_X, this.CONFIG.M_Y)
                this.vPlot.multiply(m);

                //this.vPlot.multiplyScalar(this.CONFIG.M_X);

                let vResult = Vector2.add(this.vCenter, this.vPlot);
                if (i == 0) {
                    oldRes = vResult;
                    start = vResult
                }

                this.plotPoint(vResult.x, vResult.y, 1);
                if (this.CONFIG.DRAW_CENTER_LINES) this.lineFromTo(this.vCenter, vResult);
                if (this.CONFIG.DRAW_OUT_LINES) {
                    this.lineFromTo(oldRes, vResult)
                    if (i == this.CONFIG.NUM_SAMPLES - 1) this.lineFromTo(vResult, start);
                }

                oldRes = vResult;

                //this.line(vResult.x, vResult.y, 0)
            }


        };

    }

    /*--------------------------------------------
     ~ class methods
     --------------------------------------------*/

    kill () {
        document.getElementById('dat-container').removeChild(this.gui.domElement);
    }


    initControls() {
        this.gui = new dat.GUI({
            width: 360,
            closed: false,
            autoPlace: false
        });

        document.getElementById('dat-container').appendChild(this.gui.domElement);

        //this.gui.add(this.sketch.CONFIG, 'BASE').min(1).max(12).step(1).name('BASE').onChange(this.updateParams.bind(this));

        this.gui.add(this.sketch.CONFIG, 'A').min(1).max(15).step(1).name('A');
        this.gui.add(this.sketch.CONFIG, 'B').min(1).max(15).step(1).name('B');
        this.gui.add(this.sketch.CONFIG, 'DELTA').min(0).max(Math.PI * 2).step(.01).name('DELTA');
        this.gui.add(this.sketch.CONFIG, 'SPEED').min(0).max(3).step(.01).name('SPEED');
        this.gui.add(this.sketch.CONFIG, 'SPEED_M').min(0).max(10).step(1).name('SPEED_M');
        this.gui.add(this.sketch.CONFIG, 'M_X').min(0).max(600).step(1).name('M_X');
        this.gui.add(this.sketch.CONFIG, 'M_Y').min(0).max(600).step(1).name('M_Y');
        this.gui.add(this.sketch.CONFIG, 'NUM_SAMPLES').min(1).max(1000).step(1).name('NUM_SAMPLES');
        this.gui.add(this.sketch.CONFIG, 'DRAW_CENTER_LINES').name('DRAW_CENTER_LINES');
        this.gui.add(this.sketch.CONFIG, 'DRAW_OUT_LINES').name('DRAW_OUT_LINES');
    }

   

    updateParams() {

    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketch_3;