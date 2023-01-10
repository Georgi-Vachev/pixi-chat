const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const app = express();
app.use('/', express.static('dist'));

const server = http.createServer(app);
const io = socketIO(server);

const rooms = {};
const chats = {};

io.on('connect', socket => {
    console.log('User connected');

    socket.on('selectRoom', roomId => {
        if (rooms[roomId] == undefined) {
            rooms[roomId] = new Map();
        }
        if (chats[roomId] == undefined) {
            chats[roomId] = [];
        }
        const users = rooms[roomId];
        const messages = chats[roomId];
        if (users.size >= 2) {
            socket.emit('error', 'Room is full!');
            socket.disconnect();
        } else {
            socket.join(roomId);
            initChat(roomId, users, socket, messages);
        }
    });
});

function initChat(roomId, users, socket, messages) {
    socket.on("chat message", (input, sym) => {
        if (messages.length >= 17) {
            messages.shift();
        }
        messages.push(`${sym}: ${input}\n`);
        io.to(roomId).emit('chat message', messages);
    })

    socket.on('disconnect', () => {
        console.log('User left');
        users.delete(socket);
    });

    let symbol = 'X';

    if (users.size > 0) {
        const otherSymbol = [...users.values()][0];
        if (otherSymbol == 'X') {
            symbol = 'O';
        }
    }

    users.set(socket, symbol);
    console.log('Assigning symbol', symbol);
    socket.emit('symbol', symbol, messages);
};

server.listen(3000, () => console.log('Server is listening on port 3000'));