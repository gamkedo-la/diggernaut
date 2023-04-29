class Particle {
    constructor(x,y, options={}) {

        this.type = TYPE_PARTICLE;
        this.xVelocity = options.xVelocity();
        this.yVelocity = options.yVelocity();
        this.color = options.color();
        this.lifeMax = options.life();
        this.life = options.life();
        this.custom = options.custom || null;
        this.tileSprite = options.tileSprite || null;
        this.gravity = options.gravity() || 0;
        this.collides = options.collides;
        this.x = x;
        this.y = y;
        this.previousX = this.x;
        this.previousY = this.y;
        this.gradientPalette = options.gradientPalette || null;
       
    }

    update() {
        this.previousX = this.x;
        this.previousY = this.y;
        if(!inView(this)){
            this.die();
        }
        this.yVelocity += this.gravity;
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        this.life--
      
        if(!inView(this)){
            this.die();
        }
        if(this.life <= 0){
            this.die();
        }
        if(Math.round(this.xVelocity) == 0 && Math.round(this.yVelocity) == 0){
            this.die();
        }

        if(this.collides){
            if(tileMap.collidesWith(this.x, this.y)){
                
                this.yVelocity = -this.yVelocity;
                this.xVelocity = -this.xVelocity;
                this.x = this.previousX + this.xVelocity;
                this.y = this.previousY + this.yVelocity;

            }
        }
        if(this.gradientPalette){
            //map gradient palette to life
            const lifePercent = this.life / this.lifeMax;
            const colorIndex = Math.max(0, Math.floor(lifePercent * this.gradientPalette.length));
            this.color = this.gradientPalette[colorIndex];
        }
    }
    
    draw() {   
     if(this.tileSprite){
        //tileSprite is a sprite strip of unknown length
        //map life to tileSprite frame index
        const lifePercent = this.life / this.lifeMax;
        const frameIndex = Math.max(0, Math.floor(lifePercent * this.tileSprite.tileCount));
        drawTileSprite(this.tileSprite, frameIndex, this.x-view.x, this.y-view.y);
     }
     else {
        line(this.x-view.x, this.y-view.y, this.previousX-view.x, this.previousY-view.y, this.color);
     }
    }

    die() {
       // console.log('particle died');
        actors.splice(actors.indexOf(this), 1);
    }

}