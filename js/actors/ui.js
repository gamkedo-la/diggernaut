const ui = {

    healthBar: {
        x: 700,
        y: 10,
        width: 100,
        height: 5,
        value: 0,
        color: "red"
    },

    oreBar: {
        x: 700,
        y: 24,
        width: 100,
        height: 5,
        value: 0,
        crateSize: 10,
        crateColor: COLORS[9],
        crateStroke: COLORS[7],
        boxSize: 8,
        boxColor: COLORS[8],
        boxStroke: COLORS[6],
        barColor: COLORS[8]
    },

    energyBar: {
        x: 700,
        y: 44,
        width: 100,
        height: 5,
        value: 0,
        crateSize: 10,
        crateColor: COLORS[19],
        crateStroke: COLORS[17],
        boxSize: 8,
        boxColor: COLORS[18],
        boxStroke: COLORS[16],
        barColor: COLORS[18]
    },

    //init as empty object bc will be populated by main after tilemap is created
    //miniMap: {},

    draw: function () {
        canvasContext.save();

        // Health Bar
        canvasContext.fillStyle = ui.healthBar.color;
        canvasContext.fillRect(ui.healthBar.x, ui.healthBar.y, ui.healthBar.value, ui.healthBar.height);
        drawTileSprite(tileSets.ui_icons, 0, ui.healthBar.x - 16, ui.healthBar.y - 4);

        // Energy Bar
        const energyCrates = Math.floor(ui.energyBar.value / 500);
        const energyBoxes = Math.floor((ui.energyBar.value % 500) / 100);
        const energyBarWidth = Math.floor((ui.energyBar.value % 500) % 100);

        canvasContext.fillStyle = ui.energyBar.crateColor;
        canvasContext.strokeStyle = ui.energyBar.crateStroke;
        for (let i = 0; i < energyCrates; i++) {
            canvasContext.fillRect(ui.energyBar.x + i * (ui.energyBar.crateSize + 2), ui.energyBar.y - 3, ui.energyBar.crateSize, ui.energyBar.crateSize);
            canvasContext.strokeRect(ui.energyBar.x + i * (ui.energyBar.crateSize + 2), ui.energyBar.y - 3, ui.energyBar.crateSize, ui.energyBar.crateSize);
        }
        canvasContext.fillStyle = ui.energyBar.boxColor;
        canvasContext.strokeStyle = ui.energyBar.boxStroke;
        for (let i = 0; i < energyBoxes; i++) {
            const xPos = ui.energyBar.x + (energyCrates * (ui.energyBar.crateSize + 2)) + i * (ui.energyBar.boxSize + 2)
            canvasContext.fillRect(xPos, ui.energyBar.y - 2, ui.energyBar.boxSize, ui.energyBar.boxSize);
            canvasContext.strokeRect(xPos, ui.energyBar.y - 2, ui.energyBar.boxSize, ui.energyBar.boxSize);
        }

        canvasContext.fillStyle = ui.energyBar.color;
        canvasContext.fillRect(ui.energyBar.x, ui.energyBar.y + 8, Math.min(100, energyBarWidth), ui.energyBar.height);
        drawTileSprite(tileSets.ui_icons, 2, ui.energyBar.x - 16, ui.energyBar.y);

        // Ore Bar
        const oreCrates = Math.floor(ui.oreBar.value / 500);
        const oreBoxes = Math.floor((ui.oreBar.value % 500) / 100);
        const oreBarWidth = Math.floor((ui.oreBar.value % 500) % 100);


        canvasContext.fillStyle = ui.oreBar.crateColor;
        canvasContext.strokeStyle = ui.oreBar.crateStroke;
        for (let i = 0; i < oreCrates; i++) {
            canvasContext.fillRect(ui.oreBar.x + i * (ui.oreBar.crateSize + 2), ui.oreBar.y - 3, ui.oreBar.crateSize, ui.oreBar.crateSize);
            canvasContext.strokeRect(ui.oreBar.x + i * (ui.oreBar.crateSize + 2), ui.oreBar.y - 3, ui.oreBar.crateSize, ui.oreBar.crateSize);
        }
        canvasContext.fillStyle = ui.oreBar.boxColor;
        canvasContext.strokeStyle = ui.oreBar.boxStroke;
        for (let i = 0; i < oreBoxes; i++) {
            const xPos = ui.oreBar.x + (oreCrates * (ui.oreBar.crateSize + 2)) + i * (ui.oreBar.boxSize + 2)
            canvasContext.fillRect(xPos, ui.oreBar.y - 2, ui.oreBar.boxSize, ui.oreBar.boxSize);
            canvasContext.strokeRect(xPos, ui.oreBar.y - 2, ui.oreBar.boxSize, ui.oreBar.boxSize);
        }

        canvasContext.fillStyle = ui.oreBar.color;
        canvasContext.fillRect(ui.oreBar.x, ui.oreBar.y + 8, Math.min(100, oreBarWidth), ui.oreBar.height);
        drawTileSprite(tileSets.ui_icons, 1, ui.oreBar.x - 16, ui.oreBar.y);


        gameFont.drawText(`Depth: ${player.depth} meters`, 
            { x: 180, y:8 }, 0, 0, 1);

        //if (this.miniMap) this.miniMap.draw();

        canvasContext.restore();


    },

    update: function () {
        ui.energyBar.value = player.inventory.blueOre;
        ui.healthBar.value = player.health;
        ui.oreBar.value = player.inventory.ore;
    }

}
