// this code is called by ui.js
// to draw a tiny representation of
// the entire level on the side of the screen
// showing players approxmately where they are

class uiMinimap {

    constructor() {
        
        this.needsUpdating = true;

        // entire map is rendered onto a temp buffer
        this.cachedCanvas = document.createElement("CANVAS");
        this.cachedCanvas.imageSmoothingEnabled = false;
        this.cachedCanvas.style.imageRendering = "pixelated";
        this.cachedCTX = this.cachedCanvas.getContext("2d");

    }

    update() { // only run when the map data has changed

        if (!tileMap) return; // during constructor this is null

        this.width = 8;
        this.height = canvas.height;
        this.x = canvas.width - this.width;
        this.y = 0;
        this.cachedCanvas.width = tileMap.widthInTiles;
        this.cachedCanvas.height = tileMap.heightInTiles;

        let fills = ["black", "#553", "#333", "#999", "#88ff00", "magenta", "red", "yellow", "black" ]

        // FIXME this takes half a second!!!
        // we could use drawImage for 10x perf
        for(let y = 0; y < tileMap.heightInTiles; y++){
            for(let x = 0; x < tileMap.widthInTiles; x++){
                let tile = tileMap.getTileAtPosition(x,y);
                this.cachedCTX.fillStyle = fills[tile];
                this.cachedCTX.fillRect(x,y,1,1);
            }
        }

        this.needsUpdating = false;

     }

    draw() {

        // slowly render the map offscreen (lags the game severely)
        if (this.needsUpdating) this.update();

        // draw the entire map using the cached image (very fast)
        canvasContext.drawImage(this.cachedCanvas,0,0,this.cachedCanvas.width,this.cachedCanvas.height,this.x,this.y,this.width,this.height);

        // and show where the player is
        let pX = -10;
        let pY = this.height * (player.y / (tileMap.tileHeight*tileMap.heightInTiles));
        //console.log("player.y="+player.y+" pY="+pY+" map height="+tileMap.tileHeight*tileMap.heightInTiles);

        // fixme: replace with an arrow icon or flashing blip? or just the helmet?
        canvasContext.drawImage(img['placeholder-player'],0,0,16,24,this.x+pX,this.y+pY,8,12);
    }
}