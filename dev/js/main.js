import { PlayerClass, EnemyClass, GameObject } from "./classess";
import { circleRectCollision, drawText, rectRectCollision, randomNumbersWithFixedSum, drawTextWithShadow, allTrue } from "./helperFunctions";
import { KeyBoardSprite } from "./KeyboardKeySprites";

const ctx = document.getElementById('canvas').getContext("2d");
resizeCanvas();

let player = new PlayerClass(ctx);
let fadeBox = new GameObject(ctx);
let enemyArray1 = [];

let hiScore = 0

// (max 4, 13, no max - increment)

// let enemyHealtPool1 = randomNumbersWithFixedSum(4, 13, 1000)

// enemyHealtPool1.forEach(e => {
//   enemyArray1.push(new EnemyClass(ctx, canvas.width / 2, canvas.height / 2, e))
// })

let enemyHealtPool1 = randomNumbersWithFixedSum(1, -1, 10)

enemyHealtPool1.forEach(e => {
  enemyArray1.push(new EnemyClass(ctx, canvas.width / 2, canvas.height / 2, 12))
})
let globalClock = {
  dt: 0,
  s: 0,
}
enemyArray1[0].movementSpeed = 0
let gameState = 0

let keyBoardKeys = [
  new KeyBoardSprite(ctx, 'uArrow')
  , new KeyBoardSprite(ctx, 'rArrow')
  , new KeyBoardSprite(ctx, 'dArrow')
  , new KeyBoardSprite(ctx, 'lArrow')

  , new KeyBoardSprite(ctx, '1')
  , new KeyBoardSprite(ctx, '2')
  , new KeyBoardSprite(ctx, '3')

  , new KeyBoardSprite(ctx, 'Space')
  , new KeyBoardSprite(ctx, 'Esc')
]



const keys = {
  u: {
    pressed: 0
  },
  d: {
    pressed: 0
  },
  l: {
    pressed: 0
  },
  r: {
    pressed: 0
  }
}

