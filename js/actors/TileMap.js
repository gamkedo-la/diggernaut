class TileMap {
    /**
     * Creates an instance of TileMap.
     *
     * @constructor
     * @param {int} [widthInTiles=100]
     * @param {int} [heightInTiles=100]
     * @param {int} [tileWidth=8]
     * @param {int} [tileHeight=8]
     */
    constructor(widthInTiles=100, heightInTiles=100, tileWidth=8, tileHeight=8){
    this.heightInTiles = heightInTiles;
    this.widthInTiles = widthInTiles;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.data = new Uint16Array(widthInTiles * heightInTiles);

    }

    getTileAtPosition(tx, ty){
        return this.data[this.widthInTiles*ty + tx];
    }

    setTileAtPosition(tx, ty, value=1){
        return this.data[this.widthInTiles*ty + tx] = value;
    }

    getIndexAtPosition(tx, ty){
        return this.widthInTiles*ty + tx;
    }

    pixelToTileID(x, y){
        return this.data[this.pixelToTileIndex(x - this.worldPosition.x * this.tileWidth, y - this.worldPosition.y * this.tileHeight)];
    }

    tileIndexToPixelX(index){
        return (index % this.widthInTiles) * this.tileWidth;
    }

    tileIndexToPixelY(index){
        return Math.floor(index / this.widthInTiles) * this.tileHeight;
    }
    tileIndexToCoords(index){
        return {
            x: (index % this.widthInTiles) * this.tileWidth,
            y: Math.floor(index / this.widthInTiles) * this.tileHeight
        }
    }
    

    pixelToTileIndex(x, y){
        let tx = Math.floor(x / this.tileWidth);
        let ty = Math.floor(y / this.tileHeight);
        return this.getIndexAtPosition(tx, ty);
    }

    pixelToTileGrid(x, y){
    return {
            x: Math.floor(x / this.tileWidth),
            y: Math.floor(y / this.tileHeight)
            }
    }
    //the following functions meant for use when you want to dynamically add tiles to the world. 
    //also good for prototyping before you have a map.
    tileDrawLine( x1, x2, y1, y2, value ) {
        
        var x1 = x1|0;
        var x2 = x2|0;
        var y1 = y1|0;
        var y2 = y2|0;
        var value = value|0;

        var dy = (y2 - y1);
        var dx = (x2 - x1);
        var stepx, stepy;

        if (dy < 0) { dy = -dy; stepy = -1;
        } else { stepy = 1; }

        if (dx < 0) { dx = -dx; stepx = -1;
        } else { stepx = 1; }

        dy <<= 1;        // dy is now 2*dy
        dx <<= 1;        // dx is now 2*dx

        this.setTileAtPosition(x1, y1, value);

        if (dx > dy) {
        var fraction = dy - (dx >> 1);  // same as 2*dy - dx
        while (x1 != x2) {
            if (fraction >= 0) {
            y1 += stepy;
            fraction -= dx;          // same as fraction -= 2*dx
            }
            x1 += stepx;
            fraction += dy;              // same as fraction -= 2*dy
            this.setTileAtPosition(x1, y1, value);
        }
        ;
        } else {
        fraction = dx - (dy >> 1);
        while (y1 != y2) {
            if (fraction >= 0) {
            x1 += stepx;
            fraction -= dy;
            }
            y1 += stepy;
            fraction += dx;
            this.setTileAtPosition(x1, y1, value);
        }
        }

    }

    tileFillRect( tx, ty, width, height, value ){
        for(let i = ty; i <= ty + height; i++){
            let start = this.widthInTiles * i + tx;
            let finish = start + width+1;
            this.data.fill(value, start, finish);
        }
    }

    tileFillRectRandom(tx, ty, width, height, rangeStart, rangeEnd){
        for(let i = tx; i <= tx + width; i++){
            for(let j = ty; j <= ty + height; j++){
                this.data[j * this.widthInTiles + i] = Math.floor( Math.random() * (rangeEnd-rangeStart) ) + rangeStart
            }
        }
    }

    tileFillMapChunk(array, width, height, destinationX, destinationY){
        //todo: check if array is too big for map
        for(let i = 0; i < width; i++){
            for(let j = 0; j < height; j++){
                this.data[(j+destinationY) * this.widthInTiles + (i+destinationX)] = array[j * width + i];
            }
        }
    }

    tileFillCircle( tx, ty, radius, value ){
        let rad = Math.floor(radius);
        for(let y = -rad; y <= rad; y++){
            for(let x = -rad; x <=rad; x++){
                if(x*x+y*y <= rad*rad){
                    this.data[this.getIndexAtPosition(tx+x, ty+y)] = value;
                }
                
            }
        }
    }

    draw(){
        let left = Math.floor(view.x/this.tileWidth);
        let right = Math.ceil((view.x+view.width)/this.tileWidth);
        let top = Math.floor(view.y/this.tileHeight);
        let bottom = Math.ceil((view.y+view.height)/this.tileHeight);
    
        for(let i = left; i < right; i++){
            for(let j = top; j < bottom; j++){    
                    canvasContext.drawImage(
                        img['basic-tiles'],
                        //TODO: pull out into drawTile function
                        //TODO: make tileset class that stores tileset image and tile size
                        //16 is the number of tiles in a row
                        (this.data[j*this.widthInTiles + i] % 10) * this.tileWidth,
                        Math.floor(this.data[j*this.widthInTiles + i] / 10) * this.tileHeight,
                        this.tileWidth,
                        this.tileHeight,
                        (i) * this.tileWidth - view.x,
                        (j) * this.tileHeight - view.y,
                        this.tileWidth,
                        this.tileHeight
                    );   
            }
        }
    }

    insertPrefab(prefab, x, y){
        for(let i = 0; i < prefab.width; i++){
            for(let j = 0; j < prefab.height; j++){
                this.setTileAtPosition(x+i, y+j, prefab.data[j*prefab.width + i]);
            }
        }
    }

}