/**
 * Created by STORMSEN on 14.06.2017.
 */


var chromatism = require('chromatism');
var chroma = require('chroma-js');
var CCapture = require('ccapture.js')

import SketchTemplate from "./SketchTemplate.js";
import mathUtils from "./utils/mathUtils.js";
import {Vector2} from "./math/vector2";

class Sketch_8 extends SketchTemplate {

    /*--------------------------------------------


     --------------------------------------------*/

    constructor() {
        super();

        console.log('Sketch_8!');

        // https://gka.github.io/chroma.js/
        let c = chroma.hsl(330, 1, 0.6);
        c = chroma.hsl(333.0, 1, 0.6);
        console.log(c.hex())


        this.sketch.capturer = new CCapture({
            verbose: true,
            name: 'frame',
            framerate: 10,
            autoSaveTime: 10,
            format: 'png'
        })

        this.sketch._canvas = document.querySelector('#screen canvas');

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.goldenRatio = 1.61803398875;
        this.sketch.fibonacciAngle = 137.5;
        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);
        this.sketch.points = [];

        this.sketch.forceStep = 0;
        let Q1 = new Vector2(200, this.sketch.height * .5);
        let Q2 = new Vector2(this.sketch.width - 200, this.sketch.height * .5);

        Q1.charge = 1.5;
        Q2.charge = -1.5;

        this.sketch.fields = [Q1, Q2];


