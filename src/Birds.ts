class Birds {
    
    private birdMap = new Map();
    private boxSet = new Set();
    private birdList = [];
    private myBird;
    private main;

    /**
     * main 主类
     * high 服务端存储的小鸟高度
     */
    public constructor(main, objList) {
        this.main = main;
        for (let i = 0; i < objList.length; i++) {
            let birdNum = objList[i].num;
            let birdX = parseFloat(objList[i].x);
            let birdY = parseFloat(objList[i].y);
            let bird:Bird;
            
            // 1. 自己的小鸟
            if (i === objList.length - 1) {
                bird = new Bird(main, birdX, birdY, birdNum, 2);
                this.myBird = objList[i].num;      
                main.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, bird.jump, bird);                          
                bird.alpha = 1; 
                main.birdBoxId = bird.getBirdBox().id; 
                main.bird = bird;        
            } else {
            // 2. 别的玩家的小鸟
                bird = new Bird(main, birdX, birdY, birdNum, 1);
                bird.alpha = 0.5;            
            }

            main.addChildAt(bird, 1);
            // 添加birdBox映射
            this.boxSet.add(bird.getBirdBox().id);
            this.birdList.push(birdNum);
            this.birdMap.set(birdNum, bird);
        }
    }

    /**
     * 小鸟跳跃
     */
    public jump(number) {
        if (this.birdMap.has(number))
            this.birdMap.get(number).recJump();            
    }

    private birdListDelete(num) {
        for (let i = 0; i < this.birdList.length; i++) {
            if (this.birdList[i] === num) {
                this.birdList.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 删除所有小鸟
     */
    public removeAll() {
        for (let i = 0; i < this.birdList.length; i++) {
            this.removeBird(this.birdList[i], false);
        }
        this.birdList = [];
    }

    /**
     * 玩家退出游戏，或者小鸟死亡
     */
    public removeBird(number, flag) {
        if (this.birdMap.has(number)){
            let bird = this.birdMap.get(number);
            // 删除监听器
            if (this.myBird === number) 
                this.main.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, bird.jump, bird);
            // 删除小鸟元素
            this.birdMap.get(number).removeBird(this.main);  
            this.boxSet.delete(bird.getBirdBox());
            this.birdMap.delete(number);      
            if (flag) this.birdListDelete(number);     
        }
    }

    /**
     * 其他玩家进入游戏，添加小鸟
     */
    public addBird(obj) {
        let bird = new Bird(this.main, obj.x, obj.y, obj.num, true);
        bird.alpha = 0.5;
        this.boxSet.add(bird.getBirdBox().id);
        this.main.addChildAt(bird, 1);
        this.birdMap.set(obj.num, bird);
        this.birdList.push(obj.num);
    }

    /**
     * 碰撞检测
     */
    public checkCollide(id1, id2) { 
        let flag1 = this.boxSet.has(id1.id);
        let flag2 = this.boxSet.has(id2.id);
        return flag1 && flag2;
    }
}