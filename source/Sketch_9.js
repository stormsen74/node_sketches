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
            dt_noise_z: .001,
            noise_scale: .001,
            METHODS: {
                run: function () {
                },
                clear: function () {
                }
            }
        }
        this.initControls();


        this.sketch.setup = function () {

            console.log('setup');

            this.globalCompositeOperation = 'lighter';
            this.autoclear = false;
            this.lineWidth = 1;
            this.strokeStyle = 'rgba(200, 200, 200, .1)';

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
            this.fillStyle = "rgba(5,5,5,0.01)";
            this.fillRect(0, 0, this.width, this.height);


            for (let i = 0; i < this.points.length; i++) {
                // get each point and do what we did before with a single point
                let p = this.points[i];
                let value = this.getValue(p.x, p.y);
                p.vx += Math.cos(value) * 0.05;
                p.vy += Math.sin(value) * 0.05;


                this.strokeStyle = 'hsla(' + value * 10 + ', 50% , 50% , .1)';

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

            this.noise_z += this.CONFIG.dt_noise_z;
        };

        this.sketch.getValue = function (x, y) {
            var scale = this.CONFIG.noise_scale;
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

        this.gui.add(this.sketch.CONFIG, 'dt_noise_z').min(0).max(.01).step(.001).name('dt_noise_z');
        this.gui.add(this.sketch.CONFIG, 'noise_scale').min(0).max(.01).step(.001).name('noise_scale');
        this.gui.add(this.sketch.CONFIG.METHODS, 'run').onChange(this.run.bind(this));
        this.gui.add(this.sketch.CONFIG.METHODS, 'clear').onChange(this.clear.bind(this));

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

export default Sketch_9;