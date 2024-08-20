import { PlayerClass, HealthBar, EnemyClass } from "./classess";
const ctx = document.getElementById('canvas').getContext("2d");

let player = new PlayerClass(ctx);
let playerHealthBar = new HealthBar(ctx, 40);
let testEnemy = new EnemyClass(ctx, 40);

const MATHFUNCTIONS = ['+', '-', '×', '÷',];
const playerPower = [1, 3, 5]
let currentFunction = 0;

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
  } else if (e.key === 'ArrowLeft') {
    keys.l.pressed = 0;
  } else if (e.key === 'ArrowUp') {
    keys.u.pressed = 0;
  } else if (e.key === 'ArrowDown') {
    keys.d.pressed = 0;
  };

  if (e.key === ' ') {
    console.warn('You still need to code attacking')
    if (currentFunction >= 3) { currentFunction = -1 }
    currentFunction++;
    playerHealthBar.mathfunction = MATHFUNCTIONS[currentFunction]
  }

  if (e.key === '1') {
    playerHealthBar.power = playerPower[0]
  }
  if (e.key === '2') {
    playerHealthBar.power = playerPower[1]
  }
  if (e.key === '3') {
    playerHealthBar.power = playerPower[2]
  }
});

animate();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  requestAnimationFrame(animate);
  // testEnemy.draw();
  player.draw();
  playerHealthBar.draw();

  if (keys.r.pressed && lastKey == 'r') { player.x += player.movementSpeed }
  else if (keys.l.pressed && lastKey == 'l') { player.x -= player.movementSpeed }
  else if (keys.d.pressed && lastKey == 'd') { player.y += player.movementSpeed }
  else if (keys.u.pressed && lastKey == 'u') { player.y -= player.movementSpeed }
}
