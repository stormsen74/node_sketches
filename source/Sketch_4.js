/**
 * Created by STORMSEN on 14.06.2017.
 */


// var Sketch = require('sketch-js');
var chromatism = require('chromatism');
var gsap = require('gsap');

import SketchTemplate from "./SketchTemplate.js";
import MathUtils from "./utils/mathUtils";
import {Vector2} from "./math/vector2";

class Sketch_4 extends SketchTemplate {

    constructor() {
        super(false, false);

        console.log('Sketch_4!');

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.points = [];
        this.sketch.iterateStep = 0;
        this.sketch.angle = 0;
        this.sketch.mouseIsDown = false;

        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);

        /*--------------------------------------------
         ~ confif stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            initialPoints: 6,
            radius: this.sketch.height / 4,
            scaleFactor: .6,
            initialOffset: this.sketch.height / 6,
            maxSteps: 8,
            iterateStep: '0',
            color: {r: 50, g: 180, b: 200},
            METHODS: {
                reset: function () {
                },
                autoStep: function () {
                }
            }
        };
        this.initControls();


        this.sketch.mousedown = function () {
            this.mouseIsDown = true;
            this.step();
        };

        this.sketch.mouseup = function () {
            this.mouseIsDown = false;
        };

        this.sketch.autoStep = function () {
            for (var i = this.iterateStep; i < this.CONFIG.maxSteps; i++) {
                autoStep(this, i);
            }

            function autoStep(_scope, i) {
                TweenMax.delayedCall(i * .1, function () {
                    _scope.step();
                })
            }
        };


        this.sketch.step = function () {
            if (this.iterateStep < this.CONFIG.maxSteps) {

                if (this.iterateStep == 0) this.clear();
                this.iterate();

                // this.clear();

                let color = chromatism.brightness(MathUtils.convertToRange(this.iterateStep, [0, this.CONFIG.maxSteps], [0, -20]), this.CONFIG.color).rgb;
                this.fillStyle = 'rgba(' + ~~color.r + ',' + ~~color.g + ',' + ~~color.b + ',' + MathUtils.convertToRange(this.iterateStep, [0, this.CONFIG.maxSteps], [.2, 1]) + ')';
                this.filter = 'blur(' + MathUtils.convertToRange(this.iterateStep, [0, this.CONFIG.maxSteps], [20, 0]) + 'px)';

                this.stepDraw();
            }
        };


        this.sketch.stepDraw = function () {

            this.save();
            this.translate(this.width / 2, this.height / 2);
            this.beginPath();
            this.moveTo(this.points[0].x, this.points[0].y);
            for (var i = 1; i < this.points.length; i += 1) {
                this.lineTo(this.points[i].x, this.points[i].y);
            }
            this.fill();
            this.restore();

        };

        this.sketch.iterate = function () {
            var newPoints = [];
            for (var i = 0; i < this.points.length - 1; i += 1) {
                var p0 = this.points[i],
                    p1 = this.points[i + 1],
                    newPoint = {
                        x: (p0.x + p1.x) / 2,
                        y: (p0.y + p1.y) / 2
                    };

                newPoint.x += random() * this.offset * 2 - this.offset;
                newPoint.y += random() * this.offset * 2 - this.offset;
                newPoints.push(p0, newPoint);
            }
            newPoints.push(this.points[this.points.length - 1]);
            this.points = newPoints;
            this.offset *= this.CONFIG.scaleFactor;
            this.iterateStep += 1;
            this.CONFIG.iterateStep = this.iterateStep.toString();
        };


        this.sketch.update = function () {
        };

        this.sketch.draw = function () {
        };

        this.sketch.mousemove = function () {
        };

        this.sketch.setup = function () {
            this.globalCompositeOperation = 'lighter';
            this.fillStyle = "#ffffff";

            this.points = [];
            this.offset = this.CONFIG.initialOffset;
            this.iterateStep = 0;

            for (var i = 0; i < this.CONFIG.initialPoints; i += 1) {
                let angle = Math.PI * 2 / this.CONFIG.initialPoints * i;
                this.points.push({
                    x: cos(angle) * this.CONFIG.radius,
                    y: sin(angle) * this.CONFIG.radius
                });
            }

            this.points.push(this.points[0]);

            this.stepDraw();

        };


        this.sketch.reset = function () {
            this.clear();
            this.fillStyle = "#ffffff";
            this.setup();
        };

        this.sketch.setup();

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

        this.gui.add(this.sketch.CONFIG, 'initialPoints').min(3).max(12).step(1).name('initialPoints').onChange(this.setup.bind(this));
        this.gui.add(this.sketch.CONFIG, 'radius').min(1).max(this.sketch.height).step(1).name('radius').onChange(this.setup.bind(this));
        this.gui.add(this.sketch.CONFIG, 'initialOffset').min(.01).max(this.sketch.height).step(1).name('initialOffset');
        this.gui.add(this.sketch.CONFIG, 'scaleFactor').min(.01).max(1.0).step(.01).name('scaleFactor');
        this.gui.add(this.sketch.CONFIG, 'maxSteps').min(1).max(10).step(1).name('maxSteps');
        this.gui.addColor(this.sketch.CONFIG, 'color').name('color').listen();
        this.gui.add(this.sketch.CONFIG, 'iterateStep').name('iterateStep').listen();
        this.gui.add(this.sketch.CONFIG.METHODS, 'autoStep').onChange(this.autoStep.bind(this));
        this.gui.add(this.sketch.CONFIG.METHODS, 'reset').onChange(this.reset.bind(this));

    }

    setup() {
        this.sketch.clear();
        this.sketch.setup();
    }

    autoStep() {
        this.sketch.autoStep();
    }

    reset() {
        this.sketch.reset();
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketch_4;