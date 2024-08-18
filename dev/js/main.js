let ctx  = document.getElementById('canvas').getContext("2d");

canvas.addEventListener('mouseup', (e) => {
  console.log('Do something with the left mouse button');
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    console.log('Do something with the right key');
  }

  if (e.key === 'ArrowLeft') {
    console.log('Do something with the left key');
  }

  if (e.key === 'ArrowDown') {
    console.log('Do something with the down key');
  }

  if (e.key === 'ArrowUp') {
    console.log('Do something with the up key');
  }
});


animate();

function animate() {
  requestAnimationFrame(animate);
}