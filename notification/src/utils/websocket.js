const WebSocket = require("ws");
const ConnectionManager = require("./connectionManager");
const Notification = require("../models/notification");

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

      // ------------------------------------------------------------
      // 🔥 Enviar notificações pendentes ao usuário recém-conectado
      // ------------------------------------------------------------
      const pendentes = Notification.database.filter(
        (n) => n.destinatarioId == usuarioId && !n.lido
      );

      if (pendentes.length > 0) {
        console.log(
          `📨 Enviando ${pendentes.length} notificações pendentes → usuário ${usuarioId}`
        );
      }

      for (const notif of pendentes) {
        socket.send(JSON.stringify(notif));
      }

      socket.on("close", () => {
        ConnectionManager.removeConnection(usuarioId);
      });
    });

    console.log("✅ WebSocket (ws) ativo e escutando conexões");
  }

  emitNotification(notification) {
    // ------------------------------------------------------------
    // 🟦 BROADCAST → enviar para todos os usuários conectados
    // ------------------------------------------------------------
    if (notification.broadcast === true) {
      console.log("📡 [BROADCAST] Enviando para TODOS os usuários conectados");

      const all = ConnectionManager.getAllConnections();

      for (const [userId, socket] of all.entries()) {
        console.log(`➡️ Enviando BROADCAST para usuário ${userId}`);
        socket.send(JSON.stringify(notification));
      }

      return; // importantíssimo
    }

    // ------------------------------------------------------------
    // 🟩 NÃO é broadcast → envio individual
    // ------------------------------------------------------------
    console.log("📡 Enviando notificação via WebSocket (ws):", notification);

    const socket = ConnectionManager.getConnection(notification.destinatarioId);

    if (socket) {
      socket.send(JSON.stringify(notification));
    } else {
      console.log(
        `⚠️ Usuário ${notification.destinatarioId} offline → será entregue depois`
      );
    }
  }
}

module.exports = new WebSocketServer();
