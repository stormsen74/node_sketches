/**
 * Created by STORMSEN on 14.06.2017.
 */


var chromatism = require('chromatism');

import SketchTemplate from "./SketchTemplate.js";
import {Vector2} from "./math/vector2";

class Sketch_8 extends SketchTemplate {

    /*--------------------------------------------


     --------------------------------------------*/

    constructor() {
        super();

        console.log('Sketch_8!');

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
            POINT_SCALE: 1,
            METHODS: {
                save: function () {
                }
            }
        };
        this.initControls();

        /*--------------------------------------------
         ~ sketch methods
         --------------------------------------------*/

        this.sketch.setup = function () {
            console.log('setup');
            // this.plotPoint(this.vCenter.x, this.vCenter.y, 5, 1, '#ff0000', '#0000ff');

        };

        this.sketch.mousedown = function () {
            this.plotField();
        };

        this.sketch.mousemove = function () {
        };


        this.sketch.getValue = function (x, y) {
            // return (x + y) * 0.001 * Math.PI * 2;
            return (Math.sin(x * 0.01) + Math.sin(y * 0.01)) * Math.PI * 2;
        };

        this.sketch.render = function (value) {
            this.strokeStyle = chromatism.convert(({h: Math.abs(value) * 5, s: 50, l: 40})).hex;
            this.rotate(value);
            this.beginPath();
            this.moveTo(0, 0);
            this.lineTo(20, 1);
            this.stroke();
        }

        this.sketch.plotField = function () {
            console.log('plotField');

            this.globalCompositeOperation = 'overlay';
            // let color = ({h: 90, s: 50, l: 40});
            // this.strokeStyle = chromatism.convert(color).hex;
            this.lineWidth = 1;

            for (let i = 0; i < 3000; i++) {
                let x = Math.random() * this.width;
                let y = Math.random() * this.height;

                let value = this.getValue(x, y);
                console.log(value)

                this.save();

                this.translate(x, y);

                this.render(value);

                this.restore();
            }

        };

    }

    /*--------------------------------------------
     ~ class methods
     --------------------------------------------*/

    kill() {
        document.getElementById('dat-container').removeChild(this.gui.domElement);
    }

    initControls() {
        this.gui = new dat.GUI({
            width: 360,
            closed: false
        });

        document.getElementById('dat-container').appendChild(this.gui.domElement);

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

export default Sketch_8;