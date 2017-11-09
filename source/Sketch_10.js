/**
 * Created by STORMSEN on 14.06.2017.
 */


var chroma = require('chroma-js');
var SimplexNoise = require('simplex-noise');

import SketchTemplate from "./SketchTemplate.js";
import mathUtils from "./utils/mathUtils.js";
import {Vector2} from "./math/vector2";

class Sketch_10 extends SketchTemplate {

    constructor() {
        super(true, false);

        console.log('Sketch_10!');

        // TODO implement simpleParticle (gl-vec) -> force

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.mouseIsDown = false;
        this.sketch.vTarget = new Vector2(0, this.sketch.height * .5);
        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);

        this.sketch.noise_z = 0;
        this.sketch.simplex = new SimplexNoise(Math.random);


        this.sketch.points = [];


        /*--------------------------------------------
         ~ confif stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            dt_noise_z: .001,
            noise_scale: .005,
            RESOLUTION: {
                x: 20,
                y: 15
            },
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
        this.initStats();


        this.sketch.setup = function () {

            console.log('setup');

            // this.globalCompositeOperation = 'lighter';

            this.lineWidth = .5;

            this.running = false;
            // this.plotField();


            for (let i = 0; i < 1; i++) {
                this.points.push({
                    position: new Vector2(mathUtils.getRandomBetween(0, this.width), mathUtils.getRandomBetween(0, this.height)),
                    velocity: new Vector2(0, 0)
                })
            }


        };


        this.sketch.plotField = function () {
            for (let x = this.width / this.CONFIG.RESOLUTION.x * .5; x < this.width; x += this.width / this.CONFIG.RESOLUTION.x) {
                for (let y = this.height / this.CONFIG.RESOLUTION.y * .5; y < this.height; y += this.height / this.CONFIG.RESOLUTION.y) {
                    this.plotVector({
                        position: new Vector2(x, y),
                        velocity: new Vector2(0, 0)

                    })
                }
            }
        };


        this.sketch.mousedown = function () {
            this.mouseIsDown = true;
        };

        this.sketch.mouseup = function () {
            this.mouseIsDown = false;
        };


        this.sketch.getFieldVector = function (p) {

            let mappedX = mathUtils.convertToRange(p.position.x, [0, this.width], [-10, 10]);
            let mappedY = mathUtils.convertToRange(p.position.y, [0, this.height], [-10, 10]);

            // let vField = new Vector2(
            //     this.CONFIG.PARAMETERS.a * mappedX + this.CONFIG.PARAMETERS.b * mappedY,
            //     this.CONFIG.PARAMETERS.c * mappedX + this.CONFIG.PARAMETERS.d * mappedY
            // );

            let vField = new Vector2();
            let perlinValue = this.simplex.noise3D(mappedX * this.CONFIG.noise_scale, mappedY * this.CONFIG.noise_scale, this.noise_z) * Math.PI * 2;
            vField.set(Math.cos(perlinValue), Math.sin(perlinValue));

            return vField;

        };

        this.sketch.plotVector = function (p) {
            this.plotPoint(p.position.x, p.position.y, 1, 0, '#000000', 'hsla(' + 50 + ', 50% , 50% , .75)');

            let mappedX = mathUtils.convertToRange(p.x, [0, this.width], [-10, 10]);
            let mappedY = mathUtils.convertToRange(p.y, [0, this.height], [-10, 10]);


            /*--------------------------------------------
             ~ formula
             --------------------------------------------*/

            // formula |x, y|
            // let vField = new Vector2(mappedX, mappedY);

            /*--------------------------------------------
             ~ system (dat)
             --------------------------------------------*/

            // https://academo.org/demos/vector-field-plotter/
            // let vField = new Vector2(
            //     this.CONFIG.PARAMETERS.a * mappedX + this.CONFIG.PARAMETERS.b * mappedY,
            //     this.CONFIG.PARAMETERS.c * mappedX + this.CONFIG.PARAMETERS.d * mappedY
            // );
            // vField.negate();
            // vField.multiplyScalar(5);

            /*--------------------------------------------
             ~ perlin field
             --------------------------------------------*/

            let vField = this.getFieldVector(p);
            vField.multiplyScalar(50);


