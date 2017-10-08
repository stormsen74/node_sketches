/**
 * Created by STORMSEN on 02.10.2017.
 */


class Circle {

    constructor(x, y, r, color) {
        this.x = x || 0;
        this.y = y || 0;
        this.r = r || 100;
        this.color = color || '#fff';

        this.growing = true;
    }

    grow() {
        if (this.growing) this.r += 1;
    }

    edges(w, h) {
        return (this.x + this.r > w || this.x - this.r < 0 || this.y + this.r > h || this.y - this.r < 0)
    }

}


export default Circle;