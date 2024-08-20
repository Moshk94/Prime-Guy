import hpBarSrc from '/imgs/r.png'
import { clamp, SpecInvlerp, rads } from './helperFunctions';

export const hpBarImg = new Image();
hpBarImg.src = hpBarSrc;

export class GameObject {
    constructor(ctx) {
        this.x = 350;
        this.y = 218.5;
        this.ctx = ctx
        this.width = 50
        this.height = 50
    };

    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height)
        this.ctx.fill()
    }
};

export class PlayerClass extends GameObject {
    constructor(ctx) {
        super(ctx);
        this.movementSpeed = 5;
        this.attacking = 0
        this.dtAng = 135
        this.maxAng = 45
        this.attX = this.x
        this.attY = this.y + 50
        this.radius = 25
        this.circleRadius = 15
        this.playerPowers = [1, 3, 5]
        this.playerMathFunction = ['+', '-', '×', '÷',]
        this.currentPower = 0;
        this.currentFunction = 0;
    };
    draw() {
        super.draw();
        if (this.attacking) {
            this.attack();
        } else {
            this.dtAng = this.maxAng + 90
        }
    }
    attack() {
        //TODO: allow user to strafe when moving and attacking
        if (this.dtAng > this.maxAng) {
            this.dtAng -= 10
        } else {
            this.attacking = 0
            if (this.currentFunction >= 3) { this.currentFunction = -1 }
            this.currentFunction++;
        }
        this.attX = this.x + this.radius + Math.cos(rads(this.dtAng)) * 40

        this.attY = this.y + this.radius + Math.sin(rads(this.dtAng)) * 40

        this.ctx.save()
        this.ctx.fillStyle = "red";
        this.ctx.beginPath();
        this.ctx.arc(this.attX, this.attY, this.circleRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }
}

export class EnemyClass extends GameObject {
    constructor(ctx) {
        super(ctx);
        this.movementSpeed = 5;
        this.width = 50;
        this.imageWidth = 100;
        this.maxhealth = 150;
        this.currentHealth = 0
        this.damaged = 0;

    };
    draw() {
        super.draw();
        let lerp1 = SpecInvlerp(
            Math.min(13, this.maxhealth),
            Math.max(13, this.maxhealth),
            this.currentHealth
        )
        if (this.maxhealth < 13) { lerp1 -= 1 }
        this.imageHeight = this.imageWidth / 22.85
        this.ctx.drawImage(hpBarImg, this.x - (this.imageWidth / 2 - this.width / 2),
            this.y - 10, this.imageWidth, this.imageHeight);


        this.ctx.save();
        this.ctx.filter = this.color;
        this.color = `brightness(150%) hue-rotate(90deg)`;
        let xcord = this.x - (this.imageWidth / 2 - this.width / 2);

        if (this.currentHealth < 13) { xcord += this.imageWidth; }

        this.ctx.drawImage(hpBarImg,
            xcord,
            this.y - 10, clamp(this.imageWidth * lerp1, this.imageWidth * -1, this.imageWidth), this.imageHeight);
        this.ctx.restore();

        this.ctx.font = "20px serif";
        this.ctx.fillText(`${this.currentHealth}`, this.x + this.width / 2, this.y * 0.90);
    }
    damage(v, p) {
        if (!this.damaged) {
            this.damaged = 1;
            ['+', '-', '×', '÷',]
            if (p == '+') {
                this.currentHealth += v
            } else if (p == '-') {
                this.currentHealth -= v
            } else if (p == '×') {
                this.currentHealth *= v
            } else if (p == '÷') {
                if (this.currentHealth % v == 0 || this.currentHealth % v == -0) {
                    this.currentHealth /= v
                }else {
                    console.log('Damage Player')
                }
            }
        }
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