/*
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

const TILE_EMPTY = 0;
const TILE_DIRT = 1;
const TILE_UNBREAKABLE_STONE = 2;
const TILE_UNBREAKABLE_METAL = 3;
const TILE_UNOBTANIUM = 4;
const TILE_FALLING_ROCK = 5;
const TILE_EXPLOSIVE = 6;
const TILE_DENSE_UNOBTANIUM = 7;


const GAMESTATE_TITLE = 0
const GAMESTATE_PLAY = 1;
const GAMESTATE_GAME_OVER = 2;
const GAMESTATE_CREDITS = 3;
const GAMESTATE_INVENTORY = 4;
const FRAMERATE = 60;

const screens = [
    titleScreen,
    playScreen,
    gameOverScreen,
    creditsScreen,
    inventoryScreen
]

const TYPE_PARTICLE = 0;


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

var sounds = {};

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

const particleDefinitions = {

    sparks: function(){
        return{
        quantity: 3,
        color: () => "yellow",
        life: () => 10,
        xVelocity: function(){ return rand(-1, 1)},
        yVelocity: function(){ return rand(0, 1)},
        gravity: () => rand(0, 0.1),
        }
    },

    jumpPuff: function(){
        return{
        quantity: 100,
        xVelocity: () => rand(-1, 1),
        yVelocity: () => rand(-.5, -2),
        color:  () => "white",
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
    'basic-tiles'
]

const soundList = [
    { name: "test1", url: "snd/test1.mp3" },
    { name: "test2", url: "snd/test2.mp3" },
    { name: "shovel_on_metal", url: "snd/shovel_on_metal_2.ogg" }
]
