class Flyer {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.previousX = this.x;
        this.previousY = this.y;
        this.width = 16;
        this.height = 16;
        this.xvel = 0;
        this.yvel = 0;
        this.yAccel = 0;
        this.xAccel = 0;
        this.limits = {
            maxXVel: 1,
            maxYVel: 1,
            minXVel: -1,
            minYVel: -1,
            maxYAccel: 0.1,
            minYAccel: -0.1,
            maxXAccel: 0.1,
            minXAccel: -0.1,
        }
        this.direction = randChoice([0, 1]);
        this.viewBlocked = false;
        this.collider = new Collider(this.x, this.y, this.width, this.height, {left: 20, right: 20, top: 20, bottom: 20}, "flyer")
    }
    states = {
        idle: function(){
            //random flyabout
        },
        attack: function(){
            //move towards player
        }
    }

    draw(){
        if(!inView(this)) return;
        canvasContext.fillStyle = "orange";
        strokePolygon(this.x - view.x + 8, this.y-view.y + 8, 8, 3, ticker/10);
        this.collider.draw();
    }
    update(){
        this.xAccel = mapRNG() * 0.2 - 0.1;
        this.yAccel = mapRNG() * 0.2 - 0.1;
        this.collider.update(this.x, this.y);
        this.applyForces();
        this.x += this.xvel;
        this.y += this.yvel;
        // this.x += ( Math.cos(ticker/(10*this.xspeed*5)) * this.xspeed ) * this.direction;
        // this.y += ( Math.sin(ticker/(10*this.yspeed*10)) * this.yspeed ) * this.direction;
        if(!inView(this)) return;
        this.viewBlocked = tileMap.tileRaycast(this.x, this.y, player.x, player.y);
       if(rectCollision( this.collider, player.diggerang.collider)){
            this.kill();
       }
       if(rectCollision( this.collider, player.collider)){
        this.collideWithPlayer();
       }

    }

    applyForces(){
        this.previousX = this.x;
        this.previousY = this.y;
        this.xvel += this.xAccel;
        this.yvel += this.yAccel;
        if (this.xvel > this.limits.maxXVel) { this.xvel = this.limits.maxXVel; }
        if (this.xvel < this.limits.minXVel) { this.xvel = this.limits.minXVel; }
        if (this.yvel > this.limits.maxYVel) { this.yvel = this.limits.maxYVel; }
        if (this.yvel < this.limits.minYVel) { this.yvel = this.limits.minYVel; }
        if (this.xAccel > this.limits.maxXAccel) { this.xAccel = this.limits.maxXAccel; }
        if (this.xAccel < this.limits.minXAccel) { this.xAccel = this.limits.minXAccel; }
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

}