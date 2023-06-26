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
        this.gravity = 0.25;
        
        this.hoverSound = audio.playSound(sounds["diggerang_whoosh"], 0, 0, 1.0, true);
        this.drawOffset = {
            x: 7,
            y: 8
        }

        // Start facing left with idleLeft animation
        this.facing = Direction.LEFT;
        this.inventory = {
            ore: 10,
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
            hurtCooldown: 50,
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
        this.previous = {
            x: 0, y: 0,
            xVel: 0, yVel: 0,
            onFloor: false
        }
        this.collider = new Collider(this.x, this.y, this.width, this.height,
            { left: 2, right: 2, top: 10, bottom: 6 }, 'player')
        this.digCollider = new Collider(this.x, this.y, this.width, this.height,
            { left: 2, right: 2, top: 10, bottom: 6 }, 'player_shovel');

        this.upgrades = {
            diggerang: false,
            diggerangDrill: false,
            fastDig: false,
            fastDigLevel: 0,
            fastDigLevels: [
                { feelerDelta: { left: 12, right: 12, top: 20, bottom: 18 }, damageBonus: 100 },   
                { feelerDelta: { left: 18, right: 18, top: 32, bottom: 24 }, damageBonus: 300 },
                { feelerDelta: { left: 24, right: 24, top: 32, bottom: 24 }, damageBonus: 700 },
                { feelerDelta: { left: 38, right: 38, top: 38, bottom: 31 }, damageBonus: 1000 },
            ]
        };
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
        this.hurtCooldown = 0;
        this.health = 40;
        this.moveLeftCooldown = 0;
        this.moveRightCooldown = 0;
        this.coyoteCooldown = 0;
        this.facing = Direction.LEFT;
        this.score = 0;
        // this.upgrades = {
        //     diggerang: false,
        // };
        this.inventory = {
            ore: 5,
            blueOre: 5,
        }
        blueUpgrades = createBlueUpgrades();
        goldUpgrades = createGoldUpgrades();
    }
    draw() {
        let blink = this.hurtCooldown > 0 && ticker % 6 > 2;
        if(!blink) {
            this.currentAnimation.render({
                x: Math.floor(this.x - view.x) - this.drawOffset.x,
                y: Math.floor(this.y - view.y) - this.drawOffset.y,
                width: 32,
                height: 32
            })
        } 

        if (this.hovering) {
            this.diggerang.currentAnimation.render({
                x: Math.floor(this.x - view.x),
                y: Math.floor(this.y - view.y) - 22,
                width: 32,
                height: 32
            })
        }else if (this.digging) {
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
                } else if (this.facing == Direction.LEFT) {
                    this.diggerang.verticalSpin.update();
                    this.diggerang.verticalSpin.render({
                        x: Math.floor(this.x - view.x - 14),
                        y: Math.floor(this.y - view.y - 4),
                        width: 32,
                        height: 32
                    })
                } else if (this.facing == Direction.RIGHT) {
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
        if (this.hurtCooldown > 0) { this.drawHealth(); }



        if (Key.isDown(Key.LEFT) || Joy.left) { this.drawDigTileHighlight(Direction.LEFT) };
        if (Key.isDown(Key.RIGHT) || Joy.right) { this.drawDigTileHighlight(Direction.RIGHT) };
        if (Key.isDown(Key.UP) || Joy.up) { this.drawDigTileHighlight(Direction.UP) };
        if (Key.isDown(Key.DOWN) || Joy.down) { this.drawDigTileHighlight(Direction.DOWN) };
    }

    update() {
        this.previous.x = this.x;
        this.previous.y = this.y;
        this.previous.xVel = this.xVel;
        this.previous.yVel = this.yVel;
        this.previous.onFloor = this.isOnFloor();
        this.applyForces();
        this.handleCollisions();
        this.checkForFallingRocks();
        this.checkBounds();
        this.hurtCooldown--;
        if(this.hurtCooldown < 0)  { this.hurtCooldown = 0; }
        this.showShieldCooldown--;
        this.depth = Math.round(this.y / 8);
        this.shield = Math.min(this.shield, this.limits.shieldMax);
        this.canDig = this.checkDig() && (!this.hovering || Key.isDown(Key.UP) || Joy.up);
        this.canJump = ( this.isOnFloor() || this.coyoteCooldown > 0) && !this.isOnCeiling();
        this.canHelicopter = !this.diggerang.active && !this.isOnCeiling();
        if (this.canJump) { this.helicopterCapacity = this.limits.helicopterCapacity; }
        if (this.moveLeftCooldown > 0) { this.moveLeftCooldown--; }
        if (this.moveRightCooldown > 0) { this.moveRightCooldown--; }
        this.xAccel = 0;
        this.yAccel = 0;
        if (Math.abs(this.xvel) < 0.05) { this.xvel = 0; }
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
        if (Key.isDown(Key.z) || Joy.x) {
            this.digging = true;
            if(this.diggerang.active) {
                UIMsg("Can't dig while diggerang is active!");
            }
        }

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
        }

        if (Key.justReleased(Key.z) || Joy.xReleased) { this.digCooldown = 0; }
        if (Key.justReleased(Key.p) || Joy.startReleased) { signal.dispatch('pause'); }
        if (Key.justReleased(Key.i) || Joy.yReleased) { signal.dispatch('inventory'); }
        if (Key.justReleased(Key.x) || Joy.bReleased || Joy.rightTriggerReleased) { this.throw() }
    }

    shieldBoost(amount) {
        this.shield += amount;
        if (this.shield != this.limits.shieldMax) {
            this.showShieldCooldown = this.limits.showShieldCooldown;
        }
    }

    healthBoost(amount) {
        this.health += amount;
        if(this.health != this.limits.healthMax) {
            this.hurtCooldown = 20;
        }
       
    }

    updateCollider(x, y) {
        this.x = x;
        this.y = y;
        this.collider.update(x, y);
        this.digCollider.update(x, y);
    }

    applyForces() {
        this.previousX = this.x;
        this.previousY = this.y;
        let yAccelDelta = 1;
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

    isOnCeiling() {
        let rc = tileMap.data[tileMap.pixelToTileIndex(this.collider.topFeeler.x, this.collider.topFeeler.y)];
        return (rc > 0);
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
        
        if(this.upgrades.fastDig){
            const feelerDelta = this.upgrades.fastDigLevels[this.upgrades.fastDigLevel].feelerDelta;
            
            this.digCollider.feelerDelta = feelerDelta;
        }
        const { startTileIndex } = this.digCollider.getTileIndexAndSpawnPos(direction);
        const startTileValue = tileMap.data[startTileIndex] || 0;
        audio.playSound(sounds[randChoice(dig_sounds)], 0, 0.2, 1, false);
        if (startTileValue > 0){
            if(this.upgrades.fastDig){
                const damageBonus = this.upgrades.fastDigLevels[this.upgrades.fastDigLevel].damageBonus;
                this.digWithProps(startTileValue, startTileIndex, 
                    damageValues[startTileValue] + damageBonus);
            }
            else {
                this.digWithProps(startTileValue, startTileIndex, damageValues[startTileValue]);
            }
        } 
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
        if (this.shieldHitCooldown > 0) { return; }
        
       
        if (this.shield <= 0) {
            this.collider.emit(particleDefinitions.hurt);
            audio.playSound(sounds[randChoice(player_damages)], 0, 0.3, 1.5, false);
            this.health -= damage;
            if (this.health <= 0) {
                this.health = 0;
                this.die();
            } else {
                this.damageTextFX(damage);
                this.hurtCooldown = this.limits.hurtCooldown;
                //tileMap.shakeScreen();
            }
        }else {
            this.showShieldCooldown = this.limits.showShieldCooldown;
            this.shieldHit();
            this.shield--;
        }
        
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
    //if shield is zero, we'll draw health the same way
    drawHealth() {
        let healthRadius = 25;
        let healthAngle = 0;
        let healthAngleIncrement = Math.PI * 2 / this.limits.healthMax;
        for (let i = 0; i < this.health; i++) {
            let x = Math.floor(this.x + Math.cos(healthAngle) * healthRadius) + 8;
            let y = Math.floor(this.y + Math.sin(healthAngle) * healthRadius) + 9;
            healthAngle += healthAngleIncrement;
            canvasContext.fillStyle = "red";
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
        this.yVel -= 0.1;
        this.yAccel -= this.speed * this.limits.hoverMultiplier;
        this.helicopterCapacity--;
        emitParticles(this.x + 7, this.y, particleDefinitions.helicopter);
    }

    jump() {
        this.yvel = -this.speed * this.limits.jumpMultiplier;
        this.play("jump");
        if(this.coyoteCooldown == this.limits.coyoteCooldown){
            audio.playSound(sounds["jump"], 0, 0.3, 3, false)
        }
        this.collider.emit(particleDefinitions.jumpPuff);
    }

    play(animationName) {
        this.currentAnimation = this.animations[animationName];
        if (!this.currentAnimation.loop) {
            this.currentAnimation.reset();
        }
    }

}
