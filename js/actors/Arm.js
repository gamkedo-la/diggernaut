class Arm {
    constructor(x, y, lengths, angles) {
      this.segments = lengths.map((length, index) => {
        return new Segment(x, y, length, angles[index]);
      });
  
      for (let i = 1; i < this.segments.length; i++) {
        this.segments[i].attachTo(this.segments[i - 1]);
      }
    }
  
    ikSolve(targetX, targetY) {
      let endEffector = this.segments[this.segments.length - 1];
  
      // Last segment aims at target
      endEffector.pointAt(targetX, targetY);
  
      // Backward pass
      for (let i = this.segments.length - 2; i >= 0; i--) {
        this.segments[i].pointAt(this.segments[i + 1].x, this.segments[i + 1].y);
        this.segments[i + 1].attachTo(this.segments[i]);
      }
  
      // Forward pass
      for (let i = 1; i < this.segments.length; i++) {
        this.segments[i].attachTo(this.segments[i - 1]);
      }
    }
  
    draw(context) {
      this.segments.forEach(segment => {
        segment.draw(context);
      });
    }
  
    drawBezier(context, numCircles = 10, circleRadius = 5) {
      context.fillStyle = 'red';
      const n = this.segments.length;
      for (let i = 0; i < n - 1; i++) {
        const segment1 = this.segments[i];
        const segment2 = this.segments[i + 1];
  
        const controlPoint1 = { x: segment1.getEndX(), y: segment1.getEndY() };
        const controlPoint2 = { x: segment2.x, y: segment2.y };
  
        for (let j = 0; j <= numCircles; j++) {
          const t = j / numCircles;
          const point = cubicBezierPoint(t, segment1, controlPoint1, controlPoint2, segment2);
          context.beginPath();
          context.arc(point.x, point.y, circleRadius, 0, 2 * Math.PI);
          context.fill();
        }
      }
    }
  }
  