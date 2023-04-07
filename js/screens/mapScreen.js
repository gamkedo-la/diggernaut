const mapScreen = {

    reset: function(){
        ticker = 0;
    },

    scrollOffset: 0,

    update: function (){
        stats.domElement.style.display = 'none';
        if(Key.justReleased(Key.m)){signal.dispatch('gotoPlay')}
        if(Key.isDown(Key.UP)){this.scrollOffset-=10;}
       // if(this.scrollOffset < 0){this.scrollOffset = 0;}
        if(Key.isDown(Key.DOWN)){this.scrollOffset+=10;}
    },

    draw: function () {
        //draw the tilemap, 1px per tile
        clearScreen('black');
        
        let fills = ["black", "#553", "#333", "#999", "#88ff00", "magenta", "red", "yellow", "black" ]
        for(let y = 0; y < tileMap.heightInTiles; y++){
            for(let x = 0; x < tileMap.widthInTiles; x++){

                xOffset = 15 + Math.floor(y / canvas.height) * (tileMap.widthInTiles + 3);
                yOffset = ( (y - this.scrollOffset) % (canvas.height) );

                let tile = tileMap.getTileAtPosition(x,y);
                if(tile > 0){
                   
                    canvasContext.fillStyle = fills[tile];
                    fillRect(
                        xOffset + x,
                        10 + yOffset,
                        1,1, 
                        );
                }
            }
        }
    }
}