/**
 * Created by STORMSEN on 14.06.2017.
 */


var chroma = require('chroma-js');
var SimplexNoise = require('simplex-noise');

import SketchTemplate from "./SketchTemplate.js";
import mathUtils from "./utils/mathUtils.js";
import {Vector2} from "./math/vector2";

class Sketch_9 extends SketchTemplate {

    constructor() {
        super(true, false);

        console.log('Sketch_9!');

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.hue = 0;
        this.sketch.phi = 0;
        this.sketch.t = 0;
        this.sketch.mouseIsDown = false;
        this.sketch.vTarget = new Vector2(0, this.sketch.height * .5);

        this.sketch.points = [];
        this.sketch.simplex = new SimplexNoise(Math.random);
        this.sketch.noise_z = 0;
        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);

        /*--------------------------------------------
         ~ confif stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            AMP: 20,
            dT: .1,
            dPhi: .01,
            TARGET: false,
            METHODS: {
                clear: function () {
                }
            }
        }
        this.initControls();


        this.sketch.setup = function () {

            console.log('setup');

            // this.globalCompositeOperation = 'copy';
            this.autoclear = false;
            this.lineWidth = 1;
            this.strokeStyle = 'rgba(200, 200, 200, 1)';

            for (let i = 0; i < 750; i++) {
                this.points.push({
                    x: mathUtils.getRandomBetween(0, this.width),
                    y: mathUtils.getRandomBetween(0, this.height),
                    vx: 0,
                    vy: 0
                })
            }
        };

        this.sketch.mousedown = function () {
            this.mouseIsDown = true;
        };

        this.sketch.mouseup = function () {
            this.mouseIsDown = false;
        };

        this.sketch.update = function () {
        };

        this.sketch.draw = function () {
            // console.log('draw')
            this.fillStyle = "rgba(5,5,5,0.05)";
            this.fillRect(0, 0, this.width, this.height);

            // let res = 20;
            // for (let x = 0; x < this.width; x += res) {
            //     for (let y = 0; y < this.height; y += res) {
            //         let value = this.getValue(x, y);
            //         this.save();
            //         this.translate(x, y);
            //         this.rotate(value);
            //         this.beginPath();
            //         this.moveTo(0, 0);
            //         this.lineTo(res * 1.5, 0);
            //         this.stroke();
            //         this.restore();
            //     }
            // }


            for (let i = 0; i < this.points.length; i++) {
                // get each point and do what we did before with a single point
                let p = this.points[i];
                let value = this.getValue(p.x, p.y);
                p.vx += Math.cos(value) * 0.1;
                p.vy += Math.sin(value) * 0.1;


                // this.strokeStyle = chroma.hsl(
                //     mathUtils.convertToRange(value, [0, 6.2832], [180, 360]),
                //     .5,
                //     .5,
                // ).hex();

                this.strokeStyle = 'hsl(' + value * 10 + ',50%,50%)';

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

            this.noise_z += .001;
        };

        this.sketch.getValue = function (x, y) {
            var scale = 0.001;
            // return this.simplex.noise2D(x * scale, y * scale) * Math.PI * 2;
            return this.simplex.noise3D(x * scale, y * scale, this.noise_z) * Math.PI * 2;
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

        this.gui.add(this.sketch.CONFIG, 'dT').min(0).max(2).step(.01).name('dT');
        this.gui.add(this.sketch.CONFIG, 'AMP').min(0).max(300).step(1).name('AMP');
        this.gui.add(this.sketch.CONFIG, 'dPhi').min(0).max(2).step(.01).name('dPhi');
        this.gui.add(this.sketch.CONFIG.METHODS, 'clear').onChange(this.clear.bind(this));

    }


    updateParams() {

    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketch_9;