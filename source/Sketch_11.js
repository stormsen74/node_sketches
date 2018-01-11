/**
 * Created by STORMSEN on 14.06.2017.
 */


var chromatism = require('chromatism');
let SimplexNoise = require('simplex-noise');

import SketchTemplate from "./SketchTemplate.js";
import MathUtils from "./utils/mathUtils";
import {Vector2} from "./math/vector2";

class Sketch_11 extends SketchTemplate {

    /*--------------------------------------------
     BASED ON
     view-source:http://grgrdvrt.com/sketches/204_curl_noise/

     https://al-ro.github.io/projects/curl/
     --------------------------------------------*/

    constructor() {
        super(true, false);

        console.log('Sketch_11!');

        /*--------------------------------------------
         ~ confif stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            NOISE_SCALE: 0.0015,
            EPSILON: 0.0001,
            STRENGTH: 1,
            NOISE_3D: false,
            dt_noise_z: .002,
            FADE_ALPHA: .07,
            LIFETIME: {
                min: 20,
                max: 50
            },
            METHODS: {
                run: function () {
                },
                save: function () {
                }
            }
        };
        this.initControls();

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);

        this.sketch.noise = new SimplexNoise(Math.random);
        this.sketch.noise_z = 0;
        this.sketch.epsilon = 0.0001;
        this.sketch.particles = [];
        this.sketch.nParticles = 1250;
        // this.sketch.nParticles = 1;
        this.sketch.vMouse = new Vector2();

        this.sketch.colorMap = chromatism.fade(10, '#ddb321', '#21d6dd').hex;


        /*--------------------------------------------
         ~ sketch methods
         --------------------------------------------*/

        this.sketch.setup = function () {
            console.log('setup');

            this.lineWidth = 1;
            this.strokeStyle = 'rgba(255, 255, 255, .5)';
            this.fillStyle = "rgba(5,5,5,0.07)";
            // this.globalCompositeOperation = 'lighter';


            for (let i = 0; i < this.nParticles; i++) {
                let p = new Vector2();
                p.t = 0;
                this.reset(p);
                this.particles[i] = p;
            }

        };

        this.sketch.reset = function (p) {
            p.x = Math.random() * this.width;
            p.y = Math.random() * this.height;
            p.t = MathUtils.getRandomBetween(this.CONFIG.LIFETIME.min, this.CONFIG.LIFETIME.max);
        };


        this.sketch.getNoise = function (x, y) {
            return !this.CONFIG.NOISE_3D ? this.noise.noise2D(x, y) : this.noise.noise3D(x, y, this.noise_z);
            // return this.noise.noise3D(x, y, this.noise_z);
        };


        this.sketch.curlNoise = function (pos) {
            let dx = this.getNoise(pos.x + this.CONFIG.EPSILON, pos.y) - this.getNoise(pos.x - this.CONFIG.EPSILON, pos.y);
            let dy = this.getNoise(pos.x, pos.y + this.CONFIG.EPSILON) - this.getNoise(pos.x, pos.y - this.CONFIG.EPSILON);
            let v = new Vector2(dy, -dx);
            return v.multiplyScalar(this.CONFIG.STRENGTH / this.CONFIG.EPSILON);
        };

        this.sketch.mousedown = function () {
            this.running = true;
        };

        this.sketch.mousemove = function () {
            this.vMouse.set(this.mouse.x, this.mouse.y)
        };

        this.sketch.draw = function () {

            this.fillStyle = "rgba(5,5,5," + this.CONFIG.FADE_ALPHA + ")";
            this.fillRect(0, 0, this.width, this.height);

            for (let i = 0; i < this.nParticles; i++) {
                let p = this.particles[i];
                let pos = p.clone().multiplyScalar(this.CONFIG.NOISE_SCALE);
                let dir = this.curlNoise(pos);

                this.strokeStyle = this.colorMap[parseInt(MathUtils.convertToRange(dir.length(), [0, 15], [0, this.colorMap.length]))];

                this.beginPath();
                this.moveTo(p.x, p.y);
                p.add(dir);
                this.lineTo(p.x, p.y);
                this.stroke();

                if (p.x < 0 || p.x > this.width || p.y < 0 || p.y > this.height || --p.t <= 0) this.reset(p);
            }


            this.noise_z += this.CONFIG.dt_noise_z;

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

        this.gui.add(this.sketch.CONFIG, 'NOISE_SCALE').min(0.0005).max(0.01).step(.0001).name('NOISE_SCALE');
        this.gui.add(this.sketch.CONFIG, 'EPSILON').min(0.00001).max(1).step(.00001).name('EPSILON');
        this.gui.add(this.sketch.CONFIG, 'STRENGTH').min(0).max(5).step(.01).name('STRENGTH');
        this.gui.add(this.sketch.CONFIG, 'NOISE_3D').name('NOISE_3D');
        this.gui.add(this.sketch.CONFIG, 'dt_noise_z').min(0).max(.01).step(.001).name('dt_noise_z');

        let stroke_options = this.gui.addFolder('stroke');
        stroke_options.add(this.sketch.CONFIG.LIFETIME, 'min').min(0).max(100).step(1);
        stroke_options.add(this.sketch.CONFIG.LIFETIME, 'max').min(0).max(200).step(1);
        stroke_options.add(this.sketch.CONFIG, 'FADE_ALPHA').min(.01).max(.5).step(.01).name('FADE_ALPHA');

        this.gui.add(this.sketch.CONFIG.METHODS, 'save').onChange(this.save.bind(this));
        this.gui.add(this.sketch.CONFIG.METHODS, 'run').onChange(this.run.bind(this));
    }

    updateParams() {

    }


    run() {
        this.sketch.running = !this.sketch.running;
    }

    save() {
        console.log('save');
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketch_11;