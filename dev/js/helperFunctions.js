export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomNumbersWithFixedSum(quantity, sum) {
    if (quantity === 1) { return [sum]; }

    const randomNum = getRandomInt(0, sum);
    return [
        randomNum,
        ...randomNumbersWithFixedSum(quantity - 1, sum - randomNum),
    ];
}

export function circleRectColision(cx, cy, radius, rx, ry, rw, rh) {
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

export const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));

export const lerp = (x, y, a) => x * (1 - a) + y * a;

export const invlerp = (x, y, a) => clamp((a - x) / (y - x));

export const SpecInvlerp = (x, y, a) => ((a - x) / (y - x));

export const rads = (d) => d * 0.01745;