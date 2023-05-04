/*
https://patorjk.com/software/taag/#p=display&f=Varsity&t=Text%20Banners!
                                                                                        
 @@@@@@@   @@@@@@   @@@  @@@   @@@@@@   @@@@@@@   @@@@@@   @@@  @@@  @@@@@@@   @@@@@@   
@@@@@@@@  @@@@@@@@  @@@@ @@@  @@@@@@@   @@@@@@@  @@@@@@@@  @@@@ @@@  @@@@@@@  @@@@@@@   
!@@       @@!  @@@  @@!@!@@@  !@@         @@!    @@!  @@@  @@!@!@@@    @@!    !@@       
!@!       !@!  @!@  !@!!@!@!  !@!         !@!    !@!  @!@  !@!!@!@!    !@!    !@!       
!@!       @!@  !@!  @!@ !!@!  !!@@!!      @!!    @!@!@!@!  @!@ !!@!    @!!    !!@@!!    
!!!       !@!  !!!  !@!  !!!   !!@!!!     !!!    !!!@!!!!  !@!  !!!    !!!     !!@!!!   
:!!       !!:  !!!  !!:  !!!       !:!    !!:    !!:  !!!  !!:  !!!    !!:         !:!  
:!:       :!:  !:!  :!:  !:!      !:!     :!:    :!:  !:!  :!:  !:!    :!:        !:!   
 ::: :::  ::::: ::   ::   ::  :::: ::      ::    ::   :::   ::   ::     ::    :::: ::   
 :: :: :   : :  :   ::    :   :: : :       :      :   : :  ::    :      :     :: : :    
                                                                                        
                                                             
*/
const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;

const SCREEN_SHAKE_TIME = 20;

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
const COLORS = [
    '#060608',
    '#141013',
    '#3b1725',
    '#73172d',
    '#b4202a',
    '#df3e23',
    '#fa6a0a',
    '#f9a31b',
    '#ffd541',
    '#fffc40',
    '#d6f264',
    '#9cdb43',
    '#59c135',
    '#14a02e',
    '#1a7a3e',
    '#24523b',
    '#122020',
    '#143464',
    '#285cc4',
    '#249fde',
    '#20d6c7',
    '#a6fcdb',
    '#ffffff',
    '#fef3c0',
    '#fad6b8',
    '#f5a097',
    '#e86a73',
    '#bc4a9b',
    '#793a80',
    '#403353',
    '#242234',
    '#221c1a',
    '#322b28',
    '#71413b',
    '#bb7547',
    '#dba463',
    '#f4d29c',
    '#dae0ea',
    '#b3b9d1',
    '#8b93af',
    '#6d758d',
    '#4a5462',
    '#333941',
    '#422433',
    '#5b3138',
    '#8e5252',
    '#ba756a',
    '#e9b5a3',
    '#e3e6ff',
    '#b9bffb',
    '#849be4',
    '#588dbe',
    '#477d85',
    '#23674e',
    '#328464',
    '#5daf8d',
    '#92dcba',
    '#cdf7e2',
    '#e4d2aa',
    '#c7b08b',
    '#a08662',
    '#796755',
    '#5a4e44',
    '#423934'
]

//damageValues is how much damage player deals to tile when digging. 
//damage logic currently destroys tile when damage >= 100
const damageValues = [
    0, //TILE_EMPTY
    100, //TILE_DIRT
    0, //TILE_UNBREAKABLE_STONE
    0, //TILE_UNBREAKABLE_METAL
    100, //TILE_UNOBTANIUM
    100, //TILE_FALLING_ROCK
    5, //TILE_EXPLOSIVE
    7, //TILE_DENSE_UNOBTANIUM
    10, //TILE_ROCK
    3, //TILE_DENSE_ROCK
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
    widthInTiles: 80,
    heightInTiles: 7000,
    tileSize: 32,
    mapStartY: 20, //start generating tiles at this Y position
    caveGenPools:{
        vanilla: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,3,4,5,6,7,8,9],
        fallingFun: [5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,1,1,1,2,3,4,7,8,9],
        OreGalore: [4,7,8,9.4,7,8,9.4,7,8,9,4,7,8,9,4,7,8,9,5,6,1]
    }  
}

