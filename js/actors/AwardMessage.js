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
    this.drawY = y;
  }

  update() {
    this.drawY = this.y + Math.sin(this.timer / 10) * 10;
    if(!this.started) {
      this.started = true;
      emitParticles(view.x + canvas.width/2, this.y, this.particleDef, uiActors);
    }
    this.timer++;
    if (this.timer > this.duration) {
      this.active = false;
      this.kill();
      emitParticles(this.x-30, this.drawY-30, particleDefinitions.awardSparksMessageDeath, uiActors);
    }
  }

  draw(ctx) {
    if (!this.active) return;
    this.font.drawText(this.message, {x: this.x - view.x - 100, y: this.drawY - view.y - 50 }, 0, 0, this.scale)
  }

  kill() {
    uiActors.splice(uiActors.indexOf(this), 1);
  }

}