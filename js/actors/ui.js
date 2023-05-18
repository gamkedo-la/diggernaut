const ui = {
    healthBar: {
        x: 400,
        y: 10,
        width: 100,
        height: 5,
        value: 0,
        color: "red"
    },
    energyBar: {
        x: 544-10,
        y: 10,
        width: 5,
        height: 100,
        color: "blue"
    },
    oreBar: {
        x: 200,
        y: 10,
        width: 100,
        height: 5,
        value: 0,
        crateSize: 12,
        crateColor: "green",
        crateStroke: "green",
        boxSize: 10,
        boxColor: "aquamarine",
        boxStroke: "green",
        barColor: "aquamarine"
    },
    //init as empty object bc will be populated by main after tilemap is created
    miniMap: {},

    draw: function () {
        UIContext.save();
        // Energy Bar
        UIContext.fillStyle = ui.energyBar.color;
        UIContext.fillRect(ui.energyBar.x, ui.energyBar.y, ui.energyBar.width, ui.energyBar.height);

        // Health Bar
        UIContext.fillStyle = ui.healthBar.color;
        UIContext.fillRect(ui.healthBar.x, ui.healthBar.y, ui.healthBar.value, ui.healthBar.height);

        // Ore Bar
        const oreCrates = Math.floor(ui.oreBar.value / 500);
        const oreBoxes = Math.floor((ui.oreBar.value % 500) / 100);
        const oreBarWidth = Math.floor((ui.oreBar.value % 500) % 100);
        

        UIContext.fillStyle = ui.oreBar.crateColor;
        UIContext.strokeStyle = ui.oreBar.crateStroke;
        for (let i = 0; i < oreCrates; i++) {
            UIContext.fillRect(ui.oreBar.x + i * (ui.oreBar.crateSize + 2), ui.oreBar.y - 3, ui.oreBar.crateSize, ui.oreBar.crateSize);
            UIContext.strokeRect(ui.oreBar.x + i * (ui.oreBar.crateSize + 2), ui.oreBar.y - 3, ui.oreBar.crateSize, ui.oreBar.crateSize);
        }
        UIContext.fillStyle = ui.oreBar.boxColor;
        UIContext.strokeStyle = ui.oreBar.boxStroke;
        for (let i = 0; i < oreBoxes; i++) {
            const xPos = ui.oreBar.x + (oreCrates * (ui.oreBar.crateSize + 2)) + i * (ui.oreBar.boxSize + 2)
            UIContext.fillRect(xPos, ui.oreBar.y - 2, ui.oreBar.boxSize, ui.oreBar.boxSize);
            UIContext.strokeRect(xPos, ui.oreBar.y - 2, ui.oreBar.boxSize, ui.oreBar.boxSize);
        }

        UIContext.fillStyle = ui.oreBar.color;
        UIContext.fillRect(ui.oreBar.x + 66, ui.oreBar.y, Math.min(100, oreBarWidth), ui.oreBar.height);

        UIContext.restore();

        gameFont.drawText(String(ui.oreBar.value), 
            { x: ui.oreBar.x - 25, y: ui.oreBar.y },
            0, 0, 1, ui.oreBar.boxColor, UIContext);

        if (this.miniMap) this.miniMap.draw();

    },

    update: function () {
        ui.energyBar.height = player.energy;
        ui.healthBar.value = player.health;
        ui.oreBar.value = player.inventory.ore;
    }
    
}
