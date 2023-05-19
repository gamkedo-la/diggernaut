class AwardMessage {
  constructor(x, y, message, font, scale, duration, particleDef) {
    this.x = x;
    this.y = y;
    this.message = message;
    this.font = font;
    this.scale = scale;
    this.duration = duration;
    this.particleDef = particleDef;
    this.timer = 0;
    this.active = true;
    this.started = false;
  }

  update() {
   
    if(!this.started) {
      this.started = true;
      emitParticles(view.x + canvas.width/2, this.y, this.particleDef, uiActors);
    }
    this.timer++;
    if (this.timer > this.duration) {
      this.active = false;
      this.kill();
    }
    
  }

  draw(ctx) {
    if (!this.active) return;
    let drawY = this.y + Math.sin(this.timer / 10) * 10;
    this.font.drawText(this.message, {x: this.x - view.x - 100, y: drawY - view.y - 50 }, 0, 0, this.scale)
  }

  kill() {
    uiActors.splice(actors.indexOf(this), 1);
    console.log('killing award message')
  }

}