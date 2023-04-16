class Diggerang {
  constructor (x, y) {
        this.x = x;
    this.y = y;
    this.xvel = 0;
    this.yvel = 0;
    this.active = false;
    this.returning = false;
    this.soundPlayed = false;
    this.sound = audio.playSound(sounds["diggerang_whoosh"], 0, 1, 1, true)
    this.volumeControl = this.sound.volume.gain;
    this.panControl = this.sound.pan.pan;
  }

  update (player) {
  
    if (!this.active) {
      this.volumeControl.value = 0;
      return;
    }
    this.volumeControl.value = 1;
    this.pan();
    this.x += this.velocityX;
    this.y += this.velocityY;

    const distanceToPlayer = Math.sqrt (
      (this.x - player.x) ** 2 + (this.y - player.y) ** 2
    );

    if (this.returning && distanceToPlayer < 20) {
      this.active = false;
      this.returning = false;
      return;
    }

    if (!this.returning && distanceToPlayer > 300) {
      this.returning = true;
    }

    if (this.returning) {
      const angleToPlayer = Math.atan2 (player.y - this.y, player.x - this.x);
      this.velocityX = 4 * Math.cos (angleToPlayer);
      this.velocityY = 4 * Math.sin (angleToPlayer);
    } else {
      this.velocityY += 0.2; // Apply gravity
    }
  }

  draw () {
    if (!this.active) return;

    //drawn as a spinning line, with it's position as the center
    line (
      this.x - view.x - Math.cos (ticker / 3) * 10,
      this.y - view.y - Math.sin (ticker / 3) * 10,
      this.x - view.x + Math.cos (ticker / 3) * 10,
      this.y - view.y + Math.sin (ticker / 3) * 10,
      'white'
    );
  }

  pan() {
    //sets the pan value of the sound based on the position of the diggerang, -1 is left edge of screen, 1 is right edge of screen
    this.panControl.value = (this.x - view.x) / canvas.width * 2 - 1;
  }

}
