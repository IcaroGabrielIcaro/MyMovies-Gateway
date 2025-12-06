const WebSocket = require("ws");
const ConnectionManager = require("./connectionManager");

class WebSocketServer {
  constructor() {
    this.wss = null;
  }

  initWebSocket(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on("connection", async (socket, request) => {
      const url = new URL(request.url, `http://${request.headers.host}`);
      const usuarioId = url.searchParams.get("usuarioId");

      console.log("🔌 CONEXÃO RECEBIDA:", usuarioId);

      ConnectionManager.addConnection(usuarioId, socket);

      socket.on("close", () => {
        ConnectionManager.removeConnection(usuarioId);
      });
    });

    console.log("✅ WebSocket ativo e escutando conexões");
  }

  emitNotification(notification) {
    if (notification.broadcast === true) {
      const all = ConnectionManager.getAllConnections();
      for (const [userId, socket] of all.entries()) {
        socket.send(JSON.stringify(notification));
      }
      return;
    }

    const socket = ConnectionManager.getConnection(notification.destinatarioId);
    if (socket) {
      socket.send(JSON.stringify(notification));
    } else {
      console.log(
        `⚠️ Usuário ${notification.destinatarioId} offline → notificação não enviada`
      );
    }
  }
}

module.exports = new WebSocketServer();
