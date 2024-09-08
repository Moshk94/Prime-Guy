import {
  circleRectCollision,
  rads,
  drawText,
  rectRectCollision,
  randomNumbersWithFixedSum,
  allTrue,
  getRandomInt,
  getRandomArbitrary
} from "./helperFunctions";

import { KeyBoardSprite } from "./KeyboardKeySprites";

import playerSpriteSrc from '/img/p.png';
import bgSrc from '/img/b.png';
import heartSrc from '/img/h.png';
import buffsrc from '/img/c.png';

class GameObject {
  constructor() {
    this.x = -50;
    this.width = 0;
    this.clock = {
      attClock: 0,
      dmgClock: 0,
      dt: 0,
      s: 0,
    };
  };
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height)
    ctx.fill();
  };
};

class PlayerClass extends GameObject {
  constructor(i) {
    super();
    this.x = canvas.width / 2
    this.y = canvas.height / 2
    this.movementSpeed = 5;
    this.attacking = 0;
    this.operation = ['+', '-', '÷'];
    this.index = 0;
    this.attDir = 3
    this.attX = 0;
    this.attY = 0;
    this.invincible = 0
    this.lives = 50;
    this.pArray = [1, 2, 5];
    this.power = this.pArray[0];
    this.i = i;
    this.height = this.i.height * 0.85
    this.width = this.i.width / 18
    this.frames = {
      current: 62 * 81,
      max: 62 * 12
    }
    this.x2 = 0;
  };

  draw(s) {
    this.drawPlayerInfo(s);
    this.clock.dt++
    if (this.lives > 0) { this.alive = 1 } else { this.alive = 0 };
    if (this.attacking && this.clock.attClock < 1) {
      this.clock.attClock++
    } else {
      this.clock.attClock = 0
    }

    if (this.invincible) {
      this.clock.dmgClock++
    }
    if (this.clock.dmgClock > 90) {
      this.clock.dmgClock = 0
      this.invincible = 0
    }

    ctx.save();
    if (!this.alive) {
      this.frames.min = 62 * 81
      this.frames.max = 62 * 93
    } else if (this.attDir == 3) {
      if (this.attacking) {
        this.frames.max = 62 * 28
        this.attY = 50
        this.attX = 0
      } else if (this.moving) {
        this.frames.min = 62 * 14
        this.frames.max = 62 * 21
      } else {
        this.frames.min = 0
        this.frames.max = 62 * 12
      }
    } else if (this.attDir == 2 || this.attDir == 4) {
      if (this.attacking) {
        this.frames.max = 62 * 52
        this.attY = 0
        this.attX = 80
      } else if (this.moving) {
        this.frames.min = 62 * 41
        this.frames.max = 62 * 47
      } else {
        this.frames.min = 62 * 29
        this.frames.max = 62 * 39
      }
    } else if (this.attDir == 1) {
      if (this.attacking) {
        this.frames.max = 62 * 79
        this.attY = -50
        this.attX = 0
      } else if (this.moving) {
        this.frames.min = 62 * 66
        this.frames.max = 62 * 73
      } else {
        this.frames.min = 62 * 54
        this.frames.max = 62 * 64
      }
    } if (this.attDir == 4) {
      ctx.translate(canvas.width, 0);

      ctx.scale(-2, 2);
      this.attY = 0
      this.attX = -80
    } else {
      ctx.scale(2, 2);
    }

    if (this.clock.dmgClock > 0 && this.clock.dmgClock < 15 && this.alive) {
      ctx.filter = `brightness(20)`;
    }
    if (this.clock.dmgClock >= 15 && this.invincible && this.alive) {
      ctx.filter = `opacity(0.5)`;
    }
    ctx.drawImage(
      this.i
      , this.frames.current
      , 0
      , this.i.width / 96
      , this.i.height
      , canvas.width / 4 - 36
      , canvas.height / 4 - 54
      , this.i.width / 48
      , this.i.height * 2);

    ctx.restore();

    if (this.clock.dt % 3 == 0) {
      if (this.frames.current >= this.frames.min && this.frames.current < this.frames.max) {
        this.frames.current += 62
      } else {
        if (this.alive) {
          this.frames.current = this.frames.min
          if (this.attacking) {
            this.attacking = 0;
            this.index++;
          };
        };
      };
    };
  };

