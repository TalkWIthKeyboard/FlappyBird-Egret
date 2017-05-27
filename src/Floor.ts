class Floor extends egret.DisplayObjectContainer{

    private imagedata0;
    private imagedata1;
    private floorBox: p2.Body;
    private timer: egret.Timer;
    private measured;

    public constructor(main) {
        super();

        let measured = main.measured;
        this.measured = measured;
        this.imagedata0 = new egret.Bitmap(RES.getRes('land_png'));
        this.imagedata0.width = measured.stageW + 10;
        this.imagedata0.height = measured.stageH / 6;
        this.imagedata0.anchorOffsetY = this.imagedata0.height;
        this.imagedata0.anchorOffsetX = this.imagedata0.width;
        this.imagedata0.y = measured.stageH;
        this.imagedata0.x = 0;

        this.imagedata1 = new egret.Bitmap(RES.getRes('land_png'));
        this.imagedata1.width = measured.stageW + 10;
        this.imagedata1.height = measured.stageH / 6;
        this.imagedata1.anchorOffsetY = this.imagedata1.height;
        this.imagedata1.anchorOffsetX = this.imagedata1.width;
        this.imagedata1.y = measured.stageH;
        this.imagedata1.x = measured.stageW + 10;

        // 配套的刚体
        var groundShape: p2.Plane = new p2.Plane();
        this.floorBox = new p2.Body();
        this.floorBox.position[1] = measured.stageH / 6 * 5;
        this.floorBox.angle = Math.PI;
        this.floorBox.addShape(groundShape);
        main.world.addBody(this.floorBox);
    
        this.timer = new egret.Timer(100, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.start, this);

        this.addChildAt(this.imagedata0, 2);
        this.addChildAt(this.imagedata1, 2);
        this.timer.start();
    }

    private start() {
        if (this.imagedata0.x <= 0) this.imagedata0.x = this.imagedata1.x + this.measured.stageW + 10;
        if (this.imagedata1.x <= 0) this.imagedata1.x = this.imagedata0.x + this.measured.stageW + 10;
        egret.Tween.get(this.imagedata0).to({ x:this.imagedata0.x - 20}, 100);
        egret.Tween.get(this.imagedata1).to({ x:this.imagedata1.x - 20}, 100);
    }

     public remove(main):void {
        main.world.removeBody(this.floorBox);
		this.parent.removeChild(this);
	}

    public end() {
        egret.Tween.removeTweens(this);
		this.timer.reset();
    }
}