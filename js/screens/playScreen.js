const playScreen = {

    hitCounter: 0,
    reset: function () {
        this.hitCounter = 0;
    },

    player: new Player(canvas.width/2, canvas.height/2),

    draw: function () {
        clearScreen("black");
        this.drawTileMap(tileMap);
        //player debug text
        tinyFont.drawText(`player:  x: ${this.player.x} y: ${this.player.y}`, { x: 10, y: 12 }, 0, 0);
        this.player.draw();
    },
    update: function () {
        if(Key.justReleased(Key.z)){ 
            this.hitCounter += 1; 
            audio.playSound(loader.sounds.test1);
        }
        this.followPlayer();
        this.handlePlayerInput();
        this.player.update();
    },

    handlePlayerInput: function () {
        if (Key.isDown(Key.LEFT)) { this.player.moveLeft(); }
        if (Key.isDown(Key.RIGHT)) { this.player.moveRight(); }
        if (Key.isDown(Key.UP)) { this.player.moveUp(); }
        if (Key.isDown(Key.DOWN)) { this.player.moveDown(); }
        if (Key.isDown(Key.SPACE)) { this.player.stop(); }
        if (Key.justReleased(Key.z)) { this.player.dig(); }
    },
    
    drawTileMap: function (tileMap) {
        let fills = ['Black', 'DarkSlateGray', 'DimGray', 'Gray', 'White'];
        for (let i = 0; i < tileMap.data.length; i++) {
            let tile = tileMap.data[i];
            let x = i % tileMap.widthInTiles;
            let y = Math.floor(i / tileMap.widthInTiles);
            let tileX = (x + tileMap.worldPosition.x) * tileMap.tileWidth;
            let tileY = (y + tileMap.worldPosition.y) * tileMap.tileHeight;
            canvasContext.fillStyle = fills[tile]
            if(inView(tileX, tileY)){
                canvasContext.fillRect(tileX - view.x, tileY - view.y, tileMap.tileWidth, tileMap.tileHeight);
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

