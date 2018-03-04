import Draggable from "gsap/Draggable";

/**
 * Created by STORMSEN on 14.06.2017.
 */


var chromatism = require('chromatism');
var chroma = require('chroma-js');

import SketchTemplate from "./SketchTemplate.js";
import mathUtils from "./utils/mathUtils.js";
import {Vector2} from "./math/vector2";

class Sketch_12 extends SketchTemplate {

    /*--------------------------------------------


     --------------------------------------------*/

    constructor() {
        super();

        console.log('Sketch_12!');

        /*--------------------------------------------
         ~ sketch variables
         --------------------------------------------*/

        this.sketch.goldenRatio = 1.61803398875;
        this.sketch.fibonacciAngle = 137.5;
        this.sketch.vCenter = new Vector2(this.sketch.width * .5, this.sketch.height * .5);
        this.sketch.points = [];

        let Q1 = new Vector2(200, this.sketch.height * .2);
        let Q2 = new Vector2(this.sketch.width - 200, this.sketch.height * .5);

        Q1.charge = 1.5;
        Q2.charge = -1.5;

        this.sketch.fields = [Q1, Q2];
        this.sketch.plotPoints = [];

        /*--------------------------------------------
         ~ dom-stuff
         --------------------------------------------*/

        let screen = document.getElementById('screen');

        this.sketch.pStart = document.createElement('div');
        this.sketch.pStart.classList.add('pStart');
        this.sketch.pStart.id = 'pStart';
        screen.appendChild(this.sketch.pStart);
        this.sketch._pstart = Draggable.create(this.sketch.pStart, {
            type: "x,y", edgeResistance: 0.5, bounds: "#screen", throwProps: false,
            onDrag: this.onDrag.bind(this)
        });


        this.sketch.pEnd = document.createElement('div');
        this.sketch.pEnd.classList.add('pEnd');
        this.sketch.pEnd.id = 'pEnd';
        screen.appendChild(this.sketch.pEnd);

        this.sketch._pend = Draggable.create(this.sketch.pEnd, {
            type: "x,y", edgeResistance: 0.5, bounds: "#screen", throwProps: false,
            onDrag: this.onDrag.bind(this),
            onDragStart: this.onDragStart.bind(this),
            onDragEnd: this.onDragEnd.bind(this),
        });

        TweenLite.set("#pStart", {x: this.sketch.fields[0].x, y: this.sketch.fields[0].y});
        TweenLite.set("#pEnd", {x: this.sketch.fields[1].x, y: this.sketch.fields[1].y});

        this.sketch._pstart[0].x = this.sketch.fields[0].x;
        this.sketch._pstart[0].y = this.sketch.fields[0].y;
        this.sketch._pend[0].x = this.sketch.fields[1].x;
        this.sketch._pend[0].y = this.sketch.fields[1].y;


        /*--------------------------------------------
         ~ config stuff / dat-gui
         --------------------------------------------*/

        this.sketch.CONFIG = {
            NUM_RENDER_STEPS: 1,
            OPTIONS: {
                opacity: .2,
                overdraw: false
            },
            POINTS: {
                maxPoints: 100
            },
            METHODS: {
                shuffle: function () {
                },
                toggleRun: function () {
                },
                renderField: function () {
                },
                renderForce: function () {
                },
                reset: function () {
                }
            }
        };
        this.initControls();

        /*--------------------------------------------
         ~ sketch methods
         --------------------------------------------*/

        this.sketch.setup = function () {
            console.log('setup');


            this.lineWidth = .5;
            this.strokeStyle = 'rgba(196, 174, 69, .2)';
            this.fillStyle = "rgba(23, 23, 26, 1)";
            // this.globalCompositeOperation = 'lighter';
            this.autoclear = false;

        };


        this.sketch.getForce = function (vLocation) {

            let eVecRes = new Vector2();
            let _field = new Vector2();

            for (var i = 0; i < this.fields.length; i++) {
                _field = this.fields[i];
                _field.rVec = Vector2.subtract(vLocation, _field);
                _field.eVec = _field.rVec.clone();
                _field.eVec.multiplyScalar(_field.charge / (4 * Math.PI));
                _field.eVec.multiplyScalar(1 / Math.pow(_field.rVec.length(), 2));
                _field.eVec.multiplyScalar(100000);

                i == 0 ? eVecRes = this.fields[0].eVec : eVecRes.add(this.fields[i].eVec);
            }

            return eVecRes;

        };

        this.sketch.renderForce = function (vForce) {

            let maxLength = 75;

            let force = vForce.clone();
            if (force.length() > maxLength) force.setLength(maxLength);

            this.strokeStyle = chroma.hsl(
                mathUtils.convertToRange(force.length(), [0, maxLength], [150, 260]),
                .5,
                mathUtils.convertToRange(force.length(), [0, maxLength], [.2, .6]),
            ).hex();

            this.beginPath();
            this.moveTo(0, 0);
            this.lineTo(force.x, force.y);
            this.stroke();

        }

        this.sketch.plotForce = function () {

            if(this.CONFIG.OPTIONS.overdraw) {
                this.fillStyle = "rgba(5,5,5," + this.CONFIG.OPTIONS.opacity + ")";
                this.fillRect(0, 0, this.width, this.height);
            } else {
                this.clear();
                this.fillStyle = "rgba(23, 23, 26, 1)";
            }


            let x, y = 0;
            for (let i = 0; i < this.CONFIG.POINTS.maxPoints; i++) {
                x = Math.random() * this.width;
                y = Math.random() * this.height;
                let vForce = this.getForce(new Vector2(x, y));
                this.save();
                this.translate(x, y);
                this.renderForce(vForce);
                this.restore();
            }
        };


        this.sketch.mousedown = function () {
            this.plotForce();

            // Q2.set(this.mouse.x, this.mouse.y)

        };

        this.sketch.mousemove = function () {
        };


        this.sketch.render = function () {
            // this.clear();
        };

        this.sketch.update = function () {
            this.plotForce();
        };


    }

