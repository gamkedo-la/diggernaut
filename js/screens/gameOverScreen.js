const gameOverScreen = {
    gameEndState: {},
    draw: function () {
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        
        bigFontRed.drawText("GAME OVER", { x: 110, y: 70 + Math.sin(ticker/20) * 20 }, 0, 1, 3);
        gameFont.drawText("Press Enter to return to titleScreen\nPress SPACE to try again", { x: 140, y: 190 }, 0, 1);
    },
    update: function () {
        if (Key.justReleased(Key.ENTER)) { signal.dispatch('titleScreen'); }
        if (Key.justReleased(Key.SPACE)) { signal.dispatch('startGame'); }
    }
}
