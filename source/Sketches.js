/**
 * Created by STORMSEN on 29.11.2016.
 */

var gsap = require('gsap');
import Sketch_1 from "./Sketch_1.js";


class Sketches {


    constructor() {
        console.log('Sketches!');

        var sketch_1 = new Sketch_1();

        TweenMax.delayedCall(3, function () {
            sketch_1.start();
        })

        TweenMax.delayedCall(6, function () {
            sketch_1.stop();
        })


    }

}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketches;