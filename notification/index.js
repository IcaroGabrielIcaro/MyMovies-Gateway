const express = require('express');
const http = require('http');
const notificationRoutes = require('./src/routes/notificationRoutes');
const WebSocketServer = require('./src/utils/websocket');
const { initRabbitConsumer } = require('./src/utils/rabbit');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());

app.use('/api', notificationRoutes);

const server = http.createServer(app);

WebSocketServer.initWebSocket(server);

initRabbitConsumer();

server.listen(3003, () => {
  console.log('🚀 Servidor rodando na porta 3003');
});
