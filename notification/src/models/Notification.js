class Notification {
    constructor({ destinatarioId, criadorId, filmeId, tipo, broadcast }) {
        this.id = Math.random().toString(36).substring(7);
        this.destinatarioId = destinatarioId;
        this.criadorId = criadorId;
        this.filmeId = filmeId;
        this.tipo = tipo;
        this.broadcast = broadcast ?? false;
        this.lido = false;
        this.createdAt = new Date();
    }

    static database = [];

    static async create(data) {
        if (data.tipo === "FILME_CRIADO") {
            data.broadcast = true;
        }
        const deveSalvar = data.tipo === "FILME_CURTIDO";

        const notification = new Notification(data);

        if (deveSalvar) {
            this.database.push(notification);
        }

        return notification;
    }

    static async findAll({ where }) {
        return this.database.filter(
            (n) => n.destinatarioId == where.destinatarioId
        );
    }

    static async findByPk(id) {
        return this.database.find((n) => n.id === id);
    }
}

module.exports = Notification;
