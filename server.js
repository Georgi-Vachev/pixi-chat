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
        if (users.size >= 3) {
            console.log('room is full')
            socket.emit('error', 'Room is full!');
            socket.disconnect();
        } else {
            socket.join(roomId);
            console.log(users.size)
            initChat(roomId, users, socket, messages);
        }
    });
});

function initChat(roomId, users, socket, messages) {
    let username = '';
    socket.on("chat message", (input, user) => {
        if (messages.length >= 17) {
            messages.shift();
        }
        messages.push(`${user}: ${input}\n`);
        io.to(roomId).emit('chat message', messages);
        username = user;
    })

    socket.on('disconnect', () => {
        console.log('User left');
        users.delete(socket);
    });

    users.set(socket, username);
    socket.emit('symbol', messages);
};

server.listen(3000, () => console.log('Server is listening on port 3000'));