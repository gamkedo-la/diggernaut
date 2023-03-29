class Ore {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.speed = 4;
        this.xvel = (Math.random() * 2 - 1) * this.speed;
        this.yvel = (Math.random() * 2 - 1) * this.speed; 
        this.friction = 0.7;
        this.color = "green";
    }

    draw(){
        if(!inView(this)) return;
        
        canvasContext.fillStyle = this.color;
        strokePolygon(this.x - view.x, this.y - view.y, 4, 4, ticker/10);
    }

    update(){
        if(!inView(this)) return;
        
        this.x += this.xvel;
        this.y += this.yvel;
        this.xvel *= this.friction;
        this.yVel *= this.friction; 
        
        if(this.distanceTo(player) < 40){
            this.moveTowards(player);
        }
        
        if(this.distanceTo(player) < 10){
            player.inventory.ore++;
            this.destroy();
        }
    }

    distanceTo(object){
        return Math.sqrt(Math.pow(object.x - this.x, 2) + Math.pow(object.y - this.y, 2));
    }

    moveTowards(object){
        let angle = Math.atan2(object.y - this.y, object.x - this.x);
        this.xvel += Math.cos(angle);
        this.yvel += Math.sin(angle);
    }

    destroy(){
        let index = actors.indexOf(this);
        actors.splice(index, 1);
    }
}