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
    this.height = 24;
    this.active = false;
    this.returning = false;
    this.timeSinceThrown = 0;
    this.soundPlayed = false;
    this.sound = audio.playSound(sounds["diggerang_whoosh"], 0, 0, 1, true)
    this.volumeControl = this.sound.volume.gain;
    this.panControl = this.sound.pan.pan;
    this.collider = new Collider (this.x, this.y, this.width, this.height, {left: 0, right: 0, top: 0, bottom: 0}, "diggerang");
    this.limits = {
      maxXVel: 7,
      maxYVel: 7,
      minXVel: -7,
      minYVel: -7
    }
  }

  update (player) {
    if (!this.active) { this.stop(); return; }
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

    if (!this.returning && this.timeSinceThrown > 100) {
      this.returning = true;
    }

    if (this.returning) {
      const angleToPlayer = Math.atan2 (player.y - this.y, player.x - this.x);
      const returnXVel = 10 * Math.cos(angleToPlayer);
      const returnYVel = 10 * Math.sin(angleToPlayer);

      this.xvel = this.xvel + 0.1 * returnXVel;
      this.yvel = this.yvel + 0.1 * returnYVel;
    } else {
      //this.yvel += 0.2; // Apply gravity
    }
  }

  draw () {
    if (!this.active) return;

    line (
      this.x + 16 - view.x + Math.cos ((ticker / 3) + Math.PI) * 10,
      this.y + 16  - view.y + Math.sin ((ticker / 3) + Math.PI) * 10,
      this.x  + 16 - view.x + Math.cos (ticker / 3) * 10,
      this.y  + 16 - view.y + Math.sin (ticker / 3) * 10,
      'white'
    );
    this.collider.draw();
  }

  pan() {
    //sets the pan value of the sound based on the position of the diggerang, -1 is left edge of screen, 1 is right edge of screen
    this.panControl.value = (this.x - view.x) / canvas.width * 2 - 1;
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
              this.yvel *= 0.9;
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
      tileMap.damageTileAt(tile, 25, ()=>
              {
                emitParticles(point.x, point.y, particleDefinitions.hurt)
              });
    }
    if (right) {
      const point = this.collider.rightFeeler;
      const tile = tileMap.pixelToTileIndex(point.x, point.y);
      tileMap.damageTileAt(tile, 25, ()=>
              {
                emitParticles(point.x, point.y, particleDefinitions.hurt)
              });
    }
    if (top) {
      const point = this.collider.topFeeler;
      const tile = tileMap.pixelToTileIndex(point.x, point.y);
      tileMap.damageTileAt(tile, 25, ()=>
              {
                emitParticles(point.x, point.y, particleDefinitions.hurt)
              });
    }
    if (bottom) {
      const point = this.collider.bottomFeeler;
      const tile = tileMap.pixelToTileIndex(point.x, point.y);
      tileMap.damageTileAt(tile, 25, ()=>
              {
                emitParticles(point.x, point.y, particleDefinitions.hurt)
              });
    }

  }
    

  applyForces() {
    
    if(this.xvel > this.limits.maxXVel) { this.xvel = this.limits.maxXVel; }
    if(this.xvel < -this.limits.maxXVel) { this.xvel = -this.limits.maxXVel; }
    if(this.yvel > this.limits.maxYVel) { this.yvel = this.limits.maxYVel; }
    if(this.yvel < -this.limits.maxYVel) { this.yvel = -this.limits.maxYVel; }

  }

}
