/*
https://patorjk.com/software/taag/#p=display&f=Varsity&t=Text%20Banners!
   ____ _       _           _    ____                _       
  / ___| | ___ | |__   __ _| |  / ___|___  _ __  ___| |_ ___ 
 | |  _| |/ _ \| '_ \ / _` | | | |   / _ \| '_ \/ __| __/ __|
 | |_| | | (_) | |_) | (_| | | | |__| (_) | | | \__ \ |_\__ \
  \____|_|\___/|_.__/ \__,_|_|  \____\___/|_| |_|___/\__|___/
                                                             
*/
const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;


//TODO: maybe roll all the tile data into a single object?
//have to be able to access the tile type by index, but also by name
const TILE_EMPTY = 0;
const TILE_DIRT = 1;
const TILE_UNBREAKABLE_STONE = 2;
const TILE_UNBREAKABLE_METAL = 3;
const TILE_UNOBTANIUM = 4;
const TILE_FALLING_ROCK = 5;
const TILE_EXPLOSIVE = 6;
const TILE_DENSE_UNOBTANIUM = 7;
const TILE_ROCK = 8;
const TILE_DENSE_ROCK = 9;

const TILE_TYPES = [
    "TILE_EMPTY",
    "TILE_DIRT",
    "TILE_UNBREAKABLE_STONE",
    "TILE_UNBREAKABLE_METAL",
    "TILE_UNOBTANIUM",
    "TILE_FALLING_ROCK",
    "TILE_EXPLOSIVE",
    "TILE_DENSE_UNOBTANIUM",
    "TILE_ROCK",
    "TILE_DENSE_ROCK"
]

const damageValues = [
    100, //TILE_EMPTY
    100, //TILE_DIRT
    0, //TILE_UNBREAKABLE_STONE
    0, //TILE_UNBREAKABLE_METAL
    100, //TILE_UNOBTANIUM
    100, //TILE_FALLING_ROCK
    0, //TILE_EXPLOSIVE
    25, //TILE_DENSE_UNOBTANIUM
    100, //TILE_ROCK
    100, //TILE_DENSE_ROCK
]


const GAMESTATE_TITLE = 0
const GAMESTATE_PLAY = 1;
const GAMESTATE_GAME_OVER = 2;
const GAMESTATE_CREDITS = 3;
const GAMESTATE_INVENTORY = 4;
const GAMESTATE_MAP = 5;
const FRAMERATE = 60;

const screens = [];
screens[GAMESTATE_TITLE] = titleScreen;
screens[GAMESTATE_PLAY] = playScreen;
screens[GAMESTATE_GAME_OVER] = gameOverScreen;
screens[GAMESTATE_CREDITS] = creditsScreen;
screens[GAMESTATE_INVENTORY] = inventoryScreen;
screens[GAMESTATE_MAP] = mapScreen;

const TYPE_PARTICLE = 0;
const DIGGERANG_COST = 50;

const view = {
    x: 0,
    y: 0,
    width: 544,
    height: 306,
}
const mapConfig = {
    widthInTiles: 40,
    heightInTiles: 7000,
    chasmWidth: 24,
    tileSize: 32,
    mapStartY: 20, //start generating tiles at this Y position
    choicePool:  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                  1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                  1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,3,4,5,6,7]
}

// Setting seed to a specific value causes mapRNG to run the same sequence of numbers each time it restarts
let seed = Math.random();
const mapRNG = new Math.seedrandom(seed);

var sounds = {};
var caveTileset = {};

