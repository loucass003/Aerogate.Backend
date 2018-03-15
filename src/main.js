import http from 'http';
import SocketIO from 'socket.io';
import wpa_cli from 'wireless-tools/wpa_cli'
import { connectTo, check } from './wifi_tools';

const server = http.Server();
const io = new SocketIO(server);
const port = process.env.PORT || 3000;
const wlinterface = process.env.INTERFACE || 'wlx3c33005e6271';

let inter = 20;
let ext = 9;


io.on('connection', (socket) => {
    console.log(`Connected ${socket}`);

    socket.on('refresh_networks', () => {
        wpa_cli.scan(wlinterface, () => {
            wpa_cli.scan_results(wlinterface, (err, data) => {
                wpa_cli.status(wlinterface, function(err, status) {
                    console.dir(status);
                    data.filter(({ bssid }) => bssid == status.bssid)
                        .map(n => n.connected = true);
                    socket.emit("wifi_list", { data });
                });
            });
        });
    });

    socket.on('choose_network', (ssid, password) => {
        console.log("TRY TO CONNECT !", ssid, password);
        connectTo({ssid, password}, function(err) {
            if (!err) { //Network created correctly
              setTimeout(function () {
                check(ssid, function (err, status) {
                  if (!err && status.connected) {
                    console.log('Connected to the network ' + ssid + '!');
                  } else {
                    console.log('Unable to connect to the network ' + ssid + '!');
                  }
                });
              }, 2000);
            } else {
              console.log('Unable to create the network ' + ssid + '.');
            }
        });
    });
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

export { wlinterface };