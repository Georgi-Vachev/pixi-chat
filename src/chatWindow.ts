import { Container, DisplayObject, Text, TextStyle } from 'pixi.js';


const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,

});

export class ChatWindow extends Container {
    _messages: string[];
    text: Text;

    constructor(
        messages: string[],
        private element: DisplayObject,
    ) {
        super();

        this.addChild(this.element);
        this.text = new Text(messages.join(""), style);
        this.text.position.set(20, 12);

        this._messages = messages;

        this.addChild(this.text);

        this.interactive = true;

        // this.on('pointerenter', this.onEnter.bind(this));
        // this.on('pointerleave', this.onLeave.bind(this));
        // this.on('pointerdown', this.onDown.bind(this));
    }

    get messages() {
        return this._messages;
    }

    set messages(value: string[]) {
        this._messages = value;
        this.text.text = value.join("");
        console.log('sda')
    }

    // private onEnter() {
    //     this.element.renderable = false;
    //     this.highlight.renderable = true;
    // }

    // private onLeave() {
    //     this.element.renderable = true;
    //     this.highlight.renderable = false;
    // }

    // private onDown() {
    //     console.log(this.text.text);
    // }
}