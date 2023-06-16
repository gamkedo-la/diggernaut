//custom even Listener setup
var signal = new Signal();
const stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

//canvas setup
canvas = document.getElementById("canvas");
canvasContext = canvas.getContext("2d", { alpha: false });
canvas.imageSmoothingEnabled = false;
canvas.style.imageRendering = "pixelated";
canvas.width = 544;
canvas.height = 306;

//buffer canvas for colored text, or other effects
bufferCanvas = document.createElement("canvas");
bufferCanvas.width = canvas.width;
bufferCanvas.height = canvas.height;
bufferContext = bufferCanvas.getContext("2d", { alpha: false });

//buffer canvas for colored text, or other effects
bloomCanvas = document.createElement("canvas");
bloomCanvas.width = canvas.width;
bloomCanvas.height = canvas.height;
bloomContext = bloomCanvas.getContext("2d", { alpha: false });

let gameState = GAMESTATE_TITLE,
 ticker = 0,
 loader = new AssetLoader(),
 audio = new AudioGlobal(),
 fps = FRAMERATE,
 img, gameFont, tinyFont, tileMap, player, then, startTime, fpsInterval, g

const tileSets = {};
const actors = [];
const uiActors = [];

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
    // console.log('loading sounds');
    loader.soundLoader({ context: audio.context, urlList: soundList, callback: loadingComplete });
    loader.loadAudioBuffer();
}

function loadingComplete() {

    
    generateSpriteFonts();
    processURLQuery();
    generateTilesets();
    let ready = gameSetup();
    if(ready){begin(fps);}
    //begin(fps);
}

function generateSpriteFonts() {
    gameFont = new spriteFont(255, 128, 6, 9, img["smallFont"])
    bigFont = new spriteFont(510, 128*4, 12, 36, img["bigFont"])
    bigFontBlack = new spriteFont(510, 128*4, 12, 36, img["bigFont"], 0, 72)
    bigFontOrangeGradient = new spriteFont(510, 128*4, 12, 36, img["bigFont"], 0, 72*2)
    bigFontBlue = new spriteFont(510, 128*4, 12, 36, img["bigFont"], 0, 72*3)
    bigFontGreen = new spriteFont(510, 128*4, 12, 36, img["bigFont"], 0, 72*4)
    bigFontRed = new spriteFont(510, 128*4, 12, 36, img["bigFont"], 0, 72*5)
    tinyFont = new spriteFont(320, 240, 4, 6, img["3x5font"])
}

function generateTilesets() {
    tileSets.caveTileset = new Tileset(
        img["autoTiles"], 
        {tileWidth: 32, tileHeight: 32, tileCount: 16*10, tileColumns: 16, tileRows: 10});

    tileSets.damageTileset = new Tileset(
        img["damage"],
        {tileWidth: 32, tileHeight: 32, tileCount: 10, tileColumns: 10, tileRows: 1}
    )

    tileSets.splode_7px = new Tileset(
        img["splode_7px"],
        {tileWidth: 7, tileHeight: 7, tileCount: 7, tileColumns: 7, tileRows: 1}
    )

    tileSets.splode_17px = new Tileset(
        img["splode_17px"],
        {tileWidth: 17, tileHeight: 17, tileCount: 7, tileColumns: 7, tileRows: 1}
    )

    tileSets.splode_25px = new Tileset(
        img["splode_25px"],
        {tileWidth: 25, tileHeight: 25, tileCount: 7, tileColumns: 7, tileRows: 1}
    )

    tileSets.gems = new Tileset(
        img["gems"],
        {tileWidth: 32, tileHeight: 32, tileCount: 16, tileColumns: 4, tileRows: 4}
    )

    tileSets.bones = new Tileset(
        img["bones"],
        {tileWidth: 32, tileHeight: 32, tileCount: 16, tileColumns: 4, tileRows: 4}
    )

    tileSets.gemSilhouettes = new Tileset(
        img["gems_silhouettes"],
        {tileWidth: 32, tileHeight: 32, tileCount: 16, tileColumns: 4, tileRows: 4}
    )

    tileSets.boneSilhouettes = new Tileset(
        img["bone_silhouettes"],
        {tileWidth: 32, tileHeight: 32, tileCount: 28, tileColumns: 7, tileRows: 4}
    )

    tileSets.glow_64px = new Tileset(
        img["64px-glow"],
        {tileWidth: 64, tileHeight: 64, tileCount: 4, tileColumns: 4, tileRows: 1}
    )
    
    tileSets.glow_32px = new Tileset(
        img["32px-glow"],
        {tileWidth: 32, tileHeight: 32, tileCount: 4, tileColumns: 4, tileRows: 1}
    )

    tileSets.glow_16px = new Tileset(
        img["16px-glow"],
        {tileWidth: 16, tileHeight: 16, tileCount: 4, tileColumns: 4, tileRows: 1}
    )
    tileSets.splode_glow = new Tileset(
        img["splode-glow"],
        {tileWidth: 64, tileHeight: 64, tileCount: 7, tileColumns: 7, tileRows: 1}
    )
    tileSets.splode_glow32px = new Tileset(
        img["splode-glow32px"],
        {tileWidth: 32, tileHeight: 32, tileCount: 12, tileColumns: 12, tileRows: 1}
    )
    tileSets.splode_dirt7px = new Tileset(
        img["dirt_splode_7px"],
        {tileWidth: 7, tileHeight: 7, tileCount: 7, tileColumns: 7, tileRows: 1}
    )
    tileSets.ui_icons = new Tileset(
        img["ui-icons"],
        {tileWidth: 11, tileHeight: 11, tileCount: 4, tileColumns: 4, tileRows: 1}
    )
    tileSets.tentacle_arm = new Tileset(
        img["tentacle-arm"],
        {tileWidth: 32, tileHeight: 32, tileCount: 19, tileColumns: 19, tileRows: 1}
    )
    tileSets.tentacle_block = new Tileset(
        img["tentacle-block"],
        {tileWidth: 32, tileHeight: 32, tileCount: 5, tileColumns: 5, tileRows: 1}
    )
}

