const express = require('express');
const NotificationEvent = require('../events/NotificationEvent');
const NotificationService = require('../services/NotificationService');

const router = express.Router();

router.post('/notify', (req, res) => {
  const event = new NotificationEvent(req.body);

  console.log("📩 Evento recebido:", event);

  if (!event.isValid()) {
    return res.status(400).json({
      error: 'Evento inválido'
    });
  }

  NotificationService.process(event);

  return res.status(202).json({
    status: 'Evento recebido'
  });
});

module.exports = router;
