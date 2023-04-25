class Player {
    constructor(settings = {}) {
        Object.assign(this, settings);
        // this.x = x;
        // this.y = y;
        // this.previousX = x;
        // this.previousY = y;
        // this.canJump = false;
        // this.canDig = true;
        // this.width = 16;
        // this.height = 24;
        // this.speed = 0.9;
        // this.color = "yellow";
        // this.xvel = 0;
        // this.yvel = 0;
        // this.xAccel = 0;
        // this.yAccel = 0;
        // this.digCooldown = 0;
        // this.hurtCooldown = 0;
        // this.health = 100;
        // this.friction = 0.80;
        // this.moveLeftCooldown = 0;
        // this.moveRightCooldown = 0;
        // this.coyoteCooldown = 0;
        // this.wallSliding = false;
        // this.helicopterCapacity = 120;
        // this.facing = LEFT;
       
        this.previousX = this.x;
        this.previousY = this.y;
        this.diggerang = new Diggerang(this.x, this.y);
        // this.inventory = {
        //     ore: 1000,
        // }
        

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
            digCooldown: 1,
            hurtCooldown: 20,
            healthMax: 100,
            moveLeftCooldown: 20,
            moveRightCooldown: 20,
            coyoteCooldown: 10,
            helicopterCapacity: 100,
            hoverMultiplier: 0.9,
            hoveryYVelocity: -1,
            jumpMultiplier: 8,
            gravity: 0.25,

        }

        this.gravity = this.limits.gravity

        this.collider = new Collider(this.x, this.y, this.width, this.height, {
            left: 2, right: 2, top: 10, bottom: 6
        }, 'player')
    }

    reset() {
        this.x = this.previousX;
        this.y = this.previousY;
        this.canJump = false;
        this.canDig = true;
        this.xvel = 0;
        this.yvel = 0;
        this.xAccel = 0;
        this.yAccel = 0;
        this.digCooldown = 0;
        this.hurtCooldown = 0;
        this.health = 12000;
        this.moveLeftCooldown = 0;
        this.moveRightCooldown = 0;
        this.coyoteCooldown = 0;
        this.wallSliding = false;
        this.facing = LEFT;
        //this.diggerang = new Diggerang(this.x, this.y);
        this.inventory = {
            ore: 1000,
        }
    }
    draw() {
       this.currentAnimation.render({
        x: Math.floor(this.x-view.x), 
        y: Math.floor(this.y-view.y),
        width: 16,
        height: 24
    })
        
        this.collider.draw()

        this.diggerang.draw();

        
        if(Key.isDown(Key.LEFT)||Joy.left){ this.drawDigTileHighlight("LEFT") };
        if(Key.isDown(Key.RIGHT)||Joy.right){ this.drawDigTileHighlight("RIGHT") };
        if(Key.isDown(Key.UP)||Joy.up){ this.drawDigTileHighlight("UP") };
        if(Key.isDown(Key.DOWN)||Joy.down){ this.drawDigTileHighlight("DOWN") };
    }

    update() {
        this.applyForces();
        this.handleCollisions();
        this.checkForFallingRocks();
        this.checkBounds();
        this.hurtCooldown--;
        this.canDig = this.checkDig();
        this.canJump = this.isOnFloor() || this.coyoteCooldown > 0;
        if(this.canJump){ this.helicopterCapacity = this.limits.helicopterCapacity; }
        this.wallSliding = this.isOnWall() && !this.isOnFloor() && (Key.isDown(Key.LEFT) || Key.isDown(Key.a) || Key.isDown(Key.RIGHT) || Key.isDown(Key.d) || Joy.left || Joy.right);
        this.canWallJump = this.isOnWall() && !this.isOnFloor();
        if(this.moveLeftCooldown > 0) { this.moveLeftCooldown--; }
        if(this.moveRightCooldown > 0) { this.moveRightCooldown--; }
        this.xAccel = 0;
        this.yAccel = 0;
        if(Math.abs(this.xvel) < 0.05) { this.xvel = 0; }
        if(this.wallSliding) this.collider.emit(particleDefinitions.sparks);
         if(this.yvel > this.limits.hurtVelocity-2) emitParticles(this.x + rand(0,12), this.y, particleDefinitions.fallSparks);
        this.handleAnimationState();

        this.diggerang.update(this);
    }

    handleInput() {
        if (Key.isDown(Key.LEFT) || Key.isDown(Key.a) || Joy.left) {
            this.moveLeft();
            if(Key.isDown(Key.z) || Joy.x){
                this.dig(LEFT);
            }
        }
        else if (Key.isDown(Key.RIGHT) || Key.isDown(Key.d) || Joy.right) {
            this.moveRight(); 
            if(Key.isDown(Key.z) || Joy.x){
                this.dig(RIGHT);
            }
        }

        if (Key.isDown(Key.UP) || Key.isDown(Key.w) || Joy.up) {
            if(Key.isDown(Key.z) || Joy.x){
                this.dig(UP);
            }
            
        } 
        else if (Key.isDown(Key.DOWN) || Key.isDown(Key.s) || Joy.down) {
            //this.moveDown();
            if(Key.isDown(Key.z) || Joy.x){
                this.dig(DOWN);
            }
        }

        if (Key.isDown(Key.SPACE) || Joy.a) {
            if(this.canJump) {
                this.jump();
            }else if(this.yvel > this.limits.hoveryYVelocity){
                this.helicopter();
            }
        }

        if ( Key.justReleased(Key.SPACE) || Joy.aReleased ) {
            if(this.canWallJump ) {
                this.wallJump(tileMap);
            }
        }

        if (Key.justReleased(Key.z) || Joy.xReleased) { this.digCooldown = 0; }
        if (Key.justReleased(Key.p) || Joy.startReleased) { signal.dispatch('pause'); }
        if (Key.justReleased(Key.i) || Joy.yReleased) { signal.dispatch('inventory'); }
        if (Key.justReleased(Key.x) || Joy.bReleased) { this.throw() }
    }

    updateCollider(x, y) {
        this.x = x;
        this.y = y;
        this.collider.update(x, y);
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
            this.facing = RIGHT;
        } else if(this.xvel < 0) {
            this.currentAnimation = this.spritesheet.animations["walkLeft"];
            this.facing = LEFT;
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
                if (this.collider.tileCollisionCheck(0)) {
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
                if (this.collider.tileCollisionCheck(0)) {
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

    tileOverlapCheck(tileIndex) {
        let playerTileIndex = tileMap.pixelToTileIndex(this.x, this.y);
        return (playerTileIndex == tileIndex);
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

    drawDigTileHighlight(direction="DOWN") {

        const directionTiles = {
            "UP": this.collider.topFeeler,
            "DOWN": this.collider.bottomFeeler,
            "LEFT": this.collider.leftFeeler,
            "RIGHT": this.collider.rightFeeler
        }
        const highlightDirection = directionTiles[direction];
        //if the collider feelers are on a tile and player is pressing an arrow key, draw a highlight
        let tileIndex = tileMap.pixelToTileIndex(highlightDirection.x, highlightDirection.y);
        let tileValue = tileMap.data[tileIndex];
        if (tileValue > 0) {
            let tileX = tileMap.tileIndexToPixelX(tileIndex);
            let tileY = tileMap.tileIndexToPixelY(tileIndex);
            let tileWidth = tileMap.tileWidth;
            let tileHeight = tileMap.tileHeight;
            canvasContext.fillStyle = "rgba(255,255,255,0.5)";
            canvasContext.fillRect(tileX-view.x, tileY-view.y, tileWidth, tileHeight);
        }
    }

    checkForFallingRocks() {
        let feelers = [this.collider.bottomFeeler, this.collider.leftFeeler, this.collider.rightFeeler, this.collider.topFeeler];
        for (let i = 0; i < feelers.length; i++) {
            let tileIndex = tileMap.pixelToTileIndex(feelers[i].x, feelers[i].y);
            let tileValue = tileMap.data[tileIndex];
            if (tileValue == 5) {
                tileMap.damageTileAt(tileIndex, 25, () => { damageTileWithEffects["TILE_FALLING_ROCK"](tileIndex) });
            }
        }
    }

    getDigPropsForIndex (tileIndex) {
        return {
            spawnX: tileMap.tileIndexToPixelX(tileIndex) + tileMap.tileWidth || 0,
            spawnY: tileMap.tileIndexToPixelY(tileIndex) + tileMap.tileHeight || 0,
            startTileValue: tileMap.data[tileIndex] || 0
        }
    }

    digWithProps (startTileValue, startTileIndex, dmg) {
        let type = TILE_TYPES[startTileValue];
        tileMap.damageTileAt(
            startTileIndex,
            dmg,
            () => { damageTileWithEffects[type](startTileIndex) }
        );
    }

    dig(direction) {
        this.play("dig");
        if (!this.canDig) return;
        const { startTileIndex } = this.collider.getTileIndexAndSpawnPos(direction);
        const startTileValue = tileMap.data[startTileIndex] || 0;
        
        if (startTileValue > 0) this.digWithProps(startTileValue, startTileIndex, damageValues[startTileValue]);
    }

    hurt(damage) {
        if(this.hurtCooldown > 0){ return; }
        //TODO: blink player sprite
        this.collider.emit(particleDefinitions.hurt);
        audio.playSound(sounds[randChoice(player_damages)]);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.die();
        }
        this.hurtCooldown = this.limits.hurtCooldown;
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
        if (this.diggerang.active) return;
        if (this.inventory.ore < DIGGERANG_COST) return;

        this.inventory.ore -= DIGGERANG_COST;

        switch(this.facing){
            case RIGHT: {
                this.diggerang.x = this.x;
                this.diggerang.y = this.y;
                this.diggerang.xvel = 6; // Set the initial horizontal velocity
                this.diggerang.yvel = -3; // Set the initial vertical velocity
                this.diggerang.active = true;
                this.diggerang.returning = false;
            }
            break;
            case LEFT: {
                this.diggerang.x = this.x;
                this.diggerang.y = this.y;
                this.diggerang.xvel = -6; // Set the initial horizontal velocity
                this.diggerang.yvel = -3; // Set the initial vertical velocity
                this.diggerang.active = true;
                this.diggerang.returning = false;
            }
            break;
        }
        
      }

    helicopter() {
        if (this.helicopterCapacity <= 0) return;
        if (this.inventory.ore <= 0) return;

        this.inventory.ore--;

        this.yVel -= 0.1;
        this.yAccel -= this.speed * this.limits.hoverMultiplier;
        this.helicopterCapacity--;
        this.collider.emit(particleDefinitions.sparks);
    }

    jump() {
        this.yvel = -this.speed * this.limits.jumpMultiplier;
        this.play("jump");
        this.collider.emit(particleDefinitions.jumpPuff);
    }

    play(animationName){
   
        this.currentAnimation = this.spritesheet.animations[animationName];
  
   
    if (!this.currentAnimation.loop){
        this.currentAnimation.reset();
    }
}

}