  drawPlayerInfo(s) {
    if (this.attDir == 4) {
      this.x2 = 100;
    } else if (this.attDir == 2) {
      this.x2 = 0;
    };
    for (let i = 5; i > 0; i--) {
      ctx.save();
      if (!(5 - this.lives < i)) { ctx.filter = `brightness(0)`; }
      ctx.drawImage(s, canvas.width / 2 - this.i.width / 96 + this.x2, canvas.height / 2 + (this.i.height * 0.3 * i) - 55);
      ctx.restore();
    }
    drawText(ctx, `${this.operation[this.index % this.operation.length]}${this.power}`, this.x * 0.995, this.y - this.height * 1.3, 25, 'white');
  }
  damagePlayer() {
    this.invincible = 1;
    this.lives--
    if (this.lives <= 0) { this.frames.current = 62 * 81 }
  }
}

class EnemyClass extends GameObject {
  constructor(x, y, h, s = 0.1) {
    super(ctx);
    this.speedOffset = getRandomArbitrary(-0.05, 0.1);
    this.movementSpeed = s;
    this.knockBackX = 0;
    this.knockBackY = 0;
    this.width = 100;
    this.height = this.width;
    this.y = y;
    this.x = x;
    this.lives = h
    this.damaged = 0;
    this.alive = 1;
    this.remainder = 0;
    this.angle = 0
    this.ySin = 0;
    this.opac = 1
  };
  draw() {
    ctx.save();
    ctx.font = `100px q`
    let txt = this.lives;
    let fM = ctx.measureText(txt);
    this.width = fM.width - (100 / 10);
    this.height = fM.actualBoundingBoxAscent + fM.actualBoundingBoxDescent;
    if (this.lives == 13) {
      this.ySin += 10
      this.opac -= 0.05
      if (this.ySin < 200) {
        ctx.fillStyle = `rgba(255, 255, 0, ${this.opac})`;
        ctx.fillText(1, this.x + 10 * Math.cos(rads(this.ySin)), this.y + this.height - 50 * Math.sin(rads(this.ySin)));
        ctx.fillText(3, this.x + this.width / 2 - 10 * Math.cos(rads(this.ySin)), this.y + this.height - 50 * Math.sin(rads(this.ySin)));
      } else if (this.ySin >= 200) {
        if (gameState == 1) { score++ }
        this.alive = 0;
      }
    } else {

      ctx.filter = `drop-shadow(-9px 100px 20px #000000)`;
      if (this.damaged) {
        ctx.fillStyle = "yellow";
      } else {
        ctx.fillStyle = "darkred";
      };

      ctx.fillText(txt, this.x, this.y + this.height);
    }
    ctx.restore();
    if (this.clock.dmgClock >= 1 && this.clock.dmgClock < 10) {
      this.clock.dmgClock++;
    } else if (this.clock.dmgClock >= 10) {
      this.clock.dmgClock = 0
      this.knockBackX = 0;
      this.knockBackY = 0;
    }
  }
  damageEnemy() {
    if (!this.damaged) {
      if (this.lives != 13) {
        if (player.attDir == 3) {
          this.knockBackY = -10
        } else if (player.attDir == 1) {
          this.knockBackY = -10
        } else if (player.attDir == 2) {
          this.knockBackX = -10
        } else if (player.attDir == 4) {
          this.knockBackX = -10
        }
      }

      this.damaged = 1;
      this.clock.dmgClock++;
      if (player.index % player.operation.length == 0) {
        this.lives += player.power;
      } else if (player.index % player.operation.length == 1) {
        this.lives -= player.power;
      } else if (player.index % player.operation.length == 2) {
        if (this.lives % player.power == 0 || this.lives % player.power == -0) {
          this.lives /= player.power
        } else {
          if (!this.special) {
            this.lives = Math.floor(this.lives / player.power)
            this.remainder = this.lives % player.power
          }
        }
      }
    }
  }
  move() {
    if (this.lives !== 13) {
      let followPlayer = 1;
      if (!player.alive) { followPlayer = -1 }
      if (this.y + this.height / 2 > player.y + player.height) {
        this.y -= (this.movementSpeed * followPlayer) + this.knockBackY;
      } else if (this.y + this.height / 2 < player.y) {
        this.y += (this.movementSpeed * followPlayer) + this.knockBackY;
      };

      if (this.x + this.width / 2 > canvas.width / 2) {
        this.x -= this.movementSpeed * followPlayer + this.knockBackX;
      } else if (this.x + this.width / 2 < player.x) {
        this.x += this.movementSpeed * followPlayer + this.knockBackX;
      };
    }
  }
};

