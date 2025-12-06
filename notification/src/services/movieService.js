const axios = require("axios");
const services = require("../utils/services");

// URL correta para rodar em containers Docker
const MOVIE_SERVICE_URL = services.movie;

class MovieService {
  static async pegarFilme(id) {
    try {
      const response = await axios.get(`${MOVIE_SERVICE_URL}/api/movies/${id}/`);
      return response.data;
    } catch (err) {
      console.error("❌ Erro ao buscar filme:", err.message);
      return null;
    }
  }
}

module.exports = MovieService;
