class Stalagmite {
    constructor(x, y) {
        this.x = x;
        this.y = y + 12;
        this.spawnY = y + 12;
        this.previousY = 0;
        this.yvel = 0;
        this.width = 32;
        this.height = 20;
        this.gravity = 0;
        this.yvelLimit = 5;
        this.health = 10;
        this.collider = new Collider(this.x, this.y, this.width, this.height, { left: 0, right: 0, top: 0, bottom: 0 }, "Stalagmite")
    }
    draw() {
        if (!inView(this)) return;
        drawTileSprite(tileSets.caveTileset, 16 * 10, this.x - view.x, this.y - 12 - view.y)
        this.collider.draw();
    }
    update() {
        if (!inView(this)) return;
        this.previousY = this.y;
        this.yvel += this.gravity;
        this.collider.update(this.x, this.y)
        if (this.yvel > this.yvelLimit) this.yvel = this.yvelLimit;

        this.handleCollisions();

    }

    kill() {
        emitParticles(this.x + 16, this.y + 16, particleDefinitions.fallSparks)
        emitParticles(this.x + 16, this.y + 16, particleDefinitions.hurt)
        actors.splice(actors.indexOf(this), 1);
        audio.playSound(sounds[randChoice(rock_crumbles)])

    }

    handleCollisions() {
        this.y += this.yvel;
        this.collider.update(this.x, this.y)
        const collisionInfo = rectCollision(this.collider, player.collider);
        if (collisionInfo) {
            this.resolvePlayerCollision(collisionInfo);
        }
    }

    resolvePlayerCollision(collisionInfo) {
        player.collisionInfo = collisionInfo;
        if (collisionInfo.left || collisionInfo.right) {
            player.x = player.previousX;
            player.updateCollider(player.x, player.y);
            player.xvel = 0;
            player.hurt(5);
            if (Key.isDown(Key.z) || Joy.x) {
                this.kill();
            }
        } else if (collisionInfo.top) {

            player.y = player.previousY;
            player.updateCollider(player.x, player.y);
            player.yvel = Math.max(0, player.yvel);
            this.kill();
            player.hurt(5);

        } else if (collisionInfo.bottom) {
            player.yvel = Math.min(0, player.yvel)
            player.y = player.previousY - 1;
            player.updateCollider(player.x, player.y);
            this.health--;
            if (this.health <= 0) { this.kill(); }
            ;
            player.canJump = true;
            if (Key.isDown(Key.z) || Joy.x) {
                this.kill();
            }
        }
    }
}