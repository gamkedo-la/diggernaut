class Player {
    constructor(settings = {}) {
        Object.assign(this, settings);

        this.previousX = this.x;
        this.previousY = this.y;
        this.diggerang = new Diggerang(this.x, this.y);
        this.digging = false;
        this.hovering = false;
        this.helicopterCapacity = 0;
        this.shield = 10;
        this.showShieldCooldown = 0;
        this.depth = 0;
        this.score = 0;
        this.upgrades = {};
        this.hoverSound = audio.playSound(sounds["diggerang_whoosh"], 0, 0, 1.0, true);
        this.drawOffset = {
            x: 7,
            y: 8
        }

        // Start facing left with idleLeft animation
        this.facing = Direction.LEFT;

        this.inventory = {
            ore: 50,
            blueOre: 0,
        }

        this.footstepDelay = 250; // ms between sounds
        this.footstepLast = 0; // a timestamp

        this.spritesheet = new SpriteSheet({
            image: img['movingPlayerSprite'],
            frameWidth: 32,
            frameHeight: 32,
            animations: {
                idleLeft: {
                    frames: [2],
                    frameRate: 1
                },
                idleRight: {
                    frames: [4],
                    frameRate: 1
                },
                walkLeft: {
                    frames: [0, 1, 2, 3],
                    frameRate: 10
                },
                walkRight: {
                    frames: [4, 5, 6, 7],
                    frameRate: 10
                },
                jumpLeft: {
                    frames: [14],
                    frameRate: 1
                },
                jumpRight: {
                    frames: [15],
                    frameRate: 1
                },
                fallingLeft: {
                    frames: [12],
                    frameRate: 1
                },
                fallingRight: {
                    frames: [13],
                    frameRate: 1
                },
                helicopter: {
                    frames: "8..11",
                    frameRate: 24
                },
                lookUpLeft: {
                    frames: [16],
                    frameRate: 1
                },
                lookUpRight: {
                    frames: [17],
                    frameRate: 1
                },
                digUpRight: {
                    frames: [18],
                    frameRate: 1
                },
                digUpLeft: {
                    frames: [19],
                    frameRate: 1
                },
                digLeft: {
                    frames: [20],
                    frameRate: 1
                },
                digRight: {
                    frames: [21],
                    frameRate: 1
                },
                digDown: {
                    frames: [22],
                    frameRate: 1
                }



            }
        })




        this._updateInternalAnimations();
        this.currentAnimation = this.spritesheet.animations["idleLeft"];

        this.limits = {
            minXVel: -5,
            maxXVel: 5,
            minYVel: -10,
            maxYVel: 20,
            hurtVelocity: 10,
            minXAccel: -3,
            maxXAccel: 3,
            minYAccel: -3,
            maxYAccel: 5,
            digCooldown: 12,
            hurtCooldown: 20,
            healthMax: 50,
            moveLeftCooldown: 20,
            moveRightCooldown: 20,
            coyoteCooldown: 10,
            helicopterCapacity: 100,
            hoverMultiplier: 0.9,
            hoverYVelocity: -1,
            jumpMultiplier: 8,
            gravity: 0.25,
            shieldMax: 10,
            showShieldCooldown: 100,
        }

        this.gravity = this.limits.gravity

        this.collider = new Collider(this.x, this.y, this.width, this.height, {
            left: 2, right: 2, top: 10, bottom: 6
        }, 'player')
    }

    // Object to hold current animation for easy access
    _updateInternalAnimations() {
        this.animations = {
            helicopter: this.spritesheet.animations["helicopter"],
            idle: this.spritesheet.animations[this.facing === Direction.LEFT ? "idleLeft" : 'idleRight'],
            walk: this.spritesheet.animations[this.facing === Direction.LEFT ? "walkLeft" : 'walkRight'],
            jump: this.spritesheet.animations[this.facing === Direction.LEFT ? "jumpLeft" : 'jumpRight'],
            dig: this.spritesheet.animations[this.facing === Direction.LEFT ? "digLeft" : 'digRight'],
            digUp: this.spritesheet.animations[this.facing === Direction.LEFT ? "digUpLeft" : 'digUpRight'],
            digDown: this.spritesheet.animations["digDown"],
            lookUp: this.spritesheet.animations[this.facing === Direction.LEFT ? "lookUpLeft" : 'lookUpRight'],
            falling: this.spritesheet.animations[this.facing === Direction.LEFT ? "fallingLeft" : 'fallingRight'],
        }
    }

    reset() {
        this.x = this.previousX;
        this.y = this.previousY;
        this.canHelicopter = false;
        this.canJump = false;
        this.canDig = true;
        this.xvel = 0;
        this.yvel = 0;
        this.xAccel = 0;
        this.yAccel = 0;
        this.digCooldown = 12;
        this.hurtCooldown = 300;
        this.health = 40;
        this.moveLeftCooldown = 0;
        this.moveRightCooldown = 0;
        this.coyoteCooldown = 0;
        this.wallSliding = false;
        this.facing = Direction.LEFT;
        this.score = 0;
        this.upgrades = {};
        this.inventory = {
            ore: 5,
            blueOre: 5,
        }
        blueUpgrades = createBlueUpgrades();
        goldUpgrades = createGoldUpgrades();
    }
    draw() {
        this.currentAnimation.render({
            x: Math.floor(this.x - view.x) - this.drawOffset.x,
            y: Math.floor(this.y - view.y) - this.drawOffset.y,
            width: 32,
            height: 32
        })

        if (this.hovering) {
            this.diggerang.currentAnimation.render({
                x: Math.floor(this.x - view.x),
                y: Math.floor(this.y - view.y) - 22,
                width: 32,
                height: 32
            })
        }

        if (this.digging) {
            if (!this.diggerang.active) {

                if (Key.isDown(Key.UP) || Joy.up) {
                    this.diggerang.currentAnimation.update();
                    this.diggerang.currentAnimation.render({
                        x: Math.floor(this.x - view.x - 8),
                        y: Math.floor(this.y - view.y) - 22,
                        width: 32,
                        height: 32
                    })
                } else if (Key.isDown(Key.DOWN) || Joy.down) {
                    this.diggerang.currentAnimation.update();
                    this.diggerang.currentAnimation.render({
                        x: Math.floor(this.x - view.x - 8),
                        y: Math.floor(this.y - view.y) + 8,
                        width: 32,
                        height: 32
                    })
                } else if (Key.isDown(Key.LEFT) || Joy.left) {
                    this.diggerang.verticalSpin.update();
                    this.diggerang.verticalSpin.render({
                        x: Math.floor(this.x - view.x - 14),
                        y: Math.floor(this.y - view.y - 4),
                        width: 32,
                        height: 32
                    })
                } else if (Key.isDown(Key.RIGHT) || Joy.right) {
                    this.diggerang.verticalSpin.update();
                    this.diggerang.verticalSpin.render({
                        x: Math.floor(this.x - view.x + 6),
                        y: Math.floor(this.y - view.y - 4),
                        width: 32,
                        height: 32
                    })
                }
            }
        }

        this.collider.draw()
        this.diggerang.draw();
        this.drawDamageTextFX();
        if (this.showShieldCooldown > 0) { this.drawShield(); }



        if (Key.isDown(Key.LEFT) || Joy.left) { this.drawDigTileHighlight(Direction.LEFT) };
        if (Key.isDown(Key.RIGHT) || Joy.right) { this.drawDigTileHighlight(Direction.RIGHT) };
        if (Key.isDown(Key.UP) || Joy.up) { this.drawDigTileHighlight(Direction.UP) };
        if (Key.isDown(Key.DOWN) || Joy.down) { this.drawDigTileHighlight(Direction.DOWN) };
    }

    update() {
        this.applyForces();
        this.handleCollisions();
        this.checkForFallingRocks();
        this.checkBounds();
        this.hurtCooldown--;
        this.showShieldCooldown--;
        this.depth = Math.round(this.y / 8);
        this.shield = Math.min(this.shield, this.limits.shieldMax);
        this.canDig = this.checkDig();
        this.canJump = this.isOnFloor() || this.coyoteCooldown > 0;
        this.canHelicopter = !this.diggerang.active;
        if (this.canJump) { this.helicopterCapacity = this.limits.helicopterCapacity; }
        this.wallSliding = this.isOnWall() && !this.isOnFloor() && (Key.isDown(Key.LEFT) || Key.isDown(Key.a) || Key.isDown(Key.RIGHT) || Key.isDown(Key.d) || Joy.left || Joy.right);
        this.canWallJump = this.isOnWall() && !this.isOnFloor();
        if (this.moveLeftCooldown > 0) { this.moveLeftCooldown--; }
        if (this.moveRightCooldown > 0) { this.moveRightCooldown--; }
        this.xAccel = 0;
        this.yAccel = 0;
        if (Math.abs(this.xvel) < 0.05) { this.xvel = 0; }
        if (this.wallSliding) this.collider.emit(particleDefinitions.sparks);
        if (this.yvel > this.limits.hurtVelocity - 2) emitParticles(this.x + rand(0, 12), this.y, particleDefinitions.fallSparks);

        this.handleAnimationState();

        this.diggerang.update(this);

        if (this.hovering) {
            this.hoverSound.volume.gain.value = 1;
            this.diggerang.currentAnimation.update();
        } else {
            this.hoverSound.volume.gain.value = 0;
        }

        if (this.health >= this.limits.healthMax) {
            this.health = this.limits.healthMax;
        }
    }

    handleInput() {
        this.digging = false;
        //this.hovering = false;
        if (Key.isDown(Key.LEFT) || Key.isDown(Key.a) || Key.isDown(Key.h) || Joy.left) {
            this.moveLeft();
            if (Key.isDown(Key.z) || Joy.x) {
                this.digging = true;
                this.dig(Direction.LEFT);
            }
        }
        else if (Key.isDown(Key.RIGHT) || Key.isDown(Key.d) || Key.isDown(Key.l) || Joy.right) {
            this.moveRight();
            if (Key.isDown(Key.z) || Joy.x) {
                this.digging = true;
                this.dig(Direction.RIGHT);
            }
        }

        if (Key.isDown(Key.UP) || Key.isDown(Key.w) || Key.isDown(Key.k) || Joy.up) {
            this.currentAnimation = this.animations.lookUp;
            if (Key.isDown(Key.z) || Joy.x) {
                this.digging = true;
                this.dig(Direction.UP);
            }
            this.facing = Direction.UP;

        }
        else if (Key.isDown(Key.DOWN) || Key.isDown(Key.s) || Key.isDown(Key.j) || Joy.down) {
            if (Key.isDown(Key.z) || Joy.x) {
                this.digging = true;
                this.dig(Direction.DOWN);
            }
            this.facing = Direction.DOWN;
        }

        if (Key.isDown(Key.SPACE) || Joy.a) {
            if (this.canJump) {
                this.jump();
            } else if (this.canHelicopter && this.yvel > this.limits.hoverYVelocity) {
                this.helicopter();
            }
        }

        if (Key.justReleased(Key.SPACE) || Joy.aReleased) {
            this.hovering = false;
            if (this.canWallJump) {
                this.wallJump(tileMap);
            }
        }

        if (Key.justReleased(Key.z) || Joy.xReleased) { this.digCooldown = 0; }
        if (Key.justReleased(Key.p) || Joy.startReleased) { signal.dispatch('pause'); }
        if (Key.justReleased(Key.i) || Joy.yReleased) { signal.dispatch('inventory'); }
        if (Key.justReleased(Key.x) || Joy.bReleased) { this.throw() }
    }

    shieldBoost(amount) {
        this.shield += amount;
        if (this.shield != this.limits.shieldMax) {
            this.showShieldCooldown = this.limits.showShieldCooldown;
        }


    }

    updateCollider(x, y) {
        this.x = x;
        this.y = y;
        this.collider.update(x, y);
    }

    applyForces() {
        this.previousX = this.x;
        this.previousY = this.y;
        let yAccelDelta = this.wallSliding ? 0.25 : 1;
        this.yAccel += (this.gravity * yAccelDelta);
        this.xvel += this.xAccel;
        this.yvel += this.yAccel;
        if (this.xvel > this.limits.maxXVel) { this.xvel = this.limits.maxXVel; }
        if (this.xvel < this.limits.minXVel) { this.xvel = this.limits.minXVel; }
        if (this.yvel > this.limits.maxYVel) { this.yvel = this.limits.maxYVel; }
        if (this.yvel < this.limits.minYVel) { this.yvel = this.limits.minYVel; }
        if (this.xAccel > this.limits.maxXAccel) { this.xAccel = this.limits.maxXAccel; }
        if (this.xAccel < this.limits.minXAccel) { this.xAccel = this.limits.minXAccel; }

        this.xvel *= this.friction;
        this.yvel *= (this.wallSliding ? 0.8 : 1);
    }

    handleAnimationState() {
        this._updateInternalAnimations();
        this.currentAnimation.update();

        if (this.xvel > 0) {
            this.facing = Direction.RIGHT;
            this.currentAnimation = this.animations.walk;
        } else if (this.xvel < 0) {
            this.facing = Direction.LEFT;
            this.currentAnimation = this.animations.walk;
        } else {
            this.currentAnimation = this.animations.idle;
        }

        if (this.yvel < 0) {
            this.currentAnimation = this.animations.jump;
            if (this.hovering) {
                this.currentAnimation = this.animations.helicopter;
            }
        }
        if (this.yvel > 0) {
            this.currentAnimation = this.animations.falling;;
        }
        if (this.digging) {
            if (Key.isDown(Key.UP)) {
                this.currentAnimation = this.animations.digUp;
            } else if (Key.isDown(Key.DOWN)) {
                this.currentAnimation = this.animations.digDown;
            } else this.currentAnimation = this.animations.dig;
        }
    }

    handleCollisions(resolution = 3) {
        if (this.xvel == 0) {
            this.updateCollider(this.x, this.y);
        } else {
            let increment = this.xvel / resolution;
            for (let i = 0; i < resolution; i++) {
                this.updateCollider(this.x + increment, this.y);
                if (this.collider.tileCollisionCheck(0)) {
                    this.x = this.previousX;
                    this.updateCollider(this.x, this.y);
                    this.xvel = 0;
                    break;
                }
            }
        }

        if (this.yvel == 0) {
            this.updateCollider(this.x, this.y);
        } else {
            let increment = this.yvel / resolution;
            for (let i = 0; i < resolution; i++) {
                this.updateCollider(this.x, this.y + increment);
                if (this.collider.tileCollisionCheck(0)) {
                    this.y = this.previousY;
                    this.updateCollider(this.x, this.y);

                    this.yvel = 0;
                    break;
                }
            }
        }

        this.updateCollider(this.x, this.y);
    }

    tileOverlapCheck(tileIndex) {
        let playerTileIndex = tileMap.pixelToTileIndex(this.x, this.y);
        return (playerTileIndex == tileIndex);
    }


    isOnWall() {
        //isOnWall is used to determine if the player is on a wall and can jump off of it
        let left = tileMap.data[tileMap.pixelToTileIndex(this.collider.leftFeeler.x, this.collider.leftFeeler.y)];
        let right = tileMap.data[tileMap.pixelToTileIndex(this.collider.rightFeeler.x, this.collider.rightFeeler.y)];
        return (left > 0 || right > 0);
    }

    isOnFloor() {
        let rc = tileMap.data[tileMap.pixelToTileIndex(this.collider.bottomFeeler.x, this.collider.bottomFeeler.y)];
        if (rc > 0) {
            this.coyoteCooldown = this.limits.coyoteCooldown;
            this.hovering = false;
            return true;
        } else {
            this.coyoteCooldown--;
            return false;
        }
    }

    footStepSFX() {

        if (!this.isOnFloor()) {
            // this.footstepLast = 0; // no delay once we land
            return;
        }

        let now = performance.now();
        if (this.footstepLast + this.footstepDelay <= now) {
            //console.log("step! footstepLast="+this.footstepLast.toFixed(2)+" now="+now.toFixed(2));
            audio.playSound(sounds[randChoice(footsteps)], 0, FOOTSTEP_VOLUME);
            this.footstepLast = now;
        }
    }

    moveLeft() {
        this.moveRightCooldown = 0;
        if (!this.moveLeftCooldown) {
            this.xAccel = -this.speed;
            this.footStepSFX();
        }
    }

    moveRight() {
        this.moveLeftCooldown = 0;
        if (!this.moveRightCooldown) {
            this.xAccel = this.speed;
            this.footStepSFX();
        }
    }

    moveDown() {
        //this.yAccel = this.speed;
    }

    wallJump(world) {
        this.yAccel = -this.speed * 10;
        let onleftWall = world.data[world.pixelToTileIndex(this.collider.leftFeeler.x, this.collider.leftFeeler.y)]
        onleftWall ? this.moveLeftCooldown = this.limits.moveLeftCooldown : this.moveRightCooldown = this.limits.moveRightCooldown;
        this.xAccel = onleftWall ? this.speed * 5 : -this.speed * 5;
        this.play("jump");
        // audio.playSound("walljump"); // error - noaudio buffer? but the sound loads?
        let particleDef = onleftWall ? particleDefinitions.wallJumpLeft : particleDefinitions.wallJumpRight;
        let emitLocation = onleftWall ? this.collider.leftFeeler : this.collider.rightFeeler;
        emitParticles(emitLocation.x, emitLocation.y, particleDef);
    }

    stop() {
        this.xAccel = 0;
        this.yAccel = 0;
        this.yVel = 0;
        this.xVel = 0;
    }

    drawDigTileHighlight(direction = Direction.DOWN) {

        const directionTiles = {
            [Direction.UP]: this.collider.topFeeler,
            [Direction.DOWN]: this.collider.bottomFeeler,
            [Direction.LEFT]: this.collider.leftFeeler,
            [Direction.RIGHT]: this.collider.rightFeeler
        }
        const highlightDirection = directionTiles[direction];
        //if the collider feelers are on a tile and player is pressing an arrow key, draw a highlight
        let tileIndex = tileMap.pixelToTileIndex(highlightDirection.x, highlightDirection.y);
        let tileValue = tileMap.data[tileIndex];
        if (tileValue > 0) {
            let tileX = tileMap.tileIndexToPixelX(tileIndex);
            let tileY = tileMap.tileIndexToPixelY(tileIndex);
            let tileWidth = tileMap.tileWidth;
            let tileHeight = tileMap.tileHeight;
            canvasContext.fillStyle = "rgba(255,255,255,0.5)";
            canvasContext.fillRect(tileX - view.x, tileY - view.y, tileWidth, tileHeight);
        }
    }

    checkForFallingRocks() {
        let feelers = [this.collider.bottomFeeler, this.collider.leftFeeler, this.collider.rightFeeler, this.collider.topFeeler];
        for (const feeler of feelers) {
            let tileIndex = tileMap.pixelToTileIndex(feeler.x, feeler.y);
            let tileValue = tileMap.data[tileIndex];
            if (tileValue == 5) {
                tileMap.damageTileAt(tileIndex, 25, () => { damageTileWithEffects["TILE_FALLING_ROCK"](tileIndex) });
            }
        }
    }

    getDigPropsForIndex(tileIndex) {
        return {
            spawnX: tileMap.tileIndexToPixelX(tileIndex) + tileMap.tileWidth || 0,
            spawnY: tileMap.tileIndexToPixelY(tileIndex) + tileMap.tileHeight || 0,
            startTileValue: tileMap.data[tileIndex] || 0
        }
    }

    digWithProps(startTileValue, startTileIndex, dmg) {
        let type = TILE_TYPES[startTileValue];
        tileMap.damageTileAt(
            startTileIndex,
            dmg,
            () => { damageTileWithEffects[type](startTileIndex) }
        );
    }

    dig(direction) {
        if (!this.canDig) return;
        if (this.diggerang.active) { this.diggerang.returning = true; return; }
        this.digging = true;

        const { startTileIndex } = this.collider.getTileIndexAndSpawnPos(direction);
        const startTileValue = tileMap.data[startTileIndex] || 0;

        if (startTileValue > 0) this.digWithProps(startTileValue, startTileIndex, damageValues[startTileValue]);
    }

    damageTextFX(damage) {
        this.damageTxt = "-" + Math.round(damage);
        this.damageTxtFrame = 0;
        this.damageTxtFrameMax = 20;
    }

    drawDamageTextFX() {
        if (!this.damageTxt) return;
        if (this.damageTxtFrame++ < this.damageTxtFrameMax) {
            canvasContext.globalAlpha = 1 - (this.damageTxtFrame / this.damageTxtFrameMax);
            let x = Math.floor(this.x - view.x) - this.drawOffset.x + 12;
            let y = Math.floor(this.y - view.y) - this.drawOffset.y - this.damageTxtFrame;
            tinyFont.drawText(this.damageTxt, { x: x, y: y });
            canvasContext.globalAlpha = 1;
        }
    }

    hurt(damage) {
        if (this.hurtCooldown > 0) { return; }
        //TODO: blink player sprite
        if (this.shield > 0) {
            this.shield -= damage;
            this.shieldHit();
        }
        if (this.shield <= 0) {
            this.collider.emit(particleDefinitions.hurt);
            audio.playSound(sounds[randChoice(player_damages)]);
            this.health -= damage;
            if (this.health <= 0) {
                this.health = 0;
                this.die();
            } else {
                this.damageTextFX(damage);
                tileMap.shakeScreen();
            }
        }
        this.hurtCooldown = this.limits.hurtCooldown;
    }

    shieldHit() {
        //audio.playSound(sounds[randChoice(player_shield_hits)]);
        this.showShieldCooldown = this.limits.showShieldCooldown;
        emitParticles(this.x + 8, this.y + 10, particleDefinitions.shieldHit);
    }

    drawShield() {
        if (this.showShieldCooldown-- <= 0) return;
        let shieldRadius = 25;
        let shieldAngle = 0;
        let shieldAngleIncrement = Math.PI * 2 / this.limits.shieldMax;
        for (let i = 0; i < this.shield; i++) {
            let x = Math.floor(this.x + Math.cos(shieldAngle) * shieldRadius) + 8;
            let y = Math.floor(this.y + Math.sin(shieldAngle) * shieldRadius) + 9;
            shieldAngle += shieldAngleIncrement;
            canvasContext.fillStyle = "yellow";
            canvasContext.fillRect(x - view.x, y - view.y, 3, 3);
        }
    }

    die() {
        gameState = GAMESTATE_GAME_OVER;
    }


    checkDig() {
        this.digCooldown--
        if (this.digCooldown <= 0) {
            this.digCooldown = this.limits.digCooldown;

            return true;
        }
        return false;
    }

    checkBounds() {
        if (this.x < 64) {
            this.x = 64;
            this.stop();
        }
        let worldRightBounds = tileMap.widthInTiles * tileMap.tileWidth - 64;
        if (this.x > worldRightBounds) {
            this.x = worldRightBounds;
            this.stop();
        }
    }

    throw() {
        if (this.diggerang.active) { this.diggerang.returning = true; return; }
        if (this.inventory.ore < DIGGERANG_COST) return;

        this.inventory.ore -= DIGGERANG_COST;
        this.hovering = false;

        switch (this.facing) {
            case Direction.RIGHT: {
                this.diggerang.x = this.x;
                this.diggerang.y = this.y;
                this.diggerang.xVel = 6; // Set the initial horizontal velocity
                this.diggerang.yVel = 0; // Set the initial vertical velocity
                this.diggerang.active = true;
                this.diggerang.returning = false;
            }
                break;
            case Direction.LEFT: {
                this.diggerang.x = this.x;
                this.diggerang.y = this.y;
                this.diggerang.xVel = -6; // Set the initial horizontal velocity
                this.diggerang.yVel = 0; // Set the initial vertical velocity
                this.diggerang.active = true;
                this.diggerang.returning = false;
            }
                break;
            case Direction.UP: {
                this.diggerang.x = this.x - 4;
                this.diggerang.y = this.y - 4;
                this.diggerang.xVel = 0; // Set the initial horizontal velocity
                this.diggerang.yVel = -6; // Set the initial vertical velocity
                this.diggerang.active = true;
                this.diggerang.returning = false;
            }
                break;
            case Direction.DOWN: {
                this.diggerang.x = this.x - 4;
                this.diggerang.y = this.y + 8;
                this.diggerang.xVel = 0; // Set the initial horizontal velocity
                this.diggerang.yVel = 6; // Set the initial vertical velocity
                this.diggerang.active = true;
                this.diggerang.returning = false;
            }
        }

    }

    helicopter() {
        this.hovering = true;
        if (this.helicopterCapacity <= 0) { this.hovering = false; return };
        //if (this.inventory.ore <= 0){this.hovering = false; return };

        //this.inventory.ore--;
        this.yVel -= 0.1;
        this.yAccel -= this.speed * this.limits.hoverMultiplier;
        this.helicopterCapacity--;
        emitParticles(this.x + 7, this.y, particleDefinitions.helicopter);
    }

    jump() {
        this.yvel = -this.speed * this.limits.jumpMultiplier;
        this.play("jump");
        audio.playSound(sounds["jump"], 0, 0.5, 2, false)
        this.collider.emit(particleDefinitions.jumpPuff);
    }

    play(animationName) {

        this.currentAnimation = this.animations[animationName];

        if (!this.currentAnimation.loop) {
            this.currentAnimation.reset();
        }
    }

}
