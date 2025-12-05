const amqp = require('amqplib');

class NotificationService {
    static async process(event) {
        console.log('⚙️ Processando evento e enviando ao Rabbit...');

        const connection = await amqp.connect('amqp://rabbitmq:5672');
        const channel = await connection.createChannel();

        const queue = 'notifications';
        await channel.assertQueue(queue, { durable: true });

        if (!event.destinatarioId) {
            console.log('📢 Evento é BROADCAST — será enviado a todos os usuários conectados');
            event.broadcast = true;
        } else {
            event.broadcast = false;
        }

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)));

        console.log('📤 Evento enviado para o RabbitMQ');
    }
}

module.exports = NotificationService;
