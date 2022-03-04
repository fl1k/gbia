import { settings } from './settings.mjs';
import net from 'net';
import { Akcija } from './utility.mjs';

import { World } from './world.mjs';
let world = null;

// Vama nebitno
class ClientSocket {
  clientSocket = null;
  game = 0;
  turn = 0;

  startConnection() {
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
      /*console.log(`Established a TCP connection with ${settings.SERVER}:${settings.PLAYER_NUM === 1
        ? settings.PORT_PLAYER_1 : settings.PORT_PLAYER_2}`);*/
      this.setTeamName();
    });
    this.clientSocket.connect(settings.PLAYER_NUM === 1 ?
      settings.PORT_PLAYER_1 : settings.PORT_PLAYER_2, settings.SERVER);

    this.clientSocket.on('data', (data) => {
      let msg = data.slice(8);
      const obj = JSON.parse(msg);
      if (world == null)
        world = new World(obj);
      else
        world.update(obj);
      msg = onTick();
      /*if(world.turn <80){
      this.sendMessage(msg);
      }else{
        setTimeout(()=>{
          this.sendMessage(msg);
        }, 3000)
      }*/
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


const clientSocket = new ClientSocket();
clientSocket.startConnection();
(function wait() {
  if (!clientSocket.game < settings.AMOUNT_OF_GAMES) setTimeout(wait, 1000);
})();


///
/// Ovde treba da se desi potez.
///
function onTick() {
  return Akcija.odrediAkciju(Akcija.akcije, world).toString();
}