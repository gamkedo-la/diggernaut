class Diggerang {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xVel = 0;
    this.yVel = 0;
    this.xAccel = 0;
    this.yAccel = 0;
    this.previousX = this.x;
    this.previousY = this.y;
    this.width = 24;
    this.height = 16;
    this.drawOffset = { x: 0, y: 0 };
    this.active = false;
    this.returning = false;
    this.timeSinceThrown = 0;
    this.soundPlayed = false;
    this.sound = audio.playSound(sounds["diggerang_whoosh"], 0, 0, 1, true)
    this.volumeControl = this.sound.volume.gain;
    this.panControl = this.sound.pan.pan;
    this.damageMultiplier = 1;
    this.collider = new Collider(this.x, this.y, this.width, this.height, { left: 0, right: 0, top: 0, bottom: 0 }, "diggerang");
    this.limits = {
      maxXVel: 7,
      maxYVel: 7,
      minXVel: -7,
      minYVel: -7,
      timeBeforeReturn: 200,
      airTimeBeforeTeleport: 300,
    }
    this.spritesheet = new SpriteSheet({
      image: img['diggerang-spin'],
      frameWidth: 32,
      frameHeight: 32,
      animations: {
        spin: {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          frameRate: 40
        }
      }
    });
    this.currentAnimation = this.spritesheet.animations["spin"];
    this.spritesheetVertical = new SpriteSheet({
      image: img['diggerang-spin-vertical'],
      frameWidth: 32,
      frameHeight: 32,
      animations: {
        spin: {
          frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          frameRate: 40
        }
      }
    });
    this.verticalSpin = this.spritesheetVertical.animations["spin"];

  }

  update(player) {
    if (!this.active) { this.stop(); return; }
    this.currentAnimation.update();
    this.handleUpgrades();
    this.previousX = this.x;
    this.previousY = this.y;
    this.timeSinceThrown++;
    this.volumeControl.value = 1;
    this.pan();
    this.x += this.xVel;
    this.y += this.yVel;
    this.handleCollisions();
    this.applyForces();

    const distanceToPlayer = Math.sqrt(
      (this.x - player.x) ** 2 + (this.y - player.y) ** 2
    );

    if (this.returning && distanceToPlayer < 20) {
      this.active = false;
      this.returning = false;
      UIMsg("Returned Diggerang!");
      emitParticles(this.x, this.y, particleDefinitions['jumpPuff'])
      emitParticles(player.x, player.y, particleDefinitions['jumpPuff'])
      return;
    }

    if(this.timeSinceThrown > 20 && distanceToPlayer < 20) {
      this.active = false;
      this.returning = false;
      emitParticles(this.x, this.y, particleDefinitions['jumpPuff'])
      emitParticles(player.x, player.y, particleDefinitions['jumpPuff'])
      UIMsg("Returned Diggerang!");
      return;
    }

    if( (this.x + this.xVel) == this.previousX && (this.y + this.yVel) == this.previousY) {
      this.returning = true;
    }
    if(this.returning) {
      if(this.x == this.previousX && this.y == this.previousY) {
        this.active = false;
        this.returning = false;
        emitParticles(this.x, this.y, particleDefinitions['jumpPuff'])
        emitParticles(player.x, player.y, particleDefinitions['jumpPuff'])
        UIMsg("Returned Diggerang!");
        return;
      }
    }

    if (!this.returning && this.timeSinceThrown > this.limits.timeBeforeReturn) {
      this.returning = true;
    }

    if (this.timeSinceThrown > this.limits.airTimeBeforeTeleport) {
      //todo: visual feedback for returned diggerang
      UIMsg("Returned Diggerang!");
      this.x = player.x;
      this.y = player.y;
      this.timeSinceThrown = 0
      this.active = false;
      this.returning = false;
    }

    if (this.returning) {
      const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
      const returnXVel = 10 * Math.cos(angleToPlayer);
      const returnYVel = 10 * Math.sin(angleToPlayer);

      this.xVel = this.xVel + 0.3 * returnXVel;
      this.yVel = this.yVel + 0.3 * returnYVel;
    } 
  }

  draw() {
    if (!this.active) return;
    this.currentAnimation.render({
      x: Math.floor(this.x - view.x - 4),
      y: Math.floor(this.y - view.y - 8),
      width: 32,
      height: 32
    })
    bufferContext.save();
    bufferContext.globalCompositeOperation = "screen";
    drawTileSprite(tileSets.glow_64px,
      rand(0, 1) < .1 ? randInt(0, 3) : 0,
      this.x - view.x - 16,
      this.y - view.y - 16,
      bufferContext);
    bufferContext.restore();
    //this.collider.draw();
  }

  pan() {
    this.panControl.value = (clamp(this.x - view.x, 0, canvas.width) / canvas.width * 2 - 1);
  }

  checkCollision(tileMap) {
    if (tileMap.collidesWith(this.x, this.y)) {
      const tileCoords = tileMap.pixelToTileGrid(this.x, this.y);
      // Calculate the reflection vector
      const normal = tileMap.getCollisionNormal(tileCoords.x, tileCoords.y);
      const dot = 2 * (this.xVel * normal.x + this.yVel * normal.y);
      this.xVel -= dot * normal.x * 0.05;
      this.yVel -= dot * normal.y * 0.05;
      this.xVel *= 0.7;
      this.yVel *= 0.7;

      if (isNaN(this.xVel) || isNaN(this.yVel)) {
        this.xVel = 0;
        this.yVel = 0;
        this.active = false;
        this.returning = false;
      }

    }
  }

  handleCollisions(resolution = 3) {
    //x collision
    if (this.xVel == 0) {
      this.collider.update(this.x, this.y);
    } else {
      let increment = this.xVel / resolution;
      for (let i = 0; i < resolution; i++) {
        this.collider.update(this.x + increment, this.y);
        if (this.collider.tileCollisionCheck(0)) {
          const tileIndex = tileMap.pixelToTileIndex(this.x + increment, this.y);
          this.damageTilesAtCollision(tileIndex)
          this.x = this.previousX;
          this.collider.update(this.x, this.y);
          this.xVel = -this.xVel;
          this.xVel *= 0.9;
          this.yVel *= 0.9;
          break;
        }
      }
    }
    //y collision
    if (this.yVel == 0) {
      this.collider.update(this.x, this.y);
    } else {
      let increment = this.yVel / resolution;
      for (let i = 0; i < resolution; i++) {
        this.collider.update(this.x, this.y + increment);
        if (this.collider.tileCollisionCheck(0)) {
          const tileIndex = tileMap.pixelToTileIndex(this.x + increment, this.y);
          this.damageTilesAtCollision(tileIndex)
          this.y = this.previousY;
          this.collider.update(this.x, this.y);
          this.yVel = -this.yVel;
          this.xVel *= 0.9;
          this.yVel *= 0.9;
          break;
        }
      }
    }
    if (isNaN(this.xVel) || isNaN(this.yVel)) {
      this.xVel = 0;
      this.yVel = 0;
      this.active = false;
      this.returning = false;
    }
    this.collider.update(this.x, this.y);
  }

  handleUpgrades() {
    if (player.upgrades.diggerang) {
      let end1X = this.x + 16 + Math.cos((ticker / 2) + Math.PI) * 16;
      let end1Y = this.y + 12 + Math.sin((ticker / 2) + Math.PI) * 8;
      let end2X = this.x + 16 + Math.cos(ticker / 2) * 16;
      let end2Y = this.y + 12 + Math.sin(ticker / 2) * 8;
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
      tileMap.damageTileAt(tile, damageValues[type] * this.damageMultiplier, () => {
        player.score += 100;
        emitParticles(point.x, point.y, particleDefinitions.hurt)
        damageTileWithEffects[TILE_TYPES[type]](tile);
      });
    }
    if (right) {
      const point = this.collider.rightFeeler;
      const tile = tileMap.pixelToTileIndex(point.x, point.y);
      const type = tileMap.data[tile];
      tileMap.damageTileAt(tile, damageValues[type] * this.damageMultiplier, () => {
        player.score += 100;
        emitParticles(point.x, point.y, particleDefinitions.hurt)
        damageTileWithEffects[TILE_TYPES[type]](tile);
      });
    }
    if (top) {
      const point = this.collider.topFeeler;
      const tile = tileMap.pixelToTileIndex(point.x, point.y);
      const type = tileMap.data[tile];
      tileMap.damageTileAt(tile, damageValues[type] * this.damageMultiplier, () => {
        player.score += 100;
        emitParticles(point.x, point.y, particleDefinitions.hurt)
        damageTileWithEffects[TILE_TYPES[type]](tile);
      });
    }
    if (bottom) {
      const point = this.collider.bottomFeeler;
      const tile = tileMap.pixelToTileIndex(point.x, point.y);
      const type = tileMap.data[tile];
      tileMap.damageTileAt(tile, damageValues[type] * this.damageMultiplier, () => {
        player.score += 100;
        emitParticles(point.x, point.y, particleDefinitions.hurt)
        damageTileWithEffects[TILE_TYPES[type]](tile);
      });
    }
  }


  applyForces() {
    if (this.xVel > this.limits.maxXVel) { this.xVel = this.limits.maxXVel; }
    if (this.xVel < -this.limits.maxXVel) { this.xVel = -this.limits.maxXVel; }
    if (this.yVel > this.limits.maxYVel) { this.yVel = this.limits.maxYVel; }
    if (this.yVel < -this.limits.maxYVel) { this.yVel = -this.limits.maxYVel; }
  }

  play(animationName) {
    this.currentAnimation = this.spritesheet.animations[animationName];
    if (!this.currentAnimation.loop) {
      this.currentAnimation.reset();
    }
  }

}
