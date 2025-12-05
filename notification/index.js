const express = require('express');
const http = require('http');
const notificationRoutes = require('./src/routes/notificationRoutes');
const WebSocketServer = require('./src/utils/websocket');
const { initRabbitConsumer } = require('./src/utils/rabbit');

const app = express();
app.use(express.json());
app.use('/api', notificationRoutes);

const server = http.createServer(app);

WebSocketServer.initWebSocket(server);

initRabbitConsumer();

server.listen(3000, () => {
  console.log('🚀 Servidor rodando na porta 3000');
});
