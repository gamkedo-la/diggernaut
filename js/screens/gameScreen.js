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
        this.drawTileMap();

        //draw the counter
        tinyFont.drawText("Lights Out", { x: 10, y: 12 }, 0, 0);
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
        this.handlePlayerInput();
        this.player.update();
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
    
    drawTileMap: function () {
        for (let i = 0; i < tileMap.data.length; i++) {
               //tileMap.data is 1d array
            let tile = tileMap.data[i];
            let x = i % tileMap.widthInTiles;
            let y = Math.floor(i / tileMap.widthInTiles);
            let tileX = x * tileMap.tileWidth;
            let tileY = y * tileMap.tileHeight;
            if (tile) {
                canvasContext.fillStyle = 'white';
                canvasContext.fillRect(tileX, tileY, tileMap.tileWidth, tileMap.tileHeight);        
            }
        }
    }

}

