class NotificationEvent {
    constructor(data) {
        this.destinatarioId = data.destinatarioId ?? null;
        this.criadorId = data.criadorId;
        this.filmeId = data.filmeId;
        this.tipo = data.tipo;
    }

    isValid() {

        if (this.tipo === 'FILME_CRIADO') {
            return this.criadorId != null && this.filmeId != null;
        }

        const precisaDestinatario = [
            'FILME_CURTIDO',
        ];

        if (precisaDestinatario.includes(this.tipo)) {
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
