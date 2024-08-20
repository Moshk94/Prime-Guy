import { PlayerClass, HealthBar, EnemyClass } from "./classess";
import { circleRectColision, getRandomInt } from "./helperFunctions";

const ctx = document.getElementById('canvas').getContext("2d");
let hpFloor = -20
let player = new PlayerClass(ctx);
let playerHealthBar = new HealthBar(ctx, 40);
let enemyArray1 = [
  new EnemyClass(ctx, getRandomInt(0, canvas.width), getRandomInt(0, canvas.height), getRandomInt(hpFloor, hpFloor * -1)),
  new EnemyClass(ctx, getRandomInt(0, canvas.width), getRandomInt(0, canvas.height), getRandomInt(hpFloor, hpFloor * -1)),
  new EnemyClass(ctx, getRandomInt(0, canvas.width), getRandomInt(0, canvas.height), getRandomInt(hpFloor, hpFloor * -1)),
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
  } else if (e.key === 'ArrowLeft') {
    keys.l.pressed = 1;
    lastKey = 'l';
  } else if (e.key === 'ArrowUp') {
    keys.u.pressed = 1;
    lastKey = 'u';
  } else if (e.key === 'ArrowDown') {
    keys.d.pressed = 1;
    lastKey = 'd';
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
  }
  if (e.key === '2') {
    player.currentPower = 1
  }
  if (e.key === '3') {
    player.currentPower = 2
  }
});

animate();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  requestAnimationFrame(animate);

  enemyArray1.forEach(e => {
    if (e.alive) {
      e.draw();
      e.move(player)
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

  player.draw();
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
