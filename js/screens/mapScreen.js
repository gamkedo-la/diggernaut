const mapScreen = {

    reset: function(){
        ticker = 0;
    },

    update: function (){

    },

    draw: function () {
        //draw the tilemap, 1px per tile
        clearScreen('black');
        for(let y = 0; y < tileMap.heightInTiles; y++){
            for(let x = 0; x < tileMap.widthInTiles; x++){
                let tile = tileMap.getTile(x,y);
                if(tile == 1){
                    fillRect(x,y,1,1, 'white');
                }
            }
        }
    }
}