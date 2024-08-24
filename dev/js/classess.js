import hpBarSrc from '/imgs/r.png'
import { clamp, getRandomArbitrary,drawText } from './helperFunctions';

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
        this.attacking = 0;
        this.radius = 25;
        this.circleRadius = 35;
        this.playerMathFunction = ['+', '-', '×', '÷'];
        this.currentFunction = 0;
        this.clock = {
            attClock: 0,
            dmgClock: 0
        };
        this.attDir = 3
        this.attX = this.x + this.width / 2;
        this.attY = this.y + this.height
        this.alive = 1;
        this.invincible = 0
        this.lives = 1
        this.currentMathfunction = '+';
        this.power = 1;
    };
    draw() {
        super.draw();
        this.drawPlayerInfo();

        if (this.attacking) {
            this.attack();
        } else {
            this.clock.attClock = 0
        }

        if (this.invincible) {
            this.clock.dmgClock++
        }
        if (this.clock.dmgClock > 90) {
            this.clock.dmgClock = 0
            this.invincible = 0
        }
    }
    drawPlayerInfo() {
        drawText(this.ctx, `❤️ x${this.lives}`, 80, 30, 60, 'white')
        drawText(this.ctx, `⚔️`, 36, 95, 60, 'white')
        drawText(this.ctx, `${this.playerMathFunction[this.currentFunction]}${this.power}`, 125, 95, 60, 'white')
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

        if (this.clock.attClock < 1) {
            this.clock.attClock++
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
    damagePlayer() {
        this.invincible = 1;
        this.lives--
        if (this.lives <= 0) {
            this.alive = 0
        }
    }
}

export class EnemyClass extends GameObject {
    constructor(ctx, x, y, h) {
        super(ctx);
        this.movementSpeed = getRandomArbitrary(0.1, 1);
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
        let healthRatio = Math.abs(clamp(this.currentHealth / this.maxhealth, -1, 1))

        let greenHealthOffset = 0;
        if (this.currentHealth == 0) {
            this.alive = 0;
        };
        if (this.currentHealth < 0) {


            greenHealthOffset = this.width * 2
            if (this.currentHealth < 0) {
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
    damage(player) {
        if (!this.damaged) {
            this.damaged = 1;
            ['+', '-', '×', '÷',]
            // console.log(player.currentFunction)
            if (player.currentFunction == 0) {
                console.log(player.power)
                this.currentHealth += player.power
            } else if (player.currentFunction == 1) {
                this.currentHealth -= player.power
            } else if (player.currentFunction == 2) {
                this.currentHealth *= player.power
            } else if (player.currentFunction == 3) {
                if (this.currentHealth % player.power == 0 || this.currentHealth % player.power == -0) {
                    this.currentHealth /= player.power
                } else {
                    player.lives--
                }
            }
        }
    }
    move(player) {
        let followPlayer = 1
        if (!player.alive) { followPlayer = -1 }
        if (this.y + this.height / 2 > player.y + player.height) {
            this.y -= this.movementSpeed * followPlayer
        } else if (this.y + this.height / 2 < player.y) {
            this.y += this.movementSpeed * followPlayer
        }

        if (this.x + this.width / 2 > player.x + player.width) {
            this.x -= this.movementSpeed * followPlayer
        } else if (this.x + this.width / 2 < player.x) {
            this.x += this.movementSpeed * followPlayer
        }
    }
}
