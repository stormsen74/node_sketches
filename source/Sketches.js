/**
 * Created by STORMSEN on 29.11.2016.
 */

var gsap = require('gsap');
import Sketch_2 from "./Sketch_2.js";
import Sketch_3 from "./Sketch_3.js";


class Sketches {

    constructor() {

        console.log('Sketches!');


        // TODO Select / Sketch [Meta-Info) / Close Button x

        this.sketch = new Sketch_3();

        TweenMax.delayedCall(3, this.clearSketch, null, this);
        TweenMax.delayedCall(4, this.addSketch, [1], this, );


        //
        // TweenMax.delayedCall(6, function () {
        //     sketch.stop();
        // })


    }

    clearSketch() {
        this.sketch.clearControls();
        this.sketch.clear();
        this.sketch.destroy();
    }

    addSketch(id) {
        console.log(id)
        this.sketch = new Sketch_2();
    }

}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketches;