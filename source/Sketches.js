/**
 * Created by STORMSEN on 29.11.2016.
 */

var gsap = require('gsap');
import Sketch_1 from "./Sketch_1.js";
import Sketch_2 from "./Sketch_2.js";
import Sketch_3 from "./Sketch_3.js";
import Sketch_4 from "./Sketch_4.js";


class Sketches {

    constructor() {

        console.log('Sketches!');



        this.sketches = [
            '',
            Sketch_1,
            Sketch_2,
            Sketch_3,
            Sketch_4
        ];


        // DEVELOP
        // this.sketch = new this.sketches[3]();
        // return;


        this.select = document.getElementById('select');
        this.closeButton = document.getElementById('close');
        this.closeButton.addEventListener('click', this.onCloseSketch.bind(this));

        for (var i = 1; i < this.sketches.length; i++) {
            let node = document.createElement('div');
            node.classList.add('select_box');
            node.style.background = 'im'
            node.innerHTML = 'sketch | ' + i;
            node._id = i;
            node.addEventListener('click', this.onSelectSketch.bind(this));
            this.select.appendChild(node);
        }


        // TODO => Sketch [Meta-Info) / Styling

    }

    onSelectSketch(e) {
        console.log(e.target._id)
        this.sketch = new this.sketches[e.target._id]();

        this.select.style.display = 'none';
        this.closeButton.style.display = 'block'
    }

    onCloseSketch(e) {
        this.sketch.kill();
        this.sketch.clear();
        this.sketch.destroy();

        this.select.style.display = 'block';
        this.closeButton.style.display = 'none'
    }


}

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Sketches;