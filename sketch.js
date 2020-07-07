var player;
var enemies = [];
var bullets = [];
var bombs = [];
var bosses = [];

var enemyCols = 9;
var enemyRows = 5;
var R = 30;

var bombProb = 0.01;
var bossProb = 0.001;
var initialSpeed = 1;
var speed;
var speedInc;
var speedFact = 1; // A speed factor of 1 relates to a display that is 1000 pixels wide
var movementMode = 0;
var spriteMode = 0;
var fireCooldown = 25;
var shootTimer = fireCooldown;
var autoFire = true;
var selected = 0;

var gameState = 0;
var score = 0;

function setup() {
  let s = calcCanvasSize();
  createCanvas(s.x, s.y);
  speedFact = s.x / 1000;

  textFont(myFont);
  textAlign(LEFT, TOP);
  textSize(s.y / 40);
}

function draw() {
  switch (gameState) {
    case 0: // welcome
      welcome();
      break;
    case 1: // selection
      selection();
      break;
    case 2: // active
      animate();
      break;
    case 3: // game over
      gameOver();
      break;
  }
}

function animate() {
  background(51);
  push();
  fill('#ED225D');
  text('Score: ' + score, R, R);
  //text('frame rate: '+Math.round(frameRate()).toString(), R, 2*R);
  pop();

  // Calculate danger level and draw & move player
  let danger = 0;
  if (enemies[enemies.length - 1].y > height / 2)
    danger = 1;
  if (enemies[enemies.length - 1].y > 2 * height / 3)
    danger = 2;
  player.show(danger);
  player.move();

  // Decrement shoot cooldown timer
  shootTimer = Math.max(0, shootTimer - 1);

  // Process all bullets
  if (autoFire && bullets.length === 0)
    fire();
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].show();
    bullets[i].move();
    for (var j = 0; j < enemies.length; j++) {
      if (bullets[i].hits(enemies[j])) {
        enemies[j].explode();
        bullets[i].disappear();
        score++;
        speed *= speedInc;
        snd_enemydead.play();
      }
    }
    for (var j = 0; j < bosses.length; j++) {
      if (bullets[i].hits(bosses[j])) {
        bosses[j].explode();
        bullets[i].disappear();
        score += 10;
        snd_bossdead.play();
      }
    }
  }

  // Process all bombs
  if (random() < bombProb && enemies.length > 0) {
    let attacker = Math.round(random(enemies.length));
    if (enemies[attacker]) {
      let bomb = new Bomb(enemies[attacker].x, enemies[attacker].y, 5);
      bombs.push(bomb);
      snd_bomb.play();
    }
  }
  for (var i = 0; i < bombs.length; i++) {
    bombs[i].show();
    bombs[i].move();
    if (bombs[i].hits(player)) {
      bombs[i].disappear();
      gameState = 3;
      snd_playerdead.play();
    }
    if (bombs[i].y > height)
      bombs[i].disappear();
  }

  // Remove deleted bullets
  for (var i = bullets.length - 1; i >= 0; i--) {
    if (bullets[i].toDelete) {
      bullets.splice(i, 1);
    }
  }

  // Remove deleted bombs
  for (var i = bombs.length - 1; i >= 0; i--) {
    if (bombs[i].toDelete) {
      bombs.splice(i, 1);
    }
  }

  // Remove exploded enemies
  for (var i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].explodeAnim > 30) {
      enemies.splice(i, 1);
    }
  }

  // Remove exploded bosses
  for (var i = bosses.length - 1; i >= 0; i--) {
    if (bosses[i].explodeAnim > 30) {
      bosses.splice(i, 1);
    }
  }

  // Create new fleet if all enemies are dead
  if (enemies.length === 0) {
    snd_victory.play();
    initialSpeed *= 1.3;
    movementMode = 1 - movementMode;
    spriteMode = (spriteMode + 1) % 4;
    createFleet(enemyCols, enemyRows, initialSpeed, movementMode, spriteMode);
  }

  // Process all enemies
  let edge = false;
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].show();
    enemies[i].move();
    if (enemies[i].x + R > width || enemies[i].x - R < 0) {
      edge = true;
    }
  }

  if (edge) {
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].shiftDown();
      if (enemies[i].y > height - 3 * R)
        gameState = 3; // Game Over
    }
  }

  // Process all bosses
  if (random() < bossProb) {
    let boss = new Boss(0, R * 2, speed * 1.1);
    bosses.push(boss);
    snd_boss.play();
  }
  for (var i = 0; i < bosses.length; i++) {
    bosses[i].show();
    bosses[i].move();
    if (bosses[i].x + R > width) {
      bosses[i].explodeAnim = 100;
    }
  }
}

