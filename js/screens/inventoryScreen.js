const inventoryScreen = {

    draw: function () {
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        
        gameFont.drawText("PAUSED - INVENTORY", { x: 30, y: 70 }, 0, 1, 3);
        gameFont.drawText("Press P or I to return to game ", { x: 90, y: 150 }, 0, 1);

        drawTransition();
        
    },
    update: function () {
        if (Key.justReleased(Key.i)) { signal.dispatch('returnToGame'); }
        if (Key.justReleased(Key.p)) { signal.dispatch('returnToGame'); }
        if (Joy.yReleased) { signal.dispatch('returnToGame'); }
    }
}
