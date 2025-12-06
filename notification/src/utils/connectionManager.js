class ConnectionManager {
  constructor() {
    this.connections = new Map();
  }

  addConnection(usuarioId, socket) {
    const id = String(usuarioId);
    this.connections.set(id, socket);
  }

  removeConnection(usuarioId) {
    const id = String(usuarioId);
    this.connections.delete(id);
  }

  getConnection(usuarioId) {
    return this.connections.get(String(usuarioId));
  }

  getAllConnections() {
    return this.connections;
  }
}

module.exports = new ConnectionManager();
