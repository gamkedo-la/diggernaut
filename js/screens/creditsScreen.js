const creditsScreen = {

    reset: function () {
        ticker = 0;
    },

    draw: function (additionalText = "") {
        this.credits = `` +
            this.congratsText +
            `
HomeTeam GameDev Presents:
Diggernaught

a JS game led by Ryan Malm from
April 2 thru July 2 2023

Ryan Malm: Lead Programmer, Game Design, Art
`
        this.congratsText = additionalText;
        clearScreen('black');
        let verticalSpacing = 4;
        let creditsLength = this.credits.split(/\r?\n/).length * (gameFont.characterHeight + verticalSpacing) + canvas.height;
        gameFont.drawText(this.credits, { x: 10, y: canvas.height - (ticker / 2) % creditsLength }, 0, verticalSpacing);
        gameFont.drawText(this.credits, { x: 10, y: creditsLength + (ticker / 2) % creditsLength }, 0, verticalSpacing);
        fillRect(0, 165, canvas.width, 15, '#111');
        tinyFont.drawText("Press Enter to return to Title", { x: 190, y: 170 }, 0, 0);
    },

    update: function () {
        Joy.update();
        if (Key.justReleased(Key.ENTER) || Joy.a || Joy.start || Joy.x) { signal.dispatch('titleScreen'); }
    }
}