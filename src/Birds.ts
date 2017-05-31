class Birds {
    
    private birdMap = new Map();
    private birdList = [];
    private main;

    /**
     * 构造函数
     * @params main 主类
     * @params objList 服务端存储的小鸟高度
     */
    public constructor(main, objList) {
        this.main = main;
        for (let i = 0; i < objList.length - 1; i++) {
            let birdNum = objList[i].num;
            let birdX = parseFloat(objList[i].x);
            let birdY = parseFloat(objList[i].y);
            let bird = new Bird(main, birdX, birdY, birdNum, 1);
            bird.alpha = 0.5;            

            main.addChildAt(bird, 1);
            this.birdList.push(birdNum);
            this.birdMap.set(birdNum, bird);
        }
    }

    // 在birdList里根据num删除
    private birdListDelete(num) {
        for (let i = 0; i < this.birdList.length; i++) {
            if (this.birdList[i] === num) {
                this.birdList.splice(i, 1);
                break;
            }
        }
    }

    // 删除所有小鸟
    public removeAll() {
        for (let i = 0; i < this.birdList.length; i++) {
            this.removeBird(this.birdList[i], false);
        }
        this.birdList = [];
    }

    // 玩家退出游戏，或者小鸟死亡
    public removeBird(number, flag) {
        if (this.birdMap.has(number)) {
            let bird = this.birdMap.get(number);
            // 删除小鸟元素
            this.birdMap.get(number).removeBird(this.main); 
            this.birdMap.delete(number);      
            if (flag) this.birdListDelete(number);     
        }
    }

    // 其他玩家进入游戏，添加小鸟
    public addBird(obj) {
        let bird = new Bird(this.main, obj.x, obj.y, obj.num, 1);
        bird.alpha = 0.5;
        this.main.addChildAt(bird, 1);
        this.birdMap.set(obj.num, bird);
        this.birdList.push(obj.num);
    }

    // 根据服务器的坐标进行移动
    public changePosition(position) {
        let len = position.length;
        for (let i = 0; i < len; i++) {
            if (this.main.bird.id !== position[i].num) {
                let birdNum = position[i].num;
                let birdY = parseFloat(position[i].y);

                if (this.birdMap.has(birdNum)) {
                    let bird = this.birdMap.get(birdNum);
                    egret.Tween.get(bird.mc).to({y: birdY}, 115);
                }
            }
        }
    }
}