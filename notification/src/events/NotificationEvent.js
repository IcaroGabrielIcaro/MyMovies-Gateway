const EventTypes = require('./EventTypes');

class NotificationEvent {
  constructor({ curtidorId, filmeId, destinatarioId, tipo }) {
    this.curtidorId = curtidorId;
    this.filmeId = filmeId;
    this.destinatarioId = destinatarioId;
    this.tipo = tipo;
    this.timestamp = new Date().toISOString();
  }

  isValid() {
    if (!this.curtidorId) return false;
    if (!this.filmeId) return false;
    if (!this.destinatarioId) return false;
    if (!this.tipo) return false;

    const tiposValidos = Object.values(EventTypes);
    if (!tiposValidos.includes(this.tipo)) return false;

    return true;
  }
}

module.exports = NotificationEvent;
