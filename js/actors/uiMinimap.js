// this code is called by ui.js
// to draw a tiny representation of
// the entire level on the side of the screen
// showing players approxmately where they are

class uiMinimap {

    constructor(tileMap) {
        
        this.needsUpdating = true;

        // entire map is rendered onto a temp buffer
        this.cachedCanvas = document.createElement("CANVAS");
        this.cachedCanvas.imageSmoothingEnabled = false;
        this.cachedCanvas.style.imageRendering = "pixelated";
        this.cachedCTX = this.cachedCanvas.getContext("2d");

        this.width = 8;
        this.height = canvas.height;
        this.x = canvas.width - this.width;
        this.y = 0;
        this.cachedCanvas.width = tileMap.widthInTiles;
        this.cachedCanvas.height = tileMap.heightInTiles;
        this.fills = ["black", "#553", "#333", "#999", "#88ff00", "magenta", "red", "yellow", "black" ]

    }

    update() { // only run full update when game begins, or transitioning to pause screen

        for(let y = 0; y < tileMap.heightInTiles; y++){
            for(let x = 0; x < tileMap.widthInTiles; x++){
                let tile = tileMap.getTileAtPosition(x,y);
                this.cachedCTX.fillStyle = this.fills[tile];
                this.cachedCTX.fillRect(x,y,1,1);
            }
        }
     }

    dirtyRectUpdate(tx,ty,w,h) { 
        // runs when tiles are changed, in a rect w, h around tx, ty
        const left = Math.max(0,tx-Math.floor(w/2));
        const right = Math.min(tileMap.widthInTiles-1,tx+Math.floor(w/2));
        const top = Math.max(0,ty-Math.floor(h/2));
        const bottom = Math.min(tileMap.heightInTiles-1,ty+Math.floor(h/2));

        for(let y = top; y < bottom; y++){
            for(let x = left; x < right; x++){
                let tile = tileMap.getTileAtPosition(x,y);
                this.cachedCTX.fillStyle = this.fills[tile];
                this.cachedCTX.fillRect(x,y,1,1);
            }
        }
    }


        

    draw() {

        // draw the entire map using the cached image (very fast)
        canvasContext.drawImage(this.cachedCanvas,0,0,this.cachedCanvas.width,this.cachedCanvas.height,this.x,this.y,this.width,this.height);

        // and show where the player is
        let pX = -16;
        let pY = -8 + Math.round(this.height * (player.y / (tileMap.tileHeight*tileMap.heightInTiles)));
        let txtX = Math.round(this.x+pX);
        let txtY = Math.round(this.y+pY+13);

        // arrow icon showing player pos on map
        canvasContext.drawImage(img['minimap'],0,0,32,16,this.x+pX,this.y+pY,32,16);

        // display depth in meters
        tinyFont.drawText(Math.round(player.y/8)+"m",{x:txtX,y:txtY},0,0);
    }
}