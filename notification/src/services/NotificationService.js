const EventTypes = require('../events/EventTypes');
const ConnectionManager = require('../websocket/ConnectionManager');

class NotificationService {
  process(event) {
    switch (event.tipo) {
      case EventTypes.FILME_CURTIDO:
        this.processCurtida(event);
        break;

      case EventTypes.FILME_DESCURTIDO:
        this.processDescurtida(event);
        break;

      default:
        console.log('Tipo de evento não tratado:', event.tipo);
    }
  }

  processCurtida(event) {
    const socket = ConnectionManager.getConnection(event.destinatarioId);

    if (socket) {
      socket.send(JSON.stringify({
        tipo: EventTypes.FILME_CURTIDO,
        curtidorId: event.curtidorId,
        filmeId: event.filmeId,
        timestamp: event.timestamp
      }));
    }
  }

  processDescurtida(event) {
    const socket = ConnectionManager.getConnection(event.destinatarioId);

    if (socket) {
      socket.send(JSON.stringify({
        tipo: EventTypes.FILME_DESCURTIDO,
        curtidorId: event.curtidorId,
        filmeId: event.filmeId,
        timestamp: event.timestamp
      }));
    }
  }
}

module.exports = new NotificationService();