    /*--------------------------------------------
     ~ class methods
     --------------------------------------------*/

    onDrag() {
        //console.log(this.sketch._pstart[0].x)
        this.sketch.fields[0].x = this.sketch._pstart[0].x;
        this.sketch.fields[0].y = this.sketch._pstart[0].y;

        this.sketch.fields[1].x = this.sketch._pend[0].x;
        this.sketch.fields[1].y = this.sketch._pend[0].y;


        this.plotField();
        // this.sketch.updateDrag();
    }

    onDragStart() {
    };


    onDragEnd() {
        //this.sketch.updateDraw();
    };

    kill() {
        document.getElementById('dat-container').removeChild(this.gui.domElement);
    }

    initControls() {
        this.gui = new dat.GUI({
            width: 360,
            closed: false
        });

        document.getElementById('dat-container').appendChild(this.gui.domElement);


        this.gui.add(this.sketch.CONFIG.METHODS, 'toggleRun').onChange(this.toggleRun.bind(this));
        this.gui.add(this.sketch.CONFIG.METHODS, 'reset').onChange(this.reset.bind(this));

        let points = this.gui.addFolder('points');
        points.add(this.sketch.CONFIG.POINTS, 'maxPoints').min(10).max(1000).step(1).name('maxPoints');
        // points.add(this.sketch.CONFIG.METHODS, 'renderForce').onChange(this.renderForce.bind(this));
        points.open();

        let f_options = this.gui.addFolder('options');
        f_options.add(this.sketch.CONFIG.OPTIONS, 'opacity').min(0.001).max(1).step(.001);
        f_options.add(this.sketch.CONFIG.OPTIONS, 'overdraw').name('overdraw');
    }

    updateParams() {
        this.sketch.clear();
        this.sketch.plotField();
    }


    toggleRun() {
        this.sketch.running = !this.sketch.running;
    }

    plotField() {
        this.sketch.render();
        this.sketch.update();
    }


    reset() {
        this.sketch.clear();
        this.sketch.running = false;
    }


}


// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketch_12;