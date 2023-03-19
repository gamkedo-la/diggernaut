//custom even Listener setup
var signal = new Signal();

//canvas setup
canvas = document.getElementById("canvas");
canvasContext = canvas.getContext("2d");
canvas.imageSmoothingEnabled = false;
canvas.style.imageRendering = "pixelated";
canvas.width = 320;
canvas.height = 180;

//globals and constants
const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;

const GAMESTATE_TITLE = 0
const GAMESTATE_PLAY = 1;
const GAMESTATE_GAME_OVER = 2;
const GAMESTATE_CREDITS = 3;
const FRAMERATE = 60;
const view = {
    x: 0,
    y: 0,
    width: 320,
    height: 180,
}
const mapConfig = {
    widthInTiles: 60,
    heightInTiles: 1200,
    chasmWidth: 24,
    tileSize: 16,
    mapStartY: 20 //start generating tiles at this Y position

}
var gameState = GAMESTATE_TITLE;
var ticker = 0;
var loader = new AssetLoader();
var audio = new AudioGlobal();
var img, gameFont, tinyFont, tileMap;

const imageList = [
    //image loader assumes .png and appends it. all images should be in /src/img/.
    'smallFont',
    '3x5font',
]

const soundList = [
    { name: "test1", url: "snd/test1.mp3" },
    { name: "test2", url: "snd/test2.mp3" }
]

function init() {

    loadImages();

}

function loadImages() {
    img = loader.loadImages(imageList, initAudio);
}

function initAudio() {
    audio.init(loadSounds);
}


function loadSounds() {
    console.log('loading sounds');
    loader.soundLoader({ context: audio.context, urlList: soundList, callback: loadingComplete });
    loader.loadAudioBuffer();
}

function loadingComplete() {
    console.log('loading complete, starting game')

    generateMap(mapConfig);    

    gameFont = new spriteFont(255, 128, 6, 9, img["smallFont"])

    tinyFont = new spriteFont(320, 240, 4, 6, img["3x5font"])

    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    ticker++;
    switch (gameState) {
        case GAMESTATE_TITLE:
            titleScreen.draw();
            titleScreen.update();
            break;
        case GAMESTATE_PLAY:
            playScreen.draw();
            playScreen.update();
            break;
        case GAMESTATE_GAME_OVER:
            gameOverScreen.draw();
            gameOverScreen.update();
            break;
        case GAMESTATE_CREDITS:
            creditsScreen.draw();
            creditsScreen.update();
            break;
    }
    requestAnimationFrame(gameLoop);
    Key.update();
}

function generateMap(config){

    tileMap = new TileMap(config.widthInTiles, config.heightInTiles, config.tileSize, config.tileSize);
    let choices = [3, 4, 5];
    let mapYstartOffset = config.mapStartY * config.widthInTiles;
    let mapTotalTiles = config.widthInTiles * config.heightInTiles;
    
    for (let i = mapYstartOffset; i < mapTotalTiles;  i++) {
        tileMap.data[i] = choices[ Math.floor(Math.random() * choices.length) ];
    }
    //generate chasm
    let chasmStart = (config.widthInTiles / 2) - (config.chasmWidth / 2);
    choices = [0, 1, 2]
    chasmStart = Math.floor(chasmStart);
    for (let i = mapYstartOffset; i < mapTotalTiles; i += config.widthInTiles) {
        for (let j = chasmStart; j < chasmStart + config.chasmWidth; j++) {
            tileMap.data[i + j] = choices[ Math.floor(Math.random() * choices.length) ];
        }
    }

}

window.addEventListener('keyup', function (event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function (event) { Key.onKeydown(event); }, false);
window.addEventListener('blur', function (event) { paused = true; }, false);
window.addEventListener('focus', function (event) { paused = false; }, false);

init();