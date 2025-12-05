const Notification = require('../models/Notification');
const WebSocketServer = require('../utils/websocket');

class NotificationHandler {
  static async handle(data) {
    console.log('🛠 Criando notificação...');

    const notification = await Notification.create(data);
    WebSocketServer.emitNotification(notification);
  }
}

module.exports = NotificationHandler;
