import { PlayerClass, HealthBar, EnemyClass } from "./classess";
import { circleRectColision, drawText, getRandomInt, allTrue } from "./helperFunctions";
import { KeyBoardSprite } from "./KeyboardKeySprites";

const ctx = document.getElementById('canvas').getContext("2d");
resizeCanvas();

let player = new PlayerClass(ctx);
let playerHealthBar = new HealthBar(ctx, 40);


let keyBoardKeys = [
  new KeyBoardSprite(ctx, 'uArrow')
  , new KeyBoardSprite(ctx, 'rArrow')
  , new KeyBoardSprite(ctx, 'dArrow')
  , new KeyBoardSprite(ctx, 'lArrow')

  , new KeyBoardSprite(ctx, '1')
  , new KeyBoardSprite(ctx, '2')
  , new KeyBoardSprite(ctx, '3')

  , new KeyBoardSprite(ctx, 'Space')
]

let enemyArray1 = [
  new EnemyClass(ctx,canvas.width/2,canvas.height/2,5)

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
  if (e.key === 'ArrowRight') {
    keys.r.pressed = 1;
    lastKey = 'r';
    keyBoardKeys[1].pressed = 1;
  } else if (e.key === 'ArrowLeft') {
    keys.l.pressed = 1;
    lastKey = 'l';
    keyBoardKeys[3].pressed = 1;
  } else if (e.key === 'ArrowUp') {
    keys.u.pressed = 1;
    lastKey = 'u';
    keyBoardKeys[0].pressed = 1;
  } else if (e.key === 'ArrowDown') {
    keys.d.pressed = 1;
    lastKey = 'd';
    keyBoardKeys[2].pressed = 1;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight') {
    keys.r.pressed = 0;
    player.maxAng = -45
    player.dtAng = 45
  } else if (e.key === 'ArrowLeft') {
    keys.l.pressed = 0;
    player.maxAng = -225
    player.dtAng = -135
  } else if (e.key === 'ArrowUp') {
    keys.u.pressed = 0;
    player.maxAng = -135
    player.dtAng = -45
  } else if (e.key === 'ArrowDown') {
    keys.d.pressed = 0;
    player.maxAng = 45
    player.dtAng = 135
  };

  if (e.key === ' ') {
    player.attacking = 1
  }

  if (e.key === '1') {
    player.currentPower = 0
    keyBoardKeys[4].pressed = 1;
  }
  if (e.key === '2') {
    player.currentPower = 1
    keyBoardKeys[5].pressed = 1;
  }
  if (e.key === '3') {
    player.currentPower = 2
    keyBoardKeys[6].pressed = 1;
  }
});

animate();

function animate() {

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  resizeCanvas()
  requestAnimationFrame(animate);
  player.draw();

  instruction1();
  //instruction2();
  //instruction3();
  handleEnemies();
  playerHealthBar.draw();

  // drawTextWithShadow(
  //   ctx,
  //   "Fear the thirteen",
  //   canvas.width/2,
  //   canvas.height * 0.1,
  //   60,
  //   "yellow"
  // )

  playerHealthBar.power = player.playerPowers[player.currentPower];
  playerHealthBar.mathfunction = player.playerMathFunction[player.currentFunction]

  if (keys.r.pressed && lastKey == 'r') { player.x += player.movementSpeed }
  else if (keys.l.pressed && lastKey == 'l') { player.x -= player.movementSpeed }
  else if (keys.d.pressed && lastKey == 'd') { player.y += player.movementSpeed }
  else if (keys.u.pressed && lastKey == 'u') { player.y -= player.movementSpeed }
}

function instruction1() {
  if (localStorage.getItem("DFTT-Tutorial1") != 1) {
    let x = canvas.width / 2
    let y = canvas.height * 0.25
    let pressedKeys = [];
    drawText(ctx, "press         to move", x, y, 50, "black");

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

    // if (allTrue(pressedKeys)) {
    //   localStorage.setItem('DFTT-Tutorial1',1);
    // }
  }
}
function instruction2() {
  if (localStorage.getItem("DFTT-Tutorial2") != 1) {
    let x = canvas.width / 2
    let y = canvas.height * 0.25
    let pressedKeys = [];
    drawText(ctx, "Press          to change attack power", x, y, 50, "black");

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

    // if (allTrue(pressedKeys)) {
    //   localStorage.setItem('DFTT-Tutorial2',1);
    // }
  }
}
function instruction3() {
  if (localStorage.getItem("DFTT-Tutorial3") != 1) {
    let x = canvas.width / 2
    let y = canvas.height * 0.25
    let pressedKeys = [];
    drawText(ctx, "See that enemy over there? ", x, y, 50, "black");
    drawText(ctx, "Get his health to 0 by pressing", x, y + 50, 50, "black");


    ctx.save();
    keyBoardKeys[7].draw();
    keyBoardKeys[7].width = 300
    keyBoardKeys[7].height = 50
    ctx.restore();

    keyBoardKeys[7].x = x - keyBoardKeys[7].width * 0.5
    keyBoardKeys[7].y = y + 100

    pressedKeys.push(keyBoardKeys[7].pressed)


    // if (allTrue(pressedKeys)) {
    //   localStorage.setItem('DFTT-Tutorial3',1);
    // }
  }
}


function handleEnemies() {
  enemyArray1.forEach(e => {
    if (e.alive) {
      e.draw();
     // e.move(player)
    };

    if (player.attacking &&

      circleRectColision(
        player.attX,
        player.attY,
        player.circleRadius,
        e.x,
        e.y,
        e.width,
        e.height
      )

    ) {
      e.damage(playerHealthBar.power, playerHealthBar.mathfunction)
    }

    if (!player.attacking) {
      e.damaged = 0;
    }
  });
}

function resizeCanvas() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}