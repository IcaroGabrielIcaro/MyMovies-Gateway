class NotificationEvent {
    constructor(data) {
        this.destinatarioId = data.destinatarioId ?? null;
        this.criadorId = data.criadorId;
        this.filmeId = data.filmeId;
        this.tipo = data.tipo;
    }

    isValid() {
        if (this.tipo === "FILME_CRIADO") {
            return this.criadorId != null && this.filmeId != null;
        }

        if (this.tipo === "FILME_CURTIDO") {
            return (
                this.destinatarioId != null &&
                this.criadorId != null &&
                this.tipo != null
            );
        }

        return false;
    }
}

module.exports = NotificationEvent;
