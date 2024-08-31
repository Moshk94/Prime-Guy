import { getRandomArbitrary, drawText, rads } from './helperFunctions';

export class GameObject {
    constructor(ctx) {
        // this.x = 350;
        // this.y = 218.5;
        this.ctx = ctx
        // this.width = 50
        // this.height = 50
        this.clock = {
            attClock: 0,
            dmgClock: 0,
            dt: 0,
            s: 0,
        };
    };
};

export class PlayerClass extends GameObject {
    constructor(ctx, i) {
        super(ctx);
        this.x = canvas.width / 2
        this.y = canvas.height / 2
        this.movementSpeed = 5;
        this.attacking = 0;
        this.playerMathFunction = ['+', '-', '×', '÷'];
        this.currentFunction = 0;
        this.attDir = 3
        this.attX = 0;
        this.attY = 0;
        this.alive = 1;
        this.invincible = 0
        this.lives = 5;
        this.power = 1;
        this.i = i;
        this.height = this.i.height * 0.85
        this.width = this.i.width / 18
        this.frames = {
            current: 0,
            max: 62 * 12
        }
    };

    draw() {
        this.clock.dt++
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

        // this.ctx.save()
        // this.ctx.beginPath();
        // this.ctx.rect(this.x - this.i.width / 336, this.y - this.i.height / 2, this.i.width / 168, 50)
        // this.ctx.fill();
        // this.ctx.restore();
        // console.log(this.attDir)
        if (this.attDir == 3) {
            // console.log(this.attacking)
             if (this.attacking){
                this.frames.max = 62 * 28
                this.attY = 25
                this.attX = 0
             }else if (this.moving) {
                this.frames.min = 62 * 14
                this.frames.max = 62 * 21
            } else {
                this.frames.min = 0
                this.frames.max = 62 * 12
            }
        }

        if (this.attDir == 2 || this.attDir == 4) {
            if (this.attacking){
                this.frames.max = 62 * 52
                this.attY = 0
                this.attX = 40
             }else if (this.moving) {
                this.frames.min = 62 * 41
                this.frames.max = 62 * 47
            } else {
                this.frames.min = 62 * 29
                this.frames.max = 62 * 39
            }
        }

        if (this.attDir == 1) {
            if (this.attacking){
                this.frames.max = 62 * 79
                this.attY = -25
                this.attX = 0
             }else if (this.moving) {
                this.frames.min = 62 * 66
                this.frames.max = 62 * 73
            } else {
                this.frames.min = 62 * 54
                this.frames.max = 62 * 64
            }
        }
        this.ctx.save();
        if(this.attDir == 4){
            this.ctx.translate(canvas.width, 0);
            this.ctx.scale(-1, 1);
            this.attY = 0
            this.attX = -40
        }
        this.ctx.drawImage(
            this.i
            ,this.frames.current
            // , 62*23//this.frames.current
            , 0
            , this.i.width / 96
            , this.i.height
            , this.x - this.i.width / 168
            , this.y - this.i.height
            , this.i.width / 48
            , this.i.height * 2);

        this.ctx.restore();

        // console.log(this.attDir)

        // this.ctx.save()
        // this.ctx.fillStyle = "rgba(255,0,0,0.5)";
        // this.ctx.beginPath();
        // this.ctx.arc(this.x + this.attX, this.y + this.attY, 40, 0, 2 * Math.PI);
        // this.ctx.fill();
        // this.ctx.restore();

        if (this.clock.dt % 3 == 0) {

            if (this.frames.current >= this.frames.min && this.frames.current < this.frames.max) {
                this.frames.current += 62
            } else {
                this.frames.current = this.frames.min
                if(this.attacking){
                    this.attacking = 0;
                    if (this.currentFunction >= 3) { this.currentFunction = -1 }
                    this.currentFunction++;
                }
            }
        }
    }
    drawPlayerInfo() {
        drawText(this.ctx, `×${this.lives}`, 80, 30, 60, 'white')
        drawText(this.ctx, `${this.playerMathFunction[this.currentFunction]}${this.power}`, 125, 95, 60, 'white');
    }
    attack() {
        //TODO: allow user to strafe when moving and attacking
        // if (this.attDir == 1) {
        //     this.attY = this.y
        //     this.attX = this.x + this.width / 2;
        // } else if (this.attDir == 2) {
        //     this.attY = this.y + this.height / 2
        //     this.attX = this.x + this.width
        // } else if (this.attDir == 4) {
        //     this.attY = this.y + this.height / 2
        //     this.attX = this.x
        // } else {
        //     this.attX = this.x + this.width / 2;
        //     this.attY = this.y + this.height
        // }

        if (this.clock.attClock < 1) {
            this.clock.attClock++
        }

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
            this.shadowy = this.y
        } else if (this.y + this.height / 2 < player.y) {
            this.y += this.movementSpeed * followPlayer
            this.shadowy = this.y
        }

        if (this.x + this.width / 2 > canvas.width/2) {
            this.x -= this.movementSpeed * followPlayer
            this.shadowx = this.x
        } else if (this.x + this.width / 2 < player.x) {
            this.x += this.movementSpeed * followPlayer
            this.shadowx = this.x
        }
    }
}
