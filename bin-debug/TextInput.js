var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var TextInput = (function () {
    function TextInput(main, text, x, y) {
        this.main = main;
        var input = new egret.TextField();
        input.text = text;
        input.width = 240;
        input.height = 30;
        input.x = this.main.measured.stageW / 2 - input.width / 2;
        input.y = y;
        input.border = true;
        input.borderColor = 0xFFFFFF;
        input.textAlign = egret.HorizontalAlign.CENTER;
        input.type = egret.TextFieldType.INPUT;
        this.input = input;
        this.main.addChildAt(this.input, 1);
    }
    TextInput.prototype.remove = function () {
        this.main.removeChild(this.input);
    };
    return TextInput;
}());
__reflect(TextInput.prototype, "TextInput");
//# sourceMappingURL=TextInput.js.map