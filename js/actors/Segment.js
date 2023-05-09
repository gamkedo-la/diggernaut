class Segment {
    constructor(x, y, length, angle) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.angle = angle;
    }

    getEndX() {
        return this.x + Math.cos(this.angle) * this.length;
    }

    getEndY() {
        return this.y + Math.sin(this.angle) * this.length;
    }

    pointAt(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        this.angle = Math.atan2(dy, dx);
    }

    attachTo(parent) {
        this.x = parent.getEndX();
        this.y = parent.getEndY();
    }

    draw(context) {
        line(this.x - view.x, this.y - view.y, this.getEndX() - view.x, this.getEndY() - view.x, context);
    }
}
