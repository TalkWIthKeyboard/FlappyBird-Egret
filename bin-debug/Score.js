var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Score = (function (_super) {
    __extends(Score, _super);
    function Score(main, type, score) {
        var _this = _super.call(this) || this;
        _this.scoreImgList = [];
        _this.position = [
            { x: 0, y: -200, sx: 1.4, sy: 1.4, t: 8 },
            { x: 120, y: -25, sx: 1, sy: 1, t: 4 },
            { x: 120, y: 40, sx: 1, sy: 1, t: 4 }
        ];
        _this.main = main;
        _this.score = score;
        _this.type = type;
        _this.live = false;
        return _this;
    }
    Score.prototype.makeNumberImg = function (score) {
        this.score = score;
        var a = this.score;
        var center = this.position[this.type];
        var numList = a == 0 ? [0] : [];
        if (!!this.live)
            this.clearNumber();
        while (a != 0) {
            numList.push(a % 10);
            a = Math.floor(a / 10);
        }
        for (var i = numList.length - 1; i >= 0; i--)
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
        for (var i = 0; i < this.scoreImgList.length; i++)
            this.main.addChildAt(this.scoreImgList[i], 3);
        this.live = true;
    };
    Score.prototype.clearNumber = function () {
        for (var i = 0; i < this.scoreImgList.length; i++)
            this.main.removeChild(this.scoreImgList[i]);
        this.scoreImgList = [];
        this.live = false;
    };
    return Score;
}(egret.DisplayObjectContainer));
__reflect(Score.prototype, "Score");
//# sourceMappingURL=Score.js.map