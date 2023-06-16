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
            name: "Elegant Emerald One",
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
            name: "Elegant Emerald Two",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 0
            },
            position: {x: 53+24, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Elegant Emerald Three",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 0
            },
            position: {x: 53+24*2, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Elegant Emerald Four",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 0
            },
            position: {x: 53+24*3, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Elegant Emerald Five",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 0
            },
            position: {x: 53+24*4, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Elegant Emerald Six",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 0
            },
            position: {x: 53+24*5, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Elegant Emerald Seven",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 0
            },
            position: {x: 53+24*6, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Elegant Emerald Eight",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 0
            },
            position: {x: 53+24*7, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Royal Ruby One",
            description: "A gemstone of ruby. It's red. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 1
            },
            owned: false,
            position:{x: 53, y: 93},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Royal Ruby Two",
            description: "A gemstone of ruby. It's red. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 1
            },
            owned: false,
            position:{x: 53+24, y: 93},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Royal Ruby Three",
            description: "A gemstone of ruby. It's red. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 1
            },
            owned: false,
            position:{x: 53+24*2, y: 93},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Royal Ruby Four",
            description: "A gemstone of ruby. It's red. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 1
            },
            owned: false,
            position:{x: 53+24*3, y: 93},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Royal Ruby Five",
            description: "A gemstone of ruby. It's red. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 1
            },
            owned: false,
            position:{x: 53+24*4, y: 93},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Royal Ruby Six",
            description: "A gemstone of ruby. It's red. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 1
            },
            owned: false,
            position:{x: 53+24*5, y: 93},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Royal Ruby Seven",
            description: "A gemstone of ruby. It's red. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 1
            },
            owned: false,
            position:{x: 53+24*6, y: 93},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Royal Ruby Eight",
            description: "A gemstone of ruby. It's red. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 1
            },
            owned: false,
            position:{x: 53+24*7, y: 93},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Superb Sapphire One",
            description: "A gemstone of blue. It's blue. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 2
            },
            owned: false,
            position:{x: 53, y: 123},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Superb Sapphire Two",
            description: "A gemstone of blue. It's blue. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 2
            },
            owned: false,
            position:{x: 53+24, y: 123},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Superb Sapphire Three",
            description: "A gemstone of blue. It's blue. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 2
            },
            owned: false,
            position:{x: 53+24*2, y: 123},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Superb Sapphire Four",
            description: "A gemstone of blue. It's blue. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 2
            },
            owned: false,
            position:{x: 53+24*3, y: 123},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Superb Sapphire Five",
            description: "A gemstone of blue. It's blue. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 2
            },
            owned: false,
            position:{x: 53+24*4, y: 123},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Superb Sapphire Six",
            description: "A gemstone of blue. It's blue. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 2
            },
            owned: false,
            position:{x: 53+24*5, y: 123},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Superb Sapphire Seven",
            description: "A gemstone of blue. It's blue. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 2
            },
            owned: false,
            position:{x: 53+24*6, y: 123},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Superb Sapphire Eight",
            description: "A gemstone of blue. It's blue. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 2
            },
            owned: false,
            position:{x: 53+24*7, y: 123},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Ceremonial Citrine One",
            description: "A gemstone of gold. It's gold. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 3
            },
            owned: false,
            position: {x: 53, y: 153},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Ceremonial Citrine Two",
            description: "A gemstone of gold. It's gold. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 3
            },
            owned: false,
            position: {x: 53+24, y: 153},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Ceremonial Citrine Three",
            description: "A gemstone of gold. It's gold. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 3
            },
            owned: false,
            position: {x: 53+24*2, y: 153},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Ceremonial Citrine Four",
            description: "A gemstone of gold. It's gold. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 3
            },
            owned: false,
            position: {x: 53+24*3, y: 153},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Ceremonial Citrine Five",
            description: "A gemstone of gold. It's gold. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 3
            },
            owned: false,
            position: {x: 53+24*4, y: 153},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Ceremonial Citrine Six",
            description: "A gemstone of gold. It's gold. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 3
            },
            owned: false,
            position: {x: 53+24*5, y: 153},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Ceremonial Citrine Seven",
            description: "A gemstone of gold. It's gold. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 3
            },
            owned: false,
            position: {x: 53+24*6, y: 153},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Ceremonial Citrine Eight",
            description: "A gemstone of gold. It's gold. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 3
            },
            owned: false,
            position: {x: 53+24*7, y: 153},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },



        {
            name: "Elegant Emerald Nine",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 4
            },
            position: {x: 260, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Elegant Emerald Ten",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 4
            },
            position: {x: 260+24, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Elegant Emerald Eleven",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 4
            },
            position: {x: 260+24*2, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Elegant Emerald Twelve",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 4
            },
            position: {x: 260+24*3, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Elegant Emerald Thirteen",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 4
            },
            position: {x: 260+24*4, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Elegant Emerald Fourteen",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 4
            },
            position: {x: 260+24*5, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Elegant Emerald Fifteen",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 4
            },
            position: {x: 260+24*6, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Elegant Emerald Sixteen",
            description: "A gemstone of emerald. It's green. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 4
            },
            position: {x: 260+24*7, y: 63},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
            name: "Royal Ruby Nine",
            description: "A gemstone of ruby. It's red. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 5
            },
            owned: false,
            position: {x: 260, y: 93},
            owned: false,
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
          name: "Royal Ruby Ten",
          description: "A gemstone of ruby. It's red. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 5
          },
          owned: false,
          position: {x: 260+24, y: 93},
          owned: false,
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Royal Ruby Eleven",
          description: "A gemstone of ruby. It's red. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 5
          },
          owned: false,
          position: {x: 260+24*2, y: 93},
          owned: false,
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Royal Ruby Twelve",
          description: "A gemstone of ruby. It's red. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 5
          },
          owned: false,
          position: {x: 260+24*3, y: 93},
          owned: false,
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Royal Ruby Thirteen",
          description: "A gemstone of ruby. It's red. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 5
          },
          owned: false,
          position: {x: 260+24*4, y: 93},
          owned: false,
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Royal Ruby Fourteen",
          description: "A gemstone of ruby. It's red. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 5
          },
          owned: false,
          position: {x: 260+24*5, y: 93},
          owned: false,
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Royal Ruby Fifteen",
          description: "A gemstone of ruby. It's red. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 5
          },
          owned: false,
          position: {x: 260+24*6, y: 93},
          owned: false,
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Royal Ruby Sixteen",
          description: "A gemstone of ruby. It's red. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 5
          },
          owned: false,
          position: {x: 260+24*7, y: 93},
          owned: false,
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
            name: "Superb Sapphire Nine",
            description: "A gemstone of blue. It's blue. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 6
            },
            owned: false,
            position: {x: 260, y: 123},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
          name: "Superb Sapphire Ten",
          description: "A gemstone of blue. It's blue. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 6
          },
          owned: false,
          position: {x: 260+24, y: 123},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Superb Sapphire Eleven",
          description: "A gemstone of blue. It's blue. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 6
          },
          owned: false,
          position: {x: 260+24*2, y: 123},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Superb Sapphire Twelve",
          description: "A gemstone of blue. It's blue. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 6
          },
          owned: false,
          position: {x: 260+24*3, y: 123},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Superb Sapphire Thirteen",
          description: "A gemstone of blue. It's blue. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 6
          },
          owned: false,
          position: {x: 260+24*4, y: 123},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Superb Sapphire Fourteen",
          description: "A gemstone of blue. It's blue. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 6
          },
          owned: false,
          position: {x: 260+24*5, y: 123},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Superb Sapphire Fifteen",
          description: "A gemstone of blue. It's blue. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 6
          },
          owned: false,
          position: {x: 260+24*6, y: 123},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Superb Sapphire Sixteen",
          description: "A gemstone of blue. It's blue. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 6
          },
          owned: false,
          position: {x: 260+24*7, y: 123},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
            name: "Ceremonial Citrine Nine",
            description: "A gemstone of gold. It's gold. It's a gemstone.",
            sprite: {
                sheet: tileSets.gems,
                silhouette: tileSets.gemSilhouettes,
                tile: 7
            },
            owned: false,
            position: {x: 260, y: 153},
            draw: function(){
                sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
                drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
            }
        },

        {
          name: "Ceremonial Citrine Ten",
          description: "A gemstone of gold. It's gold. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 7
          },
          owned: false,
          position: {x: 260+24, y: 153},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Ceremonial Citrine Eleven",
          description: "A gemstone of gold. It's gold. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 7
          },
          owned: false,
          position: {x: 260+24*2, y: 153},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Ceremonial Citrine Twelve",
          description: "A gemstone of gold. It's gold. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 7
          },
          owned: false,
          position: {x: 260+24*3, y: 153},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Ceremonial Citrine Thirteen",
          description: "A gemstone of gold. It's gold. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 7
          },
          owned: false,
          position: {x: 260+24*4, y: 153},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Ceremonial Citrine Fourteen",
          description: "A gemstone of gold. It's gold. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 7
          },
          owned: false,
          position: {x: 260+24*5, y: 153},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Ceremonial Citrine Fifteen",
          description: "A gemstone of gold. It's gold. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 7
          },
          owned: false,
          position: {x: 260+24*6, y: 153},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

        {
          name: "Ceremonial Citrine Sixteen",
          description: "A gemstone of gold. It's gold. It's a gemstone.",
          sprite: {
              sheet: tileSets.gems,
              silhouette: tileSets.gemSilhouettes,
              tile: 7
          },
          owned: false,
          position: {x: 260+24*7, y: 153},
          draw: function(){
              sprite = this.owned ? this.sprite.sheet : this.sprite.silhouette;
              drawTileSprite(sprite, this.sprite.tile, this.position.x, this.position.y);
          }
        },

    ]   
}
}