const inventory = {
    collections: {
        gems: {
            rubies: {
                one: {
                    collected: false,
                    sprite: "gem1"
                },
                two: {
                    collected: false,
                    sprite: "gem2"
                },
                three: {
                    collected: false,
                    sprite: "gem3"
                },
                four: {
                    collected: false,
                    sprite: "gem4"
                }
            },
            sapphires: {
                one: {
                    collected: false,
                    sprite: "gem5"
                },
                two: {
                    collected: false,
                    sprite: "gem6"
                },
                three: {
                    collected: false,
                    sprite: "gem7"
                },
                four: {
                    collected: false,
                    sprite: "gem8"
                }
            }
        },
        artifacts: {
            tech: {
                one: {
                    collected: false,
                    sprite: "tech1"
                },
                two: {
                    collected: false,
                    sprite: "tech2"
                },
                three: {
                    collected: false,
                    sprite: "tech3"
                },
                four: {
                    collected: false,
                    sprite: "tech4"
                }
            },
            pottery: {
                one: {
                    collected: false,
                    sprite: "pottery1"
                },
                two: {
                    collected: false,
                    sprite: "pottery2"
                },
                three: {
                    collected: false,
                    sprite: "pottery3"
                },
                four: {
                    collected: false,
                    sprite: "pottery4"
                }
            }
        },
        bones: {
            pterosaur: {
                one: {
                    collected: false,
                    sprite: "bone1"
                },
                two: {
                    collected: false,
                    sprite: "bone2"
                },
                three: {
                    collected: false,
                    sprite: "bone3"
                },
                four: {
                    collected: false,
                    sprite: "bone4"
                },
                five: {
                    collected: false,
                    sprite: "bone5"
                }   
            },
            triceratops: {
                one: {
                    collected: false,
                    sprite: "bone6"
                },
                two: {
                    collected: false,
                    sprite: "bone7"
                },
                three: {
                    collected: false,
                    sprite: "bone8"
                },
                four: {
                    collected: false,
                    sprite: "bone9"
                },
                five: {
                    collected: false,
                    sprite: "bone10"
                }
            }
        }
    }
}

/**
                                                                                                                                                  
@@@@@@@    @@@@@@   @@@@@@@   @@@@@@@  @@@   @@@@@@@  @@@       @@@@@@@@     @@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@@   @@@@@@@  @@@@@@@   @@@@@@   
@@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@  @@@  @@@@@@@@  @@@       @@@@@@@@     @@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@  @@@@@@@   
@@!  @@@  @@!  @@@  @@!  @@@    @@!    @@!  !@@       @@!       @@!          @@!       @@!       @@!       @@!       !@@         @@!    !@@       
!@!  @!@  !@!  @!@  !@!  @!@    !@!    !@!  !@!       !@!       !@!          !@!       !@!       !@!       !@!       !@!         !@!    !@!       
@!@@!@!   @!@!@!@!  @!@!!@!     @!!    !!@  !@!       @!!       @!!!:!       @!!!:!    @!!!:!    @!!!:!    @!!!:!    !@!         @!!    !!@@!!    
!!@!!!    !!!@!!!!  !!@!@!      !!!    !!!  !!!       !!!       !!!!!:       !!!!!:    !!!!!:    !!!!!:    !!!!!:    !!!         !!!     !!@!!!   
!!:       !!:  !!!  !!: :!!     !!:    !!:  :!!       !!:       !!:          !!:       !!:       !!:       !!:       :!!         !!:         !:!  
:!:       :!:  !:!  :!:  !:!    :!:    :!:  :!:        :!:      :!:          :!:       :!:       :!:       :!:       :!:         :!:        !:!   
 ::       ::   :::  ::   :::     ::     ::   ::: :::   :: ::::   :: ::::      :: ::::   ::        ::        :: ::::   ::: :::     ::    :::: ::   
 :         :   : :   :   : :     :     :     :: :: :  : :: : :  : :: ::      : :: ::    :         :        : :: ::    :: :: :     :     :: : :    
                                                                                                                                                  
**/

const particleDefinitions = {

    sparks: function(){
        return{
        quantity: 3,
        color: () => "yellow",
        life: () => 10,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(0, 1),
        gravity: () => rand(0, 0.1),
        }
    },

    fallSparks: function(){
        return{
        quantity: 50,
        color: () => "orange",
        life: () => 30,
        xVelocity: () => 0,
        yVelocity: () => rand(-.5, 0.1),
        gravity: () => rand(-0.5, 0.5),
        }
    },

    jumpPuff: function(){
        return{
        quantity: 20,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(-.5, -2),
        color:  () => "white",
        life: () => rand(5, 20),
        gravity: () => rand(0, 0.1),
        }
    },

    hurt: function(){
        return{
        quantity: 100,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(-.5, -2),
        color:  () => "red",
        life: () => rand(5, 20),
        gravity: () => rand(0, 0.1),
        }
    },

    explodingTile: function(){
        return{
        quantity: 20,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(-.5, -2),
        color:  () => "red",
        life: () => rand(5, 20),
        gravity: () => rand(0, 0.1),
        }
    },

    destroyDirt: function(){
        return{
        quantity: 40,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(-.5, -2),
        color:  () => "brown",
        life: () => rand(5, 20),
        gravity: () => rand(0, 0.1),
        }
    },

    wallJumpLeft: function(){
        return{
        quantity: 100,
        xVelocity: () => rand(0, 2),
        yVelocity: () => rand(-1, 1),
        color: () => ["white", "yellow"][randInt(0, 1)],
        life: () => rand(5, 20),
        gravity: () => rand(0, 0.1),
        }
    },

    wallJumpRight: function(){
        return{
        quantity: 100,
        xVelocity: () => rand(0, -2),
        yVelocity: () => rand(-1, 1),
        color: () => ["white", "yellow"][randInt(0, 1)],
        life: () => rand(5, 20),
        gravity: () => rand(0, 0.1),
        }
    }
}

