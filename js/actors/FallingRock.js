class FallingRock {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.previousY = 0;
        this.yvel = 0;
        this.width = 32;
        this.height = 32;
        this.gravity = 0.5;
        this.yvelLimit = 5;
        this.collider = new Collider(this.x, this.y, this.width, this.height, {left: 0, right: 0, top: 0, bottom: -1}, "fallingBrick")
    }
    draw(){
        tileMap.drawTileSprite(caveTileset, 5, this.x - view.x, this.y - view.y)
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
        if(tile > 0){
            this.y = this.previousY;
            this.yvel = 0;
            this.collider.update(this.x, this.y)
        }
    }

    resolvePlayerCollision(collisionInfo){
        player.collisionInfo = collisionInfo;
        if(collisionInfo.left || collisionInfo.right){
            player.xvel = 0;
            if(Key.isDown(Key.z)){
                this.kill();
            }
        }else if (collisionInfo.top){
            player.y = player.previousY;
            player.yvel = Math.max(0, player.yvel);
            this.kill();
            player.hurt(5);
        } else if(collisionInfo.bottom){
            player.y = this.y - player.height;
            player.yvel = Math.min(0, player.yvel);
            player.canJump = true;
        }
        
        

    }


}