class buffsSprite extends GameObject {
  constructor(s) {
    super();
    this.s = s
    this.frames = {
      current: 0,
    }
  }
  draw() {
    ctx.save();
    ctx.scale(2, 2);
    ctx.drawImage(
      this.s
      , this.frames.current
      , 0
      , this.s.width / 23
      , this.s.height
      , canvas.width / 4 - 20
      , canvas.height / 4 - 27
      , this.s.width / 11.5
      , this.s.height * 2);
    if (this.clock.dt % 3 == 0) {
      this.frames.current += 18
    }
    this.clock.dt++
    ctx.restore();
  }
}

const ctx = document.getElementById('canvas').getContext("2d");
resizeCanvas();
const playerSprites = new Image()
playerSprites.src = playerSpriteSrc;

const heartSprite = new Image()
heartSprite.src = heartSrc;

const buffSprite = new Image()
buffSprite.src = buffsrc;


const bg = new Image()
bg.src = bgSrc;
let bgx, bgy, player, buff;

bg.onload = () => {
  bgx = -bg.width / 2;
  bgy = -bg.height / 2;
  player = new PlayerClass(playerSprites);
  buff = new buffsSprite(buffSprite)
  ctx.drawImage(bg, canvas.width / 20 + bgx, canvas.height / 20 + bgy);
  animate();
}

const SCALE = 10;

let globalOffsetX = 0;
let globalOffsetY = 0;

let lastKey = '';
let fadeBox = new GameObject();
let enemyArray1 = [];

let score = 0;
let hiScore = 0;
let someTruthy;
let increment = 10;
let sumOfAlive = 0;

let enemyHealtPool1 = []

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
        resetGame();
      }
      if (!player.attacking) {
        if (player.attDir == 3) {
          player.frames.current = 62 * 22
        } else if (player.attDir == 2 || player.attDir == 4) {
          player.frames.current = 62 * 47
        } else if (player.attDir == 1) {
          player.frames.current = 62 * 74
        }
      };
      player.attacking = 1;
    }

    if (e.key === '1' || e.key === '2' || e.key === '3') {
      player.power = player.pArray[e.key - 1];
      buff.frames.current = 0
    }

  } else {
    if (e.key == "Escape") {
      gameState = 2
    }
  }
});

function animate() {
  requestAnimationFrame(animate);
  resizeCanvas();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  globalClock.dt++
  if (globalClock.dt % 60 == 0) {
    globalClock.s++
  };

  handleBg();
  player.draw(heartSprite);
  buff.draw();
  other();
  handleEnemies();
  drawUI();
  spawnEnemies();
  moveFadeBox();
  boundries();
}

function handleBg() {
  ctx.save();
  ctx.scale(SCALE, SCALE);
  ctx.drawImage(bg, canvas.width / 20 + bgx, canvas.height / 20 + bgy);
  ctx.restore();
};

function other() {
  someTruthy = Object.values(keys).some(val => val === 1);
  player.moving = 0
  if (someTruthy) { player.moving = 1 }
};

function gameCollisionDetection(e) {
  if (player.attacking && circleRectCollision(
    player.x + player.attX,
    player.y + player.attY,
    40,
    e.x,
    e.y,
    e.width,
    e.height)) {
    e.damageEnemy()
    keyBoardKeys[7].pressed = 1
  }

  if (!player.attacking) {
    e.damaged = 0;
  };

  if (e.remainder != 0) {
    enemyArray1.push(new EnemyClass(e.x, e.y + e.height, e.remainder, (Math.max(0.05, e.movementSpeed - 0.1))));
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
    ) && !player.invincible && gameState == 1 && e.lives != 13) {
      player.damagePlayer();
    };
  };
};

