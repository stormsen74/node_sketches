/**
 * Created by STORMSEN on 14.06.2017.
 */


// var Sketch = require('sketch-js');
var chromatism = require('chromatism');
var gsap = require('gsap');

import SketchTemplate from "./SketchTemplate.js";
import Circle from "./gfx/Circle.js";

import {Vector2} from "./math/vector2";
import Draggable from "gsap/Draggable";

class Sketch_6 extends SketchTemplate {

    //  https://www.youtube.com/watch?v=QHEQuoIKgNE

    constructor() {
        super(true, true);

        console.log('Sketch_6!');

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.points = [];
        this.sketch.circles = [];
        this.sketch.running = true;
        this.sketch.mouseIsDown = false;

        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);


        /*--------------------------------------------
         ~ config stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            maxCircles: 1000,
            stepCircles: 5,
            initialOffset: 125,
            AUTO_CLEAR: true,
            METHODS: {
                startSim: function () {
                },
                reset: function () {
                }
            }
        };
        this.initControls();


        this.sketch.mousedown = function () {
            this.mouseIsDown = true;
        };

        this.sketch.mouseup = function () {
            this.mouseIsDown = false;
        };


        this.sketch.update = function () {
            this.draw();
        };

        this.sketch.draw = function () {

            //if (this.circles.length < this.CONFIG.maxCircles) {
            //    let c = new Circle(random(this.width), random(this.height), 1);
            //    this.circles.push(c);
            //}


            if (this.circles.length < this.CONFIG.maxCircles) {

                for (let i = 0; i < parseInt(this.CONFIG.stepCircles); i++) {
                    this.createCircle();
                }

            }

            this.circles.forEach((c, index) => {
                if (c.edges(this.width, this.height)) {
                    c.growing = false;
                } else {
                    this.circles.forEach((o, index) => {
                        if (c != o) {
                            let vC = new Vector2(c.x, c.y);
                            let vO = new Vector2(o.x, o.y);
                            let d = Vector2.getDistance(vC, vO);
                            if (d < c.r + o.r + 2) {
                                c.growing = false;
                            }
                        }

                    })
                }
                c.grow();
                this.plotPoint(c.x, c.y, c.r);

            });
        };

        this.sketch.createCircle = function () {
            let x = random(this.width);
            let y = random(this.height);
            let c = new Circle(x, y, 1);

            let valid = true;
            this.circles.forEach((c, index) => {
                let vC = new Vector2(c.x, c.y);
                let d = Vector2.getDistance(new Vector2(x, y), vC);
                if (d < c.r + 1) {
                    valid = false;
                    return
                }

            });

            if (valid)
                this.circles.push(c);
        };

        this.sketch.mousemove = function () {
        };

        this.sketch.updateDrag = function () {
        };


        this.sketch.setup = function () {

            // https://developer.mozilla.org/de/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
            //this.globalCompositeOperation = 'darken';

            this.points = [];
            this.offset = this.CONFIG.initialOffset;

            //let c = new Circle(this.vCenter.x, this.vCenter.y, 101);
            //this.circles.push(c);


            //this.draw();

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

        this.gui.add(this.sketch.CONFIG, 'maxCircles').min(1).max(5000).step(1).name('maxCircles');
        this.gui.add(this.sketch.CONFIG, 'stepCircles').min(1).max(23).step(1).name('stepCircles');
        this.gui.add(this.sketch.CONFIG.METHODS, 'reset').onChange(this.reset.bind(this));
        this.gui.add(this.sketch.CONFIG.METHODS, 'startSim').onChange(this.startSim.bind(this));

    }

    setup() {
        this.sketch.setup();

    }

    reset() {
        this.sketch.running = false;
        this.sketch.clear();
        this.sketch.circles = [];
    }


    startSim() {
        this.sketch.running = true;
        this.sketch.setup();
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketch_6;