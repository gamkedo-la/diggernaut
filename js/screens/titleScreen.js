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
            
            tileMap.drawTileSprite(caveTileset, types[type], x, y - (ticker*speed) % (canvas.height * 3) )
        }
        canvasContext.fillStyle = 'rgba(0,0,0,0.7)';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < 100; i++){
            const x = titleRNG() * canvas.width;
            const y = titleRNG() * canvas.height * 3;
            const speed = titleRNG() * 3 + 2;
            const type = Math.floor(titleRNG() * 8);
            const types = [1,1,1,1,4,7,8,9]
            
            tileMap.drawTileSprite(caveTileset, types[type], x, y - (ticker*speed) % (canvas.height * 3) )
        }
        canvasContext.fillStyle = 'rgba(0,0,0,0.5)';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < 50; i++){
            const x = titleRNG() * canvas.width;
            const y = titleRNG() * canvas.height * 3;
            const speed = titleRNG() * 3 + 2;
            const type = Math.floor(titleRNG() * 8);
            const types = [1,1,1,1,4,7,8,9]
            
            tileMap.drawTileSprite(caveTileset, types[type], x, y - (ticker*speed) % (canvas.height * 3) )
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
        
       
        gameFont.drawText("Hit F to go Fullscreen", { x: 200, y: 240 }, 0, 0, 1, 'yellow');
        gameFont.drawText("Arrows to move, Z to dig, X to throw, SPACE to jump", { x: 125, y: 256 }, 0, 0);
        if(!titleScreen.clicked){
            gameFont.drawText("Click for browser focus audio context nonsense", { x: 140, y: 270 }, 0, 0);
        }else {
            gameFont.drawText("Awesome! Hit Z to start", { x: 140, y: 270 }, 0, 0, 2);

        }
        
        drawTransition();
    },

    update: function () {
        if(Key.justReleased(Key.z) && titleScreen.clicked) { signal.dispatch('startGame'); }

    }
}


