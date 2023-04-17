class Diggerang {
  constructor (x, y) {
        this.x = x;
    this.y = y;
    this.xvel = 0;
    this.yvel = 0;
    this.width = 32;
    this.height = 32;
    this.active = false;
    this.returning = false;
    this.timeSinceThrown = 0;
    this.soundPlayed = false;
    this.sound = audio.playSound(sounds["diggerang_whoosh"], 0, 1, 1, true)
    this.volumeControl = this.sound.volume.gain;
    this.panControl = this.sound.pan.pan;
    this.collider = new Collider (this.x, this.y, this.width, this.height, {left: 0, right: 0, top: 0, bottom: 0}, "diggerang");
  }

  update (player) {
  
    if (!this.active) {
      this.timeSinceThrown = 0;
      this.volumeControl.value = 0;
      return;
    }
    this.timeSinceThrown++;
    this.volumeControl.value = 1;
    //this.collider.update(this.x, this.y);
    
    

    this.pan();
    
    this.x += this.xvel;
    this.y += this.yvel;
    this.checkCollisionSimple(tileMap);
    

    const distanceToPlayer = Math.sqrt (
      (this.x - player.x) ** 2 + (this.y - player.y) ** 2
    );

    if (this.returning && distanceToPlayer < 20) {
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
      this.yvel += 0.2; // Apply gravity
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

  checkCollisionSimple(tileMap) {
    const prevX = this.x - this.xvel;
    const prevY = this.y - this.yvel;
    const collidesInX = tileMap.collidesWith(this.x, prevY);
    const collidesInY = tileMap.collidesWith(prevX, this.y);

    if(collidesInX) {
      this.xvel = -this.xvel;
      //this.xvel *= 0.98;
      //this.yvel *= 0.98;
    }

    if(collidesInY) {
      this.yvel = -this.yvel;
      //this.xvel *= 0.98;
      //t/his.yvel *= 0.98;
    }
  }

}
