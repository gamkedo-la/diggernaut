const playScreen = {

    hitCounter: 0,
    reset: function () {
        this.hitCounter = 0;
    },

    draw: function () {
        clearScreen("black");
        tileMap.draw();
        //player debug text
        tinyFont.drawText(`player:  x: ${player.x} y: ${player.y}`, { x: 10, y: 12 }, 0, 0);
        player.draw();
        actors.forEach(actor => actor.draw());
            
    },
    update: function () {
        if(Key.justReleased(Key.z)){ 
            this.hitCounter += 1; 
            audio.playSound(loader.sounds.test1);
        }
        this.followPlayer();
        this.handlePlayerInput();
        player.update();
        actors.forEach(actor => actor.update());

    },

    handlePlayerInput: function () {
        if (Key.isDown(Key.LEFT)) {
            player.moveLeft();
            if(Key.isDown(Key.z)){
                player.dig(LEFT);
            }
        }
        if (Key.isDown(Key.RIGHT)) {
            player.moveRight(); 
            if(Key.isDown(Key.z)){
                player.dig(RIGHT);
            }
        }
        if (Key.isDown(Key.UP)) { player.jump(); }

        if (Key.isDown(Key.DOWN)) {
            //player.moveDown();
            if(Key.isDown(Key.z)){
                player.dig(DOWN);
            }
        }

        // if(Key.isDown(Key.z)){
        //     player.dig(DOWN);
        // }

        if (Key.justReleased(Key.SPACE)) { player.jump(); }
        if (Key.justReleased(Key.z)) { player.digCooldown = 0; }
    },

    followPlayer: function () {
        view.x = player.x - canvas.width / 2;
        view.y = player.y - canvas.height / 2;
        view.x = Math.floor(view.x);
        view.y = Math.floor(view.y);
        view.x = Math.max(0, view.x);
        view.y = Math.max(0, view.y);
        view.x = Math.min(tileMap.widthInTiles * tileMap.tileWidth - canvas.width, view.x);
        // view.y = Math.min(tileMap.height * tileMap.tileSize - canvas.height, view.y);

    }

}

