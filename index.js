const settings = require('./settings.js');
const Communication = require('./communication.js');

const communication = new Communication();
communication.startConnection();
(function wait () {
  if (!communication.clientSocket.game < settings.AMOUNT_OF_GAMES) setTimeout(wait, 1000);
})();