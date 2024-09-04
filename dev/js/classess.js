import { getRandomArbitrary, drawText, rads } from './helperFunctions';

export class GameObject {
    constructor(ctx) {
        this.x = -50;
        this.ctx = ctx
        this.width = 0;
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
    };
};

export class PlayerClass extends GameObject {
    constructor(ctx, i) {
        super(ctx);
        this.x = canvas.width / 2
        this.y = canvas.height / 2
        this.movementSpeed = 5;
        this.attacking = 0;
        this.playerMathFunction = ['+', '-', '÷'];
        this.currentFunction = 0;
        this.attDir = 3
        this.attX = 0;
        this.attY = 0;
        this.invincible = 0
        this.lives = 5;
        this.power = 1;
        this.i = i;
        this.height = this.i.height * 0.85
        this.width = this.i.width / 18
        this.frames = {
            current: 62 * 81,
            max: 62 * 12
        }
        this.x2 = 0;
    };

    draw() {
        this.clock.dt++
        if (this.lives > 0) { this.alive = 1 } else { this.alive = 0 };
        if (this.attacking && this.clock.attClock < 1) {
            this.clock.attClock++
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

        this.ctx.save();
        if (!this.alive) {
            this.frames.min = 62 * 81
            this.frames.max = 62 * 93
        } else if (this.attDir == 3) {
            if (this.attacking) {
                this.frames.max = 62 * 28
                this.attY = 50
                this.attX = 0
            } else if (this.moving) {
                this.frames.min = 62 * 14
                this.frames.max = 62 * 21
            } else {
                this.frames.min = 0
                this.frames.max = 62 * 12
            }
        } else if (this.attDir == 2 || this.attDir == 4) {
            if (this.attacking) {
                this.frames.max = 62 * 52
                this.attY = 0
                this.attX = 80
            } else if (this.moving) {
                this.frames.min = 62 * 41
                this.frames.max = 62 * 47
            } else {
                this.frames.min = 62 * 29
                this.frames.max = 62 * 39
            }
        } else if (this.attDir == 1) {
            if (this.attacking) {
                this.frames.max = 62 * 79
                this.attY = -50
                this.attX = 0
            } else if (this.moving) {
                this.frames.min = 62 * 66
                this.frames.max = 62 * 73
            } else {
                this.frames.min = 62 * 54
                this.frames.max = 62 * 64
            }
        } if (this.attDir == 4) {
            this.ctx.translate(canvas.width, 0);

            this.ctx.scale(-2, 2);
            this.attY = 0
            this.attX = -80
        } else {
            this.ctx.scale(2, 2);}

        if (this.clock.dmgClock > 0 && this.clock.dmgClock < 15 && this.alive) {
            this.ctx.filter = `brightness(20)`;
        }
        if (this.clock.dmgClock >= 15 && this.invincible && this.alive) {
            this.ctx.filter = `opacity(0.5)`;
        }
        this.ctx.drawImage(
            this.i
            , this.frames.current
            , 0
            , this.i.width / 96
            , this.i.height
            , canvas.width / 4 - 36
            , canvas.height / 4 - 54
            , this.i.width / 48
            , this.i.height * 2);

        this.ctx.restore();

        if (this.clock.dt % 3 == 0) {
            if (this.frames.current >= this.frames.min && this.frames.current < this.frames.max) {
                this.frames.current += 62
            } else {
                if (this.alive) {
                    this.frames.current = this.frames.min
                    if (this.attacking) {
                        this.attacking = 0;
                        if (this.currentFunction >= 2) { this.currentFunction = -1 }
                        this.currentFunction++;
                    }
                }
            }
        };
    }
    drawPlayerInfo(s) {
        if (this.attDir == 4) {
            this.x2 = 100;
        } else if (this.attDir == 2){
            this.x2 = 0;
        };
        for (let i = 5; i > 0; i--) {
            this.ctx.save();
            if (!(5 - this.lives < i)) {this.ctx.filter = `brightness(0)`;}
            this.ctx.drawImage(s, canvas.width / 2 - this.i.width / 96 + this.x2, canvas.height / 2 + (this.i.height * 0.3 * i) - 55);
            this.ctx.restore();
        }
        drawText(this.ctx, `${this.playerMathFunction[this.currentFunction]}${this.power}`, this.x * 0.995, this.y - this.height * 1.3, 25, 'white');
    }
    damagePlayer() {
        this.invincible = 1;
        this.lives--
        if (this.lives <= 0) { this.frames.current = 62 * 81 }
    }
}

export class EnemyClass extends GameObject {
    constructor(ctx, x, y, h, s = 0.1) {
        super(ctx);

        this.speedOffset = getRandomArbitrary(-0.05, 0.1);
        this.movementSpeed = s;
        this.width = 100;
        this.height = this.width;
        this.y = y;
        this.x = x;
        this.lives = h
        this.damaged = 0;
        this.alive = 1;
        this.remainder = 0;
        this.angle = 0
    };
    draw() {
        this.hover();
        if (this.lives == 13) { this.alive = 0; }
        let fontSize = 100;
        this.ctx.save();
        this.ctx.font = `${fontSize}px q`
        let txt = this.lives;
        let fM = this.ctx.measureText(txt)
        this.width = fM.width - (fontSize / 10);
        this.height = fM.actualBoundingBoxAscent + fM.actualBoundingBoxDescent;

        this.ctx.save();
        this.ctx.filter = `drop-shadow(-9px 100px 20px #000000)`;
        if(this.damaged){
            this.ctx.fillStyle = "yellow";
        } else {
            this.ctx.fillStyle = "darkred";
        };
        
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
            if(player.attDir == 3){
                this.y+= 75
            } else if(player.attDir == 1){
                this.y-=75
            } else if(player.attDir == 2){
                this.x+=75
            } else if(player.attDir == 4){
                this.x-=75
            }

            this.damaged = 1;
            ['+', '-', '×', '÷',]

            if (player.currentFunction == 0) {
                this.lives += player.power
            } else if (player.currentFunction == 1) {
                this.lives -= player.power
            } else if (player.currentFunction == 2) {
                if (this.lives % player.power == 0 || this.lives % player.power == -0) {
                    this.lives /= player.power
                } else {
                    if (!this.special) {
                        this.lives = Math.floor(this.lives / player.power)
                        this.remainder = this.lives % player.power
                    }
                }
            }
        }
    }
    move(player) {
        let followPlayer = 1
        if (!player.alive) { followPlayer = -1 }
        if (this.y + this.height / 2 > player.y + player.height) {
            this.y -= this.movementSpeed * followPlayer;
        } else if (this.y + this.height / 2 < player.y) {
            this.y += this.movementSpeed * followPlayer;
        };

        if (this.x + this.width / 2 > canvas.width / 2) {
            this.x -= this.movementSpeed * followPlayer;
        } else if (this.x + this.width / 2 < player.x) {
            this.x += this.movementSpeed * followPlayer;
        };
    }
}
