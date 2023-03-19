const playScreen = {

    hitCounter: 0,
    reset: function () {
        this.hitCounter = 0;
    },

    player: new Player(canvas.width/2, canvas.height/2),

    draw: function () {
        clearScreen("black");
        tileMap.draw();
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
        if (Key.isDown(Key.LEFT)) {
            this.player.moveLeft();
            if(Key.isDown(Key.z)){
                this.player.dig(LEFT);
            }
        }
        if (Key.isDown(Key.RIGHT)) {
            this.player.moveRight(); 
            if(Key.isDown(Key.z)){
                this.player.dig(RIGHT);
            }
        }
        if (Key.isDown(Key.UP)) { this.player.jump(); }

        if (Key.isDown(Key.DOWN)) {
            this.player.moveDown();
            if(Key.isDown(Key.z)){
                this.player.dig(DOWN);
            }
        }

        if (Key.justReleased(Key.SPACE)) { this.player.jump(); }
        //if (Key.justReleased(Key.z)) { this.player.dig(); }
    },

    followPlayer: function () {
        view.x = this.player.x - canvas.width / 2;
        view.y = this.player.y - canvas.height / 2;
        view.x = Math.floor(view.x);
        view.y = Math.floor(view.y);
    }

}

