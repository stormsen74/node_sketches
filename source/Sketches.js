/**
 * Created by STORMSEN on 29.11.2016.
 */

//var gsap = require('gsap');
import Sketch_1 from "./Sketch_1.js";
import Sketch_2 from "./Sketch_2.js";
import Sketch_3 from "./Sketch_3.js";
import Sketch_4 from "./Sketch_4.js";
import Sketch_5 from "./Sketch_5.js";
import Sketch_6 from "./Sketch_6.js";
import Sketch_7 from "./Sketch_7.js";
import Sketch_8 from "./Sketch_8.js";


class Sketches {

    constructor() {

        console.log('Sketches!');


        this.sketches = [
            '',
            Sketch_1,
            Sketch_2,
            Sketch_3,
            Sketch_4,
            Sketch_5,
            Sketch_6,
            Sketch_7,
            Sketch_8
        ];


        this.select = document.getElementById('select');
        this.closeButton = document.getElementById('close');
        this.closeButton.addEventListener('click', this.onCloseSketch.bind(this));

        for (var i = 1; i < this.sketches.length; i++) {
            console.log(i)
            let node = document.createElement('div');
            let text = document.createElement('div');
            let path = 'assets/sketch_thumbs/thumb_' + i + '.png';
            node._id = i;
            node.classList.add('select_box');
            node.style.background = 'url(' + path + ')';
            node.appendChild(text);

            text.classList.add('select_text');
            text.innerHTML = 'sketch | ' + i;
            node.addEventListener('click', this.onSelectSketch.bind(this));
            this.select.appendChild(node);
        }


        // TODO => Sketch [Meta-Info) / Styling

    }

    onSelectSketch(e) {
        console.log(e.target)
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