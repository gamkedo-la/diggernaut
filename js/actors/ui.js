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

    draw: function () {
        canvasContext.save();
        // Energy Bar
        canvasContext.fillStyle = ui.energyBar.color;
        canvasContext.fillRect(ui.energyBar.x, ui.energyBar.y, ui.energyBar.width, ui.energyBar.height);

        // Health Bar
        canvasContext.fillStyle = ui.healthBar.color;
        canvasContext.fillRect(ui.healthBar.x, ui.healthBar.y, ui.healthBar.value, ui.healthBar.height);

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
        canvasContext.fillRect(ui.oreBar.x + 66, ui.oreBar.y, Math.min(100, oreBarWidth), ui.oreBar.height);

        canvasContext.restore();
    },

    update: function () {
        ui.energyBar.height = player.energy;
        ui.healthBar.value = player.health;
        ui.oreBar.value = player.inventory.ore;
    }
    
}