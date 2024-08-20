import hpBarSrc from '/imgs/r.png'

export const hpBarImg = new Image();
hpBarImg.src = hpBarSrc;

export class GameObject {
    constructor(ctx) {
        this.x = 350;
        this.y = 218.5;
        this.ctx = ctx
    };

    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, 50, 50)
        this.ctx.fill()
    }
};

export class PlayerClass extends GameObject {
    constructor(ctx) {
        super(ctx);
        this.movementSpeed = 5;
    };
    draw() {
        super.draw();
    }
}

export class EnemyClass extends GameObject {
    constructor(ctx) {
        super(ctx);
        this.movementSpeed = 5;
        this.width = 50;
        this.imageWidth = 100;
        this.maxhealth = 0;
    };
    draw() {
        super.draw();
        this.imageHeight = this.imageWidth / 22.85
        this.ctx.drawImage(hpBarImg, this.x - (this.imageWidth / 2 - this.width / 2),
            this.y - 10, this.imageWidth, this.imageHeight);
        this.ctx.save();

        this.ctx.filter = this.color;
        this.color = `brightness(150%) hue-rotate(90deg)`;
        this.ctx.drawImage(hpBarImg, this.x - (this.imageWidth / 2 - this.width / 2),
            this.y - 10, this.imageWidth - this.maxhealth, this.imageHeight);
        this.ctx.restore();
    }
}

export class HealthBar {
    constructor(ctx, width) {
        this.ctx = ctx;
        this.width = width;
        this.lives = 5;
        this.x = width * 1.1;
        this.y = width;
        this.mathfunction = '+';
        this.power = 1;
    }

    draw() {
        //TODO: Tidy up draw function
        const a = 2 * Math.PI / 6;
        const r = this.width;

        const x2 = this.x + (this.width * 1.1)
        const y2 = this.y + (this.width * 0.15)
        let ratio = 2.5
        let healthWidth = (this.width / ratio)
        let height = (this.width / 1.75) * 1.2

        this.ctx.save();
        this.ctx.lineWidth = r * 0.1;
        this.ctx.beginPath();
        for (var i = 0; i < 6; i++) {
            this.ctx.lineTo(this.x + r * Math.cos(a * i), this.y + r * Math.sin(a * i));
        }
        this.ctx.closePath();

        this.ctx.fillStyle = "white";
        this.ctx.fill();

        this.ctx.stroke();
        this.ctx.restore();
        let spacing = healthWidth * 1.5
        this.ctx.save();
        this.ctx.lineWidth = r * 0.1;
        for (var i = 0; i < this.lives; i++) {

            this.ctx.beginPath();
            this.ctx.lineTo(x2 + (i * spacing), y2);
            this.ctx.lineTo(x2 + (healthWidth) + (i * spacing), y2);
            this.ctx.lineTo(x2 + (healthWidth * Math.cos(a * 1.5)) + (i * spacing), y2 + height);
            this.ctx.lineTo(x2 - (healthWidth) + (i * spacing), y2 + height);
            this.ctx.closePath();

            this.ctx.stroke();
            this.ctx.fillStyle = "darkred";
            this.ctx.fill();
        };

        this.ctx.restore();
        this.drawNumberPower()
    }
    drawNumberPower() {
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        this.ctx.font = "48px serif";
        this.ctx.fillText(`${this.mathfunction}${this.power}`, this.x, this.y * 1.05);
    }
}