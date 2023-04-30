class FallingRock {
    constructor(x,y){
        this.x = x;
        this.y = y-1;
        this.spawnY = y - 1;
        this.previousY = 0;
        this.yvel = 0;
        this.width = 32;
        this.height = 32;
        this.gravity = 0.5;
        this.yvelLimit = 5;
        this.health = 10;
        this.collider = new Collider(this.x, this.y, this.width, this.height, {left: 0, right: 0, top: 0, bottom: -1}, "fallingBrick")
    }
    draw(){
        drawTileSprite(tileSets.caveTileset, 16*5+5, this.x - view.x, this.y - view.y)
        this.collider.draw();
    }
    update(){
        if(!inView(this)) return;
        this.previousY = this.y;
        this.yvel += this.gravity;
        this.collider.update(this.x, this.y)
        if(this.yvel > this.yvelLimit) this.yvel = this.yvelLimit;
        
       this.handleCollisions();
       
       this.handleTileCollisions();
       
    }

    kill(){
        emitParticles(this.x + 16, this.y + 16, particleDefinitions.fallSparks)
        emitParticles(this.x + 16, this.y + 16, particleDefinitions.hurt)
        actors.splice(actors.indexOf(this), 1);
        audio.playSound(sounds[randChoice(rock_crumbles)])

    }

    handleCollisions(){
        this.y += this.yvel;
        this.collider.update(this.x, this.y)
        const collisionInfo = rectCollision(this.collider, player.collider);
        if(collisionInfo){
            this.resolvePlayerCollision(collisionInfo);
        }
    }

    handleTileCollisions(){
        //check tile at bottom  feeler of collider for empty space
        let tile = tileMap.getTileAtPixelPosition(this.collider.bottomFeeler.x, this.collider.bottomFeeler.y);
        const crushedTileIndex = tileMap.pixelToTileIndex(this.collider.bottomFeeler.x, this.collider.bottomFeeler.y);
        if(tile > 0){
            this.y = this.previousY;
            this.yvel = 0;
            this.collider.update(this.x, this.y)
            this.kill();
            
            if (this.y - this.spawnY >= tileMap.tileHeight) {
                tileMap.damageTileAt(crushedTileIndex, 100, () => { damageTileWithEffects[TILE_TYPES[tile]](crushedTileIndex) })
            }
        }
    }

    resolvePlayerCollision(collisionInfo){
        player.collisionInfo = collisionInfo;
        if(collisionInfo.left || collisionInfo.right){
            player.x = player.previousX;
            player.updateCollider(player.x, player.y);
            player.xvel = 0;
            if(Key.isDown(Key.z) || Joy.x){
                this.kill();
            }
        }else if (collisionInfo.top){

            player.y = player.previousY;
            player.updateCollider(player.x, player.y);
            player.yvel = Math.max(0, player.yvel);
            this.kill();
            player.hurt(5);

        } else if(collisionInfo.bottom){
            player.yvel = Math.min(0, player.yvel)
            player.y = player.previousY-1;
            player.updateCollider(player.x, player.y);
            this.health--;
            if(this.health <= 0){ this.kill(); }
            ;
            player.canJump = true;
        }
    }
}