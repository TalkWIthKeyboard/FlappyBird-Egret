var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Birds = (function () {
    /**
     * 构造函数
     * @params main 主类
     * @params objList 服务端存储的小鸟高度
     */
    function Birds(main, objList) {
        this.birdMap = new Map();
        this.birdList = [];
        this.main = main;
        for (var i = 0; i < objList.length - 1; i++) {
            var birdNum = objList[i].num;
            var birdX = parseFloat(objList[i].x);
            var birdY = parseFloat(objList[i].y);
            var bird = new Bird(main, birdX, birdY, birdNum, objList[i].name, 1);
            bird.alpha = 0.5;
            main.addChildAt(bird, 1);
            this.birdList.push(birdNum);
            this.birdMap.set(birdNum, bird);
        }
    }
    // 在birdList里根据num删除
    Birds.prototype.birdListDelete = function (num) {
        for (var i = 0; i < this.birdList.length; i++) {
            if (this.birdList[i] === num) {
                this.birdList.splice(i, 1);
                break;
            }
        }
    };
    // 删除所有小鸟
    Birds.prototype.removeAll = function () {
        for (var i = 0; i < this.birdList.length; i++) {
            this.removeBird(this.birdList[i], false);
        }
        this.birdList = [];
    };
    // 玩家退出游戏，或者小鸟死亡
    Birds.prototype.removeBird = function (number, flag) {
        if (this.birdMap.has(number)) {
            var bird = this.birdMap.get(number);
            // 删除小鸟元素
            this.birdMap.get(number).removeBird(this.main);
            this.birdMap.delete(number);
            if (flag)
                this.birdListDelete(number);
        }
    };
    // 其他玩家进入游戏，添加小鸟
    Birds.prototype.addBird = function (obj) {
        var bird = new Bird(this.main, obj.x, obj.y, obj.num, obj.name, 1);
        bird.alpha = 0.5;
        this.main.addChildAt(bird, 1);
        this.birdMap.set(obj.num, bird);
        this.birdList.push(obj.num);
    };
    // 根据服务器的坐标进行移动
    Birds.prototype.changePosition = function (position) {
        var len = position.length;
        for (var i = 0; i < len; i++) {
            if (this.main.bird.id !== position[i].num) {
                var birdNum = position[i].num;
                var birdY = parseFloat(position[i].y);
                if (this.birdMap.has(birdNum)) {
                    var bird = this.birdMap.get(birdNum);
                    egret.Tween.get(bird.mc).to({ y: birdY }, 115);
                }
            }
        }
    };
    return Birds;
}());
__reflect(Birds.prototype, "Birds");
//# sourceMappingURL=Birds.js.map