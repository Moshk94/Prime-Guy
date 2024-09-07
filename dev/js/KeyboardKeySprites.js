import { drawText } from "./helperFunctions";

export class KeyBoardSprite {
    constructor(ctx, txt) {
        this.letter = txt;
        this.ctx = ctx;
    }

    draw() {
        let pressedOffset = 0.90;
        let textOffset = 0;
        const cornerRadius = this.height / 10;
        const fontSize = this.height / 1.3;

        if (this.pressed) {
            pressedOffset = 0.95;
            textOffset = this.height - (this.height * pressedOffset)
        }

        this.ctx.lineWidth = 3;

        //Background
        this.ctx.beginPath();
        this.ctx.roundRect(this.x, this.y, this.width, this.height, [cornerRadius]);
        this.ctx.fill();
        this.ctx.stroke();

        // Foreground
        this.ctx.fillStyle = '#cdcdcd';
        this.ctx.beginPath();
        this.ctx.roundRect(this.x, this.y, this.width, this.height * pressedOffset, [cornerRadius]);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Text
        if (this.letter.includes('Arrow')) {
            let yOffSet = 0
            let xOffSet = 0
            this.ctx.save();
            if(this.letter == 'rArrow'){
                if(!this.pressed){xOffSet = -(this.width/10)}
                this.ctx.translate((this.x+(this.width/2)), (this.y+(this.height/2)));
                this.ctx.rotate((90 * Math.PI) / 180);
                this.ctx.translate(-(this.x+(this.width/2)), -(this.y+(this.height/2)));
            }
            if(this.letter == 'lArrow'){
                if(!this.pressed){xOffSet = +(this.width * 0.1)}
                this.ctx.translate((this.x+(this.width/2)), (this.y+(this.height/2)));
                this.ctx.rotate((-90 * Math.PI) / 180);
                this.ctx.translate(-(this.x+(this.width/2)), -(this.y+(this.height/2)));
            }
            if(this.letter == 'dArrow'){
                if(!this.pressed){yOffSet = (this.height * 0.1)}
                this.ctx.translate((this.x+(this.width/2)), (this.y+(this.height/2)));
                this.ctx.rotate((180 * Math.PI) / 180);
                this.ctx.translate(-(this.x+(this.width/2)), -(this.y+(this.height/2)));
            }
            if(this.letter == 'uArrow'){
                if(this.pressed){yOffSet = (this.height * 0.1)}
            }

            this.ctx.fillStyle = '#000000';
            this.ctx.beginPath();
            this.ctx.moveTo(this.x + this.width / 2 + xOffSet, this.y + this.height * 0.2 + yOffSet);
            this.ctx.lineTo(this.x + this.width * 0.75 + xOffSet, this.y + this.height * 0.50 + yOffSet);
            this.ctx.lineTo(this.x + this.width * 0.25 + xOffSet, this.y + this.height * 0.50 + yOffSet);
            this.ctx.fill();
            this.ctx.restore();
        } else {
            drawText(this.ctx,this.letter,this.x+ (this.width / 2),this.y + (this.height / 2) + textOffset,fontSize,"black")
        }
    }
}