/*
   ____                           _                 _       
  / ___| __ _ _ __ ___   ___     / \   ___ ___  ___| |_ ___ 
 | |  _ / _` | '_ ` _ \ / _ \   / _ \ / __/ __|/ _ \ __/ __|
 | |_| | (_| | | | | | |  __/  / ___ \\__ \__ \  __/ |_\__ \
  \____|\__,_|_| |_| |_|\___| /_/   \_\___/___/\___|\__|___/
                                                            
*/

const imageList = [
    //image loader assumes .png and appends it. all images should be in /src/img/.
    'smallFont',
    '3x5font',
    'earthTiles',
    'placeholder-player',
    'basic-tiles',
    'minimap'
]

const soundList = [
    { name: "test1", url: "snd/test1.mp3" },
    { name: "test2", url: "snd/test2.mp3" },
    { name: "shovel_on_metal", url: "snd/shovel_on_metal.ogg" },
    { name: "shovel_on_metal_2", url: "snd/shovel_on_metal_2.ogg" },
    { name: "pickup", url: "snd/pickup.ogg" },
    { name: "super_pickup", url: "snd/super_pickup.ogg" },
    { name: "rock_crumble_1", url: "snd/rock_crumble_1.ogg" },
    { name: "rock_crumble_2", url: "snd/rock_crumble_2.ogg" },
    { name: "rock_crumble_3", url: "snd/rock_crumble_3.ogg" },
    { name: "explosion_1", url: "snd/explosion_1.ogg" },
    { name: "explosion_2", url: "snd/explosion_2.ogg" },
    { name: "explosion_3", url: "snd/explosion_3.ogg" },
    { name: "diggerang_whoosh", url: "snd/boomerang_repeat.ogg" },
    { name: "digging_dirt", url: "snd/digging_dirt.ogg" },

]

//TODO:  shorten digging_dirt sound, make dirt it's own tile type
const rock_crumbles = [ "rock_crumble_1", "rock_crumble_2", "rock_crumble_3", "digging_dirt" ]
const explosions = [ "explosion_1", "explosion_2", "explosion_3" ]
const metal_dings = [ "shovel_on_metal", "shovel_on_metal_2" ]


/*
                                                                                                          
@@@@@@@  @@@  @@@       @@@@@@@@     @@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@@   @@@@@@@  @@@@@@@   @@@@@@   
@@@@@@@  @@@  @@@       @@@@@@@@     @@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@@  @@@@@@@  @@@@@@@   
  @@!    @@!  @@!       @@!          @@!       @@!       @@!       @@!       !@@         @@!    !@@       
  !@!    !@!  !@!       !@!          !@!       !@!       !@!       !@!       !@!         !@!    !@!       
  @!!    !!@  @!!       @!!!:!       @!!!:!    @!!!:!    @!!!:!    @!!!:!    !@!         @!!    !!@@!!    
  !!!    !!!  !!!       !!!!!:       !!!!!:    !!!!!:    !!!!!:    !!!!!:    !!!         !!!     !!@!!!   
  !!:    !!:  !!:       !!:          !!:       !!:       !!:       !!:       :!!         !!:         !:!  
  :!:    :!:   :!:      :!:          :!:       :!:       :!:       :!:       :!:         :!:        !:!   
   ::     ::   :: ::::   :: ::::      :: ::::   ::        ::        :: ::::   ::: :::     ::    :::: ::   
   :     :    : :: : :  : :: ::      : :: ::    :         :        : :: ::    :: :: :     :     :: : :    
                                                                                                          
*/

