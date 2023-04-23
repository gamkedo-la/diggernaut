class Ore {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.speed = 4;
        this.xvel = (mapRNG() * 2 - 1) * this.speed;
        this.yvel = (mapRNG() * 2 - 1) * this.speed; 
        this.collider = new Collider(this.x, this.y, 4, 4, {left: 0, right: 0, top: 0, bottom: 0}, "ore");
        this.friction = 0.7;
        this.color = "green";
        this.life = 300;
    }

    draw(){
        if(!inView(this)) return;
        this.life--;
        canvasContext.fillStyle = this.color;

        if(this.life > 100){
            strokePolygon(this.x - view.x, this.y - view.y, 4, 4, ticker/10);
        } else {
            let blink = ticker % 8 > 4;
            if(blink){
                strokePolygon(this.x - view.x, this.y - view.y, 4, 4, ticker/10);
            }
        }
       
    }

    update(){
        if(!inView(this)){ this.destroy; return; }
        
        this.collider.update(this.x, this.y);
        this.x += this.xvel;
        this.y += this.yvel;
        this.xvel *= this.friction;
        this.yVel *= this.friction; 

        
        if(this.distanceTo(player) < 40){
            this.moveTowards(player);
        }
        
        if(this.distanceTo(player) < 10 && this.life < 270){
            player.inventory.ore++;
            this.destroy();
        }
        if(this.distanceTo(player.diggerang) < 90 && player.diggerang.active){
            this.moveTowards(player.diggerang, 2);
        }

        if(rectCollision(this.collider, player.diggerang.collider)){
            player.inventory.ore++;
            this.destroy();
        }

        if(this.life <= 0){
            this.destroy();
        }
    }

    distanceTo(object){
        return Math.sqrt(Math.pow(object.x - this.x, 2) + Math.pow(object.y - this.y, 2));
    }

    moveTowards(object, speed=1){
        let angle = Math.atan2(object.y - this.y, object.x - this.x);
        this.xvel += Math.cos(angle);
        this.yvel += Math.sin(angle);
    }

    destroy(){
        let index = actors.indexOf(this);
        actors.splice(index, 1);
    }
}