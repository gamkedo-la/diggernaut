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
                if(index < 0) continue;
                if (tileMap.data[index] === 0) continue;
               
                //fillRect 2x2 for each tile in map
                let x = 500,
                    y = 25;
                if((j + yOffset + y) > 425) continue;
                let size = 4;
                canvasContext.fillStyle = inventoryScreen.mapColors[tileMap.data[index]];
                canvasContext.fillRect(x + i * size, y + (j + yOffset) * size, size, size);
            }
        }
        playerTileX = Math.floor(player.x / tileMap.tileWidth);
        playerTileY = Math.floor(player.y / tileMap.tileHeight);
        canvasContext.fillStyle = '#ddd';
        canvasContext.fillRect(500 + playerTileX * 4, 25 + (playerTileY + yOffset) * 4, 4, 4);

        actors.forEach(actor => {
            if (actor.constructor.name === "Collectible"){
                //fill square for each collectible
                collectibleTileX = Math.floor(actor.x / tileMap.tileWidth);
                collectibleTileY = Math.floor(actor.y / tileMap.tileHeight);
                canvasContext.fillStyle = '#0f0';
                if(collectibleTileY + top > 0) return;
                canvasContext.fillRect(500 + collectibleTileX * 4, 25 + (collectibleTileY + yOffset) * 4, 4, 4);
            }
        });
        canvasContext.strokeStyle = 'white';
        canvasContext.strokeRect(500, 25, tileMap.widthInTiles*4, 400);
        canvasContext.restore();
    }
}
