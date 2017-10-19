/**
 * Created by STORMSEN on 14.06.2017.
 */


// var Sketch = require('sketch-js');
var chromatism = require('chromatism');
var gsap = require('gsap');

import SketchTemplate from "./SketchTemplate.js";
import Circle from "./geom/Circle.js";
import {Vector2} from "./math/vector2";
import MathUtils from "./utils/mathUtils";

class Sketch_7 extends SketchTemplate {

    //  https://www.youtube.com/watch?v=QHEQuoIKgNE

    // TODO
    // - walker as emitter (radius)

    constructor() {
        super(true, true);

        console.log('Sketch_7!');

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.points = [];
        this.sketch.circles = [];
        this.sketch.tracedPoints = [];
        this.sketch.running = true;
        this.sketch.mouseIsDown = false;

        this.sketch.img = new Image();
        this.sketch.imgData = null;

        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);
        //this.sketch.vCenter = new Vector2(150, 150);
        this.sketch.vTarget = new Vector2();
        this.sketch.vecWanderTheta = new Vector2();
        this.sketch.phi = 0;


        /*--------------------------------------------
         ~ config stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            maxCircles: 1500,
            stepCircles: 6,
            dPhi: .06,
            AUTO_CLEAR: true,
            METHODS: {
                startSim: function () {
                },
                reset: function () {
                }
            }
        };
        this.initControls();


        this.sketch.mousedown = function (e) {
            this.mouseIsDown = true;

            //let x = e.clientX;
            //let y = e.clientY;
            //
            //let c = this.getImageData(x, y, 1, 1).data;
            //console.log(c);
            //
            //let clr = {r: c[0], g: c[1], b: c[2]};
            //console.log(clr)


        };

        this.sketch.mouseup = function () {
            this.mouseIsDown = false;
        };


        this.sketch.update = function () {

            this.phi += this.CONFIG.dPhi;

        };

        this.sketch.draw = function () {

            this.update();

            //this.drawImage(this.img, 0, 0);

            if (this.circles.length < this.CONFIG.maxCircles) {

                let c = this.createCircle();

                let count = 0;
                let attempts = 0;

                while (count < this.CONFIG.stepCircles) {

                    let c = this.createCircle();

                    if (c != null) {
                        this.circles.push(c);
                        count++;
                    }

                    attempts++;
                    if (attempts > 100) {
                        console.log('FIN!')
                        this.running = false;
                        break;
                    }

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
                this.plotPoint(c.x, c.y, c.r, 1, '#ffffff', null);

            });
        };

        this.sketch.createCircle = function () {

            let x = 0, y = 0;

            //x = random(this.img.width);
            //y = random(this.img.height);


            //var rnd = ~~(random(this.tracedPoints.length));
            //let x = this.tracedPoints[rnd][0];
            //let y = this.tracedPoints[rnd][1];

            // DRIVEN

            let brushRadius = 60;
            this.vecWanderTheta.toPolar();
            this.vecWanderTheta.y = random() * TWO_PI;
            this.vecWanderTheta.x = MathUtils.getRandomBetween(0, brushRadius);
            this.vecWanderTheta.toCartesian();

            this.vTarget.toPolar();
            this.vTarget.y = this.phi;
            this.vTarget.x = 260;
            this.vTarget.toCartesian();

            x = this.vCenter.x + this.vTarget.x + this.vecWanderTheta.x;
            y = this.vCenter.y + this.vTarget.y + this.vecWanderTheta.y;


            let valid = true;
            this.circles.forEach((_c, index) => {
                let vC = new Vector2(_c.x, _c.y);
                let d = Vector2.getDistance(new Vector2(x, y), vC);
                if (d + 2 < _c.r ) {
                    valid = false;
                    return
                }

            });

            if (valid) {
                return new Circle(x, y, 1, '#ffffff')
            } else {
                return null;
            }
        };

        this.sketch.mousemove = function () {
        };

        this.sketch.updateDrag = function () {
        };


        this.sketch.rgbToHex = function (r, g, b) {
            if (r > 255 || g > 255 || b > 255)
                throw "Invalid color component";
            return ((r << 16) | (g << 8) | b).toString(16);
        };


        this.sketch.setup = function () {

            // https://developer.mozilla.org/de/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
            //this.globalCompositeOperation = 'darken';

            this.points = [];
            this.offset = this.CONFIG.initialOffset;

            //let c = new Circle(this.vCenter.x, this.vCenter.y, 101);
            //this.circles.push(c);

            this.draw();

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
        this.gui.add(this.sketch.CONFIG, 'dPhi').min(0).max(2).step(.01).name('dPhi');
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

export default Sketch_7;