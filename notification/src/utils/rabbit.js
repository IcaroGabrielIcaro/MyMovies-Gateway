const amqp = require('amqplib');
const NotificationHandler = require('../handlers/notificationHandler');


class RabbitMQ {
    static async initRabbitConsumer() {
        console.log('🐇 Conectando ao RabbitMQ...');


        const connection = await amqp.connect('amqp://rabbitmq:5672');
        const channel = await connection.createChannel();


        const queue = 'notifications';
        await channel.assertQueue(queue, { durable: true });


        console.log('✅ Consumidor conectado à fila:', queue);


        channel.consume(queue, async (msg) => {
            const data = JSON.parse(msg.content.toString());
            console.log('📥 Mensagem recebida do Rabbit:', data);


            await NotificationHandler.handle(data);
            channel.ack(msg);
        });
    }
}


module.exports = { initRabbitConsumer: RabbitMQ.initRabbitConsumer };