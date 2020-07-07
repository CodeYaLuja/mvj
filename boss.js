function Boss(x, y, speed) {
  this.x = x;
  this.y = y;
  this.r = R*2;
  this.speed = speed;
  this.exploding = false;
  this.explodeAnim = 10;

  this.explode = function() {
    this.exploding = true;
  }

  this.move = function() {
    this.x = this.x + this.speed * speedFact;
  }

  this.show = function() {
    let sprite
    let i = Math.floor(frameCount / 20) % 2;

    if (this.exploding)
      this.explodeAnim++;

    if (i === 0)
      sprite = boss1;
    else
      sprite = boss2;
    if (this.exploding)
      sprite = boss3;

    image(sprite, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
  }
}