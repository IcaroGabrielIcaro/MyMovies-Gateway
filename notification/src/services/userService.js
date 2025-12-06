const axios = require("axios");
const services = require("../utils/services");
const ConnectionManager = require("../utils/connectionManager");

const AUTH_SERVICE_URL = services.auth;

class UserService {
  static async pegarUsuario(id, token = null) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${AUTH_SERVICE_URL}/users/${id}`, {
        headers,
      });

      return response.data;
    } catch (err) {
      console.error("❌ Erro ao buscar usuário:", err.message);
      return null;
    }
  }

  static async pegarTodosUsuarios(token = null) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${AUTH_SERVICE_URL}/users`, {
        headers,
      });

      return response.data;
    } catch (err) {
      console.error("❌ Erro ao buscar usuários:", err.message);
      return [];
    }
  }

  static async usuariosPorGenero(genero, criadorId) {
    const generoUpper = genero.toUpperCase();

    // pegamos QUALQUER token válido (o token é do gateway)
    const anyConn = [...ConnectionManager.getAllConnections().values()][0];
    const token = anyConn?.token ?? null;

    const todos = await this.pegarTodosUsuarios(token);

    return todos.filter((u) =>
        u.id !== criadorId &&                               // ← evita notificar o criador
        u.generosPreferidos?.includes(generoUpper)          // ← filtra por gênero
    );
  }
}

module.exports = UserService;
