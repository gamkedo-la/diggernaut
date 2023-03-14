class Player {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 12;
        this.speed = .9;
        this.color = "yellow";
        this.xvel = 0;
        this.yvel = 0;
        this.xAccel = 0;
        this.yAccel = 0;
        this.limits = {
            minXVel: -5,
            maxXVel: 5,
            minYVel: -5,
            maxYVel: 5,
            minXAccel: -3,
            maxXAccel: 3,
            minYAccel: -3,
            maxYAccel: 3,
        }
        this.friction = 0.80;
    }
    draw() {
        canvasContext.fillStyle = this.color;
        canvasContext.fillRect(Math.round(this.x - view.x), Math.round(this.y - view.y), this.width, this.height);
    }
    update() {
        this.xvel += this.xAccel;
        this.yvel += this.yAccel;
        if (this.xvel > this.limits.maxXVel) { this.xvel = this.limits.maxXVel; }
        if (this.xvel < this.limits.minXVel) { this.xvel = this.limits.minXVel; }
        if (this.yvel > this.limits.maxYVel) { this.yvel = this.limits.maxYVel; }
        if (this.yvel < this.limits.minYVel) { this.yvel = this.limits.minYVel; }
        if (this.xAccel > this.limits.maxXAccel) { this.xAccel = this.limits.maxXAccel; }
        if (this.xAccel < this.limits.minXAccel) { this.xAccel = this.limits.minXAccel; }
        
        this.xvel *= this.friction;
        this.yvel *= this.friction;
        this.x += this.xvel;
        this.y += this.yvel;
        this.xAccel = 0;
        this.yAccel = 0;
    }

    moveLeft() {
        this.xAccel = -this.speed;
    }
    moveRight() {
        this.xAccel = this.speed;
    }   
    moveUp() {
        this.yAccel = -this.speed;
    }
    moveDown() {
        this.yAccel = this.speed;
    }
    stop() {
        this.xAccel = 0;
        this.yAccel = 0;
    }



}