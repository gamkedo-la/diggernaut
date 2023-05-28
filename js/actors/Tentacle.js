class Tentacle {
  constructor(x,y){
      this.x = x;
      this.y = y;
      this.previousX = this.x;
      this.previousY = this.y;
      this.currentAnimation = "idle";
      this.width = 32;
      this.height = 32;

      this.arm = new Arm(this.x+16, this.y);
      this.arm.addSegment(1);
      this.arm.addSegment(1);
      this.arm.addSegment(1);
      this.arm.addSegment(1);
      this.arm.addSegment(1);
      this.arm.addSegment(1);
      this.arm.addSegment(1);
      this.arm.addSegment(1);

      this.xvel = 0;
      this.yvel = 0;
      this.yAccel = 0;
      this.xAccel = 0;
      this.state = "idle";
      this.viewBlocked = false;
      this.limits = {
          
      }
      this.targetArmLength = 1;
      this.targetOffset = {
          x: 0,
          y: -100
      }
      this.drawOffset = {
          x: 0,
          y: 0
      }
      this.collider = new Collider(this.x, this.y, this.width, this.height, {left: 1, right: 1, top: 1, bottom: 1}, "tentacle")
  }
  states = {
      asleep: {
        enter: function(){
            this.targetArmLength = 1;
        },

        draw: function(){

        }
      },
      idle: {
            enter: function(){
            },
            draw: function(){}
      },
      seekPlayer: {
            enter: function(){
                this.targetArmLength = 10;
            },
            draw: function(){
                this.drawEye();
            }
      },
      attack: {
        enter: function(){
            this.targetArmLength = 15;
        },
        draw : function(){
            this.drawEye();
        }
      },
  }

  draw(){
        if(!inView(this)) return;

        tinyFont.drawText(this.state, {x: this.x - view.x, y: this.y - view.y - 10}, 0, 1);
        //this.arm.draw();
        this.drawArm();
        
        canvasContext.save();
        canvasContext.fillStyle = "#ff00ff";
        canvasContext.fillRect(this.x - view.x + this.drawOffset.x, this.y - view.y + this.drawOffset.y, this.width, this.height);
        canvasContext.restore();

        this.states[this.state].draw.call(this);

      this.collider.draw();
      
  }
  update(){
      if(!inView(this)) return;
        this.arm.target.x = player.x + Math.sin(ticker/10) * 10;
        this.arm.target.y = player.y + Math.cos(ticker/10) * 10;
        //this.arm.target.y = lerp(this.y, player.y, 0.1);      
        this.arm.update();
        this.collider.update(this.x, this.y);
        this.previousX = this.x;
        this.previousY = this.y;

      this.states[this.state].enter.call(this);


      for(let i = 0; i < this.arm.segments.length; i++){
            let segment = this.arm.segments[i];
            segment.length = lerp(segment.length, this.targetArmLength, 0.1);
      }

      
      this.viewBlocked = tileMap.tileRaycast(this.x, this.y, player.x, player.y);
      if(!this.viewBlocked){
          if(this.distanceToPlayer() < 150){
              this.state = "seekPlayer";
          }
          if(this.distanceToPlayer() < 120) {
              this.state = "attack";
          }
      }
      
      else {
          this.state = "asleep";
      }

      if(rectCollision( this.collider, player.diggerang.collider)){
          this.kill();
      }
      if(rectCollision( this.collider, player.collider)){
      this.collideWithPlayer();
      }
      
      

      this.x += this.xvel;
      this.y += this.yvel;
  }

  applyForces(){
      
      this.xvel += this.xAccel;
      this.yvel += this.yAccel;
      if (this.xvel > this.limits.maxXVel) { this.xvel = this.limits.maxXVel; }
      if (this.xvel < this.limits.minXVel) { this.xvel = this.limits.minXVel; }
      if (this.yvel > this.limits.maxYVel) { this.yvel = this.limits.maxYVel; }
      if (this.yvel < this.limits.minYVel) { this.yvel = this.limits.minYVel; }
      if (this.xAccel > this.limits.maxXAccel) { this.xAccel = this.limits.maxXAccel; }
      if (this.xAccel < this.limits.minXAccel) { this.xAccel = this.limits.minXAccel; }
  }

  avoidWalls(){
      let left = this.collider.leftFeeler;
      let right = this.collider.rightFeeler;
      let top = this.collider.topFeeler;
      let bottom = this.collider.bottomFeeler;
      if(tileMap.collidesWith(left.x, left.y)){
          this.xAccel += 0.01;
          this.xvel *= .9;
      }
      if(tileMap.collidesWith(right.x, right.y)){
          this.xAccel -= 0.01;
          this.xvel *= .9;

      }
      // if(tileMap.collidesWith(top.x, top.y)){
      //     this.yAccel += 0.01;
      //     this.yvel *= .9;
      // }
      // if(tileMap.collidesWith(bottom.x, bottom.y)){
      //     this.yAccel -= 0.01;
      //     this.yvel *= .9;
      // }
  }

  handleWalls(){
      if(this.collider.tileCollisionCheck(0)){
          this.x = this.previousX; 
          this.y = this.previousY;
          this.collider.update(this.x, this.y);
          this.xAccel = -this.xAccel;
          this.yAccel = -this.yAccel;
          this.yvel = -this.yvel;
          this.xvel = -this.xvel;

      }
  }

  distanceToPlayer(){
      return Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2));
  }

  kill(){
      emitParticles(this.x, this.y, particleDefinitions.fallSparks)
      emitParticles(this.x, this.y, particleDefinitions.hurt)
      audio.playSound(sounds["player_damage_big_1"], 0, 0.5, 0.6, false);
      let i = 5;
      while(i--){
          actors.push(new Health(this.x, this.y));
      }
      actors.splice(actors.indexOf(this), 1);
  }

  collideWithPlayer(){
      let repelX = normalize(this.x - player.x, -player.width/2, player.width/2);
      let repelY = normalize(this.y - player.y, -player.height/2, player.height/2);
      
      if(player.y >= this.y ) {
          player.hurt(1)
          player.stop();
          player.xAccel = -repelX * 2;
          player.yAccel = -repelY * 2;
      
      }
      else{ 
          //this.kill()
          player.hurt(1)
          player.yvel = 0;
          player.yAccel = player.limits.minYAccel * 2;
      }
      
  }
  drawEye(){
    //draw a white circle for the tentacle block eye
    canvasContext.save();
    canvasContext.fillStyle = "#ffffff";
    canvasContext.beginPath();
    canvasContext.arc(this.x - view.x + 16, this.y - view.y + 16, 10, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.restore();

    //draw a black circle for the tentacle block pupil, which follows the player
    canvasContext.save();
    canvasContext.fillStyle = "#000000";
    canvasContext.beginPath();
    canvasContext.arc(this.x - view.x + 16 + (player.x - this.x) / 20, this.y - view.y + 16 + (player.y - this.y) / 20, 5, 0, Math.PI * 2);
    canvasContext.fill();
    canvasContext.restore();
  }

  drawArm(){
    //draw a purple circle at each segment of the tentacle arm
    for (let i = 0; i < this.arm.segments.length; i++) {
        let segment = this.arm.segments[i];
        canvasContext.save();
        canvasContext.fillStyle = "#ff00ff";
        canvasContext.beginPath();
        canvasContext.arc(segment.x - view.x, segment.y - view.y, 5, 0, Math.PI * 2);
        canvasContext.fill();
        canvasContext.restore();
        }   
  }

  play(animationName){
 
      this.currentAnimation = this.spritesheet.animations[animationName];

 
      if (!this.currentAnimation.loop){
          this.currentAnimation.reset();
      }
  }

}