const EventTypes = require('../events/EventTypes');
const ConnectionManager = require('../websocket/ConnectionManager');
const Notification = require('../models/Notification');

class NotificationService {

  async process(event) {
    switch (event.tipo) {
      case EventTypes.FILME_CURTIDO:
        await this.processCurtida(event);
        break;

      case EventTypes.FILME_DESCURTIDO:
        await this.processDescurtida(event);
        break;

      default:
        console.log('Tipo de evento não tratado:', event.tipo);
    }
  }

  async processCurtida(event) {
    // 1) Salvar no banco
    const registro = await Notification.create({
      destinatarioId: event.destinatarioId,
      curtidorId: event.curtidorId,
      filmeId: event.filmeId,
      tipo: event.tipo
    });

    console.log("💾 Notificação salva:", registro.id);

    // 2) Buscar WebSocket e enviar ao vivo
    const socket = ConnectionManager.getConnection(event.destinatarioId);

    if (!socket) {
      console.log(`⚠ Usuário ${event.destinatarioId} offline. Notificação ficará pendente.`);
      return;
    }

    socket.send(JSON.stringify({
      id: registro.id,
      tipo: event.tipo,
      curtidorId: event.curtidorId,
      filmeId: event.filmeId,
      timestamp: registro.createdAt
    }));
  }

  async processDescurtida(event) {
    const registro = await Notification.create({
      destinatarioId: event.destinatarioId,
      curtidorId: event.curtidorId,
      filmeId: event.filmeId,
      tipo: event.tipo
    });

    const socket = ConnectionManager.getConnection(event.destinatarioId);

    if (socket) {
      socket.send(JSON.stringify({
        id: registro.id,
        tipo: event.tipo,
        curtidorId: event.curtidorId,
        filmeId: event.filmeId,
        timestamp: registro.createdAt
      }));
    }
  }
}

module.exports = new NotificationService();
