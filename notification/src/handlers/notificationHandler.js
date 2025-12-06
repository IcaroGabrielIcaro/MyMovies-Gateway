const Notification = require("../models/notification");
const WebSocketServer = require("../utils/websocket");

class NotificationHandler {
  static async handle(data) {
    const notification = await Notification.create(data);
    WebSocketServer.emitNotification(notification);
  }
}

module.exports = NotificationHandler;
