class ConnectionManager {
  constructor() {
    this.connections = new Map();
  }

  addConnection(usuarioId, socket, token) {
    const id = String(usuarioId);
    this.connections.set(id, { socket, token });
    console.log(`🟢 Usuário ${id} conectado (token salvo)`);
  }

  removeConnection(usuarioId) {
    const id = String(usuarioId);
    this.connections.delete(id);
    console.log(`🔴 Usuário ${id} desconectado`);
  }

  getConnection(usuarioId) {
    return this.connections.get(String(usuarioId)); // retorna {socket, token}
  }

  getAllConnections() {
    return this.connections; // Map com {socket, token}
  }
}

module.exports = new ConnectionManager();
