signal.addEventListener('startGame', startGame);
signal.addEventListener('gameOver', gameOver);
signal.addEventListener('titleScreen', gotoTitleScreen);
signal.addEventListener('creditScreen', gotoCreditScreen);

signal.addEventListener('returnToGame', function (event) { gameState = GAMESTATE_PLAY; }, false);
signal.addEventListener('gameOver', function (event) { gameState = GAMESTATE_GAME_OVER; }, false);
signal.addEventListener('gameWon', function (event) { gameState = GAMESTATE_CREDITS; }, false);
signal.addEventListener('inventory', function (event) { gameState = GAMESTATE_INVENTORY; }, false);
signal.addEventListener('pause', function (event) { gameState = GAMESTATE_INVENTORY }, false);



function startGame(event){
    console.log('startGame triggered');
    playScreen.reset();
    gameState = GAMESTATE_PLAY;
}

function gameOver(event){
    console.log('gameOver triggered');
    gameOverScreen.gameEndState = event.detail;
    gameState = GAMESTATE_GAME_OVER;
}

function gotoTitleScreen(event){
    console.log('gotoTitleScreen triggered');
    gameState = GAMESTATE_TITLE;
}

function gotoCreditScreen(event){
    console.log('gotoCreditScreen triggered');
    gameState = GAMESTATE_CREDITS;
}