            this.strokeStyle = 'hsla(' + mathUtils.convertToRange(vField.angle(), [0, Math.PI * 2], [240, 360]) + ', 50% , 50% , .1)';

            this.save();
            this.translate(p.position.x, p.position.y);
            this.rotate(vField.angle());
            this.beginPath();
            this.moveTo(0, 0);
            this.lineTo(vField.length(), 0);
            this.stroke();
            this.restore();

        };


        this.sketch.drawParticles = function () {

            for (let i = 0; i < this.points.length; i++) {

                let p = this.points[i];
                let vField = this.getFieldVector(p);
                this.strokeStyle = 'hsla(' + p.velocity.length() * 10 + ', 50% , 50% , 1)';
                vField.multiplyScalar(.1);
                p.velocity.add(vField);

                // draw
                this.beginPath();
                this.moveTo(p.position.x, p.position.y);

                p.position.add(p.velocity);
                this.lineTo(p.position.x, p.position.y);
                this.stroke();

                // friction
                p.velocity.multiplyScalar(0.99);

                // wrap
                if (p.position.x > this.width) p.position.x = 0;
                if (p.position.y > this.height) p.position.y = 0;
                if (p.position.x < 0) p.position.x = this.width;
                if (p.position.y < 0) p.position.y = this.height;

            }
        };

        this.sketch.update = function () {
        };

        this.sketch.draw = function () {
            // this.clear();

            this.fillStyle = "rgba(5,5,5,.2)";
            this.fillRect(0, 0, this.width, this.height);

            this.drawParticles()
            this.plotField();


            this.noise_z += this.CONFIG.dt_noise_z;

            this.stats.update();
        };

        this.sketch.mousemove = function () {
        };


    }

    /*--------------------------------------------
     ~ class methods
     --------------------------------------------*/

    kill() {
        document.getElementById('dat-container').removeChild(this.gui.domElement);
        document.body.removeChild(this.sketch.stats.domElement);
    }

    initStats() {
        this.sketch.stats = new Stats();
        this.sketch.stats.domElement.style.position = 'absolute';
        this.sketch.stats.domElement.style.bottom = '0px';
        document.body.appendChild(this.sketch.stats.domElement);
    }

    initControls() {
        this.gui = new dat.GUI({
            width: 360,
            closed: false,
            autoPlace: false
        });

        document.getElementById('dat-container').appendChild(this.gui.domElement);

        this.gui.add(this.sketch.CONFIG, 'dt_noise_z').min(0).max(.01).step(.001).name('dt_noise_z').onChange(this.updatePlot.bind(this)).listen();
        this.gui.add(this.sketch.CONFIG, 'noise_scale').min(0).max(.05).step(.001).name('noise_scale').onChange(this.updatePlot.bind(this)).listen();

        let f_resolution = this.gui.addFolder('resolution');
        f_resolution.add(this.sketch.CONFIG.RESOLUTION, 'x').min(10).max(100).step(1).onChange(this.updatePlot.bind(this)).listen();
        f_resolution.add(this.sketch.CONFIG.RESOLUTION, 'y').min(10).max(100).step(1).onChange(this.updatePlot.bind(this)).listen();
        f_resolution.open();

        let f_parameters = this.gui.addFolder('parameters');
        f_parameters.add(this.sketch.CONFIG.PARAMETERS, 'a').min(-3).max(3).step(.01).onChange(this.updatePlot.bind(this)).listen();
        f_parameters.add(this.sketch.CONFIG.PARAMETERS, 'b').min(-3).max(3).step(.01).onChange(this.updatePlot.bind(this)).listen();
        f_parameters.add(this.sketch.CONFIG.PARAMETERS, 'c').min(-3).max(3).step(.01).onChange(this.updatePlot.bind(this)).listen();
        f_parameters.add(this.sketch.CONFIG.PARAMETERS, 'd').min(-3).max(3).step(.01).onChange(this.updatePlot.bind(this)).listen();
        f_parameters.open();

        this.gui.add(this.sketch.CONFIG.METHODS, 'run').onChange(this.run.bind(this));
        this.gui.add(this.sketch.CONFIG.METHODS, 'clear').onChange(this.clear.bind(this));

    }

    updatePlot() {

        return;

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