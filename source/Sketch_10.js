/**
 * Created by STORMSEN on 14.06.2017.
 */


let chroma = require('chroma-js');
let SimplexNoise = require('simplex-noise');

import SketchTemplate from "./SketchTemplate.js";
import mathUtils from "./utils/mathUtils.js";
import {Vector2} from "./math/vector2";

class Sketch_10 extends SketchTemplate {

    constructor() {
        super(true, false);

        console.log('Sketch_10!');

        // TODO implement simpleParticle (gl-vec) -> force
        // https://github.com/stackgl/gl-vec2

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.mouseIsDown = false;
        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);

        this.sketch.noise_z = 0;
        this.sketch.simplex = new SimplexNoise(Math.random);

        this.sketch.particles = [];
        this.sketch.palette = chroma.scale(['#fafa6e', '#2A4858']).mode('lch').colors(10);

        this.sketch.img = new Image();
        this.sketch.imgData = null;


        /*--------------------------------------------
         ~ config stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            dt_noise_z: .001,
            noise_scale: .01,
            RESOLUTION: {
                x: 17,
                y: 15
            },
            PARAMETERS: {
                a: 1,
                b: -3,
                c: 3,
                d: -3
            },
            OPTIONS: {
                opacity: .2,
                vFieldScale: .05
            },
            DRAW_FIELD: false,
            DRAW_PARTICLES: true,
            DRAW_glPARTICLES: true,
            OVERDRAW: true,
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
            this.plotField();
            // this.initParticles();
            this.initImage(this);

        };

        this.sketch.sampleColors = function () {

            this.drawImage(this.img, 0, 0);
            this.imgData = this.getImageData(0, 0, this.img.width, this.img.height);

            let w = this.img.width;
            let h = this.img.height;
            console.log(w, h)
            let dSample = 3;
            this.tracedPoints = [];
            for (let x = 0; x < w; x += dSample) {
                for (let y = 0; y < h; y += dSample) {
                    //let index = x + y * w;
                    //let c = this.getImageData(x, y, 1, 1).data;
                    //let b = 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];
                    if (this.getImageData(x, y, 1, 1).data[1] > 10) {
                        this.tracedPoints.push([x, y]);
                    }
                }
            }

            console.log('>', this.tracedPoints.length);

            this.tracedPoints.forEach((p)=> {
                let dx = p[0];
                let dy = p[1];
                p[0] = this.vCenter.x - 128 + dx;
                p[1] = this.vCenter.y - 128 + dy;
            });

            this.initTracedParticles();

        };

        this.sketch.initImage = function (that) {
            this.img.src = 'assets/images/sw_256.png';
            this.img.onload = function () {
                that.sampleColors();
            };
        };

        this.sketch.initParticles = function () {
            for (let i = 0; i < 1000; i++) {
                this.particles.push({
                    position: new Vector2(mathUtils.getRandomBetween(0, this.width), mathUtils.getRandomBetween(0, this.height)),
                    velocity: new Vector2(0, 0)
                })
            }
        };

        this.sketch.initTracedParticles = function () {
            this.tracedPoints.forEach((p, i)=> {
                this.particles.push({
                    position: new Vector2(p[0], p[1]),
                    velocity: new Vector2(0, 0)
                })
            })
        };

        this.sketch.plotField = function () {
            for (let x = this.width / this.CONFIG.RESOLUTION.x * .5; x < this.width; x += this.width / this.CONFIG.RESOLUTION.x) {
                for (let y = this.height / this.CONFIG.RESOLUTION.y * .5; y < this.height; y += this.height / this.CONFIG.RESOLUTION.y) {
                    this.plotVector({
                        position: new Vector2(x, y)
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

            /*--------------------------------------------
             ~ perlin field
             --------------------------------------------*/

            let vField = new Vector2();
            let perlinValue = this.simplex.noise3D(mappedX * this.CONFIG.noise_scale, mappedY * this.CONFIG.noise_scale, this.noise_z) * Math.PI * 2;
            vField.set(Math.cos(perlinValue), Math.sin(perlinValue));


            // vField.negate();
            // vField.multiplyScalar(5);
            return vField;

        };


        this.sketch.plotVector = function (p) {
            this.plotPoint(p.position.x, p.position.y, 1, 0, '#000000', 'hsla(' + 50 + ', 50% , 50% , .5)');


            let vField = this.getFieldVector(p);
            vField.multiplyScalar(50);


            this.strokeStyle = 'hsla(' + mathUtils.convertToRange(vField.angle(), [0, Math.PI * 2], [240, 360]) + ', 50% , 50% , .3)';

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

            this.particles.forEach((p, i) => {
                // let p = this.particles[i];
                let vField = this.getFieldVector(p);
                // this.strokeStyle = 'hsla(' + p.velocity.length() * 10 + ', 50% , 50% , 1)';
                this.strokeStyle = this.palette[Math.floor(parseInt(Math.min(p.velocity.length())))];
                vField.multiplyScalar(this.CONFIG.OPTIONS.vFieldScale);
                // vField = Vector2.divide(vField, p.mass);
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
            })

        };


        this.sketch.update = function () {
        };

        this.sketch.draw = function () {

            if (!this.CONFIG.OVERDRAW) {
                this.clear();
            } else {
                this.fillStyle = "rgba(5,5,5," + this.CONFIG.OPTIONS.opacity + ")";
                this.fillRect(0, 0, this.width, this.height);
            }

            if (this.CONFIG.DRAW_FIELD) this.plotField();
            if (this.CONFIG.DRAW_PARTICLES) this.drawParticles();

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

        let f_parameters = this.gui.addFolder('parameters');
        f_parameters.add(this.sketch.CONFIG.PARAMETERS, 'a').min(-3).max(3).step(.01).onChange(this.updatePlot.bind(this)).listen();
        f_parameters.add(this.sketch.CONFIG.PARAMETERS, 'b').min(-3).max(3).step(.01).onChange(this.updatePlot.bind(this)).listen();
        f_parameters.add(this.sketch.CONFIG.PARAMETERS, 'c').min(-3).max(3).step(.01).onChange(this.updatePlot.bind(this)).listen();
        f_parameters.add(this.sketch.CONFIG.PARAMETERS, 'd').min(-3).max(3).step(.01).onChange(this.updatePlot.bind(this)).listen();

        // f_parameters.open();

        let f_options = this.gui.addFolder('options');
        f_options.add(this.sketch.CONFIG.OPTIONS, 'opacity').min(0.001).max(1).step(.001).onChange(this.updatePlot.bind(this)).listen();
        f_options.add(this.sketch.CONFIG.OPTIONS, 'vFieldScale').min(0.001).max(.1).step(.001).onChange(this.updatePlot.bind(this)).listen();

        this.gui.add(this.sketch.CONFIG.METHODS, 'run').onChange(this.run.bind(this));
        this.gui.add(this.sketch.CONFIG.METHODS, 'clear').onChange(this.clear.bind(this));

        this.gui.add(this.sketch.CONFIG, 'DRAW_FIELD').name('DRAW_FIELD');
        this.gui.add(this.sketch.CONFIG, 'DRAW_PARTICLES').name('DRAW_PARTICLES');
        this.gui.add(this.sketch.CONFIG, 'OVERDRAW').name('OVERDRAW');

    }

    updatePlot() {


        if (!this.sketch.running) {
            this.sketch.clear();
            this.sketch.plotField();
        }

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