async function gameSetup() {
    
    player = new Player(playerSettings),
    collectibles = createCollectibles(tileSets);
    depthAwards = createDepthAwards(DEPTH_MILESTONES);
    blueUpgrades = createBlueUpgrades(BLUE_UPGRADES);
    goldUpgrades = createGoldUpgrades(GOLD_UPGRADES);

    sounds = loader.sounds;
    generateMap(mapConfig);    
    populateMap(mapConfig);
    explosionCollider = new Collider(0,0,32*5, 32*5, {left: 0, right: 0, up: 0, down: 0});

    return 1;
}

function begin(fps) {
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    Joy.init();
    console.log('loading complete, starting game')
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
    Key.update();
    Joy.update();
}

function applyCellularAutomaton(mapData, width, height) {
    const newMapData = mapData.slice();
  
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const index = x + y * width;
        const neighborIndices = getNeighborIndices(x, y, width, height);
        const neighborTiles = neighborIndices.map(i => mapData[i]);
  
        const emptyNeighbors = neighborTiles.filter(tile => tile === TILE_EMPTY)
          .length;
  
        if (
          mapData[index] > 0 &&
          emptyNeighbors >= 5 // Adjust the threshold to control the "openness" of the map
        ) {
          newMapData[index] = TILE_EMPTY;
        }
      }
    }
  
    return newMapData;
  }
  
  function getNeighborIndices(x, y, width, height) {
    const indices = [];
  
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = x + dx;
        const ny = y + dy;
  
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          indices.push(nx + ny * width);
        }
      }
    }
  
    return indices;
  }
  

