/**
 * Created by STORMSEN on 29.11.2016.
 */

var gsap = require('gsap');
import Sketch_2 from "./Sketch_2.js";
import Sketch_3 from "./Sketch_3.js";


class Sketches {

    var _scope;

    constructor() {

        _scope = this;
        console.log('Sketches!');


        // TODO Select / Sketch [Meta-Info) / Close Button x

        this.sketch = new Sketch_3();

        this.clearSketch();
        this.sketch = new Sketch_2();


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

}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketches;