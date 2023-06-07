class Diggerang {
  constructor (x, y) {
        this.x = x;
    this.y = y;
    this.xvel = 0;
    this.yvel = 0;
    this.xAccel = 0;
    this.yAccel = 0;
    this.previousX = this.x;
    this.previousY = this.y;
    this.width = 24;
    this.height = 16;
    this.drawOffset = {x: 0, y: 0};
    this.active = false;
    this.returning = false;
    this.timeSinceThrown = 0;
    this.soundPlayed = false;
    this.sound = audio.playSound(sounds["diggerang_whoosh"], 0, 0, 1, true)
    this.volumeControl = this.sound.volume.gain;
    this.panControl = this.sound.pan.pan;
    this.damageMultiplier = 1;
    this.collider = new Collider (this.x, this.y, this.width, this.height, {left: 0, right: 0, top: 0, bottom: 0}, "diggerang");
    this.limits = {
      maxXVel: 7,
      maxYVel: 7,
      minXVel: -7,
      minYVel: -7,
      timeBeforeReturn: 200,
      airTimeBeforeTeleport: 300, 
    }
    this.spritesheet = new SpriteSheet ({
      image: img['diggerang-spin'],
      frameWidth: 32,
      frameHeight: 32,
      animations: {
        spin: {
          frames: [0, 1, 2, 3, 4, 5,6,7,8,9,10],
          frameRate: 40
        }
      }
    });
    this.currentAnimation = this.spritesheet.animations["spin"];

    this.spritesheetVertical = new SpriteSheet ({
      image: img['diggerang-spin-vertical'],
      frameWidth: 32,
      frameHeight: 32,
      animations: {
        spin: {
          frames: [0, 1, 2, 3, 4, 5,6,7,8,9,10],
          frameRate: 40
        }
      }
    });
    this.verticalSpin = this.spritesheetVertical.animations["spin"];
    
  }

  update (player) {
    if (!this.active) { this.stop(); return; }
    this.currentAnimation.update();

    this.handleUpgrades();

    

    this.previousX = this.x;
    this.previousY = this.y;

    this.timeSinceThrown++;
    this.volumeControl.value = 1;
    
    this.pan();
    
    this.x += this.xvel;
    this.y += this.yvel;

    this.handleCollisions();
    this.applyForces();
    

    const distanceToPlayer = Math.sqrt (
      (this.x - player.x) ** 2 + (this.y - player.y) ** 2
    );

    if (this.returning && distanceToPlayer < 40) {
      this.active = false;
      this.returning = false;
      return;
    }

    if (!this.returning && this.timeSinceThrown > this.limits.timeBeforeReturn) {
      this.returning = true;
    }

    if(this.timeSinceThrown > this.limits.airTimeBeforeTeleport){
      this.x = player.x;
      this.y = player.y;
      this.timeSinceThrown = 0
      this.active = false;
      this.returning = false;
    }


    if (this.returning) {
      const angleToPlayer = Math.atan2 (player.y - this.y, player.x - this.x);
      const returnXVel = 10 * Math.cos(angleToPlayer);
      const returnYVel = 10 * Math.sin(angleToPlayer);

      this.xvel = this.xvel + 0.3 * returnXVel;
      this.yvel = this.yvel + 0.3 * returnYVel;
    } else {
      //this.yvel += 0.2; // Apply gravity
    }
  }

  draw () {
    if (!this.active) return;

   
    this.currentAnimation.render({
      x: Math.floor(this.x-view.x-4),
      y: Math.floor(this.y-view.y-8),
      width: 32,
      height: 32
    })

    bufferContext.save();
            bufferContext.globalCompositeOperation = "screen";
            drawTileSprite(tileSets.glow_64px,
                rand(0,1) < .1 ? randInt(0, 3) : 0, 
                 this.x - view.x - 16,
                 this.y - view.y - 16,
                 bufferContext);
            bufferContext.restore();
    this.collider.draw();
  }

  pan() {
    //sets the pan value of the sound based on the position of the diggerang, -1 is left edge of screen, 1 is right edge of screen
    this.panControl.value = (clamp(this.x - view.x, 0, canvas.width) / canvas.width * 2 - 1);
  }

  checkCollision(tileMap) {
    if (tileMap.collidesWith(this.x, this.y)) {
      const tileCoords = tileMap.pixelToTileGrid(this.x, this.y);

      // Calculate the reflection vector
      const normal = tileMap.getCollisionNormal(tileCoords.x, tileCoords.y);
      const dot = 2 * (this.xvel * normal.x + this.yvel * normal.y);
      this.xvel -= dot * normal.x * 0.05;
      this.yvel -= dot * normal.y * 0.05;

      this.xvel *= 0.7;
      this.yvel *= 0.7;

      if (isNaN(this.xvel) || isNaN(this.yvel)) {
        this.xvel = 0;
        this.yvel = 0;
        this.active = false;
        this.returning = false;
      }
  
    }
  }

  handleCollisions(resolution = 3) {
    //handle x and y collisions separately

    //x collision
    if (this.xvel == 0) {
        this.collider.update(this.x, this.y);
    } else {
        let increment = this.xvel / resolution;
        for (let i = 0; i < resolution; i++) {
            this.collider.update(this.x + increment, this.y);
            if (this.collider.tileCollisionCheck(0)) {
              const tileIndex = tileMap.pixelToTileIndex(this.x + increment, this.y);
              this.damageTilesAtCollision(tileIndex)
              this.x = this.previousX;
              this.collider.update(this.x, this.y);
              this.xvel = -this.xvel;

              //slow down after bumping into a wall
              this.xvel *= 0.9;
              this.yvel *= 0.9;
              break;
            }
        }
    }
    //y collision
    if (this.yvel == 0) {
        this.collider.update(this.x, this.y);
    } else {
        let increment = this.yvel / resolution;
        for (let i = 0; i < resolution; i++) {
            this.collider.update(this.x, this.y + increment);
            if (this.collider.tileCollisionCheck(0)) {
              const tileIndex = tileMap.pixelToTileIndex(this.x + increment, this.y);
              this.damageTilesAtCollision(tileIndex)
              this.y = this.previousY;
              this.collider.update(this.x, this.y);
              this.yvel = -this.yvel;

              //slow down after bumping into a wall
              this.xvel *= 0.9;
              this.xvel += Math.random() * 0.1 - 0.05;
              this.yvel *= 0.9;
              this.yvel += Math.random() * 0.1 - 0.05;
              break;
            }
        }
    }

    if (isNaN(this.xvel) || isNaN(this.yvel)) {
      this.xvel = 0;
      this.yvel = 0;
      this.active = false;
      this.returning = false;
    }

    this.collider.update(this.x, this.y);
  }

  handleUpgrades() {
    if(player.upgrades.boomerang) {
      let end1X = this.x + 16 + Math.cos ((ticker / 2) + Math.PI) * 16;
      let end1Y = this.y + 12 + Math.sin ((ticker / 2) + Math.PI) * 8;
      let end2X = this.x  + 16 + Math.cos (ticker / 2) * 16;
      let end2Y = this.y  + 12 + Math.sin (ticker / 2) * 8;
      emitParticles(end1X, end1Y, particleDefinitions.blueOreSparks);
      emitParticles(end2X, end2Y, particleDefinitions.blueOreSparks);
      emitParticles(end1X, end1Y, particleDefinitions.blueOreSparks);
      emitParticles(end2X, end2Y, particleDefinitions.blueOreSparks);
    }
  }
  stop() {
    this.x = player.x;
    this.y = player.y;
    this.previousX = this.x;
    this.previousY = this.y;
    this.timeSinceThrown = 0;
    this.volumeControl.value = 0;
  }

  damageTilesAtCollision(tileIndex) {
   
      const left = tileMap.collidesWithPoint(this.collider.leftFeeler)
      const right = tileMap.collidesWithPoint(this.collider.rightFeeler)
      const top = tileMap.collidesWithPoint(this.collider.topFeeler)
      const bottom = tileMap.collidesWithPoint(this.collider.bottomFeeler)

    if (left) {
      const point = this.collider.leftFeeler;
      const tile = tileMap.pixelToTileIndex(point.x, point.y);
      const type = tileMap.data[tile];
      tileMap.damageTileAt(tile, damageValues[type] * this.damageMultiplier, ()=>
              {
                player.score += 100;
                emitParticles(point.x, point.y, particleDefinitions.hurt)
                damageTileWithEffects[TILE_TYPES[type]](tile);
              });
    }
    if (right) {
      const point = this.collider.rightFeeler;
      const tile = tileMap.pixelToTileIndex(point.x, point.y);
      const type = tileMap.data[tile];
      tileMap.damageTileAt(tile, damageValues[type] * this.damageMultiplier, ()=>
              {
                player.score += 100;
                emitParticles(point.x, point.y, particleDefinitions.hurt)
                damageTileWithEffects[TILE_TYPES[type]](tile);
              });
    }
    if (top) {
      const point = this.collider.topFeeler;
      const tile = tileMap.pixelToTileIndex(point.x, point.y);
      const type = tileMap.data[tile];
      tileMap.damageTileAt(tile, damageValues[type] * this.damageMultiplier, ()=>
              {
                player.score += 100;
                emitParticles(point.x, point.y, particleDefinitions.hurt)
                damageTileWithEffects[TILE_TYPES[type]](tile);
              });
    }
    if (bottom) {
      const point = this.collider.bottomFeeler;
      const tile = tileMap.pixelToTileIndex(point.x, point.y);
      const type = tileMap.data[tile];
      tileMap.damageTileAt(tile, damageValues[type] * this.damageMultiplier, ()=>
              {
                player.score += 100;
                emitParticles(point.x, point.y, particleDefinitions.hurt)
                damageTileWithEffects[TILE_TYPES[type]](tile);
              });
    }

  }
    

  applyForces() {
    
    if(this.xvel > this.limits.maxXVel) { this.xvel = this.limits.maxXVel; }
    if(this.xvel < -this.limits.maxXVel) { this.xvel = -this.limits.maxXVel; }
    if(this.yvel > this.limits.maxYVel) { this.yvel = this.limits.maxYVel; }
    if(this.yvel < -this.limits.maxYVel) { this.yvel = -this.limits.maxYVel; }

  }

  play(animationName){
   
    this.currentAnimation = this.spritesheet.animations[animationName];


    if (!this.currentAnimation.loop){
        this.currentAnimation.reset();
    }
}

}