const playerSettings = {
    x: 80 * 32/2, 
    y: 20 * 32 - 64,
    previousX: 0,
    previousY: 0,
    canJump: false,
    canDig: true,
    width: 16,
    height: 24,
    speed: 0.9,
    xvel: 0,
    yvel: 0,
    xAccel: 0,
    yAccel: 0,
    digCooldown: 0,
    hurtCooldown: 0,
    health: 12000,
    friction: 0.8,
    moveLeftCooldown: 0,
    moveRightCooldown: 0,
    coyoteCooldown: 0,
    wallSliding: false,
    helicopterCapcity: 120,
    facing: LEFT,
    inventory: {
            ore: 5,
        }
}

// Setting seed to a specific value causes mapRNG to run the same sequence of numbers each time it restarts
let seed = 88881654;
const mapRNG = new Math.seedrandom(seed);

var sounds = {};




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

const particleGradients = {
    fire: [
        COLORS[0],
        COLORS[1],
        COLORS[2],
        COLORS[3],
        COLORS[4],
        COLORS[5],
        COLORS[6],
        COLORS[7],
        COLORS[8],
        COLORS[9],
    ],
    ice:  [
        COLORS[0],
        COLORS[1],
        COLORS[17],
        COLORS[18],
        COLORS[19],
        COLORS[20],
        COLORS[21],
        COLORS[21],
        COLORS[22],
        COLORS[22],
    ],
    hurt: [
        [
            COLORS[0],
            COLORS[1],
            COLORS[2],
            COLORS[3],
            COLORS[4],
            COLORS[5],
        ]
    ],
    ore: [
        COLORS[0],
        COLORS[1],
        COLORS[15],
        COLORS[14],
        COLORS[13],
        COLORS[12],
        COLORS[11],
        COLORS[10],
        COLORS[9],
        
    ]
}

