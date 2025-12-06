const NotificationService = require("../services/notificationService");
const MovieService = require("../services/movieService");
const UserService = require("../services/userService");
const WebSocketServer = require("../utils/websocket");
const Notification = require("../models/notification");

class NotificationHandler {
  static async handle(event) {
    console.log("🛠 Processando notificação...");

    if (event.tipo === "FILME_CRIADO") {
      await this.processarFilmeCriado(event);
    } 
    
    else if (event.tipo === "FILME_CURTIDO") {
      await this.processarFilmeCurtido(event);
    }
  }

  // ----------------------------------------------------------------------
  // FILME CRIADO → broadcast filtrado por gênero
  // ----------------------------------------------------------------------
  static async processarFilmeCriado(event) {
    console.log("🎬 Processando FILME_CRIADO...");

    const filme = await MovieService.pegarFilme(event.filmeId);

    if (!filme) {
      console.log("❌ Filme não encontrado. Abortando.");
      return;
    }

    const genero = filme.genero;
    const idCriador = event.criadorId;
    console.log("📚 Gênero do filme:", genero, idCriador);

    const usuarios = await UserService.usuariosPorGenero(genero, idCriador);

    console.log(`👥 ${usuarios.length} usuários combinam com o gênero.`);

    for (const user of usuarios) {
      const notif = await Notification.create({
        destinatarioId: user.id,
        criadorId: event.criadorId,
        filmeId: event.filmeId,
        tipo: event.tipo,
        broadcast: false
      });

      WebSocketServer.emitNotification(notif);
    }
  }

  // ----------------------------------------------------------------------
  // FILME CURTIDO → individual e salvo
  // ----------------------------------------------------------------------
  static async processarFilmeCurtido(event) {
    console.log("❤️ Processando FILME_CURTIDO...");

    const notif = await Notification.create({
      destinatarioId: event.destinatarioId,
      criadorId: event.criadorId,
      filmeId: event.filmeId,
      tipo: event.tipo,
      broadcast: false
    });

    WebSocketServer.emitNotification(notif);
  }
}

module.exports = NotificationHandler;
