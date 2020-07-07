function Bullet(x, y, speed) {
  this.x = x;
  this.y = y;
  this.r = R / 4;
  this.speed = speed;
  this.toDelete = false;

  this.show = function() {
    noStroke();
    fill(150, 0, 255);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  this.disappear = function() {
    this.toDelete = true;
  }

  this.hits = function(enemy) {
    if (enemy.exploding)
      return false;

    var d = dist(this.x, this.y, enemy.x, enemy.y);
    return (d < this.r + enemy.r);
  }

  this.move = function() {
    this.y = this.y - this.speed * speedFact;
    if (this.y < 0)
      this.toDelete = true;
  }
}

function Bomb(x, y, speed) {
  this.x = x;
  this.y = y;
  this.r = R / 4;
  this.speed = speed;
  this.toDelete = false;

  this.show = function() {
    noStroke();
    fill(150, 255, 0);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  this.disappear = function() {
    this.toDelete = true;
  }

  this.hits = function(player) {
    var d = dist(this.x, this.y, player.x, player.y);
    return (d < this.r + player.r);
  }

  this.move = function() {
    this.y = this.y + speed * speedFact;
    if (this.y > height)
      this.toDelete = false;
}
  }