const particleDefinitions = {

    sparks: function(){
        return{
        quantity: 3,
        offset: {
            x: () => 0,
            y: () => 0
        },
        collides: true,
        color: () => "yellow",
        life: () => 10,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(0, 1),
        gravity: () => rand(0, 0.1),
        gradientPalette: particleGradients.fire
        }
    },
    helicopter: function(){
        return{
            quantity: 12,
            offset: {
                x: () => 8 + rand(-16, 16),
                y: () => -4 + rand(-8, 8)
            },
            collides: true,
            color: () => "blue",
            life: () => 10,
            xVelocity: () => 0,
            yVelocity: () => rand(0, 1),
            gravity: () => rand(0, 0.1),
            custom: (particle) => {
                particle.xvel += rand(-0.5, 0.5);
                particle.yvel += rand(0.2, 0.9);
            },
            gradientPalette: particleGradients.ice
            }
        },
            
    oreSparks: function(){
        return{
        quantity: 3,
        offset: {
            x: () => rand(-2.5, 2.5),
            y: () => 0
        },
        collides: false,
        color: () => "yellow",
        life: () => 30,
        xVelocity: () => rand(-0.2, .2),
        yVelocity: () => rand(0, -1),
        gravity: () => rand(0, 0.1),
        custom: (particle) => {
            particle.xvel += rand(-0.5, 0.5);
            particle.yvel += rand(-0.2, 0.3);
        },
        gradientPalette: particleGradients.ore
        }
    },

    healthSparks: function(){
        return{
        quantity: 3,
        offset: {
            x: () => rand(-2.5, 2.5),
            y: () => 0
        },
        collides: false,
        color: () => "red",
        life: () => 30,
        xVelocity: () => rand(-0.2, .2),
        yVelocity: () => rand(0, -1),
        gravity: () => rand(0, 0.1),
        custom: (particle) => {
            particle.xvel += rand(-0.5, 0.5);
            particle.yvel += rand(-0.2, 0.3);
        },
        gradientPalette: particleGradients.hurt
        }
    },

    fallSparks: function(){
        return{
        quantity: 50,
        offset: {
            x: () => 0,
            y: () => 0
        },
        collides: true,
        color: () => "orange",
        life: () => 30,
        xVelocity: () => 0,
        yVelocity: () => rand(-.5, 0.1),
        gravity: () => rand(-0.1, 0.1),
        gradientPalette: particleGradients.fire
        }
    },

    jumpPuff: function(){
        return{
        quantity: 20,
        offset: {
            x: () => 0,
            y: () => 0
        },
        collides: false,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(-.5, -2),
        color:  () => "white",
        life: () => rand(19, 20),
        gravity: () => rand(0, 0.1),
        gradientPalette: particleGradients.ice
        }
    },

    hurt: function(){
        return{
            quantity: 100,
            offset: {
                x: () =>  0,
                y: () => 0
            },
            collides: false,
            xVelocity: () => rand(-1, 1),
            yVelocity: () => rand(-.5, -2),
            color:  () => "red",
            life: () => rand(19, 20),
            gravity: () => rand(0, 0.1),
            gradientPalette: particleGradients.hurt
     }
    },

    explodingTile: function(){
        return{
        quantity: 20,
        offset: {
            x: () => 0,
            y: () => 0
        },
        collides: false,
        xVelocity: () => rand(-2, 2),
        yVelocity: () => rand(-1, -1),
        color:  () => "red",
        life: () => rand(5, 20),
        gravity: () => rand(0, 0.1),
        gradientPalette: particleGradients.fire
        }
    },
    boom25px: function(){
        return{
        tileSprite: tileSets.splode_25px,
        quantity: 2,
        offset: {
            x: () => rand(-10, 10),
            y: () => rand(-10, 10),
        },
        collides: false,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(0, -5),
        color:  () => "red",
        life: () => rand(10, 20),
        gravity: () => 0,
        }
    },

    splode_glow: function(){
        return{
        tileSprite: tileSets.splode_glow,
        glow: true,
        quantity: 5,
        offset: {
            x: () => rand(-10, 10),
            y: () => rand(-10, 10),
        },
        collides: false,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(0, -5),
        color:  () => "red",
        life: () => rand(30, 50),
        gravity: () => 0,
        }
    },

    boom17px: function(){
        return{
        tileSprite: tileSets.splode_17px,
        quantity: 3,
        offset: {
            x: () => rand(-10, 10),
            y: () => rand(-10, 10),
        },
        collides: false,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(0, -5),
        color:  () => "red",
        life: () => rand(10, 20),
        gravity: () => 0,
        }
    },

    boom7px: function(){
        return{
        tileSprite: tileSets.splode_7px,
        //glow: true,
        quantity: 10,
        offset: {
            x: () => rand(-10, 10),
            y: () => rand(-10, 10),
        },
        collides: false,
        xVelocity: () => 0,
        yVelocity: () => rand(0, -5),
        color:  () => "red",
        life: () => rand(20, 35),
        gravity: () => 0,
        }
    },

    destroyDirt: function(){
        return{
        quantity: 40,
        offset: {
            x: () =>0,
            y: () =>0
        },
        collides: false,
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
        offset: {
            x: () =>-10,
            y: () => 0
        },
        collides: false,
        xVelocity: () => rand(0, 2),
        yVelocity: () => rand(-1, 1),
        color: () => ["white", "yellow"][randInt(0, 1)],
        life: () => rand(5, 20),
        gravity: () => rand(0, 0.1),
        gradientPalette: particleGradients.fire
        }
    },

    wallJumpRight: function(){
        return{
        quantity: 100,
        offset: {
            x: () => 10,
            y: () => 0
        },
        collides: false,
        xVelocity: () => rand(0, -2),
        yVelocity: () => rand(-1, 1),
        color: () => ["white", "yellow"][randInt(0, 1)],
        life: () => rand(5, 20),
        gravity: () => rand(0, 0.1),
        gradientPalette: particleGradients.fire
        }
    }
}

/*
                                                                                                          
 @@@@@@@@   @@@@@@   @@@@@@@@@@   @@@@@@@@      @@@@@@    @@@@@@    @@@@@@   @@@@@@@@  @@@@@@@   @@@@@@   
@@@@@@@@@  @@@@@@@@  @@@@@@@@@@@  @@@@@@@@     @@@@@@@@  @@@@@@@   @@@@@@@   @@@@@@@@  @@@@@@@  @@@@@@@   
!@@        @@!  @@@  @@! @@! @@!  @@!          @@!  @@@  !@@       !@@       @@!         @@!    !@@       
!@!        !@!  @!@  !@! !@! !@!  !@!          !@!  @!@  !@!       !@!       !@!         !@!    !@!       
!@! @!@!@  @!@!@!@!  @!! !!@ @!@  @!!!:!       @!@!@!@!  !!@@!!    !!@@!!    @!!!:!      @!!    !!@@!!    
!!! !!@!!  !!!@!!!!  !@!   ! !@!  !!!!!:       !!!@!!!!   !!@!!!    !!@!!!   !!!!!:      !!!     !!@!!!   
:!!   !!:  !!:  !!!  !!:     !!:  !!:          !!:  !!!       !:!       !:!  !!:         !!:         !:!  
:!:   !::  :!:  !:!  :!:     :!:  :!:          :!:  !:!      !:!       !:!   :!:         :!:        !:!   
 ::: ::::  ::   :::  :::     ::    :: ::::     ::   :::  :::: ::   :::: ::    :: ::::     ::    :::: ::   
 :: :: :    :   : :   :      :    : :: ::       :   : :  :: : :    :: : :    : :: ::      :     :: : :    
                                                                                                          
                                                            
*/