function welcome() {
  background(51);
  image(mvj, width * 0.1, height * 0.1, width * 0.8, height * 0.8);
  push();
  textAlign(CENTER, CENTER);
  let textH = height / 20;
  textSize(textH);
  fill('#ED225D');
  //text(width.toString() + ',' + height.toString(), width / 2, textH);
  //text('Speed Factor: '+speedFact.toString(), width / 2, 2*textH);
  text('Press Any Key', width / 2, height - 3 * textH);
  text('Or Tap Screen', width / 2, height - 2 * textH);
  pop();
}

function selection() {
  background(51);
  push();
  textAlign(CENTER, CENTER);
  textSize(height / 20);
  fill('#ED225D');
  text('Select Your Player', width / 2, height * 0.3);
  pop();

  let imgSize = width / 9;
  if (selected === 0)
    image(f1unit1_2, 1 * imgSize, height / 2 - imgSize / 2, imgSize, imgSize);
  else
    image(f1unit1_1, 1 * imgSize, height / 2 - imgSize / 2, imgSize, imgSize);

  if (selected === 1)
    image(f1unit2_2, 2 * imgSize, height / 2 - imgSize / 2, imgSize, imgSize);
  else
    image(f1unit2_1, 2 * imgSize, height / 2 - imgSize / 2, imgSize, imgSize);

  if (selected === 2)
    image(f1unit3_2, 3 * imgSize, height / 2 - imgSize / 2, imgSize, imgSize);
  else
    image(f1unit3_1, 3 * imgSize, height / 2 - imgSize / 2, imgSize, imgSize);

  if (selected === 3)
    image(f2unit1_2, 5 * imgSize, height / 2 - imgSize / 2, imgSize, imgSize);
  else
    image(f2unit1_1, 5 * imgSize, height / 2 - imgSize / 2, imgSize, imgSize);

  if (selected === 4)
    image(f2unit2_2, 6 * imgSize, height / 2 - imgSize / 2, imgSize, imgSize);
  else
    image(f2unit2_1, 6 * imgSize, height / 2 - imgSize / 2, imgSize, imgSize);

  if (selected === 5)
    image(f2unit3_2, 7 * imgSize, height / 2 - imgSize / 2, imgSize, imgSize);
  else
    image(f2unit3_1, 7 * imgSize, height / 2 - imgSize / 2, imgSize, imgSize);

  push();
  noStroke();
  fill(255);
  let pos = selected + 1;
  if (pos > 3)
    pos++;
  rect(pos * imgSize, height / 2 + imgSize / 2 + 10, imgSize, 10);
  pop();
}

function gameOver() {
  background(51);
  push();
  textAlign(CENTER, CENTER);
  let textH = height / 20;
  textSize(textH);
  fill('#ED225D');
  text('GAME OVER', width / 2, height / 2 - textH);
  text('Your Score: ' + score, width / 2, height / 2 + textH);
  text('Press Enter', width / 2, height - 3 * textH);
  text('Or Tap Here', width / 2, height - 2 * textH);
  pop();
}

function preload() {
  myFont = loadFont('assets/ArcadeNormal-ZDZ.ttf');
  mvj = loadImage('assets/mvj.jpg');

  f1boss1 = loadImage('sprites/faction1/boss1.png');
  f1boss2 = loadImage('sprites/faction1/boss2.png');
  f1boss3 = loadImage('sprites/faction1/boss3.png');

  f1unit1_1 = loadImage('sprites/faction1/unit1_1.png');
  f1unit1_2 = loadImage('sprites/faction1/unit1_2.png');
  f1unit1_3 = loadImage('sprites/faction1/unit1_3.png');

  f1unit2_1 = loadImage('sprites/faction1/unit2_1.png');
  f1unit2_2 = loadImage('sprites/faction1/unit2_2.png');
  f1unit2_3 = loadImage('sprites/faction1/unit2_3.png');

  f1unit3_1 = loadImage('sprites/faction1/unit3_1.png');
  f1unit3_2 = loadImage('sprites/faction1/unit3_2.png');
  f1unit3_3 = loadImage('sprites/faction1/unit3_3.png');

  f2boss1 = loadImage('sprites/faction2/boss1.png');
  f2boss2 = loadImage('sprites/faction2/boss2.png');
  f2boss3 = loadImage('sprites/faction2/boss3.png');

  f2unit1_1 = loadImage('sprites/faction2/unit1_1.png');
  f2unit1_2 = loadImage('sprites/faction2/unit1_2.png');
  f2unit1_3 = loadImage('sprites/faction2/unit1_3.png');

  f2unit2_1 = loadImage('sprites/faction2/unit2_1.png');
  f2unit2_2 = loadImage('sprites/faction2/unit2_2.png');
  f2unit2_3 = loadImage('sprites/faction2/unit2_3.png');

  f2unit3_1 = loadImage('sprites/faction2/unit3_1.png');
  f2unit3_2 = loadImage('sprites/faction2/unit3_2.png');
  f2unit3_3 = loadImage('sprites/faction2/unit3_3.png');

  snd_bomb = loadSound('assets/audio/bomb.mp3');
  snd_boss = loadSound('assets/audio/boss.mp3');
  snd_bossdead = loadSound('assets/audio/bossdies.mp3');
  snd_bullet = loadSound('assets/audio/bullet.mp3');
  snd_enemydead = loadSound('assets/audio/enemydies.mp3');
  snd_playerdead = loadSound('assets/audio/playerdies.mp3');
  snd_start = loadSound('assets/audio/starting.mp3');
  snd_victory = loadSound('assets/audio/victory.mp3');

  player1 = f1unit1_1;
  player2 = f1unit1_2;
  player3 = f1unit1_3;
  enemy1_1 = f2unit1_1;
  enemy1_2 = f2unit1_2;
  enemy1_3 = f2unit1_3;
  enemy2_1 = f2unit2_1;
  enemy2_2 = f2unit2_2;
  enemy2_3 = f2unit2_3;
  enemy3_1 = f2unit3_1;
  enemy3_2 = f2unit3_2;
  enemy3_3 = f2unit3_3;
  boss1 = f2boss1;
  boss2 = f2boss2;
  boss3 = f2boss3;
}

