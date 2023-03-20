class Player {
    //todo: add a sprite sheet for the player
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.previousX = x;
        this.previousY = y;
        this.canJump = false;
        this.width = 16;
        this.height = 24;
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
            maxYAccel: 5,
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
        canvasContext.fillRect(Math.floor(this.x - view.x), Math.floor(this.y - view.y), this.width+1, this.height+1);
        canvasContext.fillStyle = "Red";
        pset(this.collider.leftFeeler.x - view.x, this.collider.leftFeeler.y - view.y);
        pset(this.collider.rightFeeler.x - view.x, this.collider.rightFeeler.y - view.y);
        pset(this.collider.topFeeler.x - view.x, this.collider.topFeeler.y - view.y);
        pset(this.collider.bottomFeeler.x - view.x, this.collider.bottomFeeler.y - view.y);
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
        this.updateCollider(this.x, this.y)
        if(this.tileCollisionCheck(tileMap, 2)){
            this.x = this.previousX;
            this.updateCollider(this.x, this.y)
            this.stop();

        }
        this.y += this.yvel;
        this.updateCollider(this.x, this.y)
        if(this.tileCollisionCheck(tileMap, 2)){
            this.y = this.previousY;
            this.updateCollider(this.x, this.y)
            this.stop();
        }

        this.canJump = this.checkFloor();
        this.xAccel = 0;
        this.yAccel = 0;
    }

    updateCollider(x, y) {

        this.collider.top = this.y
        this.collider.bottom = this.y + this.height
        this.collider.left = this.x
        this.collider.right = this.x + this.width

        this.collider.leftFeeler.x = this.collider.left - 3;
        this.collider.leftFeeler.y = this.y + this.height/2;
        this.collider.rightFeeler.x = this.collider.right + 4;
        this.collider.rightFeeler.y = this.y + this.height/2;
        this.collider.topFeeler.x = this.x + this.width/2;
        this.collider.topFeeler.y = this.collider.top - 4;
        this.collider.bottomFeeler.x = this.x + this.width/2;
        this.collider.bottomFeeler.y = this.collider.bottom+6;
        
    }

    tileCollisionCheck(world, tileCheck){
        
        let left =      Math.floor(this.collider.left),
            right =     Math.floor(this.collider.right),
            top =       Math.floor(this.collider.top),
            bottom =    Math.floor(this.collider.bottom)
        
        //check for collision with tile
        //check tile index of each corner of the player
        let topLeft = world.data[ world.pixelToTileIndex(left, top) ];
        let topRight = world.data[ world.pixelToTileIndex(right, top) ];
        let bottomLeft = world.data[ world.pixelToTileIndex(left, bottom) ];
        let bottomRight = world.data[ world.pixelToTileIndex(right, bottom) ];

        return (topLeft > tileCheck || topRight > tileCheck || bottomLeft > tileCheck || bottomRight > tileCheck);


        
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
        this.yVel = 0;
        this.xVel = 0;
    }
    dig(direction) {
        let startTileValue = 0;
        let startTileIndex = 0;
        switch(direction){
            case LEFT:
                startTileIndex = tileMap.pixelToTileIndex(this.collider.leftFeeler.x, this.collider.leftFeeler.y);
                startTileValue = tileMap.data[ startTileIndex ];
                break;
            case RIGHT:
                startTileIndex = tileMap.pixelToTileIndex(this.collider.rightFeeler.x, this.collider.rightFeeler.y);
                startTileValue = tileMap.data[ startTileIndex ];
                break;
            case DOWN:
                startTileIndex = tileMap.pixelToTileIndex(this.collider.bottomFeeler.x, this.collider.bottomFeeler.y);
                startTileValue = tileMap.data[ startTileIndex ];
                break;
        }
        if(startTileValue > 0){
            let tilesToRemove = [];
            //check outwards from the start tile for tiles of the same type
            //TODO: flood fill algorithm? right now this just blindly checks to the right
            for(let i = 0; i < 4; i++){
                let tileIndex = startTileIndex + i;
                let tileValue = tileMap.data[ tileIndex ];
                if(tileValue == startTileValue){
                    tilesToRemove.push(tileIndex);
                }
                else { break }
            }
            //remove the tiles
            for(let i = 0; i < tilesToRemove.length; i++){
                tileMap.data[ tilesToRemove[i] ] = 0;
            }
        }
    }
    checkFloor() {
        return tileMap.data[ tileMap.pixelToTileIndex(this.collider.bottomFeeler.x, this.collider.bottomFeeler.y) ] > 0;
    }
    throw() {
        //TODO: implement throwing
    }
    helicopter() {
        //TODO: implement helicopter action
        //player will be able to spin his diggerang above him and hover momentarily, slowing his descent.
    }
    jump() {
        if(!this.canJump) return;
        this.yvel = -this.speed * 6;
    }



}