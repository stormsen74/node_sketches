/**
 * Created by STORMSEN on 14.06.2017.
 */


var chromatism = require('chromatism');
var chroma = require('chroma-js');

import SketchTemplate from "./SketchTemplate.js";
import mathUtils from "./utils/mathUtils.js"
import {Vector2} from "./math/vector2";

class Sketch_8 extends SketchTemplate {

    /*--------------------------------------------


     --------------------------------------------*/

    constructor() {
        super();

        console.log('Sketch_8!');

        console.log(mathUtils.getRandomBetween(10, 40))

        // https://gka.github.io/chroma.js/
        let c = chroma.hsl(330, 1, 0.6);
        c = chroma.hsl(333.0, 1, 0.6);
        console.log(c.hex())

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.goldenRatio = 1.61803398875;
        this.sketch.fibonacciAngle = 137.5;
        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);
        this.sketch.cells = [];

        /*--------------------------------------------
         ~ confif stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            ATTRACTOR: {
                a: Math.random() * 4 - 2,
                b: Math.random() * 4 - 2,
                c: Math.random() * 4 - 2,
                d: Math.random() * 4 - 2
            },
            DRAWS_PER_CALL: 1000,
            METHODS: {
                shuffle: function () {
                },
                reset: function () {
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

            // return (y - x) * 0.001 * Math.PI * 2;

            // return (Math.sin(x * 0.01) + Math.sin(y * 0.01)) * Math.PI * 2;

            // return


            // clifford attractor
            // http://paulbourke.net/fractals/clifford/

            // scale down x and y
            let scale = 0.005;
            x = (x - this.width * .5) * scale;
            y = (y - this.height * .5) * scale;

            // attactor gives new x, y for old one.
            let x1 = Math.sin(this.CONFIG.ATTRACTOR.a * y) + this.CONFIG.ATTRACTOR.c * Math.cos(this.CONFIG.ATTRACTOR.a * x);
            let y1 = Math.sin(this.CONFIG.ATTRACTOR.b * x) + this.CONFIG.ATTRACTOR.d * Math.cos(this.CONFIG.ATTRACTOR.b * y);

            // find angle from old to new. that's the value.
            return Math.atan2(y1 - y, x1 - x);
        };

        this.sketch.render = function (value) {

            let c = chroma.hsl(330, 1, 0.6);
            c = chroma.hsl(333.0, 1, 0.6);
            console.log(c.hex())

            this.strokeStyle = chromatism.convert(({h: 20 + Math.abs(value) * 20, s: 50, l: 40})).hex;

            this.rotate(value);
            this.beginPath();
            this.moveTo(0, 0);
            this.lineTo(value * 10, -value * 10);
            this.stroke();
        }

        this.sketch.plotField = function () {
            console.log('plotField');

            this.globalCompositeOperation = 'add';
            // let color = ({h: 90, s: 50, l: 40});
            // this.strokeStyle = chromatism.convert(color).hex;
            // this.strokeStyle = '#ffffff';
            this.lineWidth = 1;

            for (let i = 0; i < this.CONFIG.DRAWS_PER_CALL; i++) {
                let x = Math.random() * this.width;
                let y = Math.random() * this.height;


                let value = this.getValue(x, y);

                this.save();

                this.translate(x, y);

                this.render(value);

                this.restore();

                // this.plotPoint(x, y, 2, 0, '#ff0000', '#cccccc');
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

        this.gui.add(this.sketch.CONFIG, 'DRAWS_PER_CALL').min(100).max(20000).step(1).name('DRAWS_PER_CALL');
        this.gui.add(this.sketch.CONFIG.METHODS, 'reset').onChange(this.reset.bind(this));

        let f1 = this.gui.addFolder('clifford attractor');
        f1.add(this.sketch.CONFIG.ATTRACTOR, 'a').min(-2).max(2).step(.01).onChange(this.updateParams.bind(this)).listen();
        f1.add(this.sketch.CONFIG.ATTRACTOR, 'b').min(-2).max(2).step(.01).onChange(this.updateParams.bind(this)).listen();
        f1.add(this.sketch.CONFIG.ATTRACTOR, 'c').min(-2).max(2).step(.01).onChange(this.updateParams.bind(this)).listen();
        f1.add(this.sketch.CONFIG.ATTRACTOR, 'd').min(-2).max(2).step(.01).onChange(this.updateParams.bind(this)).listen();
        f1.add(this.sketch.CONFIG.METHODS, 'shuffle').onChange(this.shuffleParameters.bind(this));
        f1.open();

    }

    updateParams() {
        this.sketch.clear();
        this.sketch.plotField();
    }

    shuffleParameters() {
        this.sketch.clear();
        this.sketch.CONFIG.ATTRACTOR.a = Math.random() * 4 - 2;
        this.sketch.CONFIG.ATTRACTOR.b = Math.random() * 4 - 2;
        this.sketch.CONFIG.ATTRACTOR.c = Math.random() * 4 - 2;
        this.sketch.CONFIG.ATTRACTOR.d = Math.random() * 4 - 2;
        this.sketch.plotField();
    }

    reset() {
        this.sketch.clear();
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketch_8;