function windowResized() {
  let s = calcCanvasSize();
  resizeCanvas(s.x, s.y);
  speedFact = s.x / 1000;
}

function calcCanvasSize() {
  let w = windowWidth;
  let h = w / 3 * 2;

  if (h > windowHeight) {
    h = windowHeight;
    w = h * 3 / 2;
  }

  return createVector(w, h);
}

function keyReleased() {
  if (gameState === 2 && key != ' ') {
    player.setDir(0);
  }
}


function keyPressed() {
  switch (gameState) {
    case 0: // welcome
      initialSpeed = 1;
      movementMode = 0;
      spriteMode = 0;
      shootTimer = fireCooldown;
      score = 0;
      bullets = [];
      bombs = [];
      createFleet(enemyCols, enemyRows, initialSpeed, movementMode, spriteMode);
      player = new Player(width / 2, height - R * 2, R * 2);
      gameState++;
      break;
    case 1: // selection
      if (keyCode === RIGHT_ARROW)
        selected = (selected + 1) % 6;
      else if (keyCode === LEFT_ARROW)
        selected = (selected + 5) % 6;
      else if (key === ' ') {
        selectPlayer(selected);
        snd_start.play();
      }
      break;
    case 2: // active
      if (key === ' ' && shootTimer === 0) {
        fire();
      }
      if (keyCode === RIGHT_ARROW)
        player.setDir(1);
      else if (keyCode === LEFT_ARROW)
        player.setDir(-1);
      break;
    case 3: // game over
      if (keyCode === ENTER)
        gameState = 0;
      break;
  }
}

function touchStarted() {
  switch (gameState) {
    case 0: // welcome
      break;
    case 1: // selection
      let imgSize = width / 9;
      if (mouseX > 1 * imgSize && mouseX <= 2 * imgSize)
        selected = 0;
      if (mouseX > 2 * imgSize && mouseX <= 3 * imgSize)
        selected = 1;
      if (mouseX > 3 * imgSize && mouseX <= 4 * imgSize)
        selected = 2;
      if (mouseX > 5 * imgSize && mouseX <= 6 * imgSize)
        selected = 3;
      if (mouseX > 6 * imgSize && mouseX <= 7 * imgSize)
        selected = 4;
      if (mouseX > 7 * imgSize && mouseX <= 8 * imgSize)
        selected = 5;
      break;
    case 2: // active
      if (mouseX > width / 2)
        player.setDir(1);
      else if (mouseX < width < 2)
        player.setDir(-1);
      break;
    case 3: // game over
      break;
  }

  return false;
}

function touchMoved() {
  switch (gameState) {
    case 0: // welcome
      break;
    case 1: // selection
      let imgSize = width / 9;
      if (mouseX > 1 * imgSize && mouseX <= 2 * imgSize)
        selected = 0;
      if (mouseX > 2 * imgSize && mouseX <= 3 * imgSize)
        selected = 1;
      if (mouseX > 3 * imgSize && mouseX <= 4 * imgSize)
        selected = 2;
      if (mouseX > 5 * imgSize && mouseX <= 6 * imgSize)
        selected = 3;
      if (mouseX > 6 * imgSize && mouseX <= 7 * imgSize)
        selected = 4;
      if (mouseX > 7 * imgSize && mouseX <= 8 * imgSize)
        selected = 5;
      break;
    case 2: // active
      break;
    case 3: // game over
      break;
  }

  return false;
}

