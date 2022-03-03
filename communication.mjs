const settings = require('./settings.js');
const net = require('net');

// Socket
class Communication {
    clientSocket = null;
    dto = null;
    game = 0;
    turn = 0;

    startConnection() {
        console.log('connecting...')
        this.turn = 0;
        this.clientSocket = new net.Socket();
        this.addEvents();
    }

    sendMessage(msg) {
        if (this.turn <= settings.RESTART_TURN) {
            this.turn++;
            this.clientSocket.write(msg);
        } else {
            this.game++;
            if (settings.PLAYER_NUM == 1) {
                this.clientSocket.write(settings.RESTART_STRING);
            }
        }
    }

    setTeamName() {
        this.sendMessage(settings.TEAM_NAME);
    }

    addEvents() {
        this.clientSocket.on('connect', () => {
            this.clientSocket.setEncoding("utf8");
            console.log(`Established a TCP connection with ${settings.SERVER}:${settings.PLAYER_NUM === 1
                 ? settings.PORT_PLAYER_1 : settings.PORT_PLAYER_2}`);
            this.setTeamName();
        });
        this.clientSocket.connect(settings.PLAYER_NUM === 1 ? settings.PORT_PLAYER_1 : settings.PORT_PLAYER_2, settings.SERVER);

        this.clientSocket.on('data', (data) => {
            console.log(data);
            let msg = data.slice(8);
            this.dto = JSON.parse(msg);
            msg = bi.botInput(this.dto);
            this.sendMessage(msg);
        });

        this.clientSocket.on('close', (data) => {
            var time_to_wait = settings.PLAYER_NUM === 1 ? 
            settings.PLAYER_1_WAIT : settings.PLAYER_2_WAIT;
            setTimeout(() => {
                this.startConnection();
            }, time_to_wait);
        });
    }
}

module.exports = Communication;