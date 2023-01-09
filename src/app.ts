import * as PIXI from 'pixi.js';
import { Button } from './button';
import { InputField } from './inputField';
import { createSpritesContainer, createTiles } from './util';

const imgSoruces = ['assets/bevel.png', 'assets/hover.png', 'assets/inset.png'];
let currentInput = "";
const messages = [];
//create and append app to body
const app = new PIXI.Application(
    {
        width: 800,
        height: 600,
        background: 0x4472c4
    });

document.body.appendChild(app.view as HTMLCanvasElement);

//create update function and add it to the app ticker 
app.ticker.add(update);

function update(dt) {

}

//initialization of assets, buttons, events
async function start() {

    //load images
    interface BaseTextures {
        urlString: PIXI.BaseTexture;
    }
    const baseTextures: BaseTextures = {} as BaseTextures;

    imgSoruces.map((url: string) => {

        const bt = PIXI.BaseTexture.from(url)
            .on('loaded', () => console.log(`${url} loaded`))
            .on('error', () => console.log(`${url} did not load`));

        baseTextures[url] = bt;

    });

    const bevelTextures: PIXI.Texture[][] = createTiles(baseTextures['assets/bevel.png']);
    const hoverTextures: PIXI.Texture[][] = createTiles(baseTextures['assets/hover.png']);
    const insetTextures: PIXI.Texture[][] = createTiles(baseTextures['assets/inset.png']);

    const txtOutputContainer = new PIXI.Container();
    const txtInputContainer = new PIXI.Container();
    const btnContainer = new PIXI.Container();

    const inputField = new InputField(
        currentInput,
        () => { console.log('test') },
        createSpritesContainer(bevelTextures, 575, 50, 0x78a8f5),
        createSpritesContainer(bevelTextures, 575, 50, 0xd7e8f5)
    )

    const sendBtn = new Button(
        'Send', () => {
            console.log(currentInput)
            currentInput = "";
            inputField.input = currentInput;
        },
        createSpritesContainer(bevelTextures, 150, 50),
        createSpritesContainer(hoverTextures, 150, 50),
        createSpritesContainer(insetTextures, 150, 50)
    );

    txtOutputContainer.addChild(createSpritesContainer(bevelTextures, 750, 475, 0x78a8f5)).position.set(25, 25);
    txtInputContainer.addChild(inputField);
    txtInputContainer.position.set(25, 525);
    btnContainer.addChild(sendBtn);
    btnContainer.position.set(625, 525)
    app.stage.addChild(txtOutputContainer, txtInputContainer, btnContainer);

    document.addEventListener('keydown', (event) => {
        const keyRegex = /^[\w|\s|!@#$%^&*\\\/\[\]();:.~`'\-=,]$/
        if (event.key.match(keyRegex)) {
            currentInput += event.key;
            inputField.input = currentInput;
        } else if (event.key == 'Backspace') {
            currentInput = currentInput.slice(0, currentInput.length - 1);
            inputField.input = currentInput;
        } else if (event.key == 'Enter') {
            console.log(currentInput)
            currentInput = "";
            inputField.input = currentInput;
        }
    })

}

start();