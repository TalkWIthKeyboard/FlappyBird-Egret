//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.hasWorld = false;
        // 最佳得分
        _this.bestScore = 0;
        _this.columns = undefined;
        _this.columnOpen = false;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        this.scoreImg = new Score(this, 0, this.score);
        this.lastScoreImg = new Score(this, 1, this.score);
        this.bestScoreImg = new Score(this, 2, this.bestScore);
        this.init();
    };
    /**
     * 初始化游戏场景
     * @param objList [{'num':,'high':},]
     */
    Main.prototype.init = function () {
        var _this = this;
        this.measured = {
            'stageW': this.stage.stageWidth,
            'stageH': this.stage.stageHeight
        };
        var bird = new Bird(this, 0, 0, 0, 0);
        var btn_start = this.makeBitMap('text_ready_png', 0, -100, 1.4, 1.4);
        var tutorial = this.makeBitMap('tutorial_png', 0, 0, 1, 1);
        tutorial.touchEnabled = true;
        this.addChildAt(tutorial, 1);
        this.addChildAt(btn_start, 1);
        this.addChildAt(bird, 1);
        tutorial.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            _this.removeChild(btn_start);
            _this.removeChild(tutorial);
            _this.removeChild(bird);
            _this.websocket = new Websocket(_this);
        }, this);
        if (!this.hasWorld) {
            this.createWorld();
            setInterval(function () {
                _this.world.step(60 / 1000);
            });
        }
        this.backGourd = new BackgroundImage(this.measured);
        this.addChildAt(this.backGourd, 0);
        this.floor = new Floor(this);
        this.addChildAt(this.floor, 3);
    };
    /**
     * 创建物理世界
     */
    Main.prototype.createWorld = function () {
        var wrd = new p2.World();
        wrd.sleepMode = p2.World.BODY_SLEEPING;
        wrd.gravity = [0, 3];
        this.world = wrd;
        this.hasWorld = true;
    };
    /**
     * 开始游戏
     * @param objList [{'num':,'x':,'y':},]
     */
    Main.prototype.startGame = function (objList) {
        var _this = this;
        // 1.初始化顶端分数
        this.columnIndex = -1;
        this.score = 0;
        this.scoreImg.makeNumberImg(this.score);
        // 2.开始接收服务端栏杆数据，并初始化栏杆Map
        this.columnOpen = true;
        this.columns = new Columns(this);
        // 3.初始化小鸟Map
        this.birdMap = new Birds(this, objList);
        // 4.打开物理碰撞检测
        this.world.on("beginContact", this.onBeginContact, this);
        // 5.添加分数计数器和天花板碰撞
        // 6.在分数计数器中添加小鸟的高度坐标发送
        this.scoreTimer = new egret.Timer(100, 0);
        this.scoreTimer.addEventListener(egret.TimerEvent.TIMER, function () {
            if (_this.columnIndex !== -1
                && _this.columns
                && _this.columns.columnMap.get(_this.columnIndex.toString())
                && _this.bird.mc.x > _this.columns.columnMap.get(_this.columnIndex.toString()).co2.x) {
                _this.columnIndex = (parseInt(_this.columnIndex) + 1) % 100;
                _this.score++;
                _this.scoreImg.makeNumberImg(_this.score);
            }
            if (_this.bird.mc.y < 0)
                _this.stopGame();
            // 高度坐标发送
            _this.websocket.sendMessage("high," + _this.bird.id + "," + _this.bird.mc.y);
        }, this);
        this.scoreTimer.start();
    };
    /**
     * 结束游戏
     */
    Main.prototype.stopGame = function () {
        var _this = this;
        // 0.删除所有小鸟
        this.birdMap.removeAll();
        // 1.删除栏杆图像，刚体；关闭栏杆数据获取；清空栏杆Map
        this.columnOpen = false;
        this.columns.clear();
        this.columns = undefined;
        // 2.发送死亡消息
        this.websocket.sendMessage("dead," + this.bird.id);
        // 3.更新最佳得分   
        this.bestScore = this.score > this.bestScore ? this.score : this.bestScore;
        // 4.关闭地板动画
        this.floor.end();
        // 5.关闭分数计数器
        this.scoreTimer.reset();
        // 6.关闭物理碰撞检测
        this.world.off("beginContact", null);
        // 7.新建gameOver页面元素
        var gameOver = this.makeBitMap("text_game_over_png", 0, -200, 1.4, 1.4);
        var scorePanel = this.makeBitMap("score_panel_png", 0, 0, 1.6, 1.6);
        var restartBtn = this.makeBitMap("button_play_png", 0, 200, 1.4, 1.4);
        // 8.清空顶端得分；更新最后得分与最佳得分图像
        this.scoreImg.clearNumber();
        this.lastScoreImg.makeNumberImg(this.score);
        this.bestScoreImg.makeNumberImg(this.bestScore);
        restartBtn.touchEnabled = true;
        this.addChildAt(gameOver, 3);
        this.addChildAt(scorePanel, 3);
        this.addChildAt(restartBtn, 3);
        // 9.添加重新开始按钮的监听事件
        restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            _this.removeChild(gameOver);
            _this.removeChild(scorePanel);
            _this.removeChild(restartBtn);
            _this.floor.start();
            _this.lastScoreImg.clearNumber();
            _this.bestScoreImg.clearNumber();
            _this.websocket.onSocketOpen();
        }, this);
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    Main.prototype.startAnimation = function (result) {
        var _this = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = result.map(function (text) { return parser.parse(text); });
        var textfield = this.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var textFlow = textflowArr[count];
            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, _this);
        };
        change();
    };
    /**
     * 小鸟的碰撞检测
     */
    Main.prototype.onBeginContact = function (event) {
        var bodyA = event.bodyA;
        var bodyB = event.bodyB;
        if ((bodyA.id === this.bird.getBirdBox().id || bodyB.id === this.bird.getBirdBox().id)
            && !this.birdMap.checkCollide(bodyA, bodyB))
            this.stopGame();
    };
    Main.prototype.makeBitMap = function (picName, px, py, sx, sy) {
        var sprite = this.createBitmapByName(picName);
        sprite.x = (this.measured.stageW) / 2 + px;
        sprite.y = (this.measured.stageH) / 2 + py;
        sprite.scaleX = sx;
        sprite.scaleY = sy;
        sprite.anchorOffsetX = sprite.width / 2;
        sprite.anchorOffsetY = sprite.height / 2;
        return sprite;
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map