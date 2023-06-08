class Particle {
    constructor(x, y, options = {}, pool = actors) {

        this.type = TYPE_PARTICLE;
        this.xVelocity = options.xVelocity();
        this.yVelocity = options.yVelocity();
        this.color = options.color();
        this.lifeMax = options.life();
        this.life = options.life() || 100;
        this.custom = options.custom || null;
        this.tileSprite = options.tileSprite || null;
        this.gravity = options.gravity() || 0;
        this.collides = options.collides;
        this.x = x;
        this.y = y;
        this.previousX = this.x;
        this.previousY = this.y;
        this.gradientPalette = options.gradientPalette || null;
        this.glow = options.glow || false;
        this.pool = pool;

    }

    update() {
        this.previousX = this.x;
        this.previousY = this.y;

        if (!inView(this)) {
            this.die();
        }
        if (this.custom) {
            this.custom(this);
        }

        this.yVelocity += this.gravity;
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        this.life--



        if (!inView(this)) {
            this.die();
        }
        if (this.life <= 0) {
            this.die();
        }

        if (this.collides) {
            if (tileMap.collidesWith(this.x, this.y)) {

                this.yVelocity = -this.yVelocity;
                this.xVelocity = -this.xVelocity;
                this.x = this.previousX + this.xVelocity;
                this.y = this.previousY + this.yVelocity;

            }
        }
        if (this.gradientPalette) {
            //map gradient palette to life
            const lifePercent = this.life / this.lifeMax;
            const colorIndex = Math.max(0, Math.floor(lifePercent * this.gradientPalette.length));
            this.color = this.gradientPalette[colorIndex];
        }
    }

    draw() {
        if (elapsed > 40) { this.die(); return; }
        if (this.tileSprite) {
            const lifePercent = this.life / this.lifeMax;
            const frameIndex = Math.max(0, Math.floor(lifePercent * this.tileSprite.tileCount));
            if (this.glow) {
                this.drawToGlowCanvas(frameIndex);
            }
            else {
                drawTileSprite(this.tileSprite, frameIndex, this.x - view.x, this.y - view.y);
            }
        }
        else {
            line(this.x - view.x, this.y - view.y, this.previousX - view.x, this.previousY - view.y, this.color);
        }
    }

    die() {
        this.pool.splice(this.pool.indexOf(this), 1);
    }

    drawToGlowCanvas(frame) {
        if (elapsed > 40) { this.die(); return; }
        bloomContext.save();
        bloomContext.globalCompositeOperation = "screen";
        drawTileSprite(this.tileSprite, frame, this.x - view.x, this.y - view.y, bloomContext);
        bloomContext.restore();
    }

}