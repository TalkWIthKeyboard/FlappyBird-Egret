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

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;
    // 舞台尺寸
    private measured; 
    // 地板
    private floor;
    private columnIndex;

    private bird;
    private birdMap;
    
    private backGourd;
    private hasWorld = false;
    private world: p2.World;
    // 现在得分
    private score: number;
    // 最佳得分
    private bestScore: number = 0;
    private scoreImg;
    private lastScoreImg;
    private bestScoreImg;
    private scoreTimer;
    private websocket;
    private columns = undefined;
    private columnOpen = false;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
        this.scoreImg = new Score(this, 0, this.score);
        this.lastScoreImg = new Score(this, 1, this.score);
        this.bestScoreImg = new Score(this, 2, this.bestScore);
        this.init();
    }
    
    /**
     * 初始化游戏场景
     * @param objList [{'num':,'high':},]
     */
    private init():void {
        this.measured={
            'stageW': this.stage.stageWidth,
            'stageH':this.stage.stageHeight
        }

        let bird:Bird = new Bird(this, 0, 0, 0, 0);
        let btn_start = this.makeBitMap('text_ready_png', 0, -100, 1.4, 1.4);
        let tutorial = this.makeBitMap('tutorial_png', 0, 0, 1, 1);
        tutorial.touchEnabled = true;

        this.addChildAt(tutorial, 1);
        this.addChildAt(btn_start, 1);
        this.addChildAt(bird, 1);

        tutorial.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt:egret.TouchEvent) => {
            this.removeChild(btn_start);
            this.removeChild(tutorial);
            this.removeChild(bird);
            this.websocket = new Websocket(this);            
        }, this);

        if (!this.hasWorld) {
            this.createWorld();
            setInterval(() => {
                this.world.step(60 / 1000);
            })
        }
        this.backGourd = new BackgroundImage(this.measured);
        this.addChildAt(this.backGourd, 0);
        this.floor = new Floor(this);
        this.addChildAt(this.floor, 3);
    }

    /**
     * 创建物理世界
     */
    private createWorld(): void {
        var wrd: p2.World = new p2.World();
        wrd.sleepMode = p2.World.BODY_SLEEPING;
        wrd.gravity = [0, 3];
        this.world = wrd;
        this.hasWorld = true;
    }

    /**
     * 开始游戏
     * @param objList [{'num':,'x':,'y':},]
     */
    private startGame(objList): void {

        // 1.初始化顶端分数
        this.columnIndex = -1;        
        this.score = 0;
        this.scoreImg.makeNumberImg(this.score);
        // 2.开始接收服务端栏杆数据，并初始化栏杆Map
        this.columnOpen = true;
        this.columns = new Columns(this);
        // 3.初始化含有刚体的自己操作的小鸟
        let len = objList.length;
        this.bird = new Bird(this, objList[len - 1].x, objList[len - 1].y, objList[len - 1].num, 2);
        this.addChildAt(this.bird, 1);
        // 4.初始化小鸟动画Map
        this.birdMap = new Birds(this, objList);
        // 5.打开物理碰撞检测
        this.world.on("beginContact", this.onBeginContact, this);
        // 6.添加分数计数器和天花板碰撞
        // 7.在分数计数器中添加小鸟的高度坐标发送
        this.scoreTimer = new egret.Timer(100, 0);
        this.scoreTimer.addEventListener(egret.TimerEvent.TIMER, () => {
            if (this.columnIndex !== -1 
                    && this.columns
                    && this.columns.columnMap.get(this.columnIndex.toString())
                    && this.bird.mc.x > this.columns.columnMap.get(this.columnIndex.toString()).co2.x) {
                this.columnIndex = (parseInt(this.columnIndex) + 1) % 100;
                this.score ++;
                this.scoreImg.makeNumberImg(this.score);
            }
            if (this.bird.mc.y < 0) this.stopGame();
            // 高度坐标发送
            this.websocket.sendMessage(`high,${this.bird.id},${this.bird.mc.y}`);
        }, this);
        this.scoreTimer.start();
    }

    /**
     * 结束游戏
     */
    private stopGame(): void {

        // 0.删除所有小鸟动画和刚体小鸟
        this.birdMap.removeAll();
        this.bird.removeBird(this);
        // 1.删除栏杆图像，刚体；关闭栏杆数据获取；清空栏杆Map
        this.columnOpen = false;
        this.columns.clear();
        this.columns = undefined;
        // 2.发送死亡消息
        this.websocket.sendMessage(`dead,${this.bird.id}`);      
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
        this.addChildAt(scorePanel, 2);
        this.addChildAt(restartBtn, 3);  
        // 9.添加重新开始按钮的监听事件
        restartBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, (evt:egret.TouchEvent) => {
            this.removeChild(gameOver);
            this.removeChild(scorePanel);
            this.removeChild(restartBtn);
            this.floor.start();
            this.lastScoreImg.clearNumber();
            this.bestScoreImg.clearNumber();
            this.websocket.onSocketOpen();
        }, this);
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: string[]) {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };
        change();
    }

    /**
     * 小鸟的碰撞检测
     */
    private onBeginContact(event):void {
        var bodyA: p2.Body = event.bodyA;
        var bodyB: p2.Body = event.bodyB;

        if (bodyA.id === this.bird.getBirdBox().id || bodyB.id === this.bird.getBirdBox().id)
            this.stopGame();
    }

    private makeBitMap(picName, px, py, sx, sy) {
        let sprite = this.createBitmapByName(picName);
        sprite.x = (this.measured.stageW) / 2 + px;
        sprite.y = (this.measured.stageH) / 2 + py;
        sprite.scaleX = sx;
        sprite.scaleY = sy;
        sprite.anchorOffsetX = sprite.width / 2;
        sprite.anchorOffsetY = sprite.height / 2;
        return sprite;
    }
}


