//custom even Listener setup
var signal = new Signal();
const stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

//canvas setup
canvas = document.getElementById("canvas");
canvasContext = canvas.getContext("2d");
canvas.imageSmoothingEnabled = false;
canvas.style.imageRendering = "pixelated";
canvas.width = 544;
canvas.height = 306;



let gameState = GAMESTATE_TITLE,
 ticker = 0,
 loader = new AssetLoader(),
 audio = new AudioGlobal(),
 fps = FRAMERATE,
 img, gameFont, tinyFont, tileMap, player, then, startTime, fpsInterval
const actors = [];

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
    sounds = loader.sounds;
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
    stats.begin();
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
    stats.end();
}

function gameLoop() {
    ticker++;    
    screens[gameState].draw();
    screens[gameState].update();
    Key.update();
}

function generateMap(config){

    tileMap = new TileMap(config.widthInTiles, config.heightInTiles, config.tileSize, config.tileSize);
    let choices = mapConfig.choicePool;
    let mapYstartOffset = config.mapStartY * config.widthInTiles;
    let mapTotalTiles = config.widthInTiles * config.heightInTiles;
    
    for (let i = mapYstartOffset; i < mapTotalTiles;  i++) {
        tileMap.data[i] = choices[ Math.floor(Math.random() * choices.length) ];
    }
    
    //random tiny holes
    for(let i = 0; i < 12000; i++){
        let x = Math.floor(Math.random() * tileMap.widthInTiles);
        let y = Math.floor(Math.random() * tileMap.heightInTiles);
        tileMap.tileFillRect(x, y, 1, 1, 0);
        //tileMap.data[i] = 0;
    }

    //random room sized voids
    for(let i = 0; i < 200; i++){
        let x = Math.floor(Math.random() * tileMap.widthInTiles);
        let y = Math.floor(Math.random() * tileMap.heightInTiles);
        tileMap.tileFillRect(x, y, 10, 10, 0);
    }

    //random round voids, random size
    for(let i = 0; i < 200; i++){
        let x = Math.floor(Math.random() * tileMap.widthInTiles);
        let y = Math.floor(Math.random() * tileMap.heightInTiles);
        let radius = Math.floor(Math.random() * 8 + 2);
        tileMap.tileFillCircle(x, y, radius, 0);
    }

    //random ledges of random length
    for(let i = 0; i < 300; i++){
        let x = Math.floor(Math.random() * tileMap.widthInTiles);
        let y = Math.floor(Math.random() * tileMap.heightInTiles);
        let length = Math.floor(Math.random() * 8 + 4);
        tileMap.tileFillRect(x, y, length, 1, 0);
    }

    //test of prefab function
    tileMap.insertPrefab(rooms.room1, 10, 10);
    for(let i = 0; i < 10; i++){
        let x = Math.floor(Math.random() * tileMap.widthInTiles);
        let y = Math.floor(Math.random() * tileMap.heightInTiles);
        tileMap.insertPrefab(rooms.room1, x, y)
    }

    //columns prefab to test wall jump
    tileMap.insertPrefab(rooms.columns, 20, 20);

    //fill bottom half of map with exploding blocks
    tileMap.tileFillRect(0, tileMap.heightInTiles/2, tileMap.widthInTiles, tileMap.heightInTiles/2, 6);

}

function populateMap(){
    for (let i = 0; i < 4000; i++) {
        //actors.push(new Ore(Math.random() * tileMap.widthInTiles * tileMap.tileWidth, Math.random() * tileMap.heightInTiles * tileMap.tileHeight));
    }
}
window.addEventListener('keyup', function (event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function (event) { Key.onKeydown(event); }, false);
window.addEventListener('blur', function (event) { paused = true; }, false);
window.addEventListener('focus', function (event) { paused = false; }, false);



init();