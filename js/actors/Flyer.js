class Flyer {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.xspeed = Math.random() + 0.05;
        this.yspeed = Math.random() + 0.05;
        this.direction = randChoice([0, 1]);
        this.viewBlocked = false;
        this.collider = new Collider(this.x, this.y, this.width, this.height, {left: 0, right: 0, top: 0, bottom: 0}, "flyer")
    }
    draw(){
        if(!inView(this)) return;
        if(this.viewBlocked){
            canvasContext.fillStyle = 'white';
            let x = this.viewBlocked.x * tileMap.tileWidth - view.x;
            let y = this.viewBlocked.y * tileMap.tileHeight - view.y;
        //the following line is for debugging, helps to see where the raycast is hitting
            //canvasContext.fillRect(x, y, tileMap.tileWidth, tileMap.tileHeight);
            //canvasContext.filLRect(this.x-view.x, this.y-view.y, 4, 4)
        }
        else{
            canvasContext.fillStyle = '#f90';
        //the following line is for debugging, helps to see if the raycast reaches the player
            //line(this.x-view.x, this.y-view.y, player.x-view.x, player.y-view.y);
        }

        strokePolygon(this.x - view.x, this.y-view.y, 8, 3, ticker/10);
        
    }
    update(){
        this.collider.update(this.x, this.y);
        this.x += ( Math.cos(ticker/(10*this.xspeed*5)) * this.xspeed ) * this.direction;
        this.y += ( Math.sin(ticker/(10*this.yspeed*10)) * this.yspeed ) * this.direction;
        if(!inView(this)) return;
        this.viewBlocked = tileMap.tileRaycast(this.x, this.y, player.x, player.y);
       if(rectCollision( this.collider, player.diggerang.collider)){
            this.kill();
       }
       if(rectCollision( this.collider, player.collider)){
        
        this.collideWithPlayer();
        ;
       }
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