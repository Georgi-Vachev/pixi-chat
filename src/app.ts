/* globals io */

import * as PIXI from 'pixi.js';
import { TextStyle } from 'pixi.js';
import { Button } from './button';
import { ChatWindow } from './chatWindow';
import { InputField } from './inputField';
import { BaseTextures, createSpritesContainer, createTiles, drawIndicator } from './util';

// document.getElementById('init-form').addEventListener('submit', onSubmit);

const imgSoruces = ['assets/bevel.png', 'assets/hover.png', 'assets/inset.png'];
const baseTextures: BaseTextures = {} as BaseTextures;

let bevelTextures: PIXI.Texture[][];
let hoverTextures: PIXI.Texture[][];
let insetTextures: PIXI.Texture[][];

let inputField;
let roomInputField;
let usernameInputField;

let currentInput = "";
let roomId = '';
let username = '';
let symbol = '';
let socket = null;

//create and append app to body
const app = new PIXI.Application(
    {
        width: 800,
        height: 600,
        background: 0x4472c4
    });

document.body.appendChild(app.view as HTMLCanvasElement);

function welcomeScreen() {

    //load images
    imgSoruces.map((url: string) => {

        const bt = PIXI.BaseTexture.from(url)
            .on('loaded', () => console.log(`${url} loaded`))
            .on('error', () => console.log(`${url} did not load`));

        baseTextures[url] = bt;

    });

    bevelTextures = createTiles(baseTextures['assets/bevel.png']);
    hoverTextures = createTiles(baseTextures['assets/hover.png']);
    insetTextures = createTiles(baseTextures['assets/inset.png']);

    roomInputField = new InputField(
        "",
        drawIndicator(),
        createSpritesContainer(bevelTextures, 200, 50, 0x78a8f5),
        createSpritesContainer(bevelTextures, 200, 50, 0xd7e8f5),
        createSpritesContainer(hoverTextures, 200, 50),
    )

    usernameInputField = new InputField(
        "",
        drawIndicator(),
        createSpritesContainer(bevelTextures, 200, 50, 0x78a8f5),
        createSpritesContainer(bevelTextures, 200, 50, 0xd7e8f5),
        createSpritesContainer(hoverTextures, 200, 50),
    )

    const enterRoomBtn = new Button(
        'Enter',
        onSubmit,
        createSpritesContainer(bevelTextures, 150, 50),
        createSpritesContainer(hoverTextures, 150, 50),
        createSpritesContainer(insetTextures, 150, 50)
    );

    roomInputField.position.set(175, 240);
    usernameInputField.position.set(425, 240);
    enterRoomBtn.position.set(325, 315);

    const welcomeMsg = new PIXI.Text('Welcome to PIXI Chat!', new TextStyle({
        fontFamily: 'Arial',
        fontSize: 35,
        fill: 0xd3daf5,
    }));

    welcomeMsg.position.x = 222;
    welcomeMsg.position.y = 50;

    const roomIdMsg = new PIXI.Text('Room ID', new TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff
    }));

    roomIdMsg.position.x = 230;
    roomIdMsg.position.y = 210;

    const usernameMsg = new PIXI.Text('Username', new TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff
    }));

    usernameMsg.position.x = 470;
    usernameMsg.position.y = 210;

    app.stage.addChild(welcomeMsg, roomIdMsg, usernameMsg);
    app.stage.addChild(roomInputField, usernameInputField, enterRoomBtn);

}

function onSubmit() {
    socket = io();
    console.log('onSubmit')
    socket.on('connect', () => {
        socket.emit('selectRoom', roomId);
        console.log(`You (${username}) entered room ${roomId}`);
    });

    socket.on('symbol', (newSymbol, messages) => {
        symbol = newSymbol;
        startChat(messages);
    });
}

