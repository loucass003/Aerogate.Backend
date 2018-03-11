import http from 'http';
import SocketIO from 'socket.io';
import wpa_cli from 'wireless-tools/wpa_cli'

const server = http.Server();
const io = new SocketIO(server);
const port = process.env.PORT || 3000;
const wlinterface = process.env.INTERFACE || 'wlxacf1df10c421';

let inter = 20;
let ext = 9;


io.on('connection', (socket) => {
    console.log(`Connected ${socket}`);

    socket.on('refresh_networks', () => {
        wpa_cli.scan(wlinterface, () => {
            wpa_cli.scan_results(wlinterface, (err, data) => {
                socket.emit("wifi_list", { data });
            });
        });
    })
});

function random(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

server.listen(port, () => {
    console.log('[INFO] Listening on *:' + port);
    console.log('start ticker');

    setInterval(() => { //TODO: export ticker
        inter += inter > 19 ? random(-1, 1) * 1 : 0; 
        ext += ext > 3 ? random(-1, 1) * 1 : 1;
        io.emit("temperatures", { inter, ext });
    }, 500);
});