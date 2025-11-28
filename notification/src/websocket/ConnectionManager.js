class ConnectionManager {
  constructor() {
    this.connections = new Map(); // usuarioId -> socket
  }

  addConnection(usuarioId, socket) {
    this.connections.set(usuarioId, socket);
    console.log(`🟢 Usuário ${usuarioId} conectado`);
  }

  removeConnection(usuarioId) {
    this.connections.delete(usuarioId);
    console.log(`🔴 Usuário ${usuarioId} desconectado`);
  }

  getConnection(usuarioId) {
    return this.connections.get(usuarioId);
  }

  hasConnection(usuarioId) {
    return this.connections.has(usuarioId);
  }
}

module.exports = new ConnectionManager();
