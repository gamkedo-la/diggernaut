//custom even Listener setup
var signal = new Signal();

//canvas setup
canvas = document.getElementById("canvas");
canvasContext = canvas.getContext("2d");
canvas.imageSmoothingEnabled = false;
canvas.style.imageRendering = "pixelated";
canvas.width = 544;
canvas.height = 306;

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
    width: 544,
    height: 306,
}
const mapConfig = {
    widthInTiles: 70,
    heightInTiles: 3000,
    chasmWidth: 24,
    tileSize: 32,
    mapStartY: 20 //start generating tiles at this Y position

}
var gameState = GAMESTATE_TITLE;
var ticker = 0;
var loader = new AssetLoader();
var audio = new AudioGlobal();
var img, gameFont, tinyFont, tileMap, player, fps, then, startTime, fpsInterval
const actors = [];
fps = 60;

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
    populateMap();

    player = new Player(mapConfig.widthInTiles * mapConfig.tileSize/2, canvas.height/2),


    gameFont = new spriteFont(255, 128, 6, 9, img["smallFont"])

    tinyFont = new spriteFont(320, 240, 4, 6, img["3x5font"])

    begin(fps);
}

function begin(fps) {
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    mainLoop();
}

function mainLoop(){

    requestAnimationFrame(mainLoop);

    // calc elapsed time since last loop
    now = Date.now();
    elapsed = (now - then) 

    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms) <--used to be pretty normal
        //to expect 60fps.  nowadays, it could be 120fps or even 240fps.  So, we need to adjust for that.
        then = now - (elapsed % fpsInterval);

        // Put your drawing code here
        gameLoop();
    }
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

function populateMap(){
    for (let i = 0; i < 1000; i++) {
        actors.push(new Ore(Math.random() * tileMap.widthInTiles * tileMap.tileWidth, Math.random() * tileMap.heightInTiles * tileMap.tileHeight));
    }
}
window.addEventListener('keyup', function (event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function (event) { Key.onKeydown(event); }, false);
window.addEventListener('blur', function (event) { paused = true; }, false);
window.addEventListener('focus', function (event) { paused = false; }, false);

init();