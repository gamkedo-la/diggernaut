class Player {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.previousX = x;
        this.previousY = y;
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
            maxYVel: 2,
            minXAccel: -3,
            maxXAccel: 3,
            minYAccel: -3,
            maxYAccel: 3,
        }
        this.friction = 0.80;
        this.gravity = .2;
        this.collider = {
            left: 0,
            right: 0, 
            top: 0,
            bottom: 0,
            leftFeeler: { x: 0, y: 0 },
            rightFeeler: { x: 0, y: 0 },
            topFeeler: { x: 0, y: 0 },
            bottomFeeler: { x: 0, y: 0 }
        }
    }
    draw() {
        canvasContext.fillStyle = this.color;
        canvasContext.fillRect(Math.round(this.x - view.x), Math.round(this.y - view.y), this.width, this.height);
    }
    update() {
        this.previousX = this.x;
        this.previousY = this.y;
        this.yAccel += this.gravity;
        this.xvel += this.xAccel;
        this.yvel += this.yAccel;
        if (this.xvel > this.limits.maxXVel) { this.xvel = this.limits.maxXVel; }
        if (this.xvel < this.limits.minXVel) { this.xvel = this.limits.minXVel; }
        if (this.yvel > this.limits.maxYVel) { this.yvel = this.limits.maxYVel; }
        if (this.yvel < this.limits.minYVel) { this.yvel = this.limits.minYVel; }
        if (this.xAccel > this.limits.maxXAccel) { this.xAccel = this.limits.maxXAccel; }
        if (this.xAccel < this.limits.minXAccel) { this.xAccel = this.limits.minXAccel; }
        
        this.xvel *= this.friction;
        this.x += this.xvel;
        this.y += this.yvel;
        this.xAccel = 0;
        this.yAccel = 0;
    }

    updateCollider(x, y) {

        this.collider.top = this.y
        this.collider.bottom = this.y + this.height
        this.collider.left = this.x
        this.collider.right = this.x + this.width

        this.collider.leftFeeler.x = this.collider.left;
        this.collider.leftFeeler.y = this.y;
        this.collider.rightFeeler.x = this.collider.right;
        this.collider.rightFeeler.y = this.y;
        this.collider.topFeeler.x = this.x;
        this.collider.topFeeler.y = this.collider.top;
        this.collider.bottomFeeler.x = this.x;
        this.collider.bottomFeeler.y = this.collider.bottom;
        
    }

    moveLeft() {
        this.xAccel = -this.speed;
    }
    moveRight() {
        this.xAccel = this.speed;
    }   
    moveDown() {
        this.yAccel = this.speed;
    }
    stop() {
        this.xAccel = 0;
        this.yAccel = 0;
    }
    dig() {
        //TODO: implement digging
    }
    throw() {
        //TODO: implement throwing
    }
    jump() {
        this.yAccel = -this.speed * 2;
    }



}