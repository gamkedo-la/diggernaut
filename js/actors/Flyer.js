class Hornet {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    draw(){
        strokePolygon(this.x, this.y, 4, 3, ticker/10);
    }
    update(){

    }
}