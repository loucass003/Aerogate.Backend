import http from 'http';
import SocketIO from 'socket.io';
import wpa_cli from 'wireless-tools/wpa_cli'
import { Sniffer } from './radio'
import { connectTo, check } from './wifi_tools';

const server = http.Server();
const io = new SocketIO(server);
const port = process.env.PORT || 3000;
const wlinterface = process.env.INTERFACE || 'wlx3c33005e6271';

const rfSniffer = new Sniffer();


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
        connectTo({ssid, password}, (err) => {
            if (!err)
                check(ssid, (err, { connected }) => {
                    const output = !err && connected 
                    ? { connected } 
                    : { error: 'Failed to connect. Verify password' };
                    console.log(output);
                    socket.emit(
                        'connect_output', 
                        output);
                });
            else socket.emit('connect_output', { error : `Unable to create the network ${ssid}` });
        });
    });
});


rfSniffer.on('data', ({ id, command, value: { int: value }, time }) => {
    console.log(id, command, value);
    let v = value == 4294967169 ? -1 : value;
    switch(command) {
        case 1: {
            break;
        }
        case 2: {
            console.log("emmit 2")
            io.emit("temperatures", { ext: v });
            break;
        }
        case 3: {
            io.emit("temperatures", { inter: v });
            break;
        }
        case 4: {
            io.emit("clapet", { angle: v });
            break;
        }
    }
});

function random(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

server.listen(port, () => {
    console.log('[INFO] Listening on *:' + port);
    console.log('start ticker');

   /* setInterval(() => { //TODO: export ticker
        inter += inter > 19 ? random(-1, 1) * 1 : 0; 
        ext += ext > 3 ? random(-1, 1) * 1 : 1;
        io.emit("temperatures", { inter, ext });
    }, 500);*/
});

export { wlinterface, io };
