/**
 * Created by STORMSEN on 14.06.2017.
 */


var chroma = require('chroma-js');
var SimplexNoise = require('simplex-noise');

import SketchTemplate from "./SketchTemplate.js";
import Point from "./geom/Point.js";
import mathUtils from "./utils/mathUtils.js";
import {Vector2} from "./math/vector2";

class Sketch_10 extends SketchTemplate {

    constructor() {
        super(true, false);

        console.log('Sketch_10!');
        // https://academo.org/demos/vector-field-plotter/

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.mouseIsDown = false;
        this.sketch.vTarget = new Vector2(0, this.sketch.height * .5);

        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);

        /*--------------------------------------------
         ~ confif stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            dt_noise_z: .001,
            noise_scale: .001,
            PARAMETERS: {
                a: 1,
                b: -3,
                c: 3,
                d: -3
            },
            METHODS: {
                run: function () {
                },
                clear: function () {
                }
            }
        };
        this.initControls();


        this.sketch.setup = function () {

            console.log('setup');


            this.plotField();


        };


        this.sketch.plotField = function () {


            for (let x = 0; x < this.width; x += 50) {
                for (let y = 0; y < this.width; y += 50) {
                    this.plotVector(new Point(x, y))
                }
            }
        };


        this.sketch.mousedown = function () {
            this.mouseIsDown = true;
        };

        this.sketch.mouseup = function () {
            this.mouseIsDown = false;
        };

        this.sketch.plotVector = function (p) {
            this.plotPoint(p.x, p.y, 1, 0, '#000000', '#cccccc');

            this.lineWidth = .5;
            this.strokeStyle = 'hsla(' + 50 + ', 50% , 50% , .9)';

            let mappedX = mathUtils.convertToRange(p.x, [0, this.width], [-10, 10]);
            let mappedY = mathUtils.convertToRange(p.y, [0, this.height], [-10, 10]);

            // let vField = new Vector2(mappedX, mappedY);


            let vField = new Vector2(
                this.CONFIG.PARAMETERS.a * mappedX + this.CONFIG.PARAMETERS.b * mappedY,
                this.CONFIG.PARAMETERS.c * mappedX + this.CONFIG.PARAMETERS.d * mappedY
            );

            vField.multiplyScalar(2);
            // vField.negate();

            this.save();
            this.translate(p.x, p.y);
            this.rotate(vField.angle());
            this.beginPath();
            this.moveTo(0, 0);
            this.lineTo(vField.length(), 0);
            this.stroke();
            this.restore();

        };

        this.sketch.update = function () {
        };

        this.sketch.draw = function () {
        };

        this.sketch.mousemove = function () {
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
            closed: false,
            autoPlace: false
        });

        document.getElementById('dat-container').appendChild(this.gui.domElement);

        this.gui.add(this.sketch.CONFIG, 'dt_noise_z').min(0).max(.01).step(.001).name('dt_noise_z');
        this.gui.add(this.sketch.CONFIG, 'noise_scale').min(0).max(.01).step(.001).name('noise_scale');

        let f_parameters = this.gui.addFolder('parameters');
        f_parameters.add(this.sketch.CONFIG.PARAMETERS, 'a').min(-3).max(3).step(.01).onChange(this.updateParams.bind(this)).listen();
        f_parameters.add(this.sketch.CONFIG.PARAMETERS, 'b').min(-3).max(3).step(.01).onChange(this.updateParams.bind(this)).listen();
        f_parameters.add(this.sketch.CONFIG.PARAMETERS, 'c').min(-3).max(3).step(.01).onChange(this.updateParams.bind(this)).listen();
        f_parameters.add(this.sketch.CONFIG.PARAMETERS, 'd').min(-3).max(3).step(.01).onChange(this.updateParams.bind(this)).listen();
        f_parameters.open();

        this.gui.add(this.sketch.CONFIG.METHODS, 'run').onChange(this.run.bind(this));
        this.gui.add(this.sketch.CONFIG.METHODS, 'clear').onChange(this.clear.bind(this));

    }

    updateParams() {
        this.sketch.clear();
        this.sketch.plotField();
    }


    run() {
        this.sketch.running = !this.sketch.running;
    }

    clear() {
        this.sketch.clear();
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketch_10;