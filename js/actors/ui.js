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

    draw: function () {
        canvasContext.fillStyle = ui.energyBar.color;
        canvasContext.fillRect(ui.energyBar.x, ui.energyBar.y, ui.energyBar.width, ui.energyBar.height);
        canvasContext.fillStyle = ui.healthBar.color;
        canvasContext.fillRect(ui.healthBar.x, ui.healthBar.y, ui.healthBar.value, ui.healthBar.height);
    },

    update: function () {
        ui.energyBar.height = player.energy;
        ui.healthBar.value = player.health;
    }
    
}