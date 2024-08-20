import { PlayerClass, HealthBar, EnemyClass } from "./classess";
import { circleRectColision } from "./helperFunctions";
const ctx = document.getElementById('canvas').getContext("2d");

let player = new PlayerClass(ctx);
let playerHealthBar = new HealthBar(ctx, 40);
let testEnemy = new EnemyClass(ctx, 40);



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
    // player.dtAng = player.maxAng
    console.warn('You still need to code attacking')

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
  testEnemy.draw();
  player.draw();
  playerHealthBar.draw();
  playerHealthBar.power = player.playerPowers[player.currentPower];
  playerHealthBar.mathfunction = player.playerMathFunction[player.currentFunction]
  if(player.attacking && 

    circleRectColision(
      player.attX,
      player.attY,
      player.circleRadius,
      testEnemy.x,
      testEnemy.y,
      testEnemy.width,
      testEnemy.height
    )

  ){
    testEnemy.damage( playerHealthBar.power, playerHealthBar.mathfunction)
  }

  if(!player.attacking){
    testEnemy.damaged = 0;
  }

  if (keys.r.pressed && lastKey == 'r') { player.x += player.movementSpeed }
  else if (keys.l.pressed && lastKey == 'l') { player.x -= player.movementSpeed }
  else if (keys.d.pressed && lastKey == 'd') { player.y += player.movementSpeed }
  else if (keys.u.pressed && lastKey == 'u') { player.y -= player.movementSpeed }
}
