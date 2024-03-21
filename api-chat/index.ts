import express from 'express';
import { Server } from 'socket.io';
import http from 'http';

const port = 6699;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: 'http://localhost:5173' }
});

const messages = <any>[];

server.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
});

io.on('connection', (socket) => {
    console.log(`Cliente ${socket.id} conectado!`);

    socket.on('setName', (name) => {
        socket.data.name = name;
    });

    socket.on('message', (msg) => {
        const message = {
            id: socket.id,
            mensagem: msg,
            user: socket.data.name
        };
        messages.push(message);

        io.emit('sendMessage', message);
    });

    socket.on('requestStoredMessages', () => {
        socket.emit('storedMessages', messages);
    });

    socket.on('disconnect', () => {
        console.log(`Cliente ${socket.id} desconectado!`);
    });
});