const imageList = [
    //image loader assumes .png and appends it. all images should be in /src/img/.
    'smallFont',
    '3x5font',
    'earthTiles',
    'placeholder-player',
    'basic-tiles',
    'autoTiles',
    'minimap',
    'gems',
    'damage',
    'splode_7px',
    'splode_17px',
    'splode_25px',
    'gems',
    'gems_silhouettes',
    'bones',
    'bone_silhouettes',
    'bat',
    'cave-background-1',
    'cave-background-2',
    'big_green_glow',
    '64px-glow',
    '32px-glow',
    '16px-glow',
    'splode-glow'
    
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
    { name: "player_damage_1", url: "snd/player_damage_1.ogg" },
    { name: "player_damage_2", url: "snd/player_damage_2.ogg" },
    { name: "player_damage_big_1", url: "snd/player_damage_big_1.ogg" },
    { name: "player_damage_big_2", url: "snd/player_damage_big_2.ogg" },
    { name: "jump", url: "snd/jump_1.ogg" },
    { name: "clink", url: "snd/clink1.ogg"}
]

//TODO:  shorten digging_dirt sound, make dirt it's own tile type
const rock_crumbles = [ "rock_crumble_1", "rock_crumble_2", "rock_crumble_3"]
const explosions = [ "explosion_1", "explosion_2", "explosion_3" ]
const metal_dings = [ "shovel_on_metal", "shovel_on_metal_2" ]
const player_damages = [ "player_damage_1", "player_damage_2", "player_damage_big_1", "player_damage_big_2" ]

var caveTileset, damageTileset, splode_7px, splode_17px, splode_25px, gems, bones



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
        while(--i){ actors.push(new Ore(randInt(-16,16) + x, randInt(-16,16)+y))}  
    },

    TILE_FALLING_ROCK : function (tileIndex) {
        tileMap.replaceTileAt(tileIndex, TILE_EMPTY);
        let x = tileMap.tileIndexToPixelX(tileIndex) ;
        let y = tileMap.tileIndexToPixelY(tileIndex) ;
        //emitParticles(x, y, particleDefinitions.destroyDirt);
        actors.push(new FallingRock(x, y));
    },

    TILE_EXPLOSIVE : function (startTileIndex) {
       
    },

    TILE_DENSE_UNOBTANIUM : function (tileIndex) {
        //tileMap.replaceTileAt(tileIndex, TILE_UNOBTANIUM);
        tileMap.replaceTileAt(tileIndex, TILE_EMPTY);
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.destroyDirt);
        audio.playSound(sounds[randChoice(rock_crumbles)])
        let i = 30;
        while(--i){ actors.push(new Ore(randInt(-16,16) + x, randInt(-16,16)+y))}  
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
            emitParticles(tileMap.tileIndexToPixelX(tileIndex), tileMap.tileIndexToPixelY(tileIndex), particleDefinitions.boom25px);
            emitParticles(tileMap.tileIndexToPixelX(tileIndex), tileMap.tileIndexToPixelY(tileIndex), particleDefinitions.boom17px);
            emitParticles(tileMap.tileIndexToPixelX(tileIndex), tileMap.tileIndexToPixelY(tileIndex), particleDefinitions.boom7px);
            emitParticles(tileMap.tileIndexToPixelX(tileIndex), tileMap.tileIndexToPixelY(tileIndex), particleDefinitions.splode_glow);



            tileMap.replaceTileAt(startTileIndex, TILE_EMPTY);
            const newProps = player.getDigPropsForIndex(tileIndex);
            player.digWithProps(newProps.startTileValue, tileIndex, 100);
            if(player.tileOverlapCheck(tileIndex)){
                player.hurt(10);
            }
            tileMap.shakeScreen(30);
        }
    },

    TILE_DENSE_UNOBTANIUM : function (tileIndex) {
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.jumpPuff);
        let i = 8;
        while(--i){ actors.push(new Ore(randInt(-20,20) + x, randInt(-20,20)+y))}  
    },
    TILE_ROCK : function (tileIndex) { 
        
    },
    TILE_DENSE_ROCK : function (tileIndex) { 
        
    }
}

