import { Container, DisplayObject, Text, TextStyle } from 'pixi.js';


const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,

});

export class InputField extends Container {
    _input: string;
    text: Text;

    constructor(
        input: string,
        private callback: () => void,
        private element: DisplayObject,
        private highlight: DisplayObject,

    ) {
        super();

        this.addChild(this.element, this.highlight);
        this.highlight.renderable = false;
        this._input = input;
        this.text = new Text(input, style);
        // this.text.anchor.set(-0.1, -0.5);
        this.text.position.set(20, 12);

        this.addChild(this.text);

        this.interactive = true;

        this.on('pointerenter', this.onEnter.bind(this));
        this.on('pointerleave', this.onLeave.bind(this));
        this.on('pointerdown', this.onDown.bind(this));
    }

    get input() {
        return this._input;
    }

    set input(value: string) {
        this._input = value;
        this.text.text = value;
    }

    private onEnter() {
        this.element.renderable = false;
        this.highlight.renderable = true;
    }

    private onLeave() {
        this.element.renderable = true;
        this.highlight.renderable = false;
    }

    private onDown() {
        console.log(this.text.text);
    }
}