const destroyTileWithEffects = {
    TILE_EMPTY : function () { return; },

    TILE_DIRT : function (tileIndex) {
        tileMap.replaceTileAt(tileIndex, TILE_EMPTY);
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.destroyDirt);
        audio.playSound(sounds[randChoice(rock_crumbles)])
    },

    TILE_UNBREAKABLE_STONE : function (tileIndex) {
        tileMap.replaceTileAt(tileIndex, TILE_EMPTY);
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.destroyDirt);
        audio.playSound(sounds[randChoice(rock_crumbles)])
    },

    TILE_UNBREAKABLE_METAL : function (tileIndex) {
        tileMap.replaceTileAt(tileIndex, TILE_EMPTY);
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.destroyDirt);
        audio.playSound(sounds[randChoice(rock_crumbles)])
    },

    TILE_UNOBTANIUM : function (tileIndex) {
        tileMap.replaceTileAt(tileIndex, TILE_EMPTY);
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.destroyDirt);
        audio.playSound(sounds[randChoice(rock_crumbles)])
        audio.playSound(sounds.pickup);
        let i = 10;
        while(--i){ actors.push(new Ore(x, y))}  
    },

    TILE_FALLING_ROCK : function (tileIndex) {
        tileMap.replaceTileAt(tileIndex, TILE_EMPTY);
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.destroyDirt);
        audio.playSound(sounds[randChoice(rock_crumbles)])
    },

    TILE_EXPLOSIVE : function (startTileIndex) {
       
    },

    TILE_DENSE_UNOBTANIUM : function (tileIndex) {
        tileMap.replaceTileAt(tileIndex, TILE_UNOBTANIUM);
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.destroyDirt);
        audio.playSound(sounds[randChoice(rock_crumbles)])
    },

    TILE_ROCK : function (tileIndex) {
        tileMap.replaceTileAt(tileIndex, TILE_EMPTY);
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.destroyDirt);
        audio.playSound(sounds[randChoice(rock_crumbles)])
    },

    TILE_DENSE_ROCK : function (tileIndex) {
        tileMap.replaceTileAt(tileIndex, TILE_EMPTY);
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.destroyDirt);
        audio.playSound(sounds[randChoice(rock_crumbles)])
    }
}

const damageTileWithEffects = {
    
    TILE_EMPTY : function (tileIndex) { },
    TILE_DIRT : function (tileIndex) {
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.jumpPuff);
    },
    TILE_UNBREAKABLE_STONE : function (tileIndex) { 
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.jumpPuff);
        audio.playSound(sounds[randChoice(metal_dings)])
    },
    TILE_UNBREAKABLE_METAL : function (tileIndex) {
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.jumpPuff);
        audio.playSound(sounds[randChoice(metal_dings)])
    },
    TILE_UNOBTANIUM : function (tileIndex) { 

    },
    TILE_FALLING_ROCK : function (tileIndex) { 
        
    },
    TILE_EXPLOSIVE : function (startTileIndex) { 
        let i = 25;
        while(--i){
            const x = i % 5;
            const y = Math.floor(i / 5);
            const tileIndex = startTileIndex + x - 2 + (y - 2) * tileMap.widthInTiles;
            //emit some particles at the tile location
            emitParticles(tileMap.tileIndexToPixelX(tileIndex), tileMap.tileIndexToPixelY(tileIndex), particleDefinitions.explodingTile);
            tileMap.replaceTileAt(startTileIndex, TILE_EMPTY);
            const newProps = player.getDigPropsForIndex(tileIndex);
            player.digWithProps(newProps.startTileValue, tileIndex, 100);
            if(player.tileOverlapCheck(tileIndex)){
                player.hurt(10);
            }
        }
    },

    TILE_DENSE_UNOBTANIUM : function (tileIndex) {
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.jumpPuff);
        let i = 10;
        while(--i){ actors.push(new Ore(x, y))}
    },
    TILE_ROCK : function (tileIndex) { 
        
    },
    TILE_DENSE_ROCK : function (tileIndex) { 
        
    }
}


