const titleScreen = {

    box: {
        x: 0,
        y: 0,
    },

    draw: function () {

        //fill background
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        //fun polygon background
        for(let i = 0; i < 20; i++){
            canvasContext.fillStyle = `
            rgb(
                ${Math.floor(255*Math.sin(ticker/300*i))},
                ${Math.floor(255*Math.cos(ticker/100*i/20))},
                ${Math.floor(255*Math.sin(ticker/60))})`;

            strokePolygon(canvas.width/2, 180 - i*7, 10*i, 7, ticker/100*i/2);
            
        }
        
        //title text
        
        const gradient = canvasContext.createLinearGradient(0, 60, 0, 100);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(0.5, 'orange');
        gradient.addColorStop(1, 'white');

        let titleOffsets = [{x: 0, y: 0}, {x: 4, y: 0}, {x: 0, y: 4}, {x: 4, y: 4}];
        for(let i = 0; i < titleOffsets.length; i++){
            gameFont.drawText("Diggernaut", { x: 95 + titleOffsets[i].x, y: 60 + titleOffsets[i].y }, 0, 0, 6, 'black');
        }
        
        titleOffsets = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}];
        for(let i = 0; i < titleOffsets.length; i++){
            gameFont.drawText("Diggernaut", { x: 95 + titleOffsets[i].x, y: 60 + titleOffsets[i].y }, 0, 0, 6, gradient);
        }
        
        gameFont.drawText("Arrows to move, Z to dig, X to throw, SPACE to jump", { x: 125, y: 256 }, 0, 0);
        gameFont.drawText("Press Z to Start", { x: 225, y: 270 }, 0, 0);
        
        drawTransition();
    },

    update: function () {
        if(Key.justReleased(Key.a)){
            audio.playSound(loader.sounds.test1);
        }
        if(Key.justReleased(Key.z)) { signal.dispatch('startGame'); }

        this.box.x = canvas.width/2 - 5;
        this.box.y = canvas.height/2 - 5;
        this.box.x += Math.sin(ticker/10) * 100;
        this.box.y += Math.cos(ticker/10) * 100;
        
    }
}


