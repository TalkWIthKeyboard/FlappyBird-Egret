var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Column = (function (_super) {
    __extends(Column, _super);
    function Column(main, high, x) {
        var _this = _super.call(this) || this;
        _this.measured = main.measured;
        _this.co1 = new egret.Bitmap(RES.getRes('pipe_down_png'));
        _this.co1.scaleY = 1.15;
        _this.addChild(_this.co1);
        var y1 = high;
        var y2 = Math.min(_this.measured.stageH / 6 * 5 - y1 - 300, _this.co1.height);
        _this.co1.y = y1 - _this.co1.height;
        _this.co1.x = x;
        _this.coBox1 = new p2.Body({ position: [_this.co1.x + _this.co1.width / 2, y1 / 2] });
        var boxShape1 = new p2.Box({ width: _this.co1.width, height: y1 });
        _this.coBox1.addShape(boxShape1);
        main.world.addBody(_this.coBox1);
        _this.co2 = new egret.Bitmap(RES.getRes('pipe_up_png'));
        _this.addChild(_this.co2);
        _this.co2.scaleY = 1.15;
        _this.co2.y = _this.measured.stageH / 6 * 5 - y2;
        _this.co2.x = x;
        _this.coBox2 = new p2.Body({ position: [_this.co2.x + _this.co2.width / 2, _this.co2.y + y2 / 2] });
        var boxShape2 = new p2.Box({ width: _this.co2.width, height: y2 });
        _this.coBox2.addShape(boxShape2);
        main.world.addBody(_this.coBox2);
        _this.timer = new egret.Timer(100, 0);
        _this.timer.addEventListener(egret.TimerEvent.TIMER, _this.start, _this);
        _this.timer.start();
        return _this;
    }
    Column.prototype.start = function () {
        egret.Tween.get(this.co2).to({ x: this.co2.x - 20 }, 120);
        egret.Tween.get(this.co1).to({ x: this.co1.x - 20 }, 120);
        this.coBox2.position[0] = this.co2.x;
        this.coBox1.position[0] = this.co1.x;
    };
    Column.prototype.stop = function () {
        egret.Tween.removeTweens(this);
        this.timer.reset();
    };
    Column.prototype.remove = function (main) {
        main.world.removeBody(this.coBox1);
        main.world.removeBody(this.coBox2);
        this.parent.removeChild(this);
    };
    Column.prototype.timeStart = function () {
        this.timer.start();
    };
    Column.prototype.timeEnd = function () {
        this.timer.reset();
    };
    return Column;
}(egret.DisplayObjectContainer));
__reflect(Column.prototype, "Column");
//# sourceMappingURL=Column.js.map