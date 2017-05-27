class Column extends egret.DisplayObjectContainer {
    private timer: egret.Timer;
    private measured;
    private co1;
    private co2;
    private coBox1;
    private coBox2;
    private postionX;

    public constructor(main, high, x) {
		super();
		this.measured = main.measured;
        this.co1 = new egret.Bitmap(RES.getRes('pipe_down_png'));
        this.co1.scaleY = 1.15;
        this.addChild(this.co1);
        var y1 = high;
        var y2 = Math.min(this.measured.stageH /6 * 5 - y1 - 300, this.co1.height);
        this.co1.y = y1 - this.co1.height;
        this.co1.x = x; 

        this.coBox1 = new p2.Body({position: [this.co1.x+this.co1.width/2, y1/2]});
        var boxShape1: p2.Shape = new p2.Box({width: this.co1.width, height: y1});
        this.coBox1.addShape(boxShape1);
        main.world.addBody(this.coBox1);

        this.co2 = new egret.Bitmap(RES.getRes('pipe_up_png'));
        this.addChild(this.co2);
        this.co2.scaleY = 1.15;
        this.co2.y = this.measured.stageH / 6 * 5 - y2;
        this.co2.x = x;

        this.coBox2 = new p2.Body({position: [this.co2.x+this.co2.width/2, this.co2.y+y2/2]});
        var boxShape2: p2.Shape = new p2.Box({width: this.co2.width, height: y2});
        this.coBox2.addShape(boxShape2);
        main.world.addBody(this.coBox2);

        this.timer = new egret.Timer(100, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.start, this);
        this.timer.start();
	}

    private start():void {
        egret.Tween.get(this.co2).to({ x: this.co2.x - 20}, 120)
        egret.Tween.get(this.co1).to({ x: this.co1.x - 20}, 120)
        this.coBox2.position[0] = this.co2.x;
        this.coBox1.position[0] = this.co1.x;
    }

    public stop():void {
        egret.Tween.removeTweens(this);
        this.timer.reset();
    }

    public remove(main):void {
        main.world.removeBody(this.coBox1);
        main.world.removeBody(this.coBox2);
		this.parent.removeChild(this);
	}

    public timeStart():void {
		this.timer.start();
	}

    public timeEnd():void {
        this.timer.reset();
    }
}