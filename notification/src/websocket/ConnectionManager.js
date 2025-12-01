class ConnectionManager {
  constructor() {
    this.connections = new Map(); // usuarioId(string) -> socket
  }

  addConnection(usuarioId, socket) {
    const id = String(usuarioId);  // <--- correção
    this.connections.set(id, socket);
    console.log(`🟢 Usuário ${id} conectado`);
  }

  removeConnection(usuarioId) {
    const id = String(usuarioId); // <--- correção
    this.connections.delete(id);
    console.log(`🔴 Usuário ${id} desconectado`);
  }

  getConnection(usuarioId) {
    const id = String(usuarioId); // <--- correção
    const socket = this.connections.get(id);

    console.log(`🔍 Buscando conexão do usuário ${id} →`, socket ? "ENCONTRADO" : "NÃO ENCONTRADO");

    return socket;
  }
}

module.exports = new ConnectionManager();
