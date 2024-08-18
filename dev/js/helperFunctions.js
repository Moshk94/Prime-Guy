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