import { clamp, getRandomArbitrary, drawText, rads } from './helperFunctions';

export class GameObject {
    constructor(ctx) {
        this.x = 350;
        this.y = 218.5;
        this.ctx = ctx
        this.width = 50
        this.height = 50
        this.clock = {
            attClock: 0,
            dmgClock: 0,
            dt: 0,
            s: 0,
        };
    };

    draw() {
        this.ctx.beginPath();
        this.ctx.rect(this.x, this.y, this.width, this.height)
        this.ctx.fill();

    }
};

export class PlayerClass extends GameObject {
    constructor(ctx) {
        super(ctx);
        this.x = ctx.canvas.width * 0.5 - this.width / 2 - 60
        this.y = ctx.canvas.height * 0.5 - this.height / 2
        this.movementSpeed = 5;
        this.attacking = 0;
        this.radius = 25;
        this.circleRadius = 35;
        this.playerMathFunction = ['+', '-', '×', '÷'];
        this.currentFunction = 0;
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
        if (this.lives > 0) { this.alive = 1 } else { this.alive = 0 };
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
        this.lives = h
        this.damaged = 0;
        this.alive = 1;
        this.remainder = 0;
        this.shadowx = this.x;
        this.shadowy = this.y;
        this.angle = 0
    };
    draw() {
        this.hover();
        if (this.lives == 13) {
            this.alive = 0;
        }
        let fontSize = 100;
        this.ctx.save();
        this.ctx.font = `${fontSize}px q`
        let txt = this.lives;
        let fM = this.ctx.measureText(txt)
        this.width = fM.width - (fontSize / 10);
        this.height = fM.actualBoundingBoxAscent + fM.actualBoundingBoxDescent;

        this.ctx.save();
        this.ctx.fillStyle = "rgba(0,0,0,0.1)";
        this.ctx.beginPath();
        this.ctx.ellipse(this.shadowx + this.width / 2, this.shadowy + this.height * 1.6, 15, (75 - 15 * this.hoverOffset - 12), Math.PI / 2, 0, 2 * Math.PI);

        this.ctx.fill();
        this.ctx.restore();
        
        this.ctx.save();
        this.ctx.fillStyle = "darkred";
        this.ctx.fillText(txt, this.x, this.y + this.height);
        this.ctx.restore();
    }
    hover() {
        this.angle++
        this.hoverOffset = 0.2 * Math.sin(rads(this.angle))
        this.y -= this.hoverOffset
    }
    damage(player) {
        if (!this.damaged) {
            this.damaged = 1;
            ['+', '-', '×', '÷',]

            if (player.currentFunction == 0) {
                this.lives += player.power
            } else if (player.currentFunction == 1) {
                this.lives -= player.power
            } else if (player.currentFunction == 2) {
                this.lives *= player.power
            } else if (player.currentFunction == 3) {
                if (this.lives % player.power == 0 || this.lives % player.power == -0) {
                    this.lives /= player.power
                } else {
                    if (!this.special) {
                        this.lives = Math.floor(this.lives / player.power)
                        this.remainder = this.lives % player.power
                        player.lives--
                    }
                }
            }
        }
    }
    move(player) {
        let followPlayer = 1
        if (!player.alive) { followPlayer = -1 }
        if (this.y + this.height / 2 > player.y + player.height) {
            this.y -= this.movementSpeed * followPlayer
            this.shadowy -= this.movementSpeed * followPlayer
        } else if (this.y + this.height / 2 < player.y) {
            this.y += this.movementSpeed * followPlayer
            this.shadowy += this.movementSpeed * followPlayer
        }

        if (this.x + this.width / 2 > player.x + player.width) {
            this.x -= this.movementSpeed * followPlayer
            this.shadowx -= this.movementSpeed * followPlayer
        } else if (this.x + this.width / 2 < player.x) {
            this.x += this.movementSpeed * followPlayer
            this.shadowx += this.movementSpeed * followPlayer
        }
    }
}
