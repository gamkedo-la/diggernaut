const playScreen = {

    hitCounter: 0,

    reset: function () {
        this.hitCounter = 0;
    },

    draw: function () {
        clearScreen("black");
        tileMap.draw();
        //player debug text
        tinyFont.drawText(`player:  x: ${player.x} y: ${player.y} \nyvel: ${player.yvel} xvel: ${player.xvel} health: ${player.health}`, { x: 10, y: 12 }, 0, 0);
        player.draw();
        actors.forEach(actor => actor.draw());
        ui.draw();
            
    },
    update: function () {
        this.followPlayer();
        player.handleInput();
        player.update();
        ui.update();
        actors.forEach(actor => actor.update());

    },



    followPlayer: function () {
        //TODO: lerp camera, implement deadzone and camera shake
        view.x = player.x - canvas.width / 2;
        view.y = player.y - canvas.height / 2;
        view.x = Math.floor(view.x);
        view.y = Math.floor(view.y);
        view.x = Math.max(0, view.x);
        view.y = Math.max(0, view.y);
        view.x = Math.min(tileMap.widthInTiles * tileMap.tileWidth - canvas.width, view.x);
        // view.y = Math.min(tileMap.height * tileMap.tileSize - canvas.height, view.y);

    },
}


