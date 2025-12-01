const express = require('express');
const NotificationEvent = require('../events/NotificationEvent');
const NotificationService = require('../services/NotificationService');
const Notification = require('../models/Notification'); // <-- IMPORTANTE

const router = express.Router();

/*
 * 1️⃣ RECEBER EVENTOS (já existia)
 */
router.post('/notify', async (req, res) => {
  const event = new NotificationEvent(req.body);

  console.log("📩 Evento recebido:", event);

  if (!event.isValid()) {
    return res.status(400).json({ error: 'Evento inválido' });
  }

  await NotificationService.process(event);

  return res.status(202).json({ status: 'Evento recebido' });
});


/*
 * 2️⃣ LISTAR NOTIFICAÇÕES DO USUÁRIO
 *    GET /api/notifications/:userId
 */
router.get('/notifications/:userId', async (req, res) => {
  const { userId } = req.params;

  const notificacoes = await Notification.findAll({
    where: { destinatarioId: userId },
    order: [['createdAt', 'DESC']]
  });

  return res.json(notificacoes);
});


/*
 * 3️⃣ MARCAR UMA NOTIFICAÇÃO COMO LIDA
 *    POST /api/notifications/:id/read
 */
router.post('/notifications/:id/read', async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findByPk(id);

  if (!notification) {
    return res.status(404).json({ error: 'Notificação não encontrada' });
  }

  notification.lido = true;
  await notification.save();

  return res.json({ status: 'ok', id });
});

module.exports = router;