function generateMap(config){

    tileMap = new TileMap(config.widthInTiles, config.heightInTiles, config.tileSize, config.tileSize);
    //ui.miniMap = new uiMinimap(tileMap);

    let choices = mapConfig.caveGenPools.vanilla;
    let mapYstartOffset = config.mapStartY * config.widthInTiles;
    let mapTotalTiles = config.widthInTiles * config.heightInTiles;
    
    for (let i = mapYstartOffset; i < mapTotalTiles;  i++) {
        tileMap.data[i] = choices[ Math.floor(mapRNG() * choices.length) ];
    }

        //random giant gaps -fall spaces
    for(let i = 0; i < 30; i++){
        //const x = Math.floor(mapRNG() * tileMap.widthInTiles);
        const startY = Math.floor(mapRNG() * tileMap.heightInTiles);
        const gapHeight = Math.floor(mapRNG() * 70 + 40);   
        let i = 300;
        while(i--){
            let x = Math.floor(mapRNG() * tileMap.widthInTiles);
            let y = Math.floor(startY + mapRNG() * gapHeight);
            tileMap.tileFillRect(x, y, 10, 10, 0);
        }
    }


    for (let i = 0; i < 8; i++) {
        tileMap.data = applyCellularAutomaton(tileMap.data, tileMap.widthInTiles, tileMap.heightInTiles);
    }    


    
    // //random tiny holes
    // for(let i = 0; i < 1200; i++){
    //     const x = Math.floor(mapRNG() * tileMap.widthInTiles);
    //     const y = Math.floor(mapRNG() * tileMap.heightInTiles);
    //     tileMap.tileFillRect(x, y, 2, 2, 0);
    // }

    // //random room sized voids
    // for(let i = 0; i < 1000; i++){
    //     const x = Math.floor(mapRNG() * tileMap.widthInTiles);
    //     const y = Math.floor(mapRNG() * tileMap.heightInTiles);
    //     tileMap.tileFillRect(x, y, 10, 10, 0);
    // }

    

    

    //more random little rooms
    for(let i = 0; i < 700; i++){
        tileMap.insertPrefab(rooms.hallway, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        tileMap.insertPrefab(rooms.well, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        tileMap.insertPrefab(rooms.plus, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        //tileMap.insertPrefab(rooms.checkerboard, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles - config.mapStartY));
        tileMap.insertPrefab(rooms.pipe, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles - config.mapStartY));
        //tileMap.insertPrefab(rooms.longhallway, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles - config.mapStartY));
        tileMap.insertPrefab(rooms.stairsleft, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        tileMap.insertPrefab(rooms.stairsright, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        tileMap.insertPrefab(rooms.hut, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        tileMap.insertPrefab(rooms.t_intersection, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        tileMap.insertPrefab(rooms.platform, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
    }

    //more smoothing
    for (let i = 0; i < 3; i++) {
        tileMap.data = applyCellularAutomaton(tileMap.data, tileMap.widthInTiles, tileMap.heightInTiles);
    }

     //more random little rooms
     for(let i = 0; i < 300; i++){
        tileMap.insertPrefab(rooms.hallway, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        tileMap.insertPrefab(rooms.well, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        tileMap.insertPrefab(rooms.plus, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        //tileMap.insertPrefab(rooms.checkerboard, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles - config.mapStartY));
        tileMap.insertPrefab(rooms.pipe, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles - config.mapStartY));
        //tileMap.insertPrefab(rooms.longhallway, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles - config.mapStartY));
        tileMap.insertPrefab(rooms.stairsleft, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        tileMap.insertPrefab(rooms.stairsright, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        tileMap.insertPrefab(rooms.hut, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        tileMap.insertPrefab(rooms.t_intersection, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
        tileMap.insertPrefab(rooms.platform, Math.floor(mapRNG() * tileMap.widthInTiles), config.mapStartY + Math.floor(mapRNG() * tileMap.heightInTiles));
    }

    //more smoothing
    for (let i = 0; i < 1; i++) {
        tileMap.data = applyCellularAutomaton(tileMap.data, tileMap.widthInTiles, tileMap.heightInTiles);
    }

    //random round blobs of dense rock and ore, random size

    // for(let i = 0; i < 400; i++){
    //     const x = Math.floor(mapRNG() * tileMap.widthInTiles);
    //     const y = Math.floor(mapRNG() * tileMap.heightInTiles);
    //     const radius = 8;
    //     tileMap.tileFillCircle(x, y, radius, mapConfig.caveGenPools.fallingFun);
    // }

    // for(let i = 0; i < 400; i++){
    //     const x = Math.floor(mapRNG() * tileMap.widthInTiles);
    //     const y = Math.floor(mapRNG() * tileMap.heightInTiles);
    //     const radius = 8;
    //     tileMap.tileFillCircle(x, y, radius, mapConfig.caveGenPools.oreGalore);
    // }

    //random giant gaps -fall spaces
    // for(let i = 0; i < 10; i++){
    //     //const x = Math.floor(mapRNG() * tileMap.widthInTiles);
    //     const startY = Math.floor(mapRNG() * tileMap.heightInTiles);
    //     const gapHeight = Math.floor(mapRNG() * 200 + 150);   
    //     let i = 300;
    //     while(i--){
    //         let x = Math.floor(mapRNG() * tileMap.widthInTiles);
    //         let y = Math.floor(startY + mapRNG() * gapHeight);
    //         tileMap.tileFillRect(x, y, 10, 10, 0);
    //     }
    // }

    //fill two columns at left and right edge with unbreakable blocks
    tileMap.tileFillRect(0, 0, 1, tileMap.heightInTiles, 3);
    tileMap.tileFillRect(tileMap.widthInTiles-1, 0, 1, tileMap.heightInTiles, 3);

    

    //empty circle around player
    tileMap.tileFillCircle(player.x / tileMap.tileWidth, playerSettings.y / tileMap.tileHeight, 3, 0);
    tileMap.tileFillRect(0, 0, 70, 20, 0);
    tileMap.tileFillRect(0, 20, 70, 2, 1);

    //big block of random tiles under player start
    // for (let i = mapYstartOffset; i < 10*70;  i++) {
    //     tileMap.data[i] = choices[ Math.floor(mapRNG() * choices.length) ];
    // }

    //full update on autotiles
    tileMap.updateAutoTiles(0,0, tileMap.widthInTiles, tileMap.heightInTiles);

}

function populateMap(config){

    //TODO
    /* break this down into a function that spawn more enemies ahead of player at certain depth intervals,
        and different subsets of enemies at different depths
    */

    for (let i = 0; i < 10000; i++) {
        let x = Math.floor(mapRNG() * tileMap.widthInTiles);
        let y = Math.floor(mapRNG() * tileMap.heightInTiles);
        if(tileMap.getTileAtPosition(x, y) === TILE_EMPTY){
            actors.push(
                new Flyer(x * tileMap.tileWidth, y * tileMap.tileHeight)
            )
        }
    }

    for (let i = 0; i < 5000; i++) {
        let x = Math.floor(mapRNG() * tileMap.widthInTiles);
        let y = Math.floor(mapRNG() * tileMap.heightInTiles);
        if(tileMap.getTileAtPosition(x, y) === TILE_EMPTY){
            //check downward until we find a solid tile
            while(tileMap.getTileAtPosition(x, y) === TILE_EMPTY){
                y++;
            }
            actors.push( new Crawler(x * tileMap.tileWidth, (y-1) * tileMap.tileHeight) )
        }
    }

    for (let i = 0; i < 5000; i++) {
        let x = Math.floor(mapRNG() * tileMap.widthInTiles);
        let y = Math.floor(mapRNG() * tileMap.heightInTiles);
        if(tileMap.getTileAtPosition(x, y) === TILE_EMPTY){
            //check downward until we find a solid tile
            while(tileMap.getTileAtPosition(x, y) === TILE_EMPTY){
                y++;
            }
            actors.push( new Stalagmite(x * tileMap.tileWidth, (y-1) * tileMap.tileHeight) )
        }
    }

     //create tentacles
     for(let i = 0; i < 1000; i++){
        let x = Math.floor(rand(3, 68))
        let y = Math.floor(rand(40, 2000))
        //make x and y multiples of 32
        x = x * 32;
        y = y * 32;
        //set tile to empty
        tileMap.setTileAtPixelPosition(x, y, TILE_EMPTY);
        actors.push(new Tentacle(x, y));
    }

    //create collectibles
    for(let i = 0; i < collectibles.Treasure.length; i++){
        let yChunkHeight = Math.floor( tileMap.heightInTiles / collectibles.Treasure.length )
        let yChunkStart = yChunkHeight * i;
        let yChunkEnd = yChunkHeight * (i+1);
        let x = Math.floor(rand(3, tileMap.widthInTiles - 3));
        let y = Math.floor(rand(yChunkStart, yChunkEnd));
        if(tileMap.getTileAtPosition(x, y) === TILE_EMPTY){
            //check downward until we find a solid tile
            while(tileMap.getTileAtPosition(x, y) === TILE_EMPTY){
                y++;
            }
            tileMap.setTileAtPosition(x, y, TILE_EMPTY);
            actors.push(
                new Collectible( x * tileMap.tileWidth, y * tileMap.tileHeight,
                    "Treasure",
                    collectibles.Treasure[i])
            )
            tileMap.treasureTiles[x + y * tileMap.widthInTiles] = 1;
        }else{
            tileMap.setTileAtPosition(x, y, TILE_EMPTY);
            actors.push(
                new Collectible( x * tileMap.tileWidth, y * tileMap.tileHeight,
                    "Treasure",
                    collectibles.Treasure[i])
            )
        }
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