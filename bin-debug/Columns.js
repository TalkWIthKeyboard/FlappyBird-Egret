var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Columns = (function () {
    function Columns(main) {
        // Map<编号，栏杆>
        this.columnMap = new Map();
        this.numberList = [];
        this.main = main;
        this.first = true;
    }
    Columns.prototype.numberListDelete = function (num) {
        for (var i = 0; i < this.numberList.length; i++) {
            if (this.numberList[i] === num) {
                this.numberList.splice(i, 1);
                break;
            }
        }
    };
    Columns.prototype.push = function (columnObj) {
        var numberSet = new Set();
        // 1.创建Set
        for (var i = 0; i < columnObj.length; i++)
            numberSet.add(columnObj[i].number);
        for (var i = 0; i < this.numberList.length; i++)
            // 2.删除栏杆
            if (!numberSet.has(this.numberList[i]) && this.numberList.length > 0) {
                this.columnMap.get(this.numberList[i]).remove(this.main);
                this.columnMap.delete(this.numberList[i]);
                this.numberListDelete(this.numberList[i]);
            }
        for (var i = 0; i < columnObj.length; i++) {
            var obj = columnObj[i];
            // 3.新增栏杆
            if (!this.columnMap.has(obj.number)
                && parseFloat(obj.x) > 300) {
                var _column = new Column(this.main, parseFloat(obj.high), parseFloat(obj.x));
                this.main.addChildAt(_column, 1);
                this.columnMap.set(obj.number, _column);
                this.numberList.push(obj.number);
                if (this.first)
                    this.main.columnIndex = obj.number;
                this.first = false;
            }
        }
    };
    Columns.prototype.clear = function () {
        for (var i = 0; i < this.numberList.length; i++) {
            this.columnMap.get(this.numberList[i]).remove(this.main);
            this.columnMap.delete(this.numberList[i]);
        }
        this.numberList = [];
    };
    return Columns;
}());
__reflect(Columns.prototype, "Columns");
//# sourceMappingURL=Columns.js.map