function touchEnded() {
  switch (gameState) {
    case 0: // welcome
      initialSpeed = 1;
      movementMode = 0;
      spriteMode = 0;
      shootTimer = fireCooldown;
      score = 0;
      bullets = [];
      bombs = [];
      createFleet(enemyCols, enemyRows, initialSpeed, movementMode, spriteMode);
      player = new Player(width / 2, height - R * 2, R * 2);
      gameState++;
      break;
    case 1: // selection
      selectPlayer(selected);
      snd_start.play();
      break;
    case 2: // active
      player.setDir(0);
      break;
    case 3: // game over
      let textH = height / 20;
      if (mouseX > width / 3 && mouseX < 2 * width / 3 && mouseY > height - 3.5 * textH && mouseY < height - 1.5 * textH)
        gameState = 0;
      break;
  }

  return false;
}

function fire() {
  var bullet = new Bullet(player.x, height - R * 2, 8);
  bullets.push(bullet);
  shootTimer = fireCooldown;
  snd_bullet.play();
}

function selectPlayer(player) {
  switch (player) {
    case 0:
      player1 = f1unit1_1;
      player2 = f1unit1_2;
      player3 = f1unit1_3;
      break;
    case 1:
      player1 = f1unit2_1;
      player2 = f1unit2_2;
      player3 = f1unit2_3;
      break;
    case 2:
      player1 = f1unit3_1;
      player2 = f1unit3_2;
      player3 = f1unit3_3;
      break;
    case 3:
      player1 = f2unit1_1;
      player2 = f2unit1_2;
      player3 = f2unit1_3;
      break;
    case 4:
      player1 = f2unit2_1;
      player2 = f2unit2_2;
      player3 = f2unit2_3;
      break;
    case 5:
      player1 = f2unit3_1;
      player2 = f2unit3_2;
      player3 = f2unit3_3;
      break;
  }

  if (player < 3) {
    enemy1_1 = f2unit1_1;
    enemy1_2 = f2unit1_2;
    enemy1_3 = f2unit1_3;
    enemy2_1 = f2unit2_1;
    enemy2_2 = f2unit2_2;
    enemy2_3 = f2unit2_3;
    enemy3_1 = f2unit3_1;
    enemy3_2 = f2unit3_2;
    enemy3_3 = f2unit3_3;
    boss1 = f2boss1;
    boss2 = f2boss2;
    boss3 = f2boss3;
  } else {
    enemy1_1 = f1unit1_1;
    enemy1_2 = f1unit1_2;
    enemy1_3 = f1unit1_3;
    enemy2_1 = f1unit2_1;
    enemy2_2 = f1unit2_2;
    enemy2_3 = f1unit2_3;
    enemy3_1 = f1unit3_1;
    enemy3_2 = f1unit3_2;
    enemy3_3 = f1unit3_3;
    boss1 = f1boss1;
    boss2 = f1boss2;
    boss3 = f1boss3;
  }

  gameState++;
}

// cols: number of columns
// rows: number of rows
// startingSpeed: speed at which fleet moves before any has been killed
// movementMode: 0=unison, 1=alternating
// spriteMode: 0=rows loop through sprites, 1=rows sweep through sprites, 2=columns loop through sprites, 3=columns sweep through sprites
function createFleet(cols, rows, startingSpeed, movementMode, spriteMode) {
  let spriteIndex = 1;
  let w = width / 3 / cols;
  R = 0.8 * w / 2;

  enemies = [];
  for (var y = 0; y < rows; y++) {
    if (spriteMode === 0)
      spriteIndex = y % 3 + 1;
    if (spriteMode === 1)
      spriteIndex = Math.round(2 + Math.sin((y + 1) / 2 * Math.PI));
    for (var x = 0; x < cols; x++) {
      if (spriteMode === 2)
        spriteIndex = x % 3 + 1;
      if (spriteMode === 3)
        spriteIndex = Math.round(2 + Math.sin((x + 1) / 2 * Math.PI));
      let enemy = new Enemy(w / 2 + width / 3 + x * w, y * w + w, R, spriteIndex, -(y % (movementMode + 1)) * 2 + 1);
      enemies.push(enemy);
    }
  }

  speed = startingSpeed;
  speedInc = Math.pow(5, 1 / (enemies.length - 1)); // Speed will multiply with this factor for every enemy that dies, which means the speed of the final remaining enemy will be 5 times that of the starting speed.
}