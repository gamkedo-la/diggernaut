const gameOverScreen = {
    gameEndState: {},
    draw: function () {
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        
        bigFontRed.drawText("GAME OVER", { x: 110, y: 70 + Math.sin(ticker/20) * 20 }, 0, 1, 3);
        gameFont.drawText("Press Enter or Start to return to titleScreen\nPress SPACE or A to try again", { x: 140, y: 190 }, 0, 1);
        gameFont.drawText("Press C to view Game Credits", { x: 140, y: 210 }, 0, 1);
    },
    update: function () {
        Joy.update();
        if (Key.justReleased(Key.ENTER) || Joy.start ) { signal.dispatch('titleScreen'); }
        if (Key.justReleased(Key.SPACE) || Joy.a || Joy.x ) { signal.dispatch('startGame'); }
    }
}
