const inventoryScreen = {

    // inventory screen will have 3 tabs: Treasure, Artifacts, and Map.
    activeTab: 0,
    totalTabs: 4,
    mapDrawn: false,
    mapColors: ["#000000", "#333", "#333", "#333", "#553", "#333", "#333", "#447", "#333", "#333", "#333"],

    draw: function () {
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        let ui = collectibles.ui;

        for (item in collectibles.Treasure) {
            collectibles.Treasure[item].draw();
        }


        inventoryScreen.drawMinimap();
        inventoryScreen.drawStats();

        drawTransition();

    },

    update: function () {
        Joy.update();
        if (Key.justReleased(Key.i)) { signal.dispatch('returnToGame'); }
        if (Key.justReleased(Key.p)) { signal.dispatch('returnToGame'); }
        if (Joy.yReleased) { signal.dispatch('returnToGame'); }

        if (Key.justReleased(Key.LEFT)) {
            this.activeTab--;
            if (this.activeTab < 0) { this.activeTab = this.totalTabs - 1; }
        }
        if (Key.justReleased(Key.RIGHT)) {
            this.activeTab++;
            if (this.activeTab > this.totalTabs - 1) { this.activeTab = 0; }
        }
    },

    drawStats: function () {
        
        let pos = {x:62,y:210};

        let secs = player.playtime;
        let timefmt = Math.floor(secs/60)+"m "+Math.floor(secs%60)+"s";
        
        let str = "Stats:\n\n"+
        "Score: "+player.score+"\n"+
        "Depth: "+player.depth+"\n"+
        "\n"+
        "Steps taken: "+player.stepCounter+"\n"+
        "Jumps made: "+player.jumpCounter+"\n"+
        "Helicopters: "+player.heliCounter+"\n"+
        "\n"+
        "Enemies Killed: "+player.kills+"\n"+
        "Time played: "+timefmt+"\n"+
        "\n"+
        "Ore: "+player.inventory.ore+"\n"+
        "Blue Ore: "+player.inventory.blueOre+"\n";
                
        canvasContext.fillStyle = '#222';
        canvasContext.fillRect(pos.x-4, pos.y-4, 400, 15); 

        gameFont.drawText(str,pos);

    },

    drawMinimap: function () {
        
        const left = 0;
        const right = tileMap.widthInTiles;
        const top = Math.floor(player.y / tileMap.tileHeight) - 50;
        const bottom = top + 100;
        const yOffset = -top;
        canvasContext.save();
        for (let i = left; i < right; i++) {
            for (let j = top; j < bottom; j++) {
                
                const index = tileMap.getIndexAtPosition(i, j)
                
                
                let x = 500,
                    y = 25,
                    size = 4;

                //if(tileMap.data[index] === 0 && tileMap.treasureTiles[index] === 0) continue;
                //if((j + yOffset + y) > 425) continue;
                if(index < 0) continue;

                canvasContext.fillStyle = inventoryScreen.mapColors[tileMap.data[index]];
                if(tileMap.treasureTiles[index] != 0){
                    canvasContext.fillStyle = "#0f0"
                }
                canvasContext.fillRect(x + i * size, y + (j + yOffset) * size, size, size);
            }
        }
        playerTileX = Math.floor(player.x / tileMap.tileWidth);
        playerTileY = Math.floor(player.y / tileMap.tileHeight);
        canvasContext.fillStyle = '#ddd';
        canvasContext.fillRect(500 + playerTileX * 4, 25 + (playerTileY + yOffset) * 4, 4, 4);

        canvasContext.strokeStyle = 'white';
        canvasContext.strokeRect(500, 25, tileMap.widthInTiles*4, 400);
        canvasContext.restore();
    }
}
