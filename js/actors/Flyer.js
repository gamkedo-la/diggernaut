class Flyer {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.previousX = this.x;
        this.previousY = this.y;
        this.currentAnimation = "idle";
        this.width = 16;
        this.height = 16;
        this.xvel = 0;
        this.yvel = 0;
        this.yAccel = 0;
        this.xAccel = 0;
        this.state = "idle";
        this.limits = {
            maxXVel: 1,
            maxYVel: 3,
            minXVel: -1,
            minYVel: -1,
            maxYAccel: 0.1,
            minYAccel: -0.1,
            maxXAccel: 0.1,
            minXAccel: -0.1,
        }
        this.targetOffset = {
            x: 0,
            y: -100
        }
        this.direction = randChoice([0, 1]);
        this.viewBlocked = false;
        this.drawOffset = {
            x: 8,
            y: 8
        }
        this.collider = new Collider(this.x, this.y, this.width, this.height, {left: 20, right: 20, top: 20, bottom: 20}, "flyer")
        this.spritesheet = new SpriteSheet({
            image: img['bat'],
            frameWidth: 32,
            frameHeight: 32,
            animations: {
                idle: {
                    frames: [0,1],
                    frameRate: 8
                },
                attack: {
                    frames: [2,3],
                    frameRate: 12
                }
            }
        })
        this.currentAnimation = this.spritesheet.animations["idle"];
    }
    states = {
        idle: function(){
            this.play( "idle" );
            this.xAccel += rand(-0.01, 0.01);
            this.yAccel += rand(-0.01, 0.01);
        },
        seekPlayer: function(){
            this.play( "idle" );
            const xDist = player.x + this.targetOffset.x - this.x;
            const yDist = player.y + this.targetOffset.y - this.y;
            const angle = Math.atan2(yDist, xDist);
            this.xAccel = Math.cos(angle) * 0.1;
            this.yAccel = Math.sin(angle) * 0.1;
        },
        attack: function(){
            //dive bomb the player
            this.play( "attack" );
            const xDist = player.x - this.x;
            const yDist = player.y - this.y;
            const angle = Math.atan2(yDist, xDist);
            this.xAccel = Math.cos(angle) * 0.2;
            this.yAccel = Math.sin(angle) * 0.2;
        },
    }

    draw(){
        if(!inView(this)) return;
        //canvasContext.fillStyle = "orange";
        //strokePolygon(this.x - view.x + 8, this.y-view.y + 8, 8, 3, ticker/10);

        this.currentAnimation.render({
            x: Math.floor(this.x-view.x) -this.drawOffset.x, 
            y: Math.floor(this.y-view.y) -this.drawOffset.y,
            width: 32,
            height: 32
        })

        //this.collider.draw();
    }
    update(){
        if(!inView(this)) return;
        this.currentAnimation.update();
        this.collider.update(this.x, this.y);
        this.previousX = this.x;
        this.previousY = this.y;

        this.states[this.state].call(this); 

        this.avoidWalls();
        this.handleWalls();
        this.applyForces();
        

        this.viewBlocked = tileMap.tileRaycast(this.x, this.y, player.x, player.y);
        if(!this.viewBlocked){
            if(this.distanceToPlayer() < 150){
                this.state = "seekPlayer";
            }
            if(this.distanceToPlayer() < 120) {
                this.state = "attack";
            }
        }
        
        else {
            this.state = "idle";
        }

        if(rectCollision( this.collider, player.diggerang.collider)){
            this.kill();
        }
        if(rectCollision( this.collider, player.collider)){
        this.collideWithPlayer();
        }
        
        

        this.x += this.xvel;
        this.y += this.yvel;
    }

    applyForces(){
        
        this.xvel += this.xAccel;
        this.yvel += this.yAccel;
        if (this.xvel > this.limits.maxXVel) { this.xvel = this.limits.maxXVel; }
        if (this.xvel < this.limits.minXVel) { this.xvel = this.limits.minXVel; }
        if (this.yvel > this.limits.maxYVel) { this.yvel = this.limits.maxYVel; }
        if (this.yvel < this.limits.minYVel) { this.yvel = this.limits.minYVel; }
        if (this.xAccel > this.limits.maxXAccel) { this.xAccel = this.limits.maxXAccel; }
        if (this.xAccel < this.limits.minXAccel) { this.xAccel = this.limits.minXAccel; }
    }

    avoidWalls(){
        let left = this.collider.leftFeeler;
        let right = this.collider.rightFeeler;
        let top = this.collider.topFeeler;
        let bottom = this.collider.bottomFeeler;
        if(tileMap.collidesWith(left.x, left.y)){
            this.xAccel += 0.01;
            this.xvel *= .9;
        }
        if(tileMap.collidesWith(right.x, right.y)){
            this.xAccel -= 0.01;
            this.xvel *= .9;

        }
        if(tileMap.collidesWith(top.x, top.y)){
            this.yAccel += 0.01;
            this.yvel *= .9;
        }
        if(tileMap.collidesWith(bottom.x, bottom.y)){
            this.yAccel -= 0.01;
            this.yvel *= .9;
        }
    }

    handleWalls(){
        if(this.collider.tileCollisionCheck(0)){
            this.x = this.previousX; 
            this.y = this.previousY;
            this.collider.update(this.x, this.y);
            this.xAccel = -this.xAccel;
            this.yAccel = -this.yAccel;
            this.yvel = -this.yvel;
            this.xvel = -this.xvel;

        }
    }

    distanceToPlayer(){
        return Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2));
    }

    kill(){
        emitParticles(this.x, this.y, particleDefinitions.fallSparks)
        emitParticles(this.x, this.y, particleDefinitions.hurt)
        audio.playSound(sounds["player_damage_big_1"], 0, 0.5, 0.6, false);
        actors.splice(actors.indexOf(this), 1);
    }

    collideWithPlayer(){
        let repelX = normalize(this.x - player.x, -player.width/2, player.width/2);
        let repelY = normalize(this.y - player.y, -player.height/2, player.height/2);
        
        if(player.y >= this.y ) {
            player.hurt(1)
            player.stop();
            player.xAccel = -repelX * 2;
            player.yAccel = -repelY * 2;
        
        }
        else{ 
            this.kill()
            //player.stop();
            //player.xAccel = -repelX * 2;
            player.yvel = 0;
            player.yAccel = player.limits.minYAccel * 2;
        }
        
    }

    play(animationName){
   
        this.currentAnimation = this.spritesheet.animations[animationName];
  
   
        if (!this.currentAnimation.loop){
            this.currentAnimation.reset();
        }
    }

}