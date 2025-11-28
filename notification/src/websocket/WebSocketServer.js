const WebSocket = require('ws');
const ConnectionManager = require('./ConnectionManager');

class WebSocketServer {
  init(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', (socket, request) => {
      const params = new URLSearchParams(request.url.replace('/?', ''));
      const usuarioId = params.get('usuarioId');

      if (!usuarioId) {
        socket.close();
        return;
      }

      ConnectionManager.addConnection(usuarioId, socket);

      socket.on('close', () => {
        ConnectionManager.removeConnection(usuarioId);
      });
    });

    console.log('✅ WebSocket ativo');
  }
}

module.exports = new WebSocketServer();
