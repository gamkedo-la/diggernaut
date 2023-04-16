class Diggerang {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.xvel = 0;
      this.yvel = 0;
      this.active = false;
      this.returning = false;
    }
  
    update(player) {
        if (!this.active) return;
      
        this.x += this.velocityX;
        this.y += this.velocityY;
      
        const distanceToPlayer = Math.sqrt(
          (this.x - player.x) ** 2 + (this.y - player.y) ** 2
        );
      
        if (this.returning && distanceToPlayer < 20) {
          this.active = false;
          this.returning = false;
          return;
        }
      
        if (!this.returning && distanceToPlayer > 300) {
          this.returning = true;
        }
      
        if (this.returning) {
          const angleToPlayer = Math.atan2(player.y - this.y, player.x - this.x);
          this.velocityX = 4 * Math.cos(angleToPlayer);
          this.velocityY = 4 * Math.sin(angleToPlayer);
        } else {
          this.velocityY += 0.2; // Apply gravity
        }
      }
      
  
    draw() {
        if (!this.active) return;
        
        //drawn as a spinning line, with it's position as the center
        line(
            this.x - view.x - Math.cos(ticker / 3) * 10,
            this.y - view.y - Math.sin(ticker / 3) * 10,
            this.x - view.x + Math.cos(ticker / 3) * 10,
            this.y - view.y + Math.sin(ticker / 3) * 10,
            "white"
        );
    }
  }
  