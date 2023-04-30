class Collectible {
    constructor(x, y, category="", options={}){
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
        this.collider = new Collider(this.x + this.offset.x, this.y + this.offset.y, 24, 24, {left: 0, right: 0, top: 0, bottom: 0}, "collectible");
    }

    draw(){
        if(!inView(this)) return;
        drawTileSprite(this.tileSet, this.tile, this.x - view.x, this.y - view.y);
        this.collider.draw();
       
    }

    update(){
        if(!inView(this)){ return; }
        this.previousX = this.x;
        this.previousY = this.y;
        //this.collider.update(this.x, this.y);
        //this.x += this.xvel;
        //this.y += this.yvel;
        
        //this.xvel *= this.friction;
        //this.yvel *= this.friction; 
        //this.yvel += this.gravity;

        //emitParticles(this.x, this.y, particleDefinitions.oreSparks);

        if(rectCollision(this.collider, player.collider)){
            let thisItem = collectibles[this.category].find(item => item.name == this.name);
            thisItem.owned = true;
            emitParticles(this.x+16, this.y+16, particleDefinitions.jumpPuff);
            emitParticles(this.x+16, this.y+16, particleDefinitions.boom17px);
            this.destroy();
        }
    }

    destroy(){
        let index = actors.indexOf(this);
        actors.splice(index, 1);
    }
}