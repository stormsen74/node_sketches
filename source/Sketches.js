/**
 * Created by STORMSEN on 29.11.2016.
 */

var gsap = require('gsap');
import Sketch_1 from "./Sketch_1.js";
import Sketch_2 from "./Sketch_2.js";


class Sketches {


    constructor() {
        console.log('Sketches!');

        var sketch = new Sketch_2();

        // TweenMax.delayedCall(3, function () {
        //     sketch.start();
        // })
        //
        // TweenMax.delayedCall(6, function () {
        //     sketch.stop();
        // })


    }

}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketches;