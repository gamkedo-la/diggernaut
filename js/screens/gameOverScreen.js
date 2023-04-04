const gameOverScreen = {
    gameEndState: {},
    draw: function () {
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        
        gameFont.drawText("GAME OVER", { x: 30, y: 70 }, 0, 1, 5);
        gameFont.drawText("Press Enter to return to titleScreen\nPress SPACE to try again", { x: 90, y: 150 }, 0, 1);
    },
    update: function () {
        if (Key.justReleased(Key.ENTER)) { signal.dispatch('titleScreen'); }
        if (Key.justReleased(Key.SPACE)) { signal.dispatch('startGame'); }
    }
}
