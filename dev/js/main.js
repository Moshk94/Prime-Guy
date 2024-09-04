import { PlayerClass, EnemyClass, GameObject } from "./classess";
import { circleRectCollision, drawText, rectRectCollision, randomNumbersWithFixedSum, drawTextWithShadow, allTrue, getRandomInt, getRandomArbitrary } from "./helperFunctions";
import { KeyBoardSprite } from "./KeyboardKeySprites";

import playerSpriteSrc from '/img/p.png';
import bgSrc from '/img/b.png'
import heartSrc from '/img/h.png'

const playerSprites = new Image()
playerSprites.src = playerSpriteSrc;

const heartSprite = new Image()
heartSprite.src = heartSrc;

const bg = new Image()
bg.src = bgSrc;

const ctx = document.getElementById('canvas').getContext("2d");
resizeCanvas();
const SCALE = 10

let bgx = -bg.width / 2;
let bgy = -bg.height / 2;
ctx.drawImage(bg, canvas.width / 20 + bgx, canvas.height / 20 + bgy);
let globalOffsetX = 0;
let globalOffsetY = 0;

let lastKey = ''
let player = new PlayerClass(ctx, playerSprites);
let fadeBox = new GameObject(ctx);
let enemyArray1 = [];

let score = 0
let trueScore = 0
let hiScore = 0
let someTruthy;
let increment = 100;
let sumOfCurrentHealth = 0;

let enemyHealtPool1 = [1]

let globalClock = {
  dt: 0,
  s: 0,
}

let gameState = 1

let keyBoardKeys = [
  new KeyBoardSprite(ctx, 'uArrow')
  , new KeyBoardSprite(ctx, 'rArrow')
  , new KeyBoardSprite(ctx, 'dArrow')
  , new KeyBoardSprite(ctx, 'lArrow')

  , new KeyBoardSprite(ctx, '1')
  , new KeyBoardSprite(ctx, '2')
  , new KeyBoardSprite(ctx, '3')

  , new KeyBoardSprite(ctx, 'SPACE')
  , new KeyBoardSprite(ctx, 'ESC')
];

const keys = {
  u: 0,
  d: 0,
  l: 0,
  r: 0
}

window.addEventListener('keydown', (e) => {
  if (player.alive) {

    if (e.key === 'ArrowRight') {
      keys.r = 1;
      lastKey = 'r';
      if (!player.attacking) {
        player.attDir = 2
      }

      keyBoardKeys[1].pressed = 1;
    } else if (e.key === 'ArrowLeft') {
      keys.l = 1;
      lastKey = 'l';
      keyBoardKeys[3].pressed = 1;
      if (!player.attacking) {
        player.attDir = 4
      }

    } else if (e.key === 'ArrowUp') {
      keys.u = 1;
      lastKey = 'u';
      keyBoardKeys[0].pressed = 1;
      if (!player.attacking) {
        player.attDir = 1
      }

    } else if (e.key === 'ArrowDown') {
      keys.d = 1;
      lastKey = 'd';
      keyBoardKeys[2].pressed = 1;
      if (!player.attacking) {
        player.attDir = 3
      }

    }
  } else {
    keys.r = 0;
    keys.l = 0;
    keys.u = 0;
    keys.d = 0;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight') {
    keys.r = 0;
  } else if (e.key === 'ArrowLeft') {
    keys.l = 0;

  } else if (e.key === 'ArrowUp') {
    keys.u = 0;

  } else if (e.key === 'ArrowDown') {
    keys.d = 0;
  };

  if (player.alive) {
    if (e.key === ' ') {
      if (gameState == 0) {
        gameState = 1
        beginGame();
      }
      if (player.attDir == 3) {
        player.frames.current = 62 * 22

      } else if (player.attDir == 2 || player.attDir == 4) {
        player.frames.current = 62 * 47
      } else if (player.attDir == 1) {
        player.frames.current = 62 * 74
      }
      player.attacking = 1
    }

    if (e.key === '1') {
      player.power = 1;
    }
    if (e.key === '2') {
      player.power = 2;
    }
    if (e.key === '3') {
      player.power = 5;
    }
  } else {
    if (e.key == "Escape") {
      gameState = 2
    }
  }
});

animate();

