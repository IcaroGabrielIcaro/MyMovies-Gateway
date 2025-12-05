class ConnectionManager {
  constructor() {
    this.connections = new Map();
  }

  addConnection(usuarioId, socket) {
    const id = String(usuarioId);
    this.connections.set(id, socket);
    console.log(`🟢 Usuário ${id} conectado`);
  }

  removeConnection(usuarioId) {
    const id = String(usuarioId);
    this.connections.delete(id);
    console.log(`🔴 Usuário ${id} desconectado`);
  }

  getConnection(usuarioId) {
    const id = String(usuarioId);
    const socket = this.connections.get(id);

    console.log(`🔍 Buscando conexão do usuário ${id} →`, socket ? "ENCONTRADO" : "NÃO ENCONTRADO");

    return socket;
  }

  getAllConnections() {
    return this.connections;
  }
}

module.exports = new ConnectionManager();
