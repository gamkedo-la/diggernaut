class Crawler {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.previousX = this.x;
        this.previousY = this.y;
        this.currentAnimation = "idle";
        this.width = 24;
        this.height = 20;
        this.xvel = 0;
        this.yvel = 0;
        this.gravity = 0.2;
        this.yAccel = 0;
        this.xAccel = 0;
        this.state = "idle";
        this.limits = {
            maxYVel: 4,
            maxXVel: 0.5,
            minXVel: -0.5,
        }
        this.drawOffset = {
            x: 4,
            y: 10
        }
        this.collider = new Collider(this.x, this.y, this.width, this.height, { left: 0, right: 0, top: 0, bottom: 0 }, "crawler")
        this.spritesheet = new SpriteSheet({
            image: img['crawler'],
            frameWidth: 32,
            frameHeight: 32,
            animations: {
                idle: {
                    frames: [0],
                    frameRate: 2
                },
                walking: {
                    frames: [0, 1, 2, 3],
                    frameRate: 12
                }
            }
        })
        this.currentAnimation = this.spritesheet.animations["idle"];
    }
    states = {
        idle: function () {
            this.play("idle");
        },
        walkingLeft: function () {
            this.play("walking");
            this.xvel = this.limits.minXVel;

        },
        walkingRight: function () {
            this.play("walking");
            this.xvel = this.limits.maxXVel;
        }
    }

    draw() {
        if (!inView(this)) return;
        this.currentAnimation.render({
            x: Math.floor(this.x - view.x) - this.drawOffset.x,
            y: Math.floor(this.y - view.y) - this.drawOffset.y,
            width: 32,
            height: 32
        })
        this.collider.draw();
    }
    update() {
        if (!inView(this)) return;
        this.currentAnimation.update();
        this.collider.update(this.x, this.y);
        this.previousX = this.x;
        this.previousY = this.y;
        this.states[this.state].call(this);
        this.yvel += this.gravity;
        this.checkFloor();
        this.handleWalls();
        if (rectCollision(this.collider, player.diggerang.collider)) {
            this.kill();
        }
        if (rectCollision(this.collider, player.collider)) {
            this.collideWithPlayer();
        }
        this.x += this.xvel;
        this.y += this.yvel;
        if (this.yvel > this.limits.maxYVel) {
            this.yvel = this.limits.maxYVel;
        }
    }

    checkFloor() {
        let left = this.collider.leftFeeler;
        let right = this.collider.rightFeeler;
        let bottom = this.collider.bottomFeeler;
        if (!tileMap.collidesWith(left.x, bottom.y)) {
            this.state = "walkingRight";
        }
        if (!tileMap.collidesWith(right.x, bottom.y)) {
            this.state = "walkingLeft";
        }
        if (tileMap.collidesWith(left.x, left.y)) {
            this.state = "walkingRight";
        }
        if (tileMap.collidesWith(right.x, right.y)) {
            this.state = "walkingLeft";
        }
    }

    handleWalls() {
        if (this.collider.tileCollisionCheck(0)) {
            this.x = this.previousX;
            this.y = this.previousY;
            this.collider.update(this.x, this.y);
            this.yvel = 0;
        }
    }

    kill() {
        emitParticles(this.x, this.y, particleDefinitions.fallSparks)
        emitParticles(this.x, this.y, particleDefinitions.hurt)
        audio.playSound(sounds["player_damage_big_1"], 0, 0.5, 0.3, false);
        let i = 5;
        while (i--) {
            actors.push(new Health(this.x, this.y));
        }
        actors.splice(actors.indexOf(this), 1);
    }

    collideWithPlayer() {
        emitParticles(this.x, this.y, particleDefinitions.hurt)
        let repelX = normalize(this.x - player.x, -player.width / 2, player.width / 2);
        let repelY = normalize(this.y - player.y, -player.height / 2, player.height / 2);
        if (player.collider.bottomFeeler.y >= this.y) {
            player.hurt(5)
            player.stop();
            player.xAccel = -repelX * 2;
            player.yAccel = -repelY * 2;

        }
        else {
            this.kill()
            player.yvel = 0;
            player.yAccel = player.limits.minYAccel * 2;
            player.helicopterCapacity = player.limits.helicopterCapacity;
        }
    }

    play(animationName) {
        this.currentAnimation = this.spritesheet.animations[animationName];
        if (!this.currentAnimation.loop) {
            this.currentAnimation.reset();
        }
    }

}