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
        this.collider = new Collider(this.x, this.y, this.width, this.height, {left: 0, right: 0, top: 0, bottom: 1}, "fallingBrick")
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
        //handle X collision
        if(rectCollision(this.collider, player.collider)){
            this.collider.update(this.x, this.y)
            this.resolvePlayerCollision();
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

    resolvePlayerCollision(){
        let repelX = normalize(this.x - player.x, -player.width/2, player.width/2);
        let repelY = normalize(this.y - player.y, -player.height/2, player.height/2);
        if(player.collider.topFeeler.y >= this.y ) {
            player.hurt(1)
            //player.stop();
            player.xAccel = -repelX * 2;
            player.yAccel = -repelY * 2;
            this.kill();
        }else {
            
        }
    }


}