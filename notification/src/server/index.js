require('dotenv').config();

const express = require('express');
const http = require('http');
const notificationRoutes = require('../routes/notificationRoutes');
const WebSocketServer = require('../websocket/WebSocketServer');

const app = express();
app.use(express.json());

// Rotas
app.use('/api', notificationRoutes);

// Servidor HTTP
const server = http.createServer(app);

// WebSocket acoplado ao mesmo servidor
WebSocketServer.init(server);

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
  console.log(`✅ Notification service rodando na porta ${PORT}`);
});