/*
                                                                                                                  
 @@@@@@@   @@@@@@   @@@       @@@       @@@@@@@@   @@@@@@@  @@@@@@@  @@@  @@@@@@@   @@@       @@@@@@@@   @@@@@@   
@@@@@@@@  @@@@@@@@  @@@       @@@       @@@@@@@@  @@@@@@@@  @@@@@@@  @@@  @@@@@@@@  @@@       @@@@@@@@  @@@@@@@   
!@@       @@!  @@@  @@!       @@!       @@!       !@@         @@!    @@!  @@!  @@@  @@!       @@!       !@@       
!@!       !@!  @!@  !@!       !@!       !@!       !@!         !@!    !@!  !@   @!@  !@!       !@!       !@!       
!@!       @!@  !@!  @!!       @!!       @!!!:!    !@!         @!!    !!@  @!@!@!@   @!!       @!!!:!    !!@@!!    
!!!       !@!  !!!  !!!       !!!       !!!!!:    !!!         !!!    !!!  !!!@!!!!  !!!       !!!!!:     !!@!!!   
:!!       !!:  !!!  !!:       !!:       !!:       :!!         !!:    !!:  !!:  !!!  !!:       !!:            !:!  
:!:       :!:  !:!   :!:       :!:      :!:       :!:         :!:    :!:  :!:  !:!   :!:      :!:           !:!   
 ::: :::  ::::: ::   :: ::::   :: ::::   :: ::::   ::: :::     ::     ::   :: ::::   :: ::::   :: ::::  :::: ::   
 :: :: :   : :  :   : :: : :  : :: : :  : :: ::    :: :: :     :     :    :: : ::   : :: : :  : :: ::   :: : :    
                                                                                                                  
 */

//collectibles depends on tileSets being loaded, so its a function that we call from main that returns the
//collectibles object. 
function createCollectibles() {
    return {
    ui: {
        page: {
            x: 27, y: 46, width: 490, height: 240
        },
        tab: {
            width: 100, height: 16,
            textOffset: {x: 10, y: 5},
            margin: 20,
        },
        tabs: [
            {
                name: "Treasure",
            },
            {
                name: "Artifacts",
            },
            {
                name: "Bones",
            },
            {
                name: "Map",
            }

        ]
    },

    Treasure: [
        {
            name: "Ruby of the Deep",
            description: "A ruby of the deep. It's a ruby. It's deep.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 0
            },
            position: {x: 39, y: 56},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Sapphire of Greater Depth",
            description: "A sapphire of greater depth. It's a sapphire. It's deeper.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 1
            },
            owned: false,
            position: {x: 79, y: 56},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

    ],

    Artifacts: [
        {
            name: "Wobblegangy of Draxis 3",
            description: "Some Gizmo. Supposed to do something. Nobody knows if it still works or not.",
            sprite: {
                sheet: tileSets.bones,
                silhouette: tileSets.boneSilhouettes,
                tile: 0
            },
            owned: false,
            position: {x: 39, y: 56},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Statue of Tiagius",
            description: "Statue of Tiagiaus the three-handed. Supposedly he could wield 3 swords at once.",
            sprite: {
                sheet: tileSets.bones,
                silhouette: tileSets.boneSilhouettes,
                tile: 1
            },
            owned: false,
            position: {x: 79, y: 56},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        }

    ],

    Bones: [
        {
            name: "Femur of The Greater Armadillo",
            description: "A femur of the greater armadillo. It's a pelvis. It's from an armadillo.",
            sprite: {
                sheet: tileSets.bones,
                silhouette: tileSets.boneSilhouettes,
                tile: 0
            },
            owned: false,
            position: {x: 39, y: 56},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Skull of The Lesser Armadillo",
            description: "A skull of the lesser armadillo. It's a skull. It's from an armadillo.",
            sprite: {
                sheet: tileSets.bones,
                silhouette: tileSets.boneSilhouettes,
                tile: 1
            },
            owned: false,
            position: {x: 79, y: 56},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        }
    ],
}
}
