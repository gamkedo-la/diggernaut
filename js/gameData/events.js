

signal.addEventListener('startGame', startGame);
signal.addEventListener('resetGame', resetGame);
signal.addEventListener('gotoPlay', function (event) { gameState = GAMESTATE_PLAY;stats.domElement.style.display = 'block'; }, false)
signal.addEventListener('gameOver', gameOver);
signal.addEventListener('titleScreen', gotoTitleScreen);
signal.addEventListener('creditScreen', gotoCreditScreen);
signal.addEventListener('gotoMap', gotoMap);

signal.addEventListener('returnToGame', returnToGame);
signal.addEventListener('gameWon', function (event) { gameState = GAMESTATE_CREDITS; }, false);
signal.addEventListener('inventory', gotoInventory);
signal.addEventListener('pause', gotoInventory);



function startGame(event){
    startTransition(() => {
        console.log('startGame triggered');
        playScreen.reset();
        if(titleScreen.music)titleScreen.music.volume.gain.value = 0;
        if(playScreen.music)playScreen.music.volume.gain.value = 1;
        gameState = GAMESTATE_PLAY;
    });
}

function resetGame(event){
    startTransition(() => {
        console.log('resetGame triggered');
        gameState = GAMESTATE_PLAY;
        if(playScreen.music){playScreen.music.volume.gain.value = 1;}
        if(titleScreen.music){titleScreen.music.volume.gain.value = 0;}
        gameSetup();
        playScreen.reset();
        
    });
}

function returnToGame(event){
    startTransition(() => {
        console.log('returnToGame triggered');
        gameState = GAMESTATE_PLAY;
    });
}

function gotoInventory(event){
    startTransition(() => {
        console.log('inventory triggered');
        gameState = GAMESTATE_INVENTORY;
    });
}

function gotoMap(event){
    startTransition(() => {
        console.log('map triggered');
        gameState = GAMESTATE_MAP;
        mapScreen.reset();
    });
}

function gameOver(event){
    startTransition(() => {
        console.log('gameOver triggered');
        gameOverScreen.gameEndState = event.detail;
        if(playScreen.music){playScreen.music.volume.gain.value = 0;}
        gameState = GAMESTATE_GAME_OVER;
    });
}

function gotoTitleScreen(event){
    startTransition(() => {
        console.log('gotoTitleScreen triggered');
        if(playScreen.music){playScreen.music.volume.gain.value = 0;}
        if(titleScreen.music){titleScreen.music.volume.gain.value = 1;}
        gameState = GAMESTATE_TITLE;
    });
}

function gotoCreditScreen(event){
    startTransition(() => {
        console.log('gotoCreditScreen triggered');
        gameState = GAMESTATE_CREDITS;
    });
}



