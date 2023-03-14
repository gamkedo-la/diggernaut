var gameScreen = {
    box: {
        x: 0,
        y: 0,
    },

    timerbox: {
        x: 0,
        y: 0,
        width: 320,
        height: 10
    },

    hitCounter: 0,
    reset: function () {
        this.box.x = 0;
        this.box.y = 0;
        this.timerbox.width = 320;
        this.hitCounter = 0;
    },

    player: new Player(canvas.width/2, canvas.height/2),

    draw: function () {
        //clear the background
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        //feedback! draw a polygon for how many hits you've made
        for(let i = 0; i < this.hitCounter; i++){
            canvasContext.strokeStyle = `
            rgb(
                ${Math.floor(255*Math.sin(ticker/300*i))},
                ${Math.floor(255*Math.cos(ticker/100*i/20))},
                ${Math.floor(255*Math.sin(ticker/60))})`;

            strokePolygon(canvas.width/2, canvas.height/2, 3*i, 7, ticker/100*i/2);
            
        }

        //draw the map
        this.drawMapChunks();

        //draw the counter
        tinyFont.drawText(`player:  x: ${this.player.x} y: ${this.player.y}`, { x: 10, y: 12 }, 0, 0);
        this.player.draw();
    },
    update: function () {
        if(Key.justReleased(Key.z)){ 
            this.hitCounter += 1; 
            audio.playSound(loader.sounds.test1);
        }
        this.box.x = canvas.width/2 - 5;
        this.box.y = canvas.height/2 - 5;
        this.box.x += Math.sin(ticker/10) * 50;
        this.box.y += Math.cos(ticker/10) * 50;
        this.followPlayer();
        this.handlePlayerInput();
        this.player.update();
        this.updateMapChunkPositions();
    },

    handlePlayerInput: function () {
        if (Key.isDown(Key.LEFT)) {
            this.player.moveLeft();
        }   
        if (Key.isDown(Key.RIGHT)) {
            this.player.moveRight();
        }
        if (Key.isDown(Key.UP)) {
            this.player.moveUp();
        }
        if (Key.isDown(Key.DOWN)) {
            this.player.moveDown();
        }
        if (Key.isDown(Key.SPACE)) {
            this.player.stop();
        }
    },

    drawMapChunks: function () {
        for (let i = 0; i < mapChunks.length; i++) {
            this.drawTileMap(mapChunks[i]);
        }
    },
    
    drawTileMap: function (tileMap) {
        let fills = ['Black', 'DarkSlateGray', 'DimGray', 'Gray'];
        for (let i = 0; i < tileMap.data.length; i++) {
            let tile = tileMap.data[i];
            let x = i % tileMap.widthInTiles;
            let y = Math.floor(i / tileMap.widthInTiles);
            let tileX = (x + tileMap.worldPosition.x) * tileMap.tileWidth;
            //create parallax effect in y axis for tiles closer to the left and right edges of the screen
            let parallax = Math.abs(tileX - canvas.width/2) / (canvas.width/2) * 30;
            let tileY = (y + tileMap.worldPosition.y) * tileMap.tileHeight;
            canvasContext.fillStyle = fills[tile]
            if(inView(tileX, tileY)){
                canvasContext.fillRect(tileX - view.x, tileY - view.y - parallax, tileMap.tileWidth, tileMap.tileHeight);
            }
            
        }
    },

    updateMapChunkPositions: function () {
        for (let i = 0; i < mapChunks.length; i++) {
            //mapChunk.worldPosition is the top left corner of the chunk in tile units
            //bottom edge of the chunk is worldPosition.y + heightInTiles

            //if the bottom edge in pixels is off the top of the screen, move it under all the other chunks
            let chunk = mapChunks[i];
            let bottomEdge = (chunk.worldPosition.y + chunk.heightInTiles) * chunk.tileHeight;
            if (bottomEdge - view.y < 0) {
                //find total height of all chunks
                let totalHeight = 0;
                for (let j = 0; j < mapChunks.length; j++) {
                    totalHeight += mapChunks[j].heightInTiles
                }
                //totalHeight is now the total height of all chunks in tile units, less the height of the chunk we're moving
                totalHeight -= chunk.heightInTiles;
                //move the chunk to the bottom of the map
                chunk.worldPosition.y += totalHeight;
                console.log('moved chunk')
            }
        }
    },


    followPlayer: function () {
        //view.x = this.player.x - canvas.width / 2;
        view.y = this.player.y - canvas.height / 2;
        view.x = Math.floor(view.x);
        view.y = Math.floor(view.y);
    }

}

