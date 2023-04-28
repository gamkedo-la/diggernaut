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
    this.damagedTiles = {} // {[tileIndex]: 10, [tileIndex]: 35}
    this.shakingTiles = {} // {[tileIndex]: {timeRemaining: 0, callback: callbackFunction, shake: {x: 0, y: 0}}}
    this.autoTileData = [];
    this.standardShakeTime = 7;
    this.explosiveShakeTime = 42;
    this.screenShakeTime = 0;
    this.whiteExplosionFrames = [0, 2, 5, 6, 10, 11, 12, 17, 18, 19, 20, 26, 27, 28, 29, 30, 37, 38, 39, 40, 41, 42]
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

    getTileAtPixelPosition(x, y){
        return this.data[this.pixelToTileIndex(x, y)];
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
    
    //tileRaycast is a function that takes a start point and an end point in pixels and returns the first tile it hits.
    tileRaycast(x1, y1, x2, y2){
        let tx1 = Math.floor(x1 / this.tileWidth);
        let ty1 = Math.floor(y1 / this.tileHeight);
        let tx2 = Math.floor(x2 / this.tileWidth);
        let ty2 = Math.floor(y2 / this.tileHeight);
        let dx = Math.abs(tx2 - tx1);
        let dy = Math.abs(ty2 - ty1);
        let sx = (tx1 < tx2) ? 1 : -1;
        let sy = (ty1 < ty2) ? 1 : -1;
        let err = dx - dy;
        let e2;
        let x = tx1;
        let y = ty1;
        let index = this.getIndexAtPosition(x, y);
        while (true) {
            if (this.data[index] !== 0) {
                return {x: x, y: y, index: index};
            }
            if (x === tx2 && y === ty2) {
                break;
            }
            e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x += sx;
            }
            if (e2 < dx) {
                err += dx;
                y += sy;
            }
            index = this.getIndexAtPosition(x, y);
        }
        return false;
        //return {x: x, y: y, index: index};
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
//also good for prototyping or procedural generation.
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
        for(let i = tx; i <= tx + width; i++){
            for(let j = ty; j <= ty + height; j++){
                if(Array.isArray(value)){
                    value = randChoice(value);
                }
                this.data[j * this.widthInTiles + i] = value;
            }
        }
    }

    tileFillRectRandom(tx, ty, width, height, rangeStart, rangeEnd){
        for(let i = tx; i <= tx + width; i++){
            for(let j = ty; j <= ty + height; j++){
                this.data[j * this.widthInTiles + i] = Math.floor( mapRNG() * (rangeEnd-rangeStart) ) + rangeStart
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
                let tile;
                if(Array.isArray(value)){
                    tile = randChoice(value);
                }else {tile = value;}
                if(x*x+y*y <= rad*rad){
                    this.data[this.getIndexAtPosition(tx+x, ty+y)] = tile;
                }
                
            }
        }
    }
