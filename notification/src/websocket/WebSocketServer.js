const WebSocket = require('ws');
const ConnectionManager = require('../websocket/ConnectionManager');

class WebSocketServer {
  constructor() {
    this.wss = null;
  }

  init(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', (socket, request) => {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const usuarioId = url.searchParams.get('usuarioId');

      console.log("CONEXÃO RECEBIDA:", usuarioId);

      ConnectionManager.addConnection(usuarioId, socket);

      socket.on('close', () => {
        ConnectionManager.removeConnection(usuarioId);
      });
    });

    console.log("✅ WebSocket ativo e escutando conexões");
  }
}

module.exports = new WebSocketServer();