function handleEnemies() {
  enemyArray1.forEach(e => {
    if (e.alive) {
      e.draw();
      e.move()
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
  increment = 10;
  keyBoardKeys[7].pressed = 0;
  enemyHealtPool1 = randomNumbersWithFixedSum(2, 13, increment);
  if(gameState != 1){
    bgx = -bg.width / 2;
    bgy = -bg.height / 2;
    globalOffsetY = 0;
    globalOffsetX = 0;
  }
  if (fadeBox.x > canvas.width + 500) {
    gameState = 0;
    fadeBox.width = -50
  };
}

function drawUI() {
  let x = canvas.width / 2
  let y = canvas.height * 0.25

  if (gameState == -4) {
    drawText(ctx, "PRIME GUY", canvas.width / 2 + globalOffsetX, canvas.height * 0.25 + globalOffsetY, 100, "goldenrod", 10);
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
    drawText(ctx, "YOUR ATTACK OPERATION CHANGES AFTER EVERY SWING", x - 15 + globalOffsetX, y + 175 + globalOffsetY, 20, "black");

    ctx.save();
    keyBoardKeys[7].draw();
    keyBoardKeys[7].width = 300
    keyBoardKeys[7].height = 50
    ctx.restore();

    keyBoardKeys[7].x = x - keyBoardKeys[7].width * 0.5 - 15 + globalOffsetX
    keyBoardKeys[7].y = y + 95 + globalOffsetY

    if (enemyArray1.length == 0) {
      enemyArray1.push(new EnemyClass(canvas.width / 2, canvas.height * 0.75, 0))
      enemyArray1[0].movementSpeed = 0.1;
      enemyArray1[0].special = 1;
    }

    if (keyBoardKeys[7].pressed) {
      globalClock.s = 0
      gameState++
    }
  }

  if (gameState == -2) {
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
    drawText(ctx, "PRIME GUY", canvas.width / 2 + globalOffsetX, canvas.height * 0.25 + globalOffsetY, 100, "white", 10);
    drawText(ctx, `HI-SCORE:${hiScore}`, 150, canvas.height * 0.05, 50, "white");

    drawText(ctx, "TO BEGIN", canvas.width / 2 + keyBoardKeys[7].width * 0.4 + globalOffsetX, canvas.height * 0.70 + keyBoardKeys[7].height * 0.6 + globalOffsetY, 50, "black");

    ctx.save();
    keyBoardKeys[7].draw();
    keyBoardKeys[7].width = 300
    keyBoardKeys[7].height = 50
    ctx.restore();

    keyBoardKeys[7].x = canvas.width / 2 - keyBoardKeys[7].width + globalOffsetX
    keyBoardKeys[7].y = canvas.height * 0.70 + globalOffsetY
  }

  if (player.lives <= 0) {
    drawText(ctx, "GAME OVER!", x, y - 90, 100, "white", 10);
    drawText(ctx, "    TO QUIT", x + 45, y + 15, 50, "black");
    keyBoardKeys[8].draw();
    keyBoardKeys[8].x = x - 130;
    keyBoardKeys[8].y = y - 15;
    keyBoardKeys[8].width = 90;
    keyBoardKeys[8].height = 50;
  }

  if (gameState == 1) {
    drawText(ctx, `SCORE:${score}`, 100, canvas.height * 0.05, 50, "white");
  }
}

function beginGame() {
  for (let i = 0; i < 2; i++) {
    let s = getRandomArbitrary(0.6, 1.1)
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

    enemyArray1.push(new EnemyClass(x, y, enemyHealtPool1[i], s));
  }
}

function spawnEnemies() {
  if (gameState == 1) {
    sumOfAlive = 0

    for (let i = 0; i < enemyArray1.length; i++) {
      sumOfAlive += enemyArray1[i].alive;
    }
    if (sumOfAlive == sumOfAlive >= enemyArray1.length || enemyArray1.length == 0) {
      increment += 50;
      enemyHealtPool1 = randomNumbersWithFixedSum(2, 13, increment);
      enemyArray1 = [];
      beginGame();
    }
  }
}


function boundries() {
  if (keys.r && lastKey == 'r' && bgx > -229) {
    globalOffsetX -= player.movementSpeed;
    bgx -= player.movementSpeed / SCALE;
  }
  else if (keys.l && lastKey == 'l' && bgx < -27) {
    globalOffsetX += player.movementSpeed;
    bgx += player.movementSpeed / SCALE;

  }
  else if (keys.d && lastKey == 'd' && bgy > -114) {
    globalOffsetY -= player.movementSpeed;
    bgy -= player.movementSpeed / SCALE;
  }
  else if (keys.u && lastKey == 'u' && bgy < -22) {
    globalOffsetY += player.movementSpeed;
    bgy += player.movementSpeed / SCALE;
  };
}