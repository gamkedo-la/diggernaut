const mapScreen = {

    reset: function(){
        this.scrollOffset = 0;
        ticker = 0;
    },

    scrollOffset: 0,
    columnsInView: 12,
    spaceBetweenColumns: 3,

    update: function (){
        stats.domElement.style.display = 'none';
        if(Key.justReleased(Key.m)){signal.dispatch('gotoPlay')}
        if(Key.isDown(Key.UP)){this.scrollOffset-=10;}
       // if(this.scrollOffset < 0){this.scrollOffset = 0;}
        if(Key.isDown(Key.DOWN)){this.scrollOffset+=10;}
    },

    draw: function () {
        //calculate how many columns to draw
        let totalYView = 12 * canvas.height;
        //calculate how many rows of tiles we can draw in columnsToDraw
        
        clearScreen('black');
        let fills = ["black", "#553", "#333", "#999", "#88ff00", "magenta", "red", "yellow", "black" ]

        for(let y = this.scrollOffset; y < totalYView + this.scrollOffset; y++){
            for(let x = 0; x < tileMap.widthInTiles; x++){

                xOffset = 15 + Math.floor( (y - this.scrollOffset) / canvas.height) * (tileMap.widthInTiles + this.spaceBetweenColumns);
                yOffset = ( (y - this.scrollOffset) % (canvas.height) );

                let tile = tileMap.getTileAtPosition(x,y);
                if(tile > 0){
                   
                    canvasContext.fillStyle = fills[tile];
                    fillRect(
                        xOffset + x,
                        yOffset,
                        1,1, 
                        );
                }
            }
        }
    }
}