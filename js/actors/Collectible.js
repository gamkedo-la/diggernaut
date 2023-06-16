class Collectible {
    constructor(x, y, category = "", options = {}) {
        this.x = x;
        this.y = y;
        this.category = category;
        this.name = options.name;
        this.tileSet = options.sprite.sheet;
        this.tile = options.sprite.tile
        this.speed = 9;
        this.previouxX = this.x;
        this.previousY = this.y;
        this.offset = {
            x: 4,
            y: 4
        }
        this.collider = new Collider(this.x + this.offset.x, this.y + this.offset.y, 24, 24, { left: 0, right: 0, top: 0, bottom: 0 }, "collectible");
    }

    draw() {
        if (!inView(this)) return;
        drawTileSprite(this.tileSet, this.tile, this.x - view.x, this.y - view.y+Math.floor(Math.sin(ticker/20)*5));
        this.collider.draw();

    }

    update() {
        if (!inView(this)) { return; }
        this.previousX = this.x;
        this.previousY = this.y;
        if (rectCollision(this.collider, player.collider)) {
            let thisItem = collectibles[this.category].find(item => item.name == this.name);
            thisItem.owned = true;
            emitParticles(this.x + 16, this.y + 16, particleDefinitions.jumpPuff);
            emitParticles(this.x + 16, this.y + 16, particleDefinitions.boom17px);

            // TODO: play different sounds depending on treasure type.
            // currently chooses between two bitcrushed glass shattering sounds
            uiActors.push(new AwardMessage(this.x, this.y, thisItem.name, bigFontGreen, 1, 200, particleDefinitions.awardSparks));
            audio.playSound(sounds[randChoice(collectibleSounds)], 0, COLLECTIBLE_SOUND_VOLUME);
            this.destroy();
        }
    }

    destroy() {
        let index = actors.indexOf(this);
        actors.splice(index, 1);
    }
}