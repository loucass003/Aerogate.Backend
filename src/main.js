import http from 'http';
import SocketIO from 'socket.io';

const server = http.Server();
const io = new SocketIO(server);
const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log(`Connected ${socket}`);
    socket.on('test', function () {
        console.log("TEST !");
    });
});

server.listen(port, () => {
    console.log('[INFO] Listening on *:' + port);
});