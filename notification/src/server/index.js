require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');

const notificationRoutes = require('../routes/notificationRoutes');
const WebSocketServer = require('../websocket/WebSocketServer');
const sequelize = require('../database/db');   // <-- IMPORTANTE

const app = express();
app.use(express.json());

// CORS
app.use(cors({
  origin: ["http://web-client:4200", "http://localhost:4200"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// 🔥 SINCRONIZAR BANCO AQUI ANTES DE SUBIR O SERVIDOR
(async () => {
  try {
    await sequelize.sync();
    console.log("📦 Banco sincronizado com sucesso.");
  } catch (err) {
    console.error("❌ ERRO AO INICIALIZAR BANCO:", err);
  }
})();

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
