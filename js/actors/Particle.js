class Particle {
    constructor(x,y, options={}) {

        this.type = TYPE_PARTICLE;
        this.xVelocity = options.xVelocity();
        this.yVelocity = options.yVelocity();
        this.color = options.color();
        this.lifeMax = options.life();
        this.life = options.life();
        this.custom = options.custom || null;
        this.gravity = options.gravity() || 0;
        this.x = x;
        this.y = y;
        this.prevX = this.x;
        this.prevY = this.y;
        this.gradientPalette = options.gradientPalette || null;
       
    }

    update() {
        this.prevX = this.x;
        this.prevY = this.y;
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
        if(this.gradientPalette){
            //map gradient palette to life
            const lifePercent = this.life / this.lifeMax;
            const colorIndex = Math.max(0, Math.floor(lifePercent * this.gradientPalette.length));
            this.color = this.gradientPalette[colorIndex];
        }
    }
    
    draw() {
     line(this.x-view.x, this.y-view.y, this.prevX-view.x, this.prevY-view.y, this.color);
    }

    die() {
       // console.log('particle died');
        actors.splice(actors.indexOf(this), 1);
    }

}