var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var TextInput = (function () {
    function TextInput(main, text, type, height, width, x, y) {
        this.main = main;
        var input = new egret.TextField();
        input.text = text;
        input.width = width;
        input.height = height;
        input.x = x == 0 ? this.main.measured.stageW / 2 - input.width / 2 : x;
        input.y = y;
        input.border = true;
        input.borderColor = 0xFFFFFF;
        if (type === 'INPUT') {
            input.type = egret.TextFieldType.INPUT;
            input.textAlign = egret.HorizontalAlign.CENTER;
        }
        else {
            input.border = false;
            input.textColor = 0x000000;
        }
        this.input = input;
        this.main.addChildAt(this.input, 3);
    }
    TextInput.prototype.remove = function () {
        this.main.removeChild(this.input);
    };
    return TextInput;
}());
__reflect(TextInput.prototype, "TextInput");
//# sourceMappingURL=TextInput.js.map