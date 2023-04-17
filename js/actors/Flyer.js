class Flyer {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.viewBlocked = false;
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

        strokePolygon(this.x - view.x, this.y-view.y, 4, 3, ticker/10);
        
    }
    update(){
        if(!inView(this)) return;
        this.viewBlocked = tileMap.tileRaycast(this.x, this.y, player.x, player.y);
    }
}