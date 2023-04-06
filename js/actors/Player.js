class Player {
    //todo: add a sprite sheet for the player
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.previousX = x;
        this.previousY = y;
        this.canJump = false;
        this.canDig = true;
        this.width = 16;
        this.height = 24;
        this.speed = 0.9;
        this.color = "yellow";
        this.xvel = 0;
        this.yvel = 0;
        this.xAccel = 0;
        this.yAccel = 0;
        this.digCooldown = 0;
        this.health = 100;
        this.friction = 0.80;
        this.moveLeftCooldown = 0;
        this.moveRightCooldown = 0;
        this.coyoteCooldown = 0;
        this.wallSliding = false;
        this.inventory = {
            ore: 0,
        }
        

        this.spritesheet = new SpriteSheet({
            image: img['placeholder-player'],
            frameWidth: 16,
            frameHeight: 24,
            animations: {
                idle: {
                    frames: [2],
                    frameRate: 1
                },
                walkLeft: {
                    frames: [1,3],
                    frameRate: 8
                },
                walkRight: {
                    frames: [0,2],
                    frameRate: 8
                },
                jump: {
                    frames: [4],
                    frameRate: 1
                },
                falling: {
                    frames: [5],
                    frameRate: 1
                },
                dig: {
                    frames: [3],
                    frameRate: 1
                }
            }
        })

        this.currentAnimation = this.spritesheet.animations["idle"];

        this.limits = {
            minXVel: -5,
            maxXVel: 5,
            minYVel: -10,
            maxYVel: 20,
            hurtVelocity: 10, 
            minXAccel: -3,
            maxXAccel: 3,
            minYAccel: -3,
            maxYAccel: 5,
            digCooldown: 2,
            healthMax: 100,
            moveLeftCooldown: 20,
            moveRightCooldown: 20,
            coyoteCooldown: 10,

        }

        this.gravity = .25;

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
       this.currentAnimation.render({
        x: Math.floor(this.x-view.x), 
        y: Math.floor(this.y-view.y),
        width: 16,
        height: 24
    })
        canvasContext.fillStyle = "Red";
        pset(this.collider.leftFeeler.x - view.x, this.collider.leftFeeler.y - view.y);
        pset(this.collider.rightFeeler.x - view.x, this.collider.rightFeeler.y - view.y);
        pset(this.collider.topFeeler.x - view.x, this.collider.topFeeler.y - view.y);
        pset(this.collider.bottomFeeler.x - view.x, this.collider.bottomFeeler.y - view.y);
    }

    update() {
        this.applyForces();
        this.handleCollisions();
        this.checkBounds();
        this.canDig = this.checkDig();
        this.canJump = this.isOnFloor() || this.coyoteCooldown > 0;
        this.wallSliding = this.isOnWall() && !this.isOnFloor() && (Key.isDown(Key.LEFT) || Key.isDown(Key.a) || Key.isDown(Key.RIGHT) || Key.isDown(Key.d));
        this.canWallJump = this.isOnWall() && !this.isOnFloor();
        if(this.moveLeftCooldown > 0) { this.moveLeftCooldown--; }
        if(this.moveRightCooldown > 0) { this.moveRightCooldown--; }
        this.xAccel = 0;
        this.yAccel = 0;
        if(Math.abs(this.xvel) < 0.05) { this.xvel = 0; }
        if(this.wallSliding) { 
            emitParticles(this.collider.bottomFeeler.x, this.collider.bottom, particleDefinitions.sparks);
         }
        this.handleAnimationState();

        //emitParticles(this.x, this.y, particleDefinitions.sparks)
    }

    handleInput() {
        if (Key.isDown(Key.LEFT) || Key.isDown(Key.a)) {
            this.moveLeft();
            if(Key.isDown(Key.z)){
                this.dig(LEFT);
            }
        }
        else if (Key.isDown(Key.RIGHT) || Key.isDown(Key.d)) {
            this.moveRight(); 
            if(Key.isDown(Key.z)){
                this.dig(RIGHT);
            }
        }

        if (Key.isDown(Key.UP) || Key.isDown(Key.w)) {
            if(Key.isDown(Key.z)){
                this.dig(UP);
            }
            
        } 
        else if (Key.isDown(Key.DOWN) || Key.isDown(Key.s)) {
            //this.moveDown();
            if(Key.isDown(Key.z)){
                this.dig(DOWN);
            }
        }

        if (Key.isDown(Key.SPACE)) {
            if(this.canWallJump ) {
                this.wallJump(tileMap);
            }else if(this.canJump) {
                this.jump();
            }
        }
        if (Key.justReleased(Key.z)) { this.digCooldown = 0; }
        if (Key.justReleased(Key.p)) { signal.dispatch('pause'); }
        if (Key.justReleased(Key.i)) { signal.dispatch('inventory'); }
    }

    updateCollider(x, y) {
        this.x = x;
        this.y = y;
        this.collider.top = this.y
        this.collider.bottom = this.y + this.height
        this.collider.left = this.x
        this.collider.right = this.x + this.width

        this.collider.leftFeeler.x = this.collider.left - 3;
        this.collider.leftFeeler.y = this.y + this.height / 2;
        this.collider.rightFeeler.x = this.collider.right + 4;
        this.collider.rightFeeler.y = this.y + this.height / 2;
        this.collider.topFeeler.x = this.x + this.width / 2;
        this.collider.topFeeler.y = this.collider.top - 10;
        this.collider.bottomFeeler.x = this.x + this.width / 2;
        this.collider.bottomFeeler.y = this.collider.bottom + 6;

    }

    applyForces() {
        this.previousX = this.x;
        this.previousY = this.y;
        let yAccelDelta = this.wallSliding ? 0.25 : 1;
        this.yAccel += (this.gravity * yAccelDelta);
        this.xvel += this.xAccel;
        this.yvel += this.yAccel;
        if (this.xvel > this.limits.maxXVel) { this.xvel = this.limits.maxXVel; }
        if (this.xvel < this.limits.minXVel) { this.xvel = this.limits.minXVel; }
        if (this.yvel > this.limits.maxYVel) { this.yvel = this.limits.maxYVel; }
        if (this.yvel < this.limits.minYVel) { this.yvel = this.limits.minYVel; }
        if (this.xAccel > this.limits.maxXAccel) { this.xAccel = this.limits.maxXAccel; }
        if (this.xAccel < this.limits.minXAccel) { this.xAccel = this.limits.minXAccel; }

        this.xvel *= this.friction;
        this.yvel *= (this.wallSliding ? 0.8 : 1);
    }

    handleAnimationState(){
        this.currentAnimation.update();
        if(this.xvel > 0) {
            this.currentAnimation = this.spritesheet.animations["walkRight"];
        } else if(this.xvel < 0) {
            this.currentAnimation = this.spritesheet.animations["walkLeft"];
        } else {
            this.currentAnimation = this.spritesheet.animations["idle"];
        }
        if(this.yvel < 0) {
            this.currentAnimation = this.spritesheet.animations["jump"];
        }
        if(this.yvel > 0) {
            this.currentAnimation = this.spritesheet.animations["falling"];
        }
    }

    handleCollisions(resolution = 3) {
        if (this.xvel == 0) {
            this.updateCollider(this.x, this.y);
        } else {
            let increment = this.xvel / resolution;
            for (let i = 0; i < resolution; i++) {
                this.updateCollider(this.x + increment, this.y);
                if (this.tileCollisionCheck(0)) {
                    this.x = this.previousX;
                    this.updateCollider(this.x, this.y);
                    this.xvel = 0;
                    break;
                }
            }
        }

        if (this.yvel == 0) {
            this.updateCollider(this.x, this.y);
        } else {
            let increment = this.yvel / resolution;
            for (let i = 0; i < resolution; i++) {
                this.updateCollider(this.x, this.y + increment);
                if (this.tileCollisionCheck(0)) {
                    if(this.yvel > this.limits.hurtVelocity){
                        this.hurt(10);
                    }
                    this.y = this.previousY;
                    this.updateCollider(this.x, this.y);
                    
                    this.yvel = 0;
                    break;
                }
            }
        }

        this.updateCollider(this.x, this.y);
    }

    tileCollisionCheck(tileCheck) {

        let left = Math.floor(this.collider.left),
            right = Math.floor(this.collider.right),
            top = Math.floor(this.collider.top),
            bottom = Math.floor(this.collider.bottom)

        //check for collision with tile
        //check tile index of each corner of the player
        let topLeft = tileMap.data[tileMap.pixelToTileIndex(left, top)];
        let topRight = tileMap.data[tileMap.pixelToTileIndex(right, top)];
        let bottomLeft = tileMap.data[tileMap.pixelToTileIndex(left, bottom)];
        let bottomRight = tileMap.data[tileMap.pixelToTileIndex(right, bottom)];

        return (topLeft > tileCheck || topRight > tileCheck || bottomLeft > tileCheck || bottomRight > tileCheck);

    }
    isOnWall() {
        //isOnWall is used to determine if the player is on a wall and can jump off of it
        let left = tileMap.data[tileMap.pixelToTileIndex(this.collider.leftFeeler.x, this.collider.leftFeeler.y)];
        let right = tileMap.data[tileMap.pixelToTileIndex(this.collider.rightFeeler.x, this.collider.rightFeeler.y)];
        return (left > 0 || right > 0);
    }

    isOnFloor() {
        let rc = tileMap.data[tileMap.pixelToTileIndex(this.collider.bottomFeeler.x, this.collider.bottomFeeler.y)];
        if (rc > 0) {
            this.coyoteCooldown = this.limits.coyoteCooldown;
            return true;
        } else {
            this.coyoteCooldown--;
            return false;
        }
    }

    moveLeft() {
        this.moveRightCooldown = 0;
        if(!this.moveLeftCooldown){
            this.xAccel = -this.speed;
        }
        
    
    }
    moveRight() {
        this.moveLeftCooldown = 0;
        if(!this.moveRightCooldown){
            this.xAccel = this.speed;
        }
    }

    moveDown() {
        //this.yAccel = this.speed;
    }
    
    wallJump(world) {
        this.yAccel = -this.speed * 10;
        let onleftWall = world.data[world.pixelToTileIndex(this.collider.leftFeeler.x, this.collider.leftFeeler.y)]
        onleftWall ? this.moveLeftCooldown = this.limits.moveLeftCooldown : this.moveRightCooldown = this.limits.moveRightCooldown; 
        this.xAccel = onleftWall ? this.speed * 5 : -this.speed * 5;
        this.play("jump");
        let particleDef = onleftWall? particleDefinitions.wallJumpLeft : particleDefinitions.wallJumpRight;
        let emitLocation = onleftWall? this.collider.leftFeeler : this.collider.rightFeeler;
        emitParticles(emitLocation.x, emitLocation.y, particleDef);
    }

    stop() {
        this.xAccel = 0;
        this.yAccel = 0;
        this.yVel = 0;
        this.xVel = 0;
    }

    dig(direction) {
        this.play("dig")
        if (!this.canDig) return;
        let startTileValue = 0;
        let startTileIndex = 0;
        let spawnX = 0;
        let spawnY = 0;
        switch (direction) {
            case LEFT:
                startTileIndex = tileMap.pixelToTileIndex(this.collider.leftFeeler.x, this.collider.leftFeeler.y);
                spawnX = this.collider.leftFeeler.x;
                spawnY = this.collider.leftFeeler.y;
                startTileValue = tileMap.data[startTileIndex];
                break;

            case RIGHT:
                startTileIndex = tileMap.pixelToTileIndex(this.collider.rightFeeler.x, this.collider.rightFeeler.y);
                spawnX = this.collider.leftFeeler.x;
                spawnY = this.collider.leftFeeler.y;
                startTileValue = tileMap.data[startTileIndex];
                break;

            case DOWN:
                startTileIndex = tileMap.pixelToTileIndex(this.collider.bottomFeeler.x, this.collider.bottomFeeler.y);
                spawnX = this.collider.leftFeeler.x;
                spawnY = this.collider.leftFeeler.y;
                startTileValue = tileMap.data[startTileIndex];
                break;

            case UP:
                startTileIndex = tileMap.pixelToTileIndex(this.collider.topFeeler.x, this.collider.topFeeler.y);
                spawnX = this.collider.topFeeler.x;
                spawnY = this.collider.topFeeler.y;
                startTileValue = tileMap.data[startTileIndex];
                break;
        }
        
        if (startTileValue > 0) {
            switch(startTileValue){
                case TILE_DIRT : {
                    tileMap.data[startTileIndex] = TILE_EMPTY;
                }
                case TILE_UNBREAKABLE_METAL : {
                    break;
                }
                case TILE_UNBREAKABLE_STONE : {
                    break;
                }
                case TILE_UNOBTANIUM : {
                    tileMap.data[startTileIndex] = TILE_EMPTY;
                    let i = 10;
                    while(--i){ actors.push(new Ore(spawnX, spawnY))}
                    break;   
                }
                case TILE_DENSE_UNOBTANIUM : {
                    tileMap.data[startTileIndex] = TILE_EMPTY;
                    let i = 40;
                    while(--i){ actors.push(new Ore(spawnX, spawnY))}
                    break;  
                }
                case TILE_EXPLOSIVE : {
                    //destroy a 3x3 area around the explosive tile
                    //todo: refactor to explode(radius) function, so we can leave ore behind and handle effects on other tiles
                    
                    let i = 25;
                    while(--i){
                        let x = i % 5;
                        let y = Math.floor(i / 5);
                        let tileIndex = startTileIndex + x - 2 + (y - 2) * tileMap.widthInTiles;    
                        tileMap.data[tileIndex] = TILE_EMPTY;
                    }
                    break;
                }

                default: {
                    tileMap.data[startTileIndex] = TILE_EMPTY;
                }
            }
        }
    }

    hurt(damage) {
        screenShake(5);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
    }

    die() {
        gameState = GAMESTATE_GAME_OVER;
    }


    checkDig() {
        this.digCooldown--
        if (this.digCooldown <= 0) {
            this.digCooldown = this.limits.digCooldown;
            return true;
        }
        return false;
    }

    checkBounds() {
        if (this.x < 64) {
            this.x = 64;
            this.stop();
        }
        let worldRightBounds = tileMap.widthInTiles * tileMap.tileWidth - 64;
        if (this.x > worldRightBounds) {
            this.x = worldRightBounds;
            this.stop();
        }
    }

    throw() {
        //TODO: implement throwing
    }

    helicopter() {
        //TODO: implement helicopter action
        //player will be able to spin his diggerang above him and hover momentarily, slowing his descent.
    }

    jump() {
        this.yvel = -this.speed * 10;
        this.play("jump");
        emitParticles(
            this.collider.bottomFeeler.x,
            this.collider.bottom,
            particleDefinitions.jumpPuff
            );
    }

    play(animationName){
   
        this.currentAnimation = this.spritesheet.animations[animationName];
  
   
    if (!this.currentAnimation.loop){
        this.currentAnimation.reset();
    }
}

}