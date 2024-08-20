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

export const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));

export const lerp = (x, y, a) => x * (1 - a) + y * a;

export const invlerp = (x, y, a) => clamp((a - x) / (y - x));

export const SpecInvlerp = (x, y, a) => ((a - x) / (y - x));

