const WebSocket = require('ws');
const ConnectionManager = require('./connectionManager');

class WebSocketServer {
  constructor() {
    this.wss = null;
  }

  initWebSocket(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', (socket, request) => {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const usuarioId = url.searchParams.get('usuarioId');

      console.log("🔌 CONEXÃO RECEBIDA:", usuarioId);

      ConnectionManager.addConnection(usuarioId, socket);

      socket.on('close', () => {
        ConnectionManager.removeConnection(usuarioId);
      });
    });

    console.log("✅ WebSocket (ws) ativo e escutando conexões");
  }

  emitNotification(notification) {
    console.log('📡 Enviando notificação via WebSocket (ws):', notification);

    const socket = ConnectionManager.getConnection(notification.destinatarioId);

    if (socket) {
      socket.send(JSON.stringify(notification));
    } else {
      console.log('⚠️ Usuário offline, notificação ficará apenas salva');
    }
  }
}

module.exports = new WebSocketServer();
