
class Bird extends egret.DisplayObjectContainer {

    // 小鸟动画
    private mc: egret.MovieClip;
    private mcf: egret.MovieClipDataFactory;
    private arrow = null;
    private mcValue: string;
    // 小鸟对应的刚体
    private birdBox: p2.Body;
    // 计时器
    private timer: egret.Timer;
    private main;
    private type;
    private birdName;
    private text;
    private id;

    /**
     * @params main 主类
     * @params high 小鸟的初始化高度
     * @params id 在map中的id
     * @params flag 0 首页动画 1 其他小鸟的动画 2 添加配套刚体的实体
     */
    public constructor(main, x, y, id, name, flag) {
        super();

        var json = RES.getRes('bird_json');
        var img = RES.getRes('bird_png');
        this.main = main;
        this.birdName = name;
        this.mcf = new egret.MovieClipDataFactory(json, img);
        this.mcf.enableCache = true;
        this.addBird();
        this.addChild(this.mc);
        this.mc.x = x;   
        this.mc.play(-1);
        this.type = flag;

        switch (flag) {
            case 0:
                this.mc.y = main.measured.stageH / 2 - 80;
                egret.Tween.get(this.mc, {loop:true})
                    .to({y: main.measured.stageH / 2 - 60}, 800)
                    .to({y: main.measured.stageH / 2 - 80}, 800)
                break;
            case 1:
                this.createArrowAndText(x, y);   
                this.mc.y = y;
                break;
            case 2:
                this.createArrowAndText(x, y);
                this.id = id;
                this.mc.y = y;
                this.birdBox = new p2.Body({mass: 1, position: [this.mc.x + this.mc.width / 2, this.mc.y + this.mc.height / 2]});
                var boxShape: p2.Shape = new p2.Box({width: this.mc.width, height: this.mc.height});
                this.birdBox.addShape(boxShape);
                // 1. 在物理世界添加元素
                main.world.addBody(this.birdBox);
                // 2. 添加点击事件
                main.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.jump, this);  
                // 3. 物理世界元素和动画世界元素保持同步
                setInterval(() => {
                    this.mc.y = this.birdBox.position[1] - this.mc.height / 2;
                    if (this.arrow) {
                        this.arrow.y = this.mc.y - 10;
                        this.text.y = this.mc.y - 30;
                    }
                }, 1000 * 1/60);
                break;
        }
    }

    // 初始化小鸟
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

    // 小鸟的跳跃响应函数
    public jump() {
        p2.vec2.add(this.birdBox.force, this.birdBox.force, p2.vec2.fromValues(0, -400));
    }

    // 获取小鸟的物理对象的id
    public getBirdBox() {
        return this.type === 2 ? this.birdBox : null;
    }

    // 创建配套的箭头
    public createArrowAndText(x, y) {
        this.text = new egret.TextField();
        this.text.text = this.birdName;
        this.text.textColor = 0x000000;
        this.text.x = x;
        this.text.y = y - 30;

        this.arrow = new egret.Bitmap(RES.getRes('arrow_png'));     
        this.arrow.x = x;
        this.arrow.y = y - 10; 
        this.main.addChild(this.text);
        this.main.addChild(this.arrow);
    }

    // 删除小鸟
    public removeBird(main) {
        if (this.type === 2) {
            main.world.removeBody(this.birdBox);            
            this.main.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.jump, this);
        }
        this.main.removeChild(this.text);
        this.main.removeChild(this.arrow);        
        this.parent.removeChild(this);
    }
}