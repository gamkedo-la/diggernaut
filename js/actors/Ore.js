class Ore {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.color = "green";
    }

    draw(){
        if(!inView(this)) return;
        
        canvasContext.fillStyle = this.color;
        strokePolygon(this.x - view.x, this.y - view.y, 4, 4, ticker/10);
    }

    update(){
        if(!inView(this)) return;
        
        if(this.distanceTo(player) < 40){
            this.moveTowards(player);
        }
    }

    distanceTo(object){
        return Math.sqrt(Math.pow(object.x - this.x, 2) + Math.pow(object.y - this.y, 2));
    }

    moveTowards(object){
        let angle = Math.atan2(object.y - this.y, object.x - this.x);
        this.x += Math.cos(angle);
        this.y += Math.sin(angle);
    }
}