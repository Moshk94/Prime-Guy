import { getRandomInt } from "./helperFunctions";

let ctx  = document.getElementById('canvas').getContext("2d");

window.addEventListener('keyup', (e) => {
  if (e.key === ' ') {

  }
});

animate();

function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height)
  requestAnimationFrame(animate);
}