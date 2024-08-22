import hpBarSrc from '/imgs/r.png'
import { clamp, SpecInvlerp, rads, getRandomArbitrary, getRandomInt, drawText } from './helperFunctions';


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
        this.x = ctx.canvas.width * 0.25 - this.width / 2
        this.y = ctx.canvas.height * 0.5 - this.height / 2
        this.movementSpeed = 5;
        this.attacking = 0
        this.radius = 25
        this.circleRadius = 35
        this.playerPowers = [1, 3, 5]
        this.playerMathFunction = ['+', '-', '×', '÷']
        this.currentPower = 0;
        this.currentFunction = 0;
        this.clock = 0;
        this.attDir = 3
        this.attX = this.x + this.width / 2;
        this.attY = this.y + this.height
    };
    draw() {
        super.draw();

        if (this.attacking) {
            this.attack();
        } else {
            this.clock = 0
        }
    }
    attack() {
        //TODO: allow user to strafe when moving and attacking


        if (this.attDir == 1) {
            this.attY = this.y
            this.attX = this.x + this.width / 2;
        } else if (this.attDir == 2) {
            this.attY = this.y + this.height / 2
            this.attX = this.x + this.width
        } else if (this.attDir == 4) {
            this.attY = this.y + this.height / 2
            this.attX = this.x
        } else {
            this.attX = this.x + this.width / 2;
            this.attY = this.y + this.height
        }

        if (this.clock < 1) {
            this.clock++
        } else {
            this.attacking = 0
            if (this.currentFunction >= 3) { this.currentFunction = -1 }
            this.currentFunction++;
        }


        this.ctx.save()
        this.ctx.fillStyle = "rgba(255,0,0,0.5)";
        this.ctx.beginPath();
        this.ctx.arc(this.attX, this.attY, this.circleRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
    }
}

export class EnemyClass extends GameObject {
    constructor(ctx, x, y, h) {
        super(ctx);
        this.movementSpeed = getRandomArbitrary(0.01, 1);
        this.width = 100;
        this.height = this.width;
        this.y = y;
        this.x = x;
        this.healthWidth = this.width * 2;
        this.maxhealth = h;
        this.currentHealth = h
        this.damaged = 0;
        this.alive = 1
    };
    draw() {
        super.draw();
        let healthRatio = clamp(this.currentHealth / this.maxhealth, -1, 1)
        let greenHealthOffset = 0;
        if (this.currentHealth == 0) {
            this.alive = 0;
        };
        if (this.currentHealth < 0) {
            greenHealthOffset = this.width * 2
            if (this.healthRatio > 0) {
                healthRatio *= -1
            }
        }

        this.imageHeight = this.healthWidth / 22.85
        this.ctx.drawImage(hpBarImg, this.x - (this.healthWidth / 2 - this.width / 2),
            this.y - this.width / 6, this.healthWidth, this.imageHeight);

        this.ctx.save();

        this.color = `brightness(150%) hue-rotate(90deg)`;
        this.ctx.filter = this.color;
        this.ctx.drawImage(hpBarImg, greenHealthOffset + this.x - (this.healthWidth / 2 - this.width / 2),
            this.y - this.width / 6, (this.healthWidth * healthRatio), this.imageHeight);

        drawText(
            this.ctx,
            this.currentHealth,
            this.x + (this.width / 2),
            this.y - this.width / 6,
            25,
            'white'
        )
        this.ctx.restore();
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
                } else {
                    console.log('Damage Player')
                }
            }
        }
    }
    move(player) {
        if (this.y + this.height / 2 > player.y + player.height) {
            this.y -= this.movementSpeed
        } else if (this.y + this.height / 2 < player.y) {
            this.y += this.movementSpeed
        }

        if (this.x + this.width / 2 > player.x + player.width) {
            this.x -= this.movementSpeed
        } else if (this.x + this.width / 2 < player.x) {
            this.x += this.movementSpeed
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
        this.ctx.font = `48px p`
        this.ctx.fillText(`${this.mathfunction}${this.power}`, this.x, this.y * 1.05);
    }
}