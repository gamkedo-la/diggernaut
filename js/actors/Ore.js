class Ore {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.speed = 9;
        this.previouxX = this.x;
        this.previousY = this.y;
        this.xvel = (mapRNG() * 2 - 1) * this.speed;
        this.yvel = (mapRNG() * -1) * this.speed * 2; 
        this.collider = new Collider(this.x, this.y, 4, 4, {left: 0, right: 0, top: 0, bottom: 0}, "ore");
        this.friction = 0.9;
        this.gravity = .9;
        this.color = COLORS[8];
        this.life = 300;
    }

    draw(){
        if(!inView(this)) return;
        this.life--;
        canvasContext.save();
        canvasContext.fillStyle = this.color;
        let drawX = Math.floor(this.x - view.x);
        let drawY = Math.floor(this.y - view.y);
        if(this.life > 100){
            canvasContext.fillStyle = COLORS[8]
            fillRect(drawX, drawY, 5, 5);
            this.drawGlow(drawX-16, drawY-16);
        } else {
            let blink = ticker % 8 > 4;
            if(blink){
                canvasContext.fillStyle = COLORS[8]
                fillRect(drawX, drawY, 5, 5);
                this.drawGlow(drawX-16, drawY-16);
            }
        }
        canvasContext.restore();
       
    }

    update(){
        if(!inView(this)){ this.destroy; return; }
        this.previousX = this.x;
        this.previousY = this.y;
        this.collider.update(this.x, this.y);
        this.x += this.xvel;
        this.y += this.yvel;
        
        
        this.xvel *= this.friction;
        this.yvel *= this.friction; 
        this.yvel += this.gravity;

        emitParticles(this.x, this.y-2, particleDefinitions.oreSparks);

        
        if(this.distanceTo(player) < 50 && this.life < 270){
            this.moveTowards(player);
        }
        
        if(this.distanceTo(player) < 10 && this.life < 270){
            audio.playSound(sounds["clink"]);
            player.inventory.ore++;
            player.shieldBoost(0.25);
            this.destroy();
        }
        if(this.distanceTo(player.diggerang) < 90 && player.diggerang.active){
            this.moveTowards(player.diggerang, 2);
        }

        if(rectCollision(this.collider, player.diggerang.collider)){
            player.inventory.ore++;
            audio.playSound(sounds["clink"]);
            this.destroy();
        }

        
        if(tileMap.collidesWith(this.x, this.y)){
            this.x = this.previousX; 
            this.y = this.previousY;
            this.xvel = -this.xvel;
            this.yvel = -this.yvel * 0.2;
            if(tileMap.collidesWith(this.x, this.y)){
                this.destroy();
            }
        }

        if(this.life <= 0){
            this.destroy();
        }
    }

    drawGlow(x,y){
        bufferContext.save();
        bufferContext.globalCompositeOperation = "screen";
        drawTileSprite(tileSets.glow_32px,
            rand(0,1) < .1 ? randInt(0, 3) : 0, 
             x,
             y,
             bufferContext);
        bufferContext.restore();
    }

    distanceTo(object){
        return Math.sqrt(Math.pow(object.x - this.x, 2) + Math.pow(object.y - this.y, 2));
    }

    moveTowards(object, speed=1){
        let angle = Math.atan2(object.y - this.y, object.x - this.x);
        this.xvel += Math.cos(angle)*3+ Math.random()-0.5;
        this.yvel += Math.sin(angle)*3+ Math.random()-0.5;
    }

    destroy(){
        let index = actors.indexOf(this);
        actors.splice(index, 1);
    }
}