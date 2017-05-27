var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Floor = (function (_super) {
    __extends(Floor, _super);
    function Floor(main) {
        var _this = _super.call(this) || this;
        var measured = main.measured;
        _this.measured = measured;
        _this.imagedata0 = new egret.Bitmap(RES.getRes('land_png'));
        _this.imagedata0.width = measured.stageW + 10;
        _this.imagedata0.height = measured.stageH / 6;
        _this.imagedata0.anchorOffsetY = _this.imagedata0.height;
        _this.imagedata0.anchorOffsetX = _this.imagedata0.width;
        _this.imagedata0.y = measured.stageH;
        _this.imagedata0.x = 0;
        _this.imagedata1 = new egret.Bitmap(RES.getRes('land_png'));
        _this.imagedata1.width = measured.stageW + 10;
        _this.imagedata1.height = measured.stageH / 6;
        _this.imagedata1.anchorOffsetY = _this.imagedata1.height;
        _this.imagedata1.anchorOffsetX = _this.imagedata1.width;
        _this.imagedata1.y = measured.stageH;
        _this.imagedata1.x = measured.stageW + 10;
        // 配套的刚体
        var groundShape = new p2.Plane();
        _this.floorBox = new p2.Body();
        _this.floorBox.position[1] = measured.stageH / 6 * 5;
        _this.floorBox.angle = Math.PI;
        _this.floorBox.addShape(groundShape);
        main.world.addBody(_this.floorBox);
        _this.timer = new egret.Timer(100, 0);
        _this.timer.addEventListener(egret.TimerEvent.TIMER, _this.start, _this);
        _this.addChildAt(_this.imagedata0, 2);
        _this.addChildAt(_this.imagedata1, 2);
        _this.timer.start();
        return _this;
    }
    Floor.prototype.start = function () {
        if (this.imagedata0.x <= 0)
            this.imagedata0.x = this.imagedata1.x + this.measured.stageW + 10;
        if (this.imagedata1.x <= 0)
            this.imagedata1.x = this.imagedata0.x + this.measured.stageW + 10;
        egret.Tween.get(this.imagedata0).to({ x: this.imagedata0.x - 20 }, 100);
        egret.Tween.get(this.imagedata1).to({ x: this.imagedata1.x - 20 }, 100);
    };
    Floor.prototype.remove = function (main) {
        main.world.removeBody(this.floorBox);
        this.parent.removeChild(this);
    };
    Floor.prototype.end = function () {
        egret.Tween.removeTweens(this);
        this.timer.reset();
    };
    return Floor;
}(egret.DisplayObjectContainer));
__reflect(Floor.prototype, "Floor");
//# sourceMappingURL=Floor.js.map