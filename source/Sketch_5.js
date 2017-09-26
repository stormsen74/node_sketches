/**
 * Created by STORMSEN on 14.06.2017.
 */


// var Sketch = require('sketch-js');
var chromatism = require('chromatism');
var gsap = require('gsap');

import SketchTemplate from "./SketchTemplate.js";
import {Vector2} from "./math/vector2";
import Draggable from "gsap/Draggable";

class Sketch_5 extends SketchTemplate {

    constructor() {
        super(false, false);

        console.log('Sketch_5!');

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.points = [];
        this.sketch.iterateStep = 0;
        this.sketch.mouseIsDown = false;

        this.sketch.vT = new Vector2(this.sketch.width * .5, this.sketch.height * .5);
        this.sketch.vT.add(new Vector2(-this.sketch.width * .2, 0));

        this.sketch.colors = [
            {r: 50, g: 180, b: 200},
            {r: 200, g: 138, b: 50}
        ];


        /*--------------------------------------------
         ~ config stuff / dat-gui
         --------------------------------------------*/

        let screen = document.getElementById('screen');

        this.sketch.pStart = document.createElement('div');
        this.sketch.pStart.classList.add('pStart');
        this.sketch.pStart.id = 'pStart';
        screen.appendChild(this.sketch.pStart);
        this.sketch._pstart = Draggable.create(this.sketch.pStart, {
            type: "x,y", edgeResistance: 0.5, bounds: "#screen", throwProps: false,
            onDrag: this.dragUpdate.bind(this)
        });


        this.sketch.pEnd = document.createElement('div');
        this.sketch.pEnd.classList.add('pEnd');
        this.sketch.pEnd.id = 'pEnd';
        screen.appendChild(this.sketch.pEnd);

        this.sketch._pend = Draggable.create(this.sketch.pEnd, {
            type: "x,y", edgeResistance: 0.5, bounds: "#screen", throwProps: false,
            onDrag: this.dragUpdate.bind(this)
        });

        let rsx = random() * this.sketch.width;
        let rsy = 0;
        let rex = random() * this.sketch.width;
        let rey = this.sketch.height - 50;
        TweenLite.set("#pStart", {x: rsx, y: rsy});
        TweenLite.set("#pEnd", {x: rex, y: rey});

        this.sketch._pstart[0].x = rsx;
        this.sketch._pstart[0].y = rsy;
        this.sketch._pend[0].x = rex;
        this.sketch._pend[0].y = rey;


        /*--------------------------------------------
         ~ config stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            scaleFactor: .45,
            initialOffset: 250,
            maxSteps: 5,
            iterateStep: 0,
            color: this.sketch.colors[0],
            METHODS: {
                reset: function () {
                },
                autoStep: function () {
                },
                newFrac: function () {
                }
            }
        };
        this.initControls();


        this.sketch.mousedown = function () {
            this.mouseIsDown = true;
            this.autoStep();
        };

        this.sketch.mouseup = function () {
            this.mouseIsDown = false;
        };


        this.sketch.autoStep = function () {
            console.log(this._pstart[0].x)
            this.points[0].x = this._pstart[0].x + 25;
            this.points[0].y = this._pstart[0].y + 25;

            this.points[1].x = this._pend[0].x + 25;
            this.points[1].y = this._pend[0].y + 25;

            for (var i = this.iterateStep; i < this.CONFIG.maxSteps; i++) {
                this.iterate();
            }
            // this.clear();
            this.drawFlash()

        };


        this.sketch.drawFlash = function () {

            console.log('draw')


            this.clear("black");
            this.strokeStyle = "rgb(220, 200, 255)";
            this.lineWidth = 4;
            this.shadowColor = "rgb(255, 255, 255)";
            this.shadowOffsetX = 0;
            this.shadowOffsetY = 0;
            this.shadowBlur = 20;
            this.beginPath();
            this.moveTo(this.points[0].x, this.points[0].y);
            for (var i = 1; i < this.points.length; i += 1) {
                this.lineTo(this.points[i].x, this.points[i].y);
            }
            this.stroke();

        };

        this.sketch.iterate = function () {
            console.log('iterate')


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
            this.CONFIG.iterateStep = this.iterateStep;
        };


        this.sketch.update = function () {
        };

        this.sketch.draw = function () {
        };

        this.sketch.mousemove = function () {
        };

        this.sketch.updateDrag = function () {
            console.log('dsd')
        };

        this.sketch.updateIndicatorPositions = function () {
            TweenMax.set(this.pStart, {
                left: this.points[0].x - 25,
                top: this.points[0].y - 25
            })
            TweenMax.set(this.pEnd, {
                left: this.points[1].x - 25,
                top: this.points[1].y - 25
            })
        };


        this.sketch.setup = function () {
            this.globalCompositeOperation = 'lighter';
            this.fillStyle = "#ffffff";

            this.points = [];
            this.offset = this.CONFIG.initialOffset;

            this.iterateStep = 0;
            this.CONFIG.iterateStep = this.iterateStep;


            // this.points.push({
            //     x: random() * this.width,
            //     y: 25
            // });
            //
            // this.points.push({
            //     x: random() * this.width,
            //     y: this.height - 25
            // });

            this.points.push({
                x: 0,
                y: 0
            });

            this.points.push({
                x: 0,
                y: 0
            });


            // this.updateIndicatorPositions();


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
        document.getElementById('screen').removeChild(this.sketch.pStart);
        document.getElementById('screen').removeChild(this.sketch.pEnd);
    }


    initControls() {
        this.gui = new dat.GUI({
            width: 360,
            closed: false,
            autoPlace: false
        });

        document.getElementById('dat-container').appendChild(this.gui.domElement);

        this.gui.add(this.sketch.CONFIG, 'initialOffset').min(.01).max(this.sketch.height).step(1).name('initialOffset');
        this.gui.add(this.sketch.CONFIG, 'scaleFactor').min(.01).max(1.0).step(.01).name('scaleFactor');
        this.gui.add(this.sketch.CONFIG, 'maxSteps').min(1).max(10).step(1).name('maxSteps');
        this.gui.addColor(this.sketch.CONFIG, 'color').name('color').listen();
        this.gui.add(this.sketch.CONFIG, 'iterateStep').name('iterateStep').listen();
        this.gui.add(this.sketch.CONFIG.METHODS, 'autoStep').onChange(this.autoStep.bind(this));
        this.gui.add(this.sketch.CONFIG.METHODS, 'reset').onChange(this.reset.bind(this));

    }

    setup() {
        //this.sketch.clear();
        this.sketch.setup();

    }

    dragUpdate() {
        // console.log(this.sketch._pstart[0].x)
        // this.sketch.updateDrag();
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

export default Sketch_5;