//initialization of assets, buttons, events
async function startChat(messages) {
    app.stage.removeChildren();
    socket.on('chat message', (msgs) => {
        chatWindow.messages = msgs;
    })

    socket.on('disconnect', () => {
        app.destroy(true);
    });

    socket.on('error', msg => alert(msg))

    const txtOutputContainer = new PIXI.Container();
    const txtInputContainer = new PIXI.Container();
    const btnContainer = new PIXI.Container();

    const chatWindow = new ChatWindow(
        messages,
        createSpritesContainer(bevelTextures, 750, 475, 0x78a8f5)
    )

    inputField = new InputField(
        currentInput,
        drawIndicator(),
        createSpritesContainer(bevelTextures, 575, 50, 0x78a8f5),
        createSpritesContainer(bevelTextures, 575, 50, 0xd7e8f5),
        createSpritesContainer(hoverTextures, 575, 50),
    )

    const sendBtn = new Button(
        'Send', () => {
            if (currentInput) {
                socket.emit('chat message', currentInput, username);
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
}

// when click is outside the input field - deselect it
app.view.addEventListener('click', (e: PointerEvent) => {
    if (inputField != undefined && inputField.isSelected) {
        if (!((e.clientX >= 35 && e.clientX <= 605) && (e.clientY >= 535 && e.clientY <= 580))) {
            inputField.indicator.renderable = false;
            inputField.deselect();
        }
    }
    if (roomInputField != undefined && roomInputField.isSelected) {
        if (!((e.clientX >= 180 && e.clientX <= 370) && (e.clientY >= 245 && e.clientY <= 295))) {
            roomInputField.indicator.renderable = false;
            roomInputField.deselect();
        }
    }
    if (usernameInputField != undefined && usernameInputField.isSelected) {
        if (!((e.clientX >= 430 && e.clientX <= 625) && (e.clientY >= 245 && e.clientY <= 295))) {
            usernameInputField.indicator.renderable = false;
            usernameInputField.deselect();
        }
    }
})

// keyboard event listener for input fields
document.addEventListener('keydown', (event) => {
    const inputRegex = /^[\w|\s|!@#$%^&*\\\/\[\]();:.~`'\-=,]$/
    const roomRegex = /^[\d]$/
    const usernameRegex = /^[\w]$/
    if (roomInputField != undefined && roomInputField.isSelected) {
        if (event.key.match(roomRegex) && roomId.length <= 3) {
            roomInputField.indicator.x = roomInputField.text.width + 15;
            roomId += event.key;
            roomInputField.input = roomId;
        } else if (event.key == 'Backspace') {
            roomInputField.indicator.x = roomInputField.text.width - 15;
            roomId = roomId.slice(0, roomId.length - 1);
            roomInputField.input = roomId;
        }
    } else if (usernameInputField != undefined && usernameInputField.isSelected) {
        if (event.key.match(usernameRegex) && username.length <= 10) {
            usernameInputField.indicator.x = usernameInputField.text.width + 15;
            username += event.key;
            usernameInputField.input = username;
            console.log(roomId);
        } else if (event.key == 'Backspace') {
            usernameInputField.indicator.x = usernameInputField.text.width - 15;
            username = username.slice(0, username.length - 1);
            usernameInputField.input = username;
        }
    } else if (inputField != undefined && inputField.isSelected) {
        if (event.key.match(inputRegex) && inputField.text.width < 540) {
            inputField.indicator.x = inputField.text.width + 15;
            currentInput += event.key;
            inputField.input = currentInput;
        } else if (event.key == 'Backspace') {
            inputField.indicator.x = inputField.text.width - 15;
            currentInput = currentInput.slice(0, currentInput.length - 1);
            inputField.input = currentInput;
        } else if (event.key == 'Enter') {
            if (currentInput) {
                socket.emit('chat message', currentInput, username);
            }
            currentInput = "";
            inputField.input = currentInput;
            inputField.indicator.position.x = 0;
        }
    }
    if (event.key == 'Enter' && inputField == undefined) {
        if (roomId != "" && username != "") {
            onSubmit();
        }
    }
})

//create update function and add it to the app ticker 
app.ticker.add(update);

let elapsed = 0;

function update(dt) {
    elapsed += dt;
    if (elapsed >= 30 && inputField != undefined && inputField.isSelected) {
        inputField.indicator.renderable = !inputField.indicator.renderable;
        elapsed = 0;
    } else if (elapsed >= 30 && roomInputField != undefined && roomInputField.isSelected) {
        roomInputField.indicator.renderable = !roomInputField.indicator.renderable;
        elapsed = 0;
    } else if (elapsed >= 30 && usernameInputField != undefined && usernameInputField.isSelected) {
        usernameInputField.indicator.renderable = !usernameInputField.indicator.renderable;
        elapsed = 0;
    }
}



welcomeScreen();