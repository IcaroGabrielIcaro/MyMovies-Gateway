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
      const token = url.searchParams.get("token");

      console.log("🔌 CONEXÃO RECEBIDA:", usuarioId, " TOKEN:", token);

      // Agora salva socket + token
      ConnectionManager.addConnection(usuarioId, socket, token);

      socket.on("close", () => {
        ConnectionManager.removeConnection(usuarioId);
      });
    });

    console.log("✅ WebSocket ativo e escutando conexões");
  }

  emitNotification(notification) {
    if (notification.broadcast === true) {
      console.log('broadcast');
      const all = ConnectionManager.getAllConnections();

      for (const [userId, conn] of all.entries()) {
        if (conn?.socket) {
          conn.socket.send(JSON.stringify(notification));
        }
      }
      return;
    }

    console.log('nao broadcast');
    const conn = ConnectionManager.getConnection(notification.destinatarioId);

    if (conn?.socket) {
      conn.socket.send(JSON.stringify(notification));
    } else {
      console.log(
        `⚠️ Usuário ${notification.destinatarioId} offline → notificação não enviada`
      );
    }
  }
}

module.exports = new WebSocketServer();
