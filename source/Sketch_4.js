/**
 * Created by STORMSEN on 14.06.2017.
 */


// var Sketch = require('sketch-js');
var chromatism = require('chromatism');

import SketchTemplate from "./SketchTemplate.js";
import {Vector2} from "./math/vector2";

class Sketch_4 extends SketchTemplate {

    constructor() {
        super(false, false);

        console.log('Sketch_4!');

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.points = [];
        this.sketch.initialPoints = 6;
        this.sketch.scaleFactor = .6;
        this.sketch.radius = this.sketch.height / 4;
        this.sketch.angle = 0;
        this.sketch.offset = this.sketch.height / 6;
        this.sketch.mouseIsDown = false;

        //this.t = 0;
        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);

        /*--------------------------------------------
         ~ confif stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            initialPoints: 8,
            scaleFactor: .6,
            METHODS: {
                reset: function () {
                }
            }
        }
        this.initControls();


        this.sketch.mousedown = function () {

            this.mouseIsDown = true;

            this.iterate();
            this.drawCoast();
        };

        this.sketch.mouseup = function () {
            this.mouseIsDown = false;
        };

        this.sketch.drawCoast = function () {
            // this.clear();
            this.fillStyle = "rgba(255,255,255,0.05)";
            this.fillRect(0, 0, this.width, this.height);

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
        };


        this.sketch.update = function () {

            // this.drawPolar();

        };

        this.sketch.draw = function () {
            // this.fillStyle = "rgba(38,38,38,0.05)";
            // this.fillRect(0, 0, this.width, this.height);
        }


        this.sketch.mousemove = function () {

            if (this.running && this.mouseIsDown) {


            }


        };

        this.sketch.setup = function () {
            this.globalCompositeOperation = 'lighter';
            this.fillStyle = "#ffffff";
            for (var i = 0; i < this.initialPoints; i += 1) {
                let angle = Math.PI * 2 / this.initialPoints * i;
                this.points.push({
                    x: cos(angle) * this.radius,
                    y: sin(angle) * this.radius
                });
            }

            this.points.push(this.points[0]);

            this.drawCoast();

        };
        this.sketch.setup();

        this.sketch.reset = function() {
            console.log('R')
        }



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

        this.gui.add(this.sketch.CONFIG, 'scaleFactor').min(.01).max(1.0).step(.01).name('scaleFactor');
        this.gui.add(this.sketch.CONFIG.METHODS, 'reset').onChange(this.reset.bind(this));

    }


    reset() {
        console.log('reset');
        this.sketch.reset();
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketch_4;