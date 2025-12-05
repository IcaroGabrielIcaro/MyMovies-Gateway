class Notification {
    constructor({ destinatarioId, criadorId, filmeId, tipo }) {
        this.id = Math.random().toString(36).substring(7);
        this.destinatarioId = destinatarioId;
        this.criadorId = criadorId;
        this.filmeId = filmeId;
        this.tipo = tipo;
        this.lido = false;
        this.createdAt = new Date();
    }


    static database = [];


    static async create(data) {
        const notification = new Notification(data);
        this.database.push(notification);
        console.log('💾 Notificação salva na memória');
        return notification;
    }


    static async findAll({ where }) {
        return this.database.filter(n => n.destinatarioId == where.destinatarioId);
    }


    static async findByPk(id) {
        return this.database.find(n => n.id === id);
    }
}


module.exports = Notification;