let lastKey = ''
window.addEventListener('keydown', (e) => {
  if (player.alive) {

    if (e.key === 'ArrowRight') {
      keys.r.pressed = 1;
      lastKey = 'r';
      if (!player.attacking) {
        player.attDir = 2
      }
      keyBoardKeys[1].pressed = 1;
    } else if (e.key === 'ArrowLeft') {
      keys.l.pressed = 1;
      lastKey = 'l';
      keyBoardKeys[3].pressed = 1;
      if (!player.attacking) {
        player.attDir = 4
      }
    } else if (e.key === 'ArrowUp') {
      keys.u.pressed = 1;
      lastKey = 'u';
      keyBoardKeys[0].pressed = 1;
      if (!player.attacking) {
        player.attDir = 1
      }
    } else if (e.key === 'ArrowDown') {
      keys.d.pressed = 1;
      lastKey = 'd';
      keyBoardKeys[2].pressed = 1;
      if (!player.attacking) {
        player.attDir = 3
      }
    }
  } else {
    keys.r.pressed = 0;
    keys.l.pressed = 0;
    keys.u.pressed = 0;
    keys.d.pressed = 0;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight') {
    keys.r.pressed = 0;
  } else if (e.key === 'ArrowLeft') {
    keys.l.pressed = 0;

  } else if (e.key === 'ArrowUp') {
    keys.u.pressed = 0;

  } else if (e.key === 'ArrowDown') {
    keys.d.pressed = 0;
  };

  if (player.alive) {
    if (e.key === ' ') {
      if(gameState == 0){
        gameState = 1
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

  instruction1();
  instruction2();
  instruction3();
  instruction4();
  handleEnemies();
  gameOverScreen();


  if (keys.r.pressed && lastKey == 'r') { player.x += player.movementSpeed }
  else if (keys.l.pressed && lastKey == 'l') { player.x -= player.movementSpeed }
  else if (keys.d.pressed && lastKey == 'd') { player.y += player.movementSpeed }
  else if (keys.u.pressed && lastKey == 'u') { player.y -= player.movementSpeed }
  drawGameTitle();
  moveFadeBox();
}

function instruction1() {
  if (gameState == -4) {
    let x = canvas.width / 2
    let y = canvas.height * 0.75
    let pressedKeys = [];
    drawText(ctx, "PRESS         TO MOVE", x, y, 50, "black");

    for (let i = 0; i < 4; i++) {
      ctx.save();
      keyBoardKeys[i].draw();
      keyBoardKeys[i].width = keyBoardKeys[i].height = 50
      ctx.restore();
    }

    keyBoardKeys[3].x = x - keyBoardKeys[3].width * 2
    keyBoardKeys[3].y = y

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
}
function instruction2() {
  if (gameState == -3) {
    let x = canvas.width / 2
    let y = canvas.height * 0.25
    let pressedKeys = [];
    drawText(ctx, "PRESS          TO CHANGE ATTACK POWER", x, y, 50, "black");

    for (let i = 4; i < 7; i++) {
      ctx.save();
      keyBoardKeys[i].draw();
      keyBoardKeys[i].width = keyBoardKeys[i].height = 50
      ctx.restore();
    }

    keyBoardKeys[4].x = x - keyBoardKeys[4].width * 5.8
    keyBoardKeys[4].y = y - keyBoardKeys[4].width / 2

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
}
function instruction3() {
  if (gameState == -2) {
    let x = canvas.width / 2 + 15
    let y = canvas.height * 0.25
    let pressedKeys = [];

    drawText(ctx, "SEE THAT '0' OVER THERE?", x, y, 50, "black");
    drawText(ctx, "GET IT TO 13 BY PRESSING", x - 15, y + 50, 50, "black");
    drawText(ctx, "YOUR ATTACK TYPE CHANGES AFTER EVERY SWING", x - 15, y + 175, 25, "black");

    ctx.save();
    keyBoardKeys[7].draw();
    keyBoardKeys[7].width = 300
    keyBoardKeys[7].height = 50
    ctx.restore();

    keyBoardKeys[7].x = x - keyBoardKeys[7].width * 0.5 - 15
    keyBoardKeys[7].y = y + 90

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
}

function instruction4() {
  if (gameState == -1) {
    let x = canvas.width / 2 + 15
    let y = canvas.height * 0.25
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
}

function gameCollisionDetection(e) {
  if (player.attacking &&

    circleRectCollision(
      player.attX,
      player.attY,
      player.circleRadius,
      e.x,
      e.y,
      e.width,
      e.height
    )

  ) {
    e.damage(player)
    if (e.alive) {
      player.score++
    }
  }

  if (!player.attacking) {
    e.damaged = 0;
  }

  if (e.remainder != 0) {
    enemyArray1.push(new EnemyClass(ctx, e.x, e.y + e.height, e.remainder))
    e.remainder = 0
  }

  if (player.alive) {
    if (rectRectCollision(
      player.x,
      player.y,
      player.width,
      player.height,
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

      gameCollisionDetection(e)
    };

  });
}

function resizeCanvas() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

function gameOverScreen() {
  let x = canvas.width / 2
  let y = canvas.height * 0.25
  if (player.lives <= 0) {
    drawTextWithShadow(ctx, "Game Over!", x, y, 100, "white");
    drawText(ctx, "    to quit", x, y + 100, 50, "black");
    keyBoardKeys[8].draw();
    keyBoardKeys[8].x = x - 130
    keyBoardKeys[8].y = y + 100 - 25
    keyBoardKeys[8].width = 60
    keyBoardKeys[8].height = 50
  }
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
  player.x = canvas.width / 2 - player.width / 2
  player.y = canvas.height / 2 - player.height / 2
  player.score = 0;
  hiScore = Math.max(player.score, hiScore)
  if (fadeBox.x > canvas.width + 500) {
    gameState = 0;
  }

}


function drawGameTitle() {
  if (gameState == -4 || gameState == 0) {
    drawTextWithShadow(ctx, "DON'T FEAR THE 13", canvas.width / 2, canvas.height * 0.25, 100, "white");
  }

  if (gameState == 0) {
    let x = canvas.width / 2 + 15
    let y = canvas.height * 0.25


    drawText(ctx, "TO BEGIN", canvas.width / 2 + keyBoardKeys[7].width * 0.4, canvas.width * 0.56 + keyBoardKeys[7].height / 2, 50, "black");
    drawText(ctx, `Hi-Score:${hiScore}`, 150, canvas.width * 0.14, 50, "white");
    ctx.save();
    keyBoardKeys[7].draw();
    keyBoardKeys[7].width = 300
    keyBoardKeys[7].height = 50
    ctx.restore();

    keyBoardKeys[7].x = canvas.width / 2 - keyBoardKeys[7].width
    keyBoardKeys[7].y = canvas.width * 0.56
  }
}