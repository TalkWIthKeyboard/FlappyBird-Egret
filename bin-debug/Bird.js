var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bird = (function (_super) {
    __extends(Bird, _super);
    /**
     * @params main 主类
     * @params high 小鸟的初始化高度
     * @params id 在map中的id
     * @params flag 0 首页动画 1 其他小鸟的动画 2 添加配套刚体的实体
     */
    function Bird(main, x, y, id, flag) {
        var _this = _super.call(this) || this;
        var json = RES.getRes('bird_json');
        var img = RES.getRes('bird_png');
        _this.main = main;
        _this.mcf = new egret.MovieClipDataFactory(json, img);
        _this.mcf.enableCache = true;
        _this.addBird();
        _this.addChild(_this.mc);
        _this.mc.x = x;
        _this.mc.play(-1);
        switch (flag) {
            case 0:
                _this.mc.y = main.measured.stageH / 2 - 80;
                egret.Tween.get(_this.mc, { loop: true })
                    .to({ y: main.measured.stageH / 2 - 60 }, 800)
                    .to({ y: main.measured.stageH / 2 - 80 }, 800);
                break;
            case 1:
                _this.mc.y = y;
                break;
            case 2:
                _this.id = id;
                _this.mc.y = y;
                _this.birdBox = new p2.Body({ mass: 1, position: [_this.mc.x + _this.mc.width / 2, _this.mc.y + _this.mc.height / 2] });
                var boxShape = new p2.Box({ width: _this.mc.width, height: _this.mc.height });
                _this.birdBox.addShape(boxShape);
                main.world.addBody(_this.birdBox);
                setInterval(function () {
                    _this.mc.y = _this.birdBox.position[1] - _this.mc.height / 2;
                }, 1000 * 1 / 60);
                break;
        }
        return _this;
    }
    /**
     * 初始化小鸟
     * 随机小鸟种类，添加小鸟动画
     */
    Bird.prototype.addBird = function () {
        var num = parseInt(String(Math.random() * 2 + 1));
        switch (num) {
            case 1:
                this.mcValue = "one";
                break;
            case 2:
                this.mcValue = "two";
                break;
            case 3:
                this.mcValue = "three";
                break;
        }
        this.mc = new egret.MovieClip(this.mcf.generateMovieClipData(this.mcValue));
    };
    /**
     * 小鸟飞行
     */
    Bird.prototype.jump = function () {
        this.main.websocket.sendMessage("jump," + this.id);
    };
    Bird.prototype.recJump = function () {
        p2.vec2.add(this.birdBox.force, this.birdBox.force, p2.vec2.fromValues(0, -400));
    };
    Bird.prototype.getBirdBox = function () {
        return this.birdBox;
    };
    Bird.prototype.removeBird = function (main) {
        main.world.removeBody(this.birdBox);
        this.parent.removeChild(this);
    };
    return Bird;
}(egret.DisplayObjectContainer));
__reflect(Bird.prototype, "Bird");
//# sourceMappingURL=Bird.js.map