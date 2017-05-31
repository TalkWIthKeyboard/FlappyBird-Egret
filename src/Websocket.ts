class Websocket {

    private _socket;
    private _main;
    private numList = [0];

    public constructor(main) {
        this._main = main;
        this._socket = new egret.WebSocket();
        this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.onReceiveMessage, this);
        this._socket.addEventListener(egret.Event.CONNECT, this.onSocketOpen, this);
        this._socket.connectByUrl("ws://10.0.1.55:5500/");
    }

    private workForColumnString(str: string) {
        let column = str.split('?');
        let ans = [];
        for (let i = 0; i < column.length - 1; i ++) {
            let [number, high, x] = column[i].split('/');
            let obj = {'number': number, 'high': high, 'x': x};
            ans.push(obj);
        }
        return ans;
    }

    private onReceiveMessage(e:egret.Event) {
        let msg:string = this._socket.readUTF();
        let list = msg.split(',');
        switch (list[0]) {
            case 'start':
                if (list[1] === '0') {
                    let ans = [];
                    let info = list[2].split('/');
                    for (let i = 0; i < info.length - 1; i++) {
                        let [num, position] = info[i].split(':');
                        let [x, y] = position.split('|');
                        ans.push({'num': num, 'x': x, 'y': y});
                    }
                    this._main.startGame(ans);
                } else {
                    let [num, position] = list[2].split(':');
                    let [x, y] = position.split('|');
                    // 数据收集开关
                    if (this._main.columnOpen) 
                        this._main.birdMap.addBird({'num': num, 'x': x, 'y': y});
                }
                break;
            case 'dead':
                if (list[1]) 
                    this._main.birdMap.removeBird(list[1], true);
                break;
            case 'oldColumn':
                if (this._main.columnOpen) {
                    let reg = new RegExp('oldColumn,(.*),column,(.*)');
                    let [,oldColumn,column] = reg.exec(msg);
                    let oldColumnObj = this.workForColumnString(oldColumn);
                    let columnObj = this.workForColumnString(column);
                    if (this._main.columns !== undefined) this._main.columns.push(columnObj);
                }
                break;
            case 'position':
                let ans = [];
                let info = list[1].split('/');
                for (let i = 0; i < info.length - 1; i++) {
                    let [num, position] = info[i].split(':');
                    let [x, y] = position.split('|');
                    ans.push({'num': num, 'x': x, 'y': y});
                }
                this._main.birdMap.changePosition(ans);
                break;
        }
    }

    public onSocketOpen() {
        let high = Math.floor(Math.random()*400);
        let width = Math.floor(Math.random()*200);
        // let width = 200;
        this.sendMessage(`start,${width},${high}`);
    }

    public sendMessage(message) {
        this._socket.writeUTF(message);	
		this._socket.flush();
    }
}