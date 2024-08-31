import { PlayerClass, EnemyClass, GameObject } from "./classess";
import { circleRectCollision, drawText, rectRectCollision, randomNumbersWithFixedSum, drawTextWithShadow, allTrue, getRandomInt } from "./helperFunctions";
import { KeyBoardSprite } from "./KeyboardKeySprites";

import playerSpriteSrc from '/img/playerSpites.png'

const ctx = document.getElementById('canvas').getContext("2d");

const playerSprites = new Image()
playerSprites.src = playerSpriteSrc;
let globalOffsetX = 0;
let globalOffsetY = 0;
resizeCanvas();

let lastKey = ''
let player = new PlayerClass(ctx, playerSprites);
let fadeBox = new GameObject(ctx);
let enemyArray1 = [];

let score = 0
let hiScore = 0
let someTruthy;
let increment = 100;
let sumOfCurrentHealth = 0;
// (max 4, 13, no max - increment)

// let enemyHealtPool1 = randomNumbersWithFixedSum(4, 13, increment)
let enemyHealtPool1 = [12]


let globalClock = {
  dt: 0,
  s: 0,
}

let gameState = -4

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
      globalOffsetX-=player.movementSpeed
      keyBoardKeys[1].pressed = 1;
    } else if (e.key === 'ArrowLeft') {
      keys.l = 1;
      lastKey = 'l';
      keyBoardKeys[3].pressed = 1;
      if (!player.attacking) {
        player.attDir = 4
      }
      globalOffsetX+=player.movementSpeed
    } else if (e.key === 'ArrowUp') {
      keys.u = 1;
      lastKey = 'u';
      keyBoardKeys[0].pressed = 1;
      if (!player.attacking) {
        player.attDir = 1
      }
      globalOffsetY+=player.movementSpeed
    } else if (e.key === 'ArrowDown') {
      keys.d = 1;
      lastKey = 'd';
      keyBoardKeys[2].pressed = 1;
      if (!player.attacking) {
        player.attDir = 3
      }
      globalOffsetY-=player.movementSpeed
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
      player.power = 1
      keyBoardKeys[4].pressed = 1;
    }
    if (e.key === '2') {
      player.power = 2
      keyBoardKeys[5].pressed = 1;
    }
    if (e.key === '3') {
      player.power = 5
      keyBoardKeys[6].pressed = 1;
    }
  } else {
    if (e.key == "Escape") {
      gameState = 2
    }
  }
});


animate();


function animate() {
  globalClock.dt++
  if (globalClock.dt % 60 == 0) {
    globalClock.s++
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resizeCanvas()
  requestAnimationFrame(animate);
  player.draw();
  other();
  handleEnemies();
  drawUI();
  spawnEnemies();
  moveFadeBox();
  // gameDebugger();
}
function other() {
  someTruthy = Object.values(keys).some(val => val === 1);
  if (someTruthy) {
    player.moving = 1
  } else {
    player.moving = 0
  }
}

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
}

function gameCollisionDetection(e) {
  if (player.attacking &&

    circleRectCollision(
      player.x + player.attX,
      player.y + player.attY,
      40,
      e.x,
      e.y,
      e.width,
      e.height
    )

  ) {
    e.damage(player)
    if (!e.alive && gameState == 1) {
      score++
    }
  }

  if (!player.attacking) {
    e.damaged = 0;
  }

  if (e.remainder != 0) {
    // let newSpeed = Math.max(e.movementSpeed-0.05,0.1)
    enemyArray1.push(new EnemyClass(ctx, e.x, e.y + e.height, e.remainder))
    e.remainder = 0
  }

  if (player.alive) {
    if (rectRectCollision(
      player.x - player.i.width / 336,
      player.y - player.i.height / 2,
      player.i.width / 168,
      50,
      e.x,
      e.y,
      e.width,
      e.height
    ) && !player.invincible && gameState == 1) {
      player.damagePlayer();
    }
  }
}

function handleEnemies() {

  enemyArray1.forEach(e => {
    if (e.alive) {
      e.draw();
      e.move(player)
      if (keys.r && lastKey == 'r') { e.x -= player.movementSpeed;}
      else if (keys.l && lastKey == 'l') { e.x += player.movementSpeed;}
      else if (keys.d && lastKey == 'd') { e.y -= player.movementSpeed;}
      else if (keys.u && lastKey == 'u') { e.y += player.movementSpeed;}
      gameCollisionDetection(e)
    };

  });
}

function resizeCanvas() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}


function moveFadeBox() {
  if (gameState == 2) {
    fadeBox.draw()
    let fadeSpeed = 50
    ctx.save()

    fadeBox.y = -50
    fadeBox.height = canvas.height + 50
    if (fadeBox.width > canvas.width) {
      fadeBox.x += fadeSpeed
      enemyArray1 = []
      resetGame();
    } else {
      fadeBox.x = -50
      fadeBox.width += fadeSpeed
    }
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.restore();
  }
}

