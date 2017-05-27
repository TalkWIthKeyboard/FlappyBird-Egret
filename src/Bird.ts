
class Bird extends egret.DisplayObjectContainer {

    // 小鸟动画
    private mc: egret.MovieClip;
    private mcf: egret.MovieClipDataFactory;
    private mcValue: string;
    // 小鸟对应的刚体
    private birdBox: p2.Body;
    // 计时器
    private timer: egret.Timer;
    private main;
    private id;

    /**
     * @params main 主类
     * @params high 小鸟的初始化高度
     * @params id 在map中的id
     * @params flag 0 首页动画 1 其他小鸟的动画 2 添加配套刚体的实体
     */
    public constructor(main, x, y, id, flag) {
        super();

        var json = RES.getRes('bird_json');
        var img = RES.getRes('bird_png');
        this.main = main;
        this.mcf = new egret.MovieClipDataFactory(json, img);
        this.mcf.enableCache = true;
        this.addBird();
        this.addChild(this.mc);
        this.mc.x = x;   
        this.mc.play(-1);

        switch (flag) {
            case 0:
                this.mc.y = main.measured.stageH / 2 - 80;
                egret.Tween.get(this.mc, {loop:true})
                    .to({y: main.measured.stageH / 2 - 60}, 800)
                    .to({y: main.measured.stageH / 2 - 80}, 800)
                break;
            case 1:
                this.mc.y = y;
                break;
            case 2:
                this.id = id;
                this.mc.y = y;
                this.birdBox = new p2.Body({mass: 1, position: [this.mc.x + this.mc.width / 2, this.mc.y + this.mc.height / 2]});
                var boxShape: p2.Shape = new p2.Box({width: this.mc.width, height: this.mc.height});
                this.birdBox.addShape(boxShape);
                main.world.addBody(this.birdBox);
                setInterval(() => {
                    this.mc.y = this.birdBox.position[1] - this.mc.height / 2;
                }, 1000 * 1/60);
                break;
        }
    }

    /**
     * 初始化小鸟
     * 随机小鸟种类，添加小鸟动画
     */
    public addBird() {
        
        var num = parseInt(String(Math.random()*2+1));
        switch (num) {
            case 1:this.mcValue = "one"
                break;
            case 2:this.mcValue = "two"
                break;
            case 3:this.mcValue = "three"
                break;
        }
        this.mc = new egret.MovieClip(this.mcf.generateMovieClipData(this.mcValue));
    }

    /**
     * 小鸟飞行
     */
    public jump() {
        this.main.websocket.sendMessage(`jump,${this.id}`);
    }

    public recJump() {
        p2.vec2.add(this.birdBox.force, this.birdBox.force, p2.vec2.fromValues(0, -400));
    }

    public getBirdBox() {
        return this.birdBox;
    }

    public removeBird(main) {
        main.world.removeBody(this.birdBox);
        this.parent.removeChild(this);
    }
}