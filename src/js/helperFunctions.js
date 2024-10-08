export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomNumbersWithFixedSum(quantity, sum,h) {
    if (quantity === 1) { return [sum]; }

    const randomNum = getRandomInt(h, sum);
    return [
        randomNum,
        ...randomNumbersWithFixedSum(quantity - 1, sum - randomNum,h),
    ];
}

export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

export function circleRectCollision(cx, cy, radius, rx, ry, rw, rh) {
    let testX = cx;
    let testY = cy;
    if (cx < rx) { testX = rx } else if (cx > rx + rw) { testX = rx + rw };
    if (cy < ry) { testY = ry; } else if (cy > ry + rh) { testY = ry + rh };

    let distX = cx - testX;
    let distY = cy - testY;
    let distance = Math.sqrt((distX * distX) + (distY * distY));

    if (distance <= radius) {
        return true;
    }
    return false;
}


export function rectRectCollision( r1x,  r1y,  r1w,  r1h,  r2x,  r2y,  r2w,  r2h){
    
  if (r1x + r1w >= r2x &&   
    r1x <= r2x + r2w &&  
    r1y + r1h >= r2y && 
    r1y <= r2y + r2h) { 
      return true;
}
return false;
}

export function drawText(ctx, text, centerX, centerY, fontsize, color = '#333', s = 0, a = 'center') {
    ctx.save();
    ctx.filter = `drop-shadow(0px ${s}px 0px #000000)`;
    ctx.font = `${fontsize}px p`
    ctx.textAlign = a;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, centerX, centerY);
    ctx.restore();
};

export const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));

export const lerp = (x, y, a) => x * (1 - a) + y * a;

export const invlerp = (x, y, a) => clamp((a - x) / (y - x));

export const SpecInvlerp = (x, y, a) => ((a - x) / (y - x));

export const rads = (d) => d * 0.01745;

export const allTrue  = (arr, fn = Boolean) => arr.every(fn);