function resetGame() {
  player.lives = 5;
  hiScore = Math.max(score, hiScore)
  score = 0;
  increment = 100;
  enemyHealtPool1 = randomNumbersWithFixedSum(4, 13, increment)
  if (fadeBox.x > canvas.width + 500) {
    gameState = 0;
    fadeBox.width = -50
  };
}

function drawUI() {
  let x = canvas.width / 2
  let y = canvas.height * 0.25
  
  if (gameState == -4) {
    drawTextWithShadow(ctx, "DON'T FEAR THE 13", canvas.width / 2  + globalOffsetX, canvas.height * 0.25  + globalOffsetY, 100, "white");
    let x = canvas.width / 2
    let y = canvas.height * 0.75
    let pressedKeys = [];
    drawText(ctx, "PRESS                 TO MOVE", x + globalOffsetX, y +  + globalOffsetY, 50, "black");

    for (let i = 0; i < 4; i++) {
      ctx.save();
      keyBoardKeys[i].draw();
      keyBoardKeys[i].width = keyBoardKeys[i].height = 50
      ctx.restore();
    }

    keyBoardKeys[3].x = x - keyBoardKeys[3].width * 2  + globalOffsetX
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
    x = canvas.width / 2
    y = canvas.height * 0.25
    let pressedKeys = [];
    drawText(ctx, "PRESS                TO CHANGE ATTACK POWER", x + globalOffsetX, y + globalOffsetY, 50, "black");

    for (let i = 4; i < 7; i++) {
      ctx.save();
      keyBoardKeys[i].draw();
      keyBoardKeys[i].width = keyBoardKeys[i].height = 50
      ctx.restore();
    }

    keyBoardKeys[4].x = x - keyBoardKeys[4].width * 5.8  + globalOffsetX
    keyBoardKeys[4].y = y - keyBoardKeys[4].width / 2  + globalOffsetY

    keyBoardKeys[5].x = keyBoardKeys[4].x + keyBoardKeys[4].width
    keyBoardKeys[6].y = keyBoardKeys[5].y = keyBoardKeys[4].y
    keyBoardKeys[6].x = keyBoardKeys[4].x + keyBoardKeys[4].width * 2

    for (let i = 4; i < 7; i++) {
      pressedKeys.push(keyBoardKeys[i].pressed)
    }

    if (allTrue(pressedKeys)) {
      gameState++
    }
  }

  if (gameState == -2) {
    x = canvas.width / 2 + 15
    y = canvas.height * 0.10
    let pressedKeys = [];

    drawText(ctx, "SEE THAT '0' OVER THERE?", x  + globalOffsetX, y + globalOffsetY, 50, "black");
    drawText(ctx, "GET IT TO 13 BY PRESSING", x + globalOffsetX, y + 55 + globalOffsetY, 50, "black");
    drawText(ctx, "YOUR ATTACK TYPE CHANGES AFTER EVERY SWING", x - 15 + globalOffsetX, y + 175 + globalOffsetY, 20, "black");

    ctx.save();
    keyBoardKeys[7].draw();
    keyBoardKeys[7].width = 300
    keyBoardKeys[7].height = 50
    ctx.restore();

    keyBoardKeys[7].x = x - keyBoardKeys[7].width * 0.5 - 15  + globalOffsetX
    keyBoardKeys[7].y = y + 95  + globalOffsetY

    pressedKeys.push(keyBoardKeys[7].pressed)

    if (enemyArray1.length == 0) {
      enemyArray1.push(new EnemyClass(ctx, canvas.width / 2, canvas.height * 0.75, 0))
      enemyArray1[0].movementSpeed = 0.1;
      enemyArray1[0].special = 1;
    }

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
      gameState = 1
    }
  }

  if (gameState == 0 || fadeBox.width >= canvas.width) {
    drawTextWithShadow(ctx, "DON'T FEAR THE 13", canvas.width / 2, canvas.height * 0.25, 100, "white");
    drawText(ctx, `HI-SCORE:${hiScore}`, 150, canvas.height * 0.18, 50, "white");

    drawText(ctx, "TO BEGIN", canvas.width / 2 + keyBoardKeys[7].width * 0.4, canvas.height * 0.56 + keyBoardKeys[7].height * 0.6, 50, "black");

    ctx.save();
    keyBoardKeys[7].draw();
    keyBoardKeys[7].width = 300
    keyBoardKeys[7].height = 50
    ctx.restore();

    keyBoardKeys[7].x = canvas.width / 2 - keyBoardKeys[7].width
    keyBoardKeys[7].y = canvas.height * 0.56
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
    drawText(ctx, `SCORE:${score}`, 150, canvas.height * 0.18, 50, "white");
  }
}

function beginGame() {
  enemyHealtPool1.forEach(e => {
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
    enemyArray1.push(new EnemyClass(ctx, x, y, e))
  })
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
      enemyHealtPool1 = randomNumbersWithFixedSum(4, 13, increment);
      enemyArray1 = [];
      beginGame();
    }
  }
}