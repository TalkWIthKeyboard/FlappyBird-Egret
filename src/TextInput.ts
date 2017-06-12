class TextInput {

    private main;
    public input;

    public constructor(main, text, type, height, width, x, y) {
        this.main = main;
        
        let input = new egret.TextField();
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
        } else {
            input.border = false;
            input.textColor = 0x000000;
        }
        this.input = input;
        this.main.addChildAt(this.input, 3);
    }

    public remove() {
        this.main.removeChild(this.input);
    }
}