function animate() {
  requestAnimationFrame(animate);
  resizeCanvas();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  globalClock.dt++
  if (globalClock.dt % 60 == 0) {
    globalClock.s++
  }


  handleBg();
  player.draw();
  player.drawPlayerInfo(heartSprite)
  other();
  handleEnemies();
  drawUI();
  spawnEnemies();
  moveFadeBox();

  if (keys.r && lastKey == 'r' && bgx > -229) { globalOffsetX -= player.movementSpeed; }
  else if (keys.l && lastKey == 'l' && bgx < -27) { globalOffsetX += player.movementSpeed; }
  else if (keys.d && lastKey == 'd' && bgy > -114) { globalOffsetY -= player.movementSpeed; }
  else if (keys.u && lastKey == 'u' && bgy < -22) { globalOffsetY += player.movementSpeed; };
  //gameDebugger();
}

function handleBg() {
  ctx.save();
  ctx.scale(SCALE, SCALE)
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(bg, canvas.width / 20 + bgx, canvas.height / 20 + bgy);
  ctx.restore();

  if (keys.r && lastKey == 'r' && bgx > -229) { bgx -= player.movementSpeed / SCALE; }
  else if (keys.l && lastKey == 'l' && bgx < -27) { bgx += player.movementSpeed / SCALE; }
  else if (keys.d && lastKey == 'd' && bgy > -114) { bgy -= player.movementSpeed / SCALE; }
  else if (keys.u && lastKey == 'u' && bgy < -22) { bgy += player.movementSpeed / SCALE; };
};

function other() {
  someTruthy = Object.values(keys).some(val => val === 1);
  if (someTruthy) {
    player.moving = 1
  } else {
    player.moving = 0
  };
};

