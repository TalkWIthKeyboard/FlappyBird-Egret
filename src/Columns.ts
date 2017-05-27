class Columns {

    // Map<编号，栏杆>
    private columnMap = new Map();
    private numberList = [];
    private main;
    private first;

    public constructor(main) {
        this.main = main;
        this.first = true;
    }

    private numberListDelete(num) {
        for (let i = 0; i < this.numberList.length; i++) {
            if (this.numberList[i] === num) {
                this.numberList.splice(i, 1);
                break;
            }
        }
    }

    private push(columnObj) {
        let numberSet = new Set();
        // 1.创建Set
        for (let i = 0; i < columnObj.length; i++) 
            numberSet.add(columnObj[i].number);
        
        for (let i = 0; i < this.numberList.length; i++)
        // 2.删除栏杆
            if (! numberSet.has(this.numberList[i]) && this.numberList.length > 0) {
                this.columnMap.get(this.numberList[i]).remove(this.main);
                this.columnMap.delete(this.numberList[i]);
                this.numberListDelete(this.numberList[i]);
            }

        for (let i = 0; i < columnObj.length; i++) {
            let obj = columnObj[i];
        // 3.新增栏杆
            if (! this.columnMap.has(obj.number)
            // 在小鸟左边以及右边很近的栏杆都不被添加
            && parseFloat(obj.x) > 300) {
                let _column = new Column(this.main, parseFloat(obj.high), parseFloat(obj.x));
                this.main.addChildAt(_column, 1);
                this.columnMap.set(obj.number, _column);
                this.numberList.push(obj.number);
                if (this.first) this.main.columnIndex = obj.number;
                this.first = false;
            }
        }
    }

    private clear() {
        for (let i = 0; i < this.numberList.length; i++) {
            this.columnMap.get(this.numberList[i]).remove(this.main);
            this.columnMap.delete(this.numberList[i]);
        }
        this.numberList = [];
    }
}