class TextInput {

    private main;
    public input;

    public constructor(main, text, x, y) {
        this.main = main;
        
        let input = new egret.TextField();
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

    public remove() {
        this.main.removeChild(this.input);
    }
}