//-=============================================================================
    draw(){
        const left = Math.floor(view.x/this.tileWidth);
        const right = Math.ceil((view.x+view.width)/this.tileWidth);
        const top = Math.floor(view.y/this.tileHeight);
        const bottom = Math.ceil((view.y+view.height)/this.tileHeight);

        // const dx = this.screenShakeTime > 0 ? screenShake(this.screenShakeTime): 0;
        // const dy = this.screenShakeTime > 0 ? screenShake(this.screenShakeTime): 0;

        for(let i = left; i < right; i++){
            for(let j = top; j < bottom; j++){    
                const index = this.getIndexAtPosition(i, j)
                
                this.drawTile(caveTileset, this.autoTileData[index], i, j)
                this.drawDamagedTiles(index, i, j);
                this.drawFlashingTiles(index, i, j);
            }
        }
    }

    update() {
        if (this.screenShakeTime > 0) {
            this.screenShakeTime--;
            screenShake(this.screenShakeTime)
        }
        
        let left = Math.floor(view.x/this.tileWidth);
        let right = Math.ceil((view.x+view.width)/this.tileWidth);
        let top = Math.floor(view.y/this.tileHeight);
        let bottom = Math.ceil((view.y+view.height)/this.tileHeight);
        
    
        for(let x = left; x < right; x++){
            for(let y = top; y < bottom; y++){

                let index = this.getIndexAtPosition(x, y);

                //take care of damaged tiles, destroy if dead
                if (this.damagedTiles[index] >= 100) {
                    let type = TILE_TYPES[this.data[index]];
                    destroyTileWithEffects[type](index);
                    ui.miniMap.dirtyRectUpdate(x, y, 6, 6)
                    this.updateAutoTiles(left, top, right, bottom);
                }

                //handle timers on shaking tiles
                if (this.shakingTiles[index]) {
                    if (this.shakingTiles[index].timeRemaining > 0) {
                        this.shakingTiles[index].shake.x = randChoice([-1, 1]);
                        this.shakingTiles[index].shake.y = randChoice([-1, 1]);
                        this.shakingTiles[index].timeRemaining--;
                    } else {
                        this.shakingTiles[index].callback(this.damagedTiles[index] || 100);
                        delete this.shakingTiles[index];
                    }    
                }

            }
        }
       
    }

    drawTile(tileset, tileData, tx, ty){
        let index = this.getIndexAtPosition(tx, ty);
        let dx = this.shakingTiles[index] ? this.shakingTiles[index].shake.x : 0;
        let dy = this.shakingTiles[index] ? this.shakingTiles[index].shake.y : 0;
        canvasContext.drawImage(
            tileset.image,
            (tileData % tileset.tileColumns) * this.tileWidth,
            Math.floor(tileData / tileset.tileColumns) * this.tileHeight,
            this.tileWidth,
            this.tileHeight,
            tx * this.tileWidth -  view.x + dx,
            ty * this.tileHeight - view.y + dy,
            this.tileWidth,
            this.tileHeight
        );
    }
    //for drawing from the tileset at a non-grid position
    drawTileSprite(tileset, tileData, x, y){
        canvasContext.drawImage(
            tileset.image,
            (tileData % tileset.tileColumns) * this.tileWidth,
            Math.floor(tileData / tileset.tileColumns) * this.tileHeight,
            this.tileWidth,
            this.tileHeight,
            x,
            y,
            this.tileWidth,
            this.tileHeight
        );
    }

    drawDamagedTiles(index, x, y) {
        if(this.data[index] === TILE_EMPTY){ return; }
        if(!this.damagedTiles[index]){ return; }
        //TODO:  make a damaged tileset strip and just call drawTile() from here
            let damage = this.damagedTiles[index]/100;
            canvasContext.save();
            canvasContext.fillStyle = `rgba(255, 0, 0, ${damage})`;
            canvasContext.fillRect(
                x * this.tileWidth - view.x,
                y * this.tileHeight - view.y,
                this.tileWidth,
                this.tileHeight
            );
            canvasContext.restore();
    }

    shakeScreen(time=null) {
        this.screenShakeTime = time || SCREEN_SHAKE_TIME;
    }

    updateAutoTiles(sx, sy, width, height){
        const dirs = {
            up: 1,
            left: 2,
            down: 8, 
            right: 4
        }

        //loop over tilemap.data, check for tiles Up, Down, Left, Right of current tile
        //generate a bitmask based on which tiles are present
        //use bitmask to look up tile in autotileset
        //set tilemap.data to autotile index
        for(let y = sy; y < height; y++){ 
            for(let x = sx; x < width; x++){
                let index = this.getIndexAtPosition(x, y);
                //bitmask will become the column lookup in the autotileset
                let bitmask = 0b0;

                if(this.data[this.getIndexAtPosition(x, y-1)] === this.data[index]){ bitmask += dirs.up; }
                if(this.data[this.getIndexAtPosition(x-1, y)] === this.data[index]){ bitmask += dirs.left; }
                if(this.data[this.getIndexAtPosition(x, y+1)] === this.data[index]){ bitmask += dirs.down; }
                if(this.data[this.getIndexAtPosition(x+1, y)] === this.data[index]){ bitmask += dirs.right; }
                //the original tile type is the row lookup in the autotileset
                //autotileset is arranged in rows of 16 tiles, each row is a different tile type
                this.autoTileData[index] = this.data[index] * 16 + bitmask;
            }
        }
    }

    updateAutoTilesOnScreen(){
        let left = Math.floor(view.x/this.tileWidth);
        let right = Math.ceil((view.x+view.width)/this.tileWidth);
        let top = Math.floor(view.y/this.tileHeight);
        let bottom = Math.ceil((view.y+view.height)/this.tileHeight);
        this.updateAutoTiles(left, top, right-left, bottom-top);
    }
                
            
    drawFlashingTiles(index, x, y) {
        if ( this.data[index] === TILE_EXPLOSIVE &&
            this.shakingTiles[index] &&
            this.whiteExplosionFrames.includes(this.shakingTiles[index].timeRemaining) )
        { 
            canvasContext.save();
            canvasContext.fillStyle = 'white';
            canvasContext.fillRect(
                x * this.tileWidth - view.x,
                y * this.tileHeight - view.y,
                this.tileWidth,
                this.tileHeight
            );
            canvasContext.restore();
        }
    }

    insertPrefab(prefab, x, y){
        for(let i = 0; i < prefab.width; i++){
            for(let j = 0; j < prefab.height; j++){
                this.setTileAtPosition(x+i, y+j, prefab.data[j*prefab.width + i]);
            }
        }
    }

    damageTileAt (tileIndex, damage, callback) {
        
        if (!this.damagedTiles[tileIndex]) {
            this.damagedTiles[tileIndex] = 0;
        }
        
        if (this.damagedTiles[tileIndex] < 100) {
            this.shakingTiles[tileIndex] = {
                timeRemaining: this.data[tileIndex] === TILE_EXPLOSIVE ? this.explosiveShakeTime : this.standardShakeTime,
                callback,
                shake: { x: randChoice([-1,1]), y: randChoice([-1,1]) }
            };
        }

        this.damagedTiles[tileIndex] += damage;
        return this.damagedTiles[tileIndex];
    }

    replaceTileAt (tileIndex, tileType) {
        this.data[tileIndex] = tileType;
        delete this.damagedTiles[tileIndex];
        delete this.shakingTiles[tileIndex];
    }

    getXinTiles(x){
        return Math.floor(x/this.tileWidth);
    }

    getYinTiles(y){
        return Math.floor(y/this.tileHeight);
    }

    getCollisionNormal(x, y) {
        // Calculate the normal based on the neighboring tiles
        const left = this.collidesWith(x - 1, y);
        const right = this.collidesWith(x + 1, y);
        const up = this.collidesWith(x, y - 1);
        const down = this.collidesWith(x, y + 1);
    
        let normalX = left ? 1 : (right ? -1 : 0);
        let normalY = up ? 1 : (down ? -1 : 0);
    
        // Normalize the normal vector
        if (normalX === 0 && normalY === 0) {
            normalX = 1;
            normalY = 0;
          } else {
        const length = Math.sqrt(normalX ** 2 + normalY ** 2);
        normalX /= length;
        normalY /= length;
          }
    
        return { x: normalX, y: normalY };
    }

    collidesWith(x, y) {
        //const tileCoords = this.getTileCoordsAtPosition(x, y);
        const tileIndex = this.pixelToTileIndex(x,y);
        return this.data[tileIndex] !== TILE_EMPTY;
    }

    collidesWithPoint(point){
        return this.collidesWith(point.x, point.y);
    }

}
    


