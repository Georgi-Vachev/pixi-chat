import * as PIXI from 'pixi.js';
import { Button } from './button';
import { ChatWindow } from './chatWindow';
import { InputField } from './inputField';
import { createSpritesContainer, createTiles } from './util';

const imgSoruces = ['assets/bevel.png', 'assets/hover.png', 'assets/inset.png'];
let currentInput = "";
const messages = [];
const archivedMessages = [];
//create and append app to body
const app = new PIXI.Application(
    {
        width: 800,
        height: 600,
        background: 0x4472c4
    });

document.body.appendChild(app.view as HTMLCanvasElement);

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

    const indicator = new PIXI.Graphics();
    indicator.beginFill(0xFFFFFF);
    indicator.drawRect(20, 10, 3, 30);

    const chatWindow = new ChatWindow(
        messages,
        createSpritesContainer(bevelTextures, 750, 475, 0x78a8f5)
    )

    const inputField = new InputField(
        currentInput,
        indicator,
        createSpritesContainer(bevelTextures, 575, 50, 0x78a8f5),
        createSpritesContainer(bevelTextures, 575, 50, 0xd7e8f5),
        createSpritesContainer(hoverTextures, 575, 50),
    )

    const sendBtn = new Button(
        'Send', () => {
            if (currentInput) {
                if (messages.length >= 17) {
                    archivedMessages.push(messages.shift());
                }
                messages.push(`${currentInput}\n`)
                chatWindow.messages = messages;
            }
            currentInput = "";
            inputField.input = currentInput;
            inputField.indicator.position.x = 0;
        },
        createSpritesContainer(bevelTextures, 150, 50),
        createSpritesContainer(hoverTextures, 150, 50),
        createSpritesContainer(insetTextures, 150, 50)
    );

    txtOutputContainer.addChild(chatWindow).position.set(25, 25);
    txtInputContainer.addChild(inputField).position.set(25, 525);
    btnContainer.addChild(sendBtn);

    btnContainer.position.set(625, 525)
    app.stage.addChild(txtOutputContainer, txtInputContainer, btnContainer);

    // event listener for input
    document.addEventListener('keydown', (event) => {
        const keyRegex = /^[\w|\s|!@#$%^&*\\\/\[\]();:.~`'\-=,]$/
        if (event.key.match(keyRegex) && inputField.text.width < 540) {
            inputField.indicator.x = inputField.text.width + 15;
            currentInput += event.key;
            inputField.input = currentInput;
        } else if (event.key == 'Backspace') {
            inputField.indicator.x = inputField.text.width - 15;
            currentInput = currentInput.slice(0, currentInput.length - 1);
            inputField.input = currentInput;
        } else if (event.key == 'Enter') {
            if (currentInput) {
                if (messages.length >= 17) {
                    archivedMessages.push(messages.shift());
                }
                messages.push(`${currentInput}\n`)
                chatWindow.messages = messages;
            }
            currentInput = "";
            inputField.input = currentInput;
            inputField.indicator.position.x = 0;
        }
    })

    // when click is outside the input field - deselect it
    app.view.addEventListener('click', (e: PointerEvent) => {
        if (inputField.isSelected) {
            if (!((e.clientX >= 35 && e.clientX <= 605) && (e.clientY >= 535 && e.clientY <= 580))) {
                inputField.indicator.renderable = false;
                inputField.deselect();
            }
        }

    })

    //create update function and add it to the app ticker 
    app.ticker.add(update);

    let elapsed = 0;

    function update(dt) {
        elapsed += dt;
        if (elapsed >= 30 && inputField.isSelected) {
            inputField.indicator.renderable = !inputField.indicator.renderable;
            elapsed = 0;
        }
    }
}

start();