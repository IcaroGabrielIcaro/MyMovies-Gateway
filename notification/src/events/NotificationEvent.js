class NotificationEvent {
    constructor(data) {
        this.destinatarioId = data.destinatarioId;
        this.criadorId = data.criadorId;
        this.filmeId = data.filmeId;
        this.tipo = data.tipo;
    }


    isValid() {
        return this.destinatarioId && this.criadorId && this.tipo;
    }
}


module.exports = NotificationEvent;