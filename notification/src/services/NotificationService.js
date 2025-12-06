const amqp = require("amqplib");

class NotificationService {
    static async process(event) {
        const connection = await amqp.connect("amqp://rabbitmq:5672");
        const channel = await connection.createChannel();

        const queue = "notifications";
        await channel.assertQueue(queue, { durable: true });

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(event)));

        console.log("📤 Evento enviado para o RabbitMQ");
    }
}

module.exports = NotificationService;