function gameDebugger() {
  ctx.save();
  ctx.strokeStyle = "yellow";
  ctx.moveTo(-5, canvas.height / 2)
  ctx.lineTo(canvas.width + 5, canvas.height / 2)
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "yellow";
  ctx.moveTo(canvas.width / 2, -5)
  ctx.lineTo(canvas.width / 2, canvas.height + 5)
  ctx.stroke();
  ctx.restore();

  ctx.save()
  ctx.fillStyle = "rgba(255,0,0,0.5)";
  ctx.beginPath();
  ctx.rect(canvas.width / 2 - player.i.width / 250, canvas.height / 2 - player.i.height * 0.65, player.i.width / 150, 70);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "rgba(255,0,0,0.5)";
  ctx.beginPath();
  ctx.arc(player.x + player.attX, player.y + player.attY, 80, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

function gameCollisionDetection(e) {
  if (player.attacking && circleRectCollision(
    player.x + player.attX,
    player.y + player.attY,
    40,
    e.x,
    e.y,
    e.width,
    e.height)) {
    e.damage(player)
    keyBoardKeys[7].pressed = 1
    if (!e.alive && gameState == 1) {
      score++
    }
  }

  if (!player.attacking) {
    e.damaged = 0;
  };

  if (e.remainder != 0) {
    enemyArray1.push(new EnemyClass(ctx, e.x, e.y + e.height, e.remainder, (Math.max(0.05, e.movementSpeed-0.1))));
    e.remainder = 0;
  };

  if (player.alive) {
    if (rectRectCollision(
      player.x - player.i.width / 250,
      player.y - player.i.height * 0.65,
      player.i.width / 150,
      50,
      e.x,
      e.y,
      e.width,
      e.height
    ) && !player.invincible && gameState == 1) {
      player.damagePlayer();
    };
  };
};

function handleEnemies() {
  enemyArray1.forEach(e => {
    if (e.alive) {
      e.draw();
      e.move(player)
      if (keys.r && lastKey == 'r' && bgx > -229) { e.x -= player.movementSpeed; }
      else if (keys.l && lastKey == 'l' && bgx < -27) { e.x += player.movementSpeed; }
      else if (keys.d && lastKey == 'd' && bgy > -114) { e.y -= player.movementSpeed; }
      else if (keys.u && lastKey == 'u' && bgy < -22) { e.y += player.movementSpeed; };
      gameCollisionDetection(e);
    };
  });
};

function resizeCanvas() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
};


function moveFadeBox() {
  if (gameState == 2) {
    fadeBox.draw();
    let fadeSpeed = 50;
    ctx.save();

    fadeBox.y = -50;
    fadeBox.height = canvas.height + 50;
    if (fadeBox.width > canvas.width) {
      fadeBox.x += fadeSpeed;
      enemyArray1 = [];
      resetGame();
    } else {
      fadeBox.x = -50;
      fadeBox.width += fadeSpeed;
    }
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.restore();
  }
}

function resetGame() {
  player.lives = 5;
  hiScore = Math.max(score, hiScore);
  score = 0;
  increment = 100;
  keyBoardKeys[7].pressed = 0;
  enemyHealtPool1 = randomNumbersWithFixedSum(2, 13, increment);
  if (fadeBox.x > canvas.width + 500) {
    gameState = 0;
    fadeBox.width = -50
  };
}

function drawUI() {
  let x = canvas.width / 2
  let y = canvas.height * 0.25

  if (gameState == -4) {
    drawTextWithShadow(ctx, "PRIME GUY", canvas.width / 2 + globalOffsetX, canvas.height * 0.25 + globalOffsetY, 100, "goldenrod");
    let x = canvas.width / 2
    let y = canvas.height * 0.75
    let pressedKeys = [];
    drawText(ctx, "PRESS                 TO MOVE", x + globalOffsetX, y + + globalOffsetY, 50, "black");

    for (let i = 0; i < 4; i++) {
      ctx.save();
      keyBoardKeys[i].draw();
      keyBoardKeys[i].width = keyBoardKeys[i].height = 50
      ctx.restore();
    }

    keyBoardKeys[3].x = x - keyBoardKeys[3].width * 2 + globalOffsetX
    keyBoardKeys[3].y = y + globalOffsetY

    keyBoardKeys[2].x = keyBoardKeys[3].x + keyBoardKeys[3].width
    keyBoardKeys[1].y = keyBoardKeys[2].y = keyBoardKeys[3].y
    keyBoardKeys[1].x = keyBoardKeys[3].x + keyBoardKeys[3].width * 2
    keyBoardKeys[0].x = keyBoardKeys[3].x + keyBoardKeys[3].width
    keyBoardKeys[0].y = keyBoardKeys[3].y - keyBoardKeys[3].width

    for (let i = 0; i < 4; i++) {
      pressedKeys.push(keyBoardKeys[i].pressed)
    }

    if (allTrue(pressedKeys)) {
      gameState++;
    }
  }

  if (gameState == -3) {
    x = canvas.width / 2 + 15
    y = canvas.height * 0.10

    drawText(ctx, "SEE THAT '0' OVER THERE?", x + globalOffsetX, y + globalOffsetY, 50, "black");
    drawText(ctx, "ATTACK IT BY PRESSING", x + globalOffsetX, y + 55 + globalOffsetY, 50, "black");
    drawText(ctx, "YOUR ATTACK TYPE CHANGES AFTER EVERY SWING", x - 15 + globalOffsetX, y + 175 + globalOffsetY, 20, "black");

    ctx.save();
    keyBoardKeys[7].draw();
    keyBoardKeys[7].width = 300
    keyBoardKeys[7].height = 50
    ctx.restore();

    keyBoardKeys[7].x = x - keyBoardKeys[7].width * 0.5 - 15 + globalOffsetX
    keyBoardKeys[7].y = y + 95 + globalOffsetY

    if (enemyArray1.length == 0) {
      enemyArray1.push(new EnemyClass(ctx, canvas.width / 2, canvas.height * 0.75, 0))
      enemyArray1[0].movementSpeed = 0.1;
      enemyArray1[0].special = 1;
    }

    if (keyBoardKeys[7].pressed) {
      globalClock.s = 0
      gameState++
    }
  }

  if (gameState == -2) {
    x = canvas.width / 2
    y = canvas.height * 0.25
    drawText(ctx, "GET THAT NUMBER TO 13!", x + globalOffsetX, y + globalOffsetY, 50, "black");
    drawText(ctx, "USE                TO CHANGE YOUR ATTACK POWER", x - 15 + globalOffsetX, y + 60 + globalOffsetY, 35, "black");

    for (let i = 4; i < 7; i++) {
      ctx.save();
      keyBoardKeys[i].draw();
      keyBoardKeys[i].width = keyBoardKeys[i].height = 35
      ctx.restore();
    }

    keyBoardKeys[4].x = x - keyBoardKeys[4].width * 8 + globalOffsetX
    keyBoardKeys[4].y = y + keyBoardKeys[4].width * 1.1 + globalOffsetY

    keyBoardKeys[5].x = keyBoardKeys[4].x + keyBoardKeys[4].width;
    keyBoardKeys[6].y = keyBoardKeys[5].y = keyBoardKeys[4].y;
    keyBoardKeys[6].x = keyBoardKeys[4].x + keyBoardKeys[4].width * 2;

    if (enemyArray1[0].lives == 13) {
      globalClock.s = 0
      gameState++
    }
  }

  if (gameState == -1) {
    x = canvas.width / 2 + 15
    y = canvas.height * 0.25
    if (globalClock.s < 3) {
      drawText(ctx, "UH-OH, LOOKS LIKE IT BROUGHT MORE FRIENDS", x, y, 50, "black");
    } if (globalClock.s < 6 && globalClock.s >= 3) {
      drawText(ctx, "MAKE SURE YOU DONT LEAVE", x, y, 50, "black");
      drawText(ctx, "ANY REMAINDERS WHEN DIVIDING", x, y + 50, 50, "black");
    } if (globalClock.s > 6 && globalClock.s < 9) {
      drawText(ctx, "GOOD LUCK!", x, y, 50, "black");
    } if (globalClock.s >= 9) {
      gameState = 1;
    }
  }

  if (gameState == 0 || fadeBox.width >= canvas.width) {
    drawTextWithShadow(ctx, "PRIME GUY", canvas.width / 2, canvas.height * 0.25, 100, "white");
    drawText(ctx, `HI-SCORE:${hiScore}`, 150, canvas.height * 0.05, 50, "white");

    drawText(ctx, "TO BEGIN", canvas.width / 2 + keyBoardKeys[7].width * 0.4, canvas.height * 0.70 + keyBoardKeys[7].height * 0.6, 50, "black");

    ctx.save();
    keyBoardKeys[7].draw();
    keyBoardKeys[7].width = 300
    keyBoardKeys[7].height = 50
    ctx.restore();

    keyBoardKeys[7].x = canvas.width / 2 - keyBoardKeys[7].width
    keyBoardKeys[7].y = canvas.height * 0.70
  }

  if (player.lives <= 0) {
    drawTextWithShadow(ctx, "GAME OVER!", x, y, 100, "white");
    drawText(ctx, "    TO QUIT", x + 45, y + 105, 50, "black");
    keyBoardKeys[8].draw();
    keyBoardKeys[8].x = x - 130
    keyBoardKeys[8].y = y + 100 - 25
    keyBoardKeys[8].width = 90
    keyBoardKeys[8].height = 50
  }

  if (gameState == 1) {
    drawText(ctx, `SCORE:${score}`, 100, canvas.height * 0.05, 50, "white");
  }
}

function beginGame() {
  for (let i = 0; i < 2; i++) {
    let s = getRandomArbitrary(0.6,1.1)
    let xRand = getRandomInt(0, canvas.width);
    let yRand = getRandomInt(0, canvas.height);
    let x;
    let y;

    if (xRand > canvas.width / 2) {
      x = canvas.width + 50
    } else {
      x = 0 - 50
    }

    if (yRand > canvas.height / 2) {
      y = canvas.height + 50
    } else {
      y = 0 - 50
    }

    if (i == 1) {
      if (enemyArray1[0].x > canvas.width) {
        x = -50
      } else {
        x = canvas.width
      }

      if (enemyArray1[0].y > canvas.height) {
        y = -50
      } else {
        y = canvas.height
      }
      s = enemyArray1[0].movementSpeed - 0.4
    }
    enemyArray1.push(new EnemyClass(ctx, x, y, enemyHealtPool1[i],s));
  }

  trueScore += enemyArray1.length;
}

function spawnEnemies() {
  if (gameState == 1) {
    sumOfCurrentHealth = 0

    for (let i = 0; i < enemyArray1.length; i++) {
      sumOfCurrentHealth += Math.abs(enemyArray1[i].lives - 13);

      if (sumOfCurrentHealth > 0) { break }
    }

    if (sumOfCurrentHealth == 0) {
      increment += 10;
      enemyHealtPool1 = randomNumbersWithFixedSum(2, 13, increment);
      enemyArray1 = [];

      if (score < trueScore) {
        score = trueScore;
      }
      beginGame();
    }
  }
}