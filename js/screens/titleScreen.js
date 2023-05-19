const titleScreen = {
    clicked: false,
   
    draw: function () {

        //fill background
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        titleRNG = new Math.seedrandom(456);
        for(let i = 0; i < 100; i++){
            const x = titleRNG() * canvas.width;
            const y = titleRNG() * canvas.height * 3;
            const speed = titleRNG() * 3 + 2;
            const type = Math.floor(titleRNG() * 8);
            const types = [1,1,1,1,4,7,8,9]
            
            drawTileSprite(tileSets.caveTileset, types[type]*16, x, y - (ticker*speed) % (canvas.height * 3) )
        }
        canvasContext.fillStyle = 'rgba(0,0,0,0.7)';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < 100; i++){
            const x = titleRNG() * canvas.width;
            const y = titleRNG() * canvas.height * 3;
            const speed = titleRNG() * 3 + 2;
            const type = Math.floor(titleRNG() * 8);
            const types = [1,1,1,1,4,7,8,9]
            
            drawTileSprite(tileSets.caveTileset, types[type]*16, x, y - (ticker*speed) % (canvas.height * 3) )
        }
        canvasContext.fillStyle = 'rgba(0,0,0,0.5)';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < 50; i++){
            const x = titleRNG() * canvas.width;
            const y = titleRNG() * canvas.height * 3;
            const speed = titleRNG() * 3 + 2;
            const type = Math.floor(titleRNG() * 8);
            const types = [1,1,1,1,4,7,8,9]
            
            drawTileSprite(tileSets.caveTileset, types[type]*16, x, y - (ticker*speed) % (canvas.height * 3) )
        }
        
        //title text
        const gradient = canvasContext.createLinearGradient(0, 60, 0, 100);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(0.5, 'orange');
        gradient.addColorStop(1, 'white');

        let titleOffsets = [{x: 0, y: 0}, {x: 4, y: 0}, {x: 0, y: 4}, {x: 4, y: 4}];
        for(let i = 0; i < titleOffsets.length; i++){
            bigFontBlack.drawText("DIGGERNAUTS", { x: 125 + titleOffsets[i].x, y: 60 + titleOffsets[i].y }, 2, 1, 2);
        }
        
        titleOffsets = [{x: 0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1}];
        for(let i = 0; i < titleOffsets.length; i++){
            bigFontOrangeGradient.drawText("DIGGERNAUTS", { x: 125 + titleOffsets[i].x, y: 60 + titleOffsets[i].y }, 2, 1, 2);
        }
        
       
        gameFont.drawText("Hit F to go Fullscreen", { x: 215, y: 240-40 }, 0, 0, 1, 'yellow');
        gameFont.drawText("Arrows to move, Z to dig, X to throw, SPACE to jump", { x: 125, y: 256-40 }, 0, 0);
        if(!titleScreen.clicked){
            gameFont.drawText("Click or tap to play", { x: 220, y: 270-40 }, 0, 0);
        }else {
            gameFont.drawText("Awesome! Hit Z to start", { x: 140, y: 270-40 }, 0, 0, 2);

        }
        
        drawTransition();
    },

    update: function () {
        if(titleScreen.clicked && (Key.justReleased(Key.z) || Joy.aReleased || Joy.startReleased)) { 
            signal.dispatch('startGame'); 
        }

    }
}


