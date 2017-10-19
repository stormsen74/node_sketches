/**
 * Created by STORMSEN on 14.06.2017.
 */


var chromatism = require('chromatism');

import SketchTemplate from "./SketchTemplate.js";
import {Vector2} from "./math/vector2";

class Sketch_1 extends SketchTemplate {

    constructor() {
        super(true, false);

        console.log('Sketch_1!');

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.hue = 0;
        this.sketch.phi = 0;
        this.sketch.t = 0;
        this.sketch.mouseIsDown = false;
        this.sketch.vTarget = new Vector2(0, this.sketch.height * .5);

        //this.t = 0;
        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);
        this.sketch.vecWanderTheta = new Vector2(150, 0);

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
            //this.sketch.globalCompositeOperation = 'lighter';
        };
        this.sketch.setup();

        this.sketch.mousedown = function () {
            this._mx = this.mouse.x;
            this._my = this.mouse.y;
            this.mouseIsDown = true;
        };

        this.sketch.mouseup = function () {
            this.mouseIsDown = false;
        };


        this.sketch.drawPolar = function () {
            this.phi += this.CONFIG.dPhi;
            this.t += this.CONFIG.dT;

            this.vecWanderTheta.toPolar();
            // phi
            this.vecWanderTheta.y = this.phi;
            // r
            this.vecWanderTheta.x = 100 + sin(this.t) * this.CONFIG.AMP;

            this.vecWanderTheta.toCartesian();

            // this.vCenter.jitter(10, 10);

            //this.particle.position.x = this.vCenter.x + this.vecWanderTheta.x;
            //this.particle.position.y = this.vCenter.y + this.vecWanderTheta.y;

            //console.log(this.vCenter.x + this.vecWanderTheta.x)

            let vTarget = new Vector2(this.vCenter.x + this.vecWanderTheta.x, this.vCenter.y + this.vecWanderTheta.y);


            this.hue = this.hue < 359 ? this.hue += 1 : 0;
            let s = 60;
            let l = 50;
            let color = ({h: this.hue, s: s, l: l});
            this.strokeStyle = chromatism.convert(color).hex;

            this.beginPath();
            this.moveTo(this._mx, this._my);
            this.lineTo(vTarget.x, vTarget.y);
            this.closePath();
            this.stroke();

            this._mx = vTarget.x;
            this._my = vTarget.y;

            //this.particle.tail.unshift({
            //    x: this.particle.position.x,
            //    y: this.particle.position.y
            //});
            //
            //if (this.particle.tail.length > 100) {
            //    this.particle.tail.pop();
            //}

            //this.lines.clear();
            //// this.lines.lineStyle(1, 0xffffff);
            //this.lines.moveTo(this.particle.position.x, this.particle.position.y);
            //this.particle.tail.forEach((point, index) => {
            //    this.lines.lineStyle(index * .1, 0xffffff);
            //    this.lines.lineTo(point.x, point.y);
            //});
        }


        this.sketch.update = function () {

            this.drawPolar();

            return;


            if (this.vTarget.x > this.width) {
                this.clear();
                this.vTarget.x = 0;

                this._mx = this.vTarget.x;
                this._my = this.vTarget.y;

            }
            this.vTarget.x += this.CONFIG.VEL_X;
            this.t += this.CONFIG.dT;
            this.vTarget.y = this.height * .5 + this.CONFIG.AMP * sin(this.CONFIG.FREQ * this.t);


            this.hue = this.hue < 180 ? this.hue += 1 : 0;
            let s = 60;
            let l = 50;
            let color = ({h: this.hue, s: s, l: l});
            this.strokeStyle = chromatism.convert(color).hex;

            let w = 1 + abs(sin(this.t) * 5);
            this.lineWidth = w;

            this.beginPath();
            this.moveTo(this._mx, this._my);
            this.lineTo(this.vTarget.x, this.vTarget.y);
            this.closePath();
            this.stroke();

            this._mx = this.vTarget.x;
            this._my = this.vTarget.y;
        };

        this.sketch.draw = function () {
            this.fillStyle = "rgba(38,38,38,0.05)";
            this.fillRect(0, 0, this.width, this.height);
        }


        this.sketch.mousemove = function () {

            if (this.running && this.mouseIsDown) {

                this.hue = this.hue < 359 ? this.hue += 1 : 0;
                let s = 60;
                let l = 50;
                let color = ({h: this.hue, s: s, l: l});
                this.strokeStyle = chromatism.convert(color).hex;

                this.t += this.delta;
                let w = 1 + abs(sin(this.t) * 10);
                this.lineWidth = w;

                this.beginPath();
                this.moveTo(this._mx, this._my);
                this.lineTo(this.mouse.x, this.mouse.y);
                this.closePath();
                this.stroke();

                this._mx = this.mouse.x;
                this._my = this.mouse.y;
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

export default Sketch_1;