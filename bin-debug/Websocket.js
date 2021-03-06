var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Websocket = (function () {
    function Websocket(main, name) {
        this.numList = [0];
        this._main = main;
        this.name = name;
        this._socket = new egret.WebSocket();
        this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this._socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this._socket.connectByUrl("ws://115.159.1.222:5500/");
    }
    Websocket.prototype.workForColumnString = function (str) {
        var column = str.split('?');
        var ans = [];
        for (var i = 0; i < column.length - 1; i++) {
            var _a = column[i].split('/'), number = _a[0], high = _a[1], x = _a[2];
            var obj = { 'number': number, 'high': high, 'x': x };
            ans.push(obj);
        }
        return ans;
    };
    Websocket.prototype.onReceiveMessage = function (e) {
        var msg = this._socket.readUTF();
        var list = msg.split(',');
        switch (list[0]) {
            case 'start':
                if (list[1] === '0') {
                    var ans_1 = [];
                    var info_1 = list[2].split('/');
                    for (var i = 0; i < info_1.length - 1; i++) {
                        var _a = info_1[i].split(':'), num = _a[0], position = _a[1];
                        var _b = position.split('|'), x = _b[0], y = _b[1], name_1 = _b[2];
                        ans_1.push({ 'num': num, 'x': x, 'y': y, 'name': name_1 });
                    }
                    this._main.startGame(ans_1);
                }
                else {
                    var _c = list[2].split(':'), num = _c[0], position = _c[1];
                    var _d = position.split('|'), x = _d[0], y = _d[1], name_2 = _d[2];
                    // 数据收集开关
                    if (this._main.columnOpen)
                        this._main.birdMap.addBird({ 'num': num, 'x': x, 'y': y, 'name': name_2 });
                }
                break;
            case 'dead':
                if (list[1] !== '')
                    this._main.birdMap.removeBird(list[1], true);
                else {
                    this._main.showName = new TextInput(this._main, list[2], null, 240, 340, 0, 220);
                    this._main.showScore = new TextInput(this._main, list[3], null, 240, 100, 250, 220);
                }
                break;
            case 'oldColumn':
                if (this._main.columnOpen) {
                    var reg = new RegExp('oldColumn,(.*),column,(.*)');
                    var _e = reg.exec(msg), oldColumn = _e[1], column = _e[2];
                    var oldColumnObj = this.workForColumnString(oldColumn);
                    var columnObj = this.workForColumnString(column);
                    if (this._main.columns !== undefined)
                        this._main.columns.push(columnObj);
                }
                break;
            case 'position':
                var ans = [];
                var info = list[1].split('/');
                for (var i = 0; i < info.length - 1; i++) {
                    var _f = info[i].split(':'), num = _f[0], position = _f[1];
                    var _g = position.split('|'), x = _g[0], y = _g[1];
                    ans.push({ 'num': num, 'x': x, 'y': y });
                }
                this._main.birdMap.changePosition(ans);
                break;
        }
    };
    Websocket.prototype.onSocketOpen = function () {
        var high = Math.floor(Math.random() * 400);
        var width = Math.floor(Math.random() * 200);
        this.sendMessage("start," + width + "," + high + "," + this.name);
    };
    Websocket.prototype.sendMessage = function (message) {
        this._socket.writeUTF(message);
        this._socket.flush();
    };
    return Websocket;
}());
__reflect(Websocket.prototype, "Websocket");
//# sourceMappingURL=Websocket.js.map