        /*--------------------------------------------
         ~ config stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            ATTRACTOR: {
                a: Math.random() * 4 - 2,
                b: Math.random() * 4 - 2,
                c: Math.random() * 4 - 2,
                d: Math.random() * 4 - 2
            },
            DRAWS_PER_CALL: 100,
            NUM_RENDER_STEPS: 3,
            METHODS: {
                shuffle: function () {
                },
                run: function () {
                },
                renderForce: function () {
                },
                startCapture: function () {
                },
                stopCapture: function () {
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

            this.lineWidth = .5;
            this.strokeStyle = 'rgba(196, 174, 69, .2)';
            this.fillStyle = "rgba(23, 23, 26, 1)";
            this.globalCompositeOperation = 'lighter';


            for (let y = 0; y < this.height; y += 10) {
                this.points.push({
                    x: 0,
                    y: y,
                    vx: 0,
                    vy: 0
                })
            }

        };

        this.sketch.mousedown = function () {
            // this.plotField();

            // this.plotForce();


            // Q2.set(this.mouse.x, this.mouse.y)
            // this.steppedRender();


        };


        this.sketch.steppedRender = function () {

            this.clear();
            this.fillRect(0, 0, this.width, this.height);

            this.forceStep = 0;
            while (this.forceStep <= this.CONFIG.NUM_RENDER_STEPS) {
                this.filter = 'blur(' + mathUtils.convertToRange(this.forceStep, [0, this.CONFIG.NUM_RENDER_STEPS], [10, 0]) + 'px)';
                this.forceStep += 1;
                this.plotForce();
            }


        };

        this.sketch.mousemove = function () {
        };


        this.sketch.getForce = function (vLocation) {

            let eVecRes = new Vector2();

            for (var i = 0; i < this.fields.length; i++) {
                let field = this.fields[i];
                field.rVec = Vector2.subtract(vLocation, field);
                field.eVec = field.rVec.clone();
                field.eVec.multiplyScalar(field.charge / (4 * Math.PI));
                field.eVec.multiplyScalar(1 / Math.pow(field.rVec.length(), 2));
                field.eVec.multiplyScalar(100000);

                i == 0 ? eVecRes = this.fields[0].eVec : eVecRes.add(this.fields[i].eVec);
            }

            return eVecRes;

        };


        this.sketch.getValue = function (x, y) {

            // https://www.bit-101.com/blog/2017/10/23/flow-fields-part-i/


            // return (y - x) * 0.001 * Math.PI * 2;

            // return (Math.sin(x * 0.01) + Math.sin(y * 0.01)) * Math.PI * 2;

            // return

            let scale = 0.01;
            x = (x - this.width * .5) * scale;
            y = (y - this.height * .5) * scale;
            // let v = new Vector2(Math.sin(y), Math.sin(x));
            // let v = new Vector2(Math.pow(y, 2), Math.pow(x, 2));
            let v = new Vector2(y, -x);

            return v.angle();

            return


            // clifford attractor
            // http://paulbourke.net/fractals/clifford/

            // scale down x and y
            // let scale = 0.005;
            x = (x - this.width * .5) * scale;
            y = (y - this.height * .5) * scale;

            // attactor gives new x, y for old one.
            let x1 = Math.sin(this.CONFIG.ATTRACTOR.a * y) + this.CONFIG.ATTRACTOR.c * Math.cos(this.CONFIG.ATTRACTOR.a * x);
            let y1 = Math.sin(this.CONFIG.ATTRACTOR.b * x) + this.CONFIG.ATTRACTOR.d * Math.cos(this.CONFIG.ATTRACTOR.b * y);

            // find angle from old to new. that's the value.
            return Math.atan2(y1 - y, x1 - x);
        };


        this.sketch.render = function () {

            for (var i = 0; i < this.points.length; i++) {
                // get each point and do what we did before with a single point
                let p = this.points[i];
                let value = this.getValue(p.x, p.y);
                p.vx += Math.cos(value) * 0.2;
                p.vy += Math.sin(value) * 0.2;

                // move to current position
                this.beginPath();
                this.moveTo(p.x, p.y);

                // add velocity to position and line to new position
                p.x += p.vx;
                p.y += p.vy;
                this.lineTo(p.x, p.y);
                this.stroke();

                // apply some friction so point doesn't speed up too much
                p.vx *= 0.99;
                p.vy *= 0.99;

                // wrap around edges of screen
                if (p.x > this.width) p.x = 0;
                if (p.y > this.height) p.y = 0;
                if (p.x < 0) p.x = this.width;
                if (p.y < 0) p.y = this.height;
            }
        };

        this.sketch.update = function () {
            // this.render();

            this.steppedRender();
            this.capturer.capture(this._canvas);
        };


        this.sketch.renderForce = function (vForce) {

            let mag = Math.min(vForce.length(), 200);
            let invertMag = (200 - mag) * .7;

            this.strokeStyle = chroma.hsl(
                mathUtils.convertToRange(mag, [0, 200], [150, 260]),
                .5,
                .4,
            ).hex();

            this.rotate(vForce.angle());
            this.beginPath();
            this.moveTo(0, 0);
            this.lineTo(invertMag * .5, -invertMag * .5);
            // this.lineTo(20, 1);
            this.stroke();
        }


        this.sketch.renderField = function (value) {

            // this.strokeStyle = chromatism.convert(({h: 20 + Math.abs(value) * 20, s: 50, l: 40})).hex;
            this.strokeStyle = chroma.hsl(
                // mathUtils.convertToRange(Math.abs(value), [0, Math.PI * 2], [0, 60]),
                20 + Math.abs(value) * 20,
                .5,
                .4,
            ).hex();

            this.rotate(value);
            this.beginPath();
            this.moveTo(0, 0);
            // this.lineTo(value * 10, -value * 10);
            this.lineTo(20, 1);
            this.stroke();
        };


        this.sketch.plotForce = function () {

            for (let i = 0; i < this.CONFIG.DRAWS_PER_CALL; i++) {
                let x = Math.random() * this.width;
                let y = Math.random() * this.height;
                let vForce = this.getForce(new Vector2(x, y));
                this.save();
                this.translate(x, y);
                this.renderForce(vForce);
                this.restore();
            }
        };

        this.sketch.plotField = function () {
            // console.log('plotField');

            for (let i = 0; i < this.CONFIG.DRAWS_PER_CALL; i++) {
                let x = Math.random() * this.width;
                let y = Math.random() * this.height;


                let value = this.getValue(x, y);

                this.save();

                this.translate(x, y);

                this.renderField(value);

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
        this.gui.add(this.sketch.CONFIG, 'NUM_RENDER_STEPS').min(1).max(15).step(1).name('NUM_RENDER_STEPS');
        this.gui.add(this.sketch.CONFIG.METHODS, 'reset').onChange(this.reset.bind(this));
        this.gui.add(this.sketch.CONFIG.METHODS, 'run').onChange(this.run.bind(this));
        this.gui.add(this.sketch.CONFIG.METHODS, 'renderForce').onChange(this.renderForce.bind(this));
        this.gui.add(this.sketch.CONFIG.METHODS, 'startCapture').onChange(this.startCapture.bind(this));
        this.gui.add(this.sketch.CONFIG.METHODS, 'stopCapture').onChange(this.stopCapture.bind(this));

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

    run() {
        this.sketch.running = !this.sketch.running;
    }

    renderForce() {
        this.sketch.steppedRender();
    }

    startCapture() {
        this.sketch.running = true;
        this.sketch.capturer.start();
    }

    stopCapture() {
        this.sketch.capturer.stop();
        this.sketch.capturer.save();
        this.sketch.running = false;
    }

    reset() {
        this.sketch.clear();
        this.sketch.capturer.stop();
        this.running = false;

        this.sketch.forceStep = 0;

        for (var i = 0; i < this.sketch.points.length; i++) {
            let p = this.sketch.points[i];
            p.x = 0;
            p.y = i * 10;
            p.vx = 0;
            p.vy = 0;
        }
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketch_8;