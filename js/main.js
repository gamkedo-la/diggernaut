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

//buffer canvas for colored text, or other effects
bufferCanvas = document.createElement("canvas");
bufferCanvas.width = canvas.width;
bufferCanvas.height = canvas.height;
bufferContext = bufferCanvas.getContext("2d");




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
    caveTileset = new Tileset(
        img["basic-tiles"], 
        {tileWidth: 32, tileHeight: 32,
        tileCount: 16, tileColumns: 10, tileRows: 1});
    
    console.log('loading complete, starting game')
    sounds = loader.sounds;
    generateMap(mapConfig);    
    populateMap();

    player = new Player(playerSettings),
    gameFont = new spriteFont(255, 128, 6, 9, img["smallFont"])
    tinyFont = new spriteFont(320, 240, 4, 6, img["3x5font"])
    processURLQuery();
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
    if(Key.justReleased(Key.f)) {
        canvas.requestFullscreen();
    }
    if(Key.justReleased(Key.ESCAPE)) {
        canvas.exitFullscreen();
    }
    Key.update();
}

function generateMap(config){

    tileMap = new TileMap(config.widthInTiles, config.heightInTiles, config.tileSize, config.tileSize);
    ui.miniMap = new uiMinimap(tileMap);
    let choices = mapConfig.caveGenPools.fallingFun;
    let mapYstartOffset = config.mapStartY * config.widthInTiles;
    let mapTotalTiles = config.widthInTiles * config.heightInTiles;
    
    for (let i = mapYstartOffset; i < mapTotalTiles;  i++) {
        tileMap.data[i] = choices[ Math.floor(mapRNG() * choices.length) ];
    }
    
    //random tiny holes
    for(let i = 0; i < 12000; i++){
        const x = Math.floor(mapRNG() * tileMap.widthInTiles);
        const y = Math.floor(mapRNG() * tileMap.heightInTiles);
        tileMap.tileFillRect(x, y, 1, 1, 0);
        //tileMap.data[i] = 0;
    }

    //random room sized voids
    for(let i = 0; i < 200; i++){
        const x = Math.floor(mapRNG() * tileMap.widthInTiles);
        const y = Math.floor(mapRNG() * tileMap.heightInTiles);
        tileMap.tileFillRect(x, y, 10, 10, 0);
    }

    //random giant gaps -fall spaces
    for(let i = 0; i < 20; i++){
        //const x = Math.floor(mapRNG() * tileMap.widthInTiles);
        const startY = Math.floor(mapRNG() * tileMap.heightInTiles);
        const gapHeight = Math.floor(mapRNG() * 200 + 150);   
        let i = 300;
        while(i--){
            let x = Math.floor(mapRNG() * tileMap.widthInTiles);
            let y = Math.floor(startY + mapRNG() * gapHeight);
            tileMap.tileFillRect(x, y, 10, 10, 0);
        }
        
    }

    //random round voids, random size
    for(let i = 0; i < 200; i++){
        const x = Math.floor(mapRNG() * tileMap.widthInTiles);
        const y = Math.floor(mapRNG() * tileMap.heightInTiles);
        const radius = Math.floor(mapRNG() * 8 + 2);
        tileMap.tileFillCircle(x, y, radius, 0);
    }

    //random round blobs, random size
    for(let i = 0; i < 200; i++){
        const x = Math.floor(mapRNG() * tileMap.widthInTiles);
        const y = Math.floor(mapRNG() * tileMap.heightInTiles);
        const radius = Math.floor(mapRNG() * 8 + 2);
        tileMap.tileFillCircle(x, y, radius, 1);
    }

    //random ledges of random length
    for(let i = 0; i < 300; i++){
        const x = Math.floor(mapRNG() * tileMap.widthInTiles);
        const y = Math.floor(mapRNG() * tileMap.heightInTiles);
        const length = Math.floor(mapRNG() * 8 + 4);
        tileMap.tileFillRect(x, y, length, 1, 0);
    }

    //test of prefab function
    for(let i = 0; i < 10; i++){
        const x = Math.floor(mapRNG() * tileMap.widthInTiles);
        const y = Math.floor(mapRNG() * tileMap.heightInTiles);
        tileMap.insertPrefab(rooms.room1, x, y)
    }

    tileMap.insertPrefab(rooms["c-shelter"], 10, 16)
    //columns prefab to test wall jump
    tileMap.insertPrefab(rooms.columns, 20, 20);

    //fill bottom half of map with exploding blocks
    //tileMap.tileFillRect(0, tileMap.heightInTiles/2, tileMap.widthInTiles, tileMap.heightInTiles/2, 6);

    //fill two columns at left and right edge with unbreakable blocks
    tileMap.tileFillRect(0, 0, 1, tileMap.heightInTiles, 3);
    tileMap.tileFillRect(tileMap.widthInTiles-1, 0, 1, tileMap.heightInTiles, 3);

    //full update on ui minimap
    ui.miniMap.update();

}

function populateMap(){
    for (let i = 0; i < 100; i++) {
        actors.push(new Flyer(mapRNG() * tileMap.widthInTiles * tileMap.tileWidth, mapRNG() * mapConfig.tileSize * mapConfig.mapStartY));
    }
}
window.addEventListener('keyup', function (event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function (event) { Key.onKeydown(event); }, false);
window.addEventListener('blur', function (event) { paused = true; }, false);
window.addEventListener('focus', function (event) { paused = false; }, false);
canvas.addEventListener('mouseup', function (event) { audio.context.resume(); audio.playSound(sounds.test1); titleScreen.clicked=true }, false);

/*processURLQuery will check to see if there's a query on window location, which could include pre-setting many
in-game variables to recreate a state, a saved game, or debugging.
*/
function processURLQuery(){
    //check window location for query
    let query = window.location.search;
    if(query.length > 0){
        parsedQuery = new URLSearchParams(query);
        //if there's a query, check for specific variables
        setState(parsedQuery);
    }
}

function setState(parsedQuery){
    const player_y = parsedQuery.get('playerY');
    const playerHealth = parsedQuery.get('playerHealth');
    const player_x = parsedQuery.get('playerX');
    if(player_y){
        player.y = parseInt(player_y)
        console.log(`player y set to ${player_y}`);
    }
    if(playerHealth){
        player.health = parseInt(playerHealth)
        console.log(`player health set to ${playerHealth}`);
    }
    if(player_x){
        player.x = parseInt(player_x)
        console.log(`player x set to ${player_x}`);
    }
    player.updateCollider(player.x, player.y);

}
  

init();