function Player(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.speed = 5;
  this.xdir = 0;

  this.show = function(danger) {
    switch (danger) {
      case 0:
        image(player1, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
        break;
      case 1:
        image(player2, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
        break;
      case 2:
        image(player3, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
        break;
    }
  }

  this.setDir = function(dir) {
    this.xdir = dir;
  }

  this.move = function(dir) {
    this.x = Math.max(this.r, Math.min(width - this.r, this.x + this.xdir * this.speed * speedFact));
  }
}