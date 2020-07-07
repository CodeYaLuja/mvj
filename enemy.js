function Enemy(x, y, r, variant, initialDir) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.variant = variant;
  this.exploding = false;
  this.explodeAnim = 10;

  this.xdir = initialDir;

  this.explode = function() {
    this.exploding = true;
  }

  this.shiftDown = function() {
    this.xdir *= -1;
    this.y += this.r;
  }

  this.move = function() {
    this.x = this.x + this.xdir * speed * speedFact;
  }

  this.show = function() {
    let sprite
    let i = Math.floor(frameCount / 20) % 2;

    if (this.exploding)
      this.explodeAnim++

    switch (this.variant) {
      case 1:
        if (i === 0)
          sprite = enemy1_1;
        else
          sprite = enemy1_2;
        if (this.exploding)
          sprite = enemy1_3;
        break;
      case 2:
        if (i === 0)
          sprite = enemy2_1;
        else
          sprite = enemy2_2;
        if (this.exploding)
          sprite = enemy2_3;
        break;
      case 3:
        if (i === 0)
          sprite = enemy3_1;
        else
          sprite = enemy3_2;
        if (this.exploding)
          sprite = enemy3_3;
        break;
    }
    image(sprite, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
  }
}