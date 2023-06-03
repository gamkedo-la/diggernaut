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

const SCREEN_SHAKE_TIME = 20;

//TODO: maybe roll all the tile data into a single object?
//have to be able to access the tile type by index, but also by name
const TILE_EMPTY = 0;
const TILE_DIRT = 1;
const TILE_UNBREAKABLE_STONE = 2;
const TILE_UNBREAKABLE_METAL = 3;
const TILE_GOLD_ORE = 4;
const TILE_FALLING_ROCK = 5;
const TILE_EXPLOSIVE = 6;
const TILE_BLUE_ORE = 7;
const TILE_ROCK = 8;
const TILE_DENSE_ROCK = 9;
const TILE_TREASURE = 10;
const TILE_TENTACLE = 11;


const TILE_TYPES = [
    "TILE_EMPTY",
    "TILE_DIRT",
    "TILE_UNBREAKABLE_STONE",
    "TILE_UNBREAKABLE_METAL",
    "TILE_GOLD_ORE",
    "TILE_FALLING_ROCK",
    "TILE_EXPLOSIVE",
    "TILE_BLUE_ORE",
    "TILE_ROCK",
    "TILE_DENSE_ROCK",
    "TILE_TREASURE",
    "TILE_TENTACLE"
]

//damageValues is how much damage player deals to tile when digging. 
//damage logic currently destroys tile when damage >= 100
const damageValues = [
    0, //TILE_EMPTY
    100, //TILE_DIRT
    0, //TILE_UNBREAKABLE_STONE
    0, //TILE_UNBREAKABLE_METAL
    100, //TILE_GOLD_ORE
    100, //TILE_FALLING_ROCK
    5, //TILE_EXPLOSIVE
    7, //TILE_BLUE_ORE
    10, //TILE_ROCK
    3, //TILE_DENSE_ROCK
    10, //TILE_BONE
    10, //TILE_TENTACLE
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

const DEPTH_MILESTONES = [
    100, 200, 300, 400, 500, 600, 700, 800, 900, 1000,
    1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800,
    1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600,
    2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400,
    3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200,
    4300, 4400, 4500, 4600, 4700, 4800, 4900, 5000
]

const BLUE_UPGRADES = [
    //dig speed +
    {
        name: "Dig Speed +",
        description: "DIG FASTER",
        cost: 50,
        effect: function () {
            player.limits.digCooldown = 10;
        }
    },

    {
        name: "Dig Speed ++",
        description: "SUPER DIG SPEED",
        cost: 60,
        effect: function () {
            player.limits.digCooldown = 6;
        }
    },

    {
        name: "Dig Speed +++",
        description: "MEGA DIG",
        cost: 70,
        effect: function () {
            player.limits.digCooldown = 3;
        }
    },

    {
        name: "Dig Speed ++++",
        description: "DIG SPEED OVERLOAD",
        cost: 80,
        effect: function () {
            player.limits.digCooldown = 0;
        }
    },

    {
        name: "Diggerang Damage +",
        description: "DIGGERANG DAMAGE",
        cost: 90,
        effect: function () {
            player.diggerang.damageMultiplier = 2;
        }
    },

]


const GOLD_UPGRADES = [
    {
        name: "Armor class"
    }
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


const TYPE_PARTICLE = 0;
const DIGGERANG_COST = 0;

const view = {
    x: 0,
    y: 0,
    width: 544,
    height: 306,
}

const mapConfig = {
    widthInTiles: 70,
    heightInTiles: 10000,
    tileSize: 32,
    mapStartY: 20, //start generating tiles at this Y position
    caveGenPools:{
        vanilla: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,5,6,7,8,9],
        fallingFun: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,1,1,1,4,7,8,9],
        OreGalore: [4,7,8,9.4,7,8,9.4,7,8,9,4,7,8,9,4,7,8,9,5,6]
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
    facing: Direction.LEFT,
    inventory: {
            ore: 5,
        }
}

// Setting seed to a specific value causes mapRNG to run the same sequence of numbers each time it restarts
let seed = 3141592653589793;
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
            COLORS[0],
            COLORS[1],
            COLORS[2],
            COLORS[3],
            COLORS[4],
            COLORS[5],
    ],
    ore: [
        COLORS[0],
        COLORS[1],
        COLORS[6],
        COLORS[7],
        COLORS[8],
        COLORS[9]
        
    ],

    green: [
        COLORS[0],
        COLORS[1],
        COLORS[15],
        COLORS[14],
        COLORS[13],
        COLORS[12],
        COLORS[11],
        COLORS[10],
        COLORS[9],
        
    ],

    award: [
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
        quantity: 2,
        offset: {
            x: () => rand(-2.5, 2.5),
            y: () => 0
        },
        collides: true,
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

    blueOreSparks: function(){
        return{
        quantity: 2,
        offset: {
            x: () => rand(-2.5, 2.5),
            y: () => 0
        },
        collides: true,
        color: () => "yellow",
        life: () => 30,
        xVelocity: () => rand(-0.2, .2),
        yVelocity: () => rand(0, -1),
        gravity: () => rand(0, 0.1),
        custom: (particle) => {
            particle.xvel += rand(-0.5, 0.5);
            particle.yvel += rand(-0.2, 0.3);
        },
        gradientPalette: particleGradients.ice
        }
    },

    awardSparks: function(){
        return{
        pool: uiActors,
        quantity: 1000,
        offset: {
            x: () => rand(-300, 300),
            y: () => rand(-15, 15)
        },
        collides: false,
        color: () => "blue",
        life: () => 50,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(2, -1),
        gravity: () => 0,
        custom: (particle) => {
            particle.xvel += rand(-0.5, 0.5);
            particle.yvel += rand(-0.2, 0.3);
        },
        gradientPalette: particleGradients.green
        }
    },

    awardSparksMessageDeath: function(){
        return{
        pool: uiActors,
        quantity: 500,
        offset: {
            x: () => rand(-75, 75),
            y: () => rand(18, -18)
        },
        collides: false,
        color: () => "blue",
        life: () => 35,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(0.5, -1),
        gravity: () => 0,
        custom: (particle) => {
            particle.xvel += rand(-1, 1);
            particle.yvel += rand(-1, 0.5);
        },
        gradientPalette: particleGradients.green
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
        gravity: () => 0,
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
        quantity: 1,
        offset: {
            x: () => rand(-10, 10),
            y: () => rand(-10, 10),
        },
        collides: false,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(0, -5),
        color:  () => "red",
        life: () => rand(15, 30),
        gravity: () => 0,
        }
    },

    splode_glow32px: function(){
        return{
        tileSprite: tileSets.splode_glow32px,
        glow: true,
        quantity: 4,
        offset: {
            x: () => rand(-10, 10),
            y: () => rand(-10, 10),
        },
        collides: false,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(0, -5),
        color:  () => "red",
        life: () => rand(20, 40),
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
            tileSprite: tileSets.splode_dirt7px,
            //glow: true,
            quantity: 60,
            offset: {
                x: () => rand(-18, 18),
                y: () => rand(-18, 18),
            },
            collides: false,
            xVelocity: () => rand(-0.5, 0.5),
            yVelocity: () => rand(0, -1),
            color:  () => "brown",
            life: () => rand(20, 25),
            gravity: () => 0,
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
    'bigFont',
    'earthTiles',
    'placeholder-player',
    'movingPlayerSprite',
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
    'splode-glow',
    'splode-glow32px',
    'crawler',
    'dirt_splode_7px',
    'ui-icons',
    'tab-background',
    'diggerang-spin',
    'diggerang-spin-vertical',
    'tentacle-arm',
    'tentacle-block'

    
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
    { name: "clink", url: "snd/clink1.ogg"},
    { name: "explore-music", url: "snd/BGM-deeper_deeper-draft_1.mp3"}, 
    { name: "walljump", url: "snd/walljump-subtle.wav"}, 
    { name: "footstep-a", url: "snd/footstep-a.wav"}, 
    { name: "footstep-b", url: "snd/footstep-b.wav"}, 
    { name: "footstep-c", url: "snd/footstep-c.wav"}, 
    { name: "footstep-d", url: "snd/footstep-d.wav"}, 
    { name: "gemstone-a", url: "snd/gemstone-a.wav"}, 
    { name: "gemstone-b", url: "snd/gemstone-b.wav"}, 
    { name: "important_pickup", url: "snd/important_pickup.ogg"}, 

]

//TODO:  shorten digging_dirt sound, make dirt it's own tile type
const rock_crumbles = [ "rock_crumble_1", "rock_crumble_2", "rock_crumble_3"]
const explosions = [ "explosion_1", "explosion_2", "explosion_3" ]
const metal_dings = [ "shovel_on_metal", "shovel_on_metal_2" ]
const player_damages = [ "player_damage_1", "player_damage_2", "player_damage_big_1", "player_damage_big_2" ]

const FOOTSTEP_VOLUME = 0.7;
const footsteps = [ "footstep-a","footstep-b","footstep-c","footstep-d" ]

const COLLECTIBLE_SOUND_VOLUME = 3;
const collectibleSounds = [ "important_pickup" ]; // "gemstone-a","gemstone-b" ]

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
    TILE_EMPTY : function (tileIndex) { return; },

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

    TILE_GOLD_ORE : function (tileIndex) {
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
        emitParticles(x, y, particleDefinitions.destroyDirt);
        actors.push(new FallingRock(x, y));
    },

    TILE_EXPLOSIVE : function (startTileIndex) {
    },

    TILE_BLUE_ORE : function (tileIndex) {
        //tileMap.replaceTileAt(tileIndex, TILE_UNOBTANIUM);
        tileMap.replaceTileAt(tileIndex, TILE_EMPTY);
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.destroyDirt);
        audio.playSound(sounds[randChoice(rock_crumbles)])
        let i = 30;
        while(--i){ actors.push(new BlueOre(randInt(-16,16) + x, randInt(-16,16)+y))}  
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
    },

    TILE_BONE : function (tileIndex) {
        let x = tileMap.tileIndexToPixelX(tileIndex) ;
        let y = tileMap.tileIndexToPixelY(tileIndex) ;
        tileMap.replaceTileAt(tileIndex, TILE_EMPTY);
        emitParticles(x, y, particleDefinitions.destroyDirt);
    },

    TILE_TENTACLE : function (tileIndex) {
        let x = tileMap.tileIndexToPixelX(tileIndex) ;
        let y = tileMap.tileIndexToPixelY(tileIndex) ;
        tileMap.replaceTileAt(tileIndex, TILE_EMPTY);
        emitParticles(x, y, particleDefinitions.destroyDirt);
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

    TILE_GOLD_ORE : function (tileIndex) { 

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
            emitParticles(tileMap.tileIndexToPixelX(tileIndex), tileMap.tileIndexToPixelY(tileIndex), particleDefinitions.boom17px);
            emitParticles(tileMap.tileIndexToPixelX(tileIndex), tileMap.tileIndexToPixelY(tileIndex), particleDefinitions.boom7px);
            emitParticles(tileMap.tileIndexToPixelX(tileIndex), tileMap.tileIndexToPixelY(tileIndex), particleDefinitions.splode_glow);
            emitParticles(tileMap.tileIndexToPixelX(tileIndex), tileMap.tileIndexToPixelY(tileIndex), particleDefinitions.splode_glow32px);

            tileMap.replaceTileAt(startTileIndex, TILE_EMPTY);
            const newProps = player.getDigPropsForIndex(tileIndex);
            player.digWithProps(newProps.startTileValue, tileIndex, 100);
            if(player.tileOverlapCheck(tileIndex)){
                player.hurt(10);
            }
            tileMap.shakeScreen(30);
        }
    },

    TILE_BLUE_ORE : function (tileIndex) {
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.jumpPuff);
        let i = 8;
        while(--i){ actors.push(new BlueOre(randInt(-20,20) + x, randInt(-20,20)+y))}  
    },

    TILE_ROCK : function (tileIndex) {
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.jumpPuff);
    },

    TILE_DENSE_ROCK : function (tileIndex) {
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.jumpPuff);
    },


    TILE_BONE : function (tileIndex) {
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.jumpPuff);
        let i = 8;
        while(--i){ actors.push(new Ore(randInt(-20,20) + x, randInt(-20,20)+y))}  
    },

    TILE_TENTACLE : function (tileIndex) {
        let x = tileMap.tileIndexToPixelX(tileIndex) + 16;
        let y = tileMap.tileIndexToPixelY(tileIndex) + 16;
        emitParticles(x, y, particleDefinitions.jumpPuff);
        let i = 8;
        while(--i){ actors.push(new Ore(randInt(-20,20) + x, randInt(-20,20)+y))}  
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
                name: "Map",
            }

        ]
    },

    Treasure: [
        {
            name: "Royal Emerald Gemstone Of Atlantis",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 0
            },
            position: {x: 53, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Royal Ruby Gemstone Of Atlantis",
            description: "A gemstone of ruby. It's red. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 1
            },
            owned: false,
            position: {x: 84, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Blue Gemstone",
            description: "A gemstone of blue. It's blue. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 2
            },
            owned: false,
            position: {x: 70, y: 91},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Golden Gemstone",
            description: "A gemstone of gold. It's gold. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 3
            },
            owned: false,
            position: {x: 102, y: 91},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },



        {
            name: "Royal Emerald Square Cut Of Atlantis",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 4
            },
            position: {x: 129, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Royal Ruby Square Cut Of Atlantis",
            description: "A gemstone of ruby. It's red. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 5
            },
            owned: false,
            position: {x: 156, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Blue Square Cut",
            description: "A gemstone of blue. It's blue. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 6
            },
            owned: false,
            position: {x: 142, y: 93},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Golden Square Cut",
            description: "A gemstone of gold. It's gold. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 7
            },
            owned: false,
            position: {x: 167, y: 93},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

    ]   
}
}

function createDepthAwards() {
    out = [];
    DEPTH_MILESTONES.forEach(function(depth){
        out[depth] = function(){
            uiActors.push(new AwardMessage(player.x, player.y, `${depth} METERS!`, bigFontGreen, 1, 100, particleDefinitions.awardSparks))
            }
    });
    return out;
}

function createBlueUpgrades() {
    out = [];
    BLUE_UPGRADES.forEach(function(upgrade, index, arr){
        out[index] = {};
        out[index].won = false;
        out[index].description = upgrade.description;
        out[index].effect = function(){
            
            uiActors.push(new AwardMessage(player.x, player.y, `${this.description}`, bigFontGreen, 1, 100, particleDefinitions.awardSparks))
            upgrade.effect();
            player.inventory.blueOre -= upgrade.cost;
            
            }

    });
    return out;
}