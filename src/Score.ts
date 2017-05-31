class Score extends egret.DisplayObjectContainer {

    private scoreImgList = [];
    private score;
    private main;
    // 0 是现在积分 1 是最后的积分 2 是最佳积分
    private type;
    private live;
    private position = [
        {x:0, y:-200, sx:1.4, sy:1.4, t:8},
        {x:120, y:-25, sx:1, sy:1, t:4},
        {x:120, y:40, sx:1, sy:1, t:4}
    ]

    public constructor(main, type, score) {
        super();

        this.main = main;
        this.score = score;
        this.type = type;
        this.live = false;
    }

    public makeNumberImg(score) {
        this.score = score;
        let a = this.score;
        let center = this.position[this.type];
        let numList = a == 0 ? [0] : [];

        if (!!this.live) this.clearNumber();

        while (a != 0) {
            numList.push(a % 10);
            a = Math.floor(a / 10);
        }
        for (let i = numList.length - 1; i >= 0; i--) 
            this.scoreImgList.push(this.main.makeBitMap('font_' + numList[i] + '_png', center.x, center.y, center.sx, center.sy));
        switch (numList.length) {
            case 2: 
                this.scoreImgList[0].x = this.scoreImgList[0].x - this.scoreImgList[0].width / 2 - center.t;
                this.scoreImgList[1].x = this.scoreImgList[1].x + this.scoreImgList[1].width / 2 + center.t;
                break;
            case 3:
                this.scoreImgList[0].x = this.scoreImgList[0].x - this.scoreImgList[0].width - center.t * 2;
                this.scoreImgList[2].x = this.scoreImgList[2].x + this.scoreImgList[0].width + center.t * 2;
                break;
        }
        for (let i = 0; i < this.scoreImgList.length; i++)
            this.main.addChildAt(this.scoreImgList[i], 3);
        this.live = true;
    }

    private clearNumber() {
        for (let i = 0; i < this.scoreImgList.length; i++) this.main.removeChild(this.scoreImgList[i]);
        this.scoreImgList = []; 
        this.live = false;
    }
}