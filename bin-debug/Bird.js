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
    function Bird(main, x, y, id, name, flag) {
        var _this = _super.call(this) || this;
        _this.arrow = null;
        var json = RES.getRes('bird_json');
        var img = RES.getRes('bird_png');
        _this.main = main;
        _this.birdName = name;
        _this.mcf = new egret.MovieClipDataFactory(json, img);
        _this.mcf.enableCache = true;
        _this.addBird();
        _this.addChild(_this.mc);
        _this.mc.x = x;
        _this.mc.play(-1);
        _this.type = flag;
        switch (flag) {
            case 0:
                _this.mc.y = main.measured.stageH / 2 - 80;
                egret.Tween.get(_this.mc, { loop: true })
                    .to({ y: main.measured.stageH / 2 - 60 }, 800)
                    .to({ y: main.measured.stageH / 2 - 80 }, 800);
                break;
            case 1:
                _this.createArrowAndText(x, y, 1);
                _this.mc.y = y;
                break;
            case 2:
                _this.createArrowAndText(x, y, 2);
                _this.id = id;
                _this.mc.y = y;
                _this.birdBox = new p2.Body({ mass: 1, position: [_this.mc.x + _this.mc.width / 2, _this.mc.y + _this.mc.height / 2] });
                var boxShape = new p2.Box({ width: _this.mc.width, height: _this.mc.height });
                _this.birdBox.addShape(boxShape);
                // 1. 在物理世界添加元素
                main.world.addBody(_this.birdBox);
                // 2. 添加点击事件
                main.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.jump, _this);
                // 3. 物理世界元素和动画世界元素保持同步
                setInterval(function () {
                    _this.mc.y = _this.birdBox.position[1] - _this.mc.height / 2;
                    if (_this.arrow) {
                        _this.arrow.y = _this.mc.y - 10;
                        _this.text.y = _this.mc.y - 30;
                    }
                }, 1000 * 1 / 60);
                break;
        }
        return _this;
    }
    // 初始化小鸟
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
    // 小鸟的跳跃响应函数
    Bird.prototype.jump = function () {
        p2.vec2.add(this.birdBox.force, this.birdBox.force, p2.vec2.fromValues(0, -400));
    };
    // 获取小鸟的物理对象的id
    Bird.prototype.getBirdBox = function () {
        return this.type === 2 ? this.birdBox : null;
    };
    // 创建配套的箭头
    Bird.prototype.createArrowAndText = function (x, y, type) {
        this.text = new egret.TextField();
        this.text.text = this.birdName;
        this.text.textColor = 0xFFFFFF;
        this.text.x = x;
        this.text.y = y - 30;
        this.arrow = new egret.Bitmap(RES.getRes('arrow_png'));
        this.arrow.x = x;
        this.arrow.y = y - 10;
        if (type === 1) {
            this.arrow.alpha = 0.5;
            this.text.textColor = 0xCCCCCC;
        }
        this.main.addChild(this.text);
        this.main.addChild(this.arrow);
    };
    // 删除小鸟
    Bird.prototype.removeBird = function (main) {
        if (this.type === 2) {
            main.world.removeBody(this.birdBox);
            this.main.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.jump, this);
        }
        this.main.removeChild(this.text);
        this.main.removeChild(this.arrow);
        this.parent.removeChild(this);
    };
    return Bird;
}(egret.DisplayObjectContainer));
__reflect(Bird.prototype, "Bird");
//# sourceMappingURL=Bird.js.map