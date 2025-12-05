const express = require('express');
const NotificationEvent = require('../events/notificationEvent');
const NotificationService = require('../services/notificationService');
const Notification = require('../models/notification');


const router = express.Router();

router.post('/notify', async (req, res) => {
    const event = new NotificationEvent(req.body);


    console.log('📩 Evento recebido:', event);


    if (!event.isValid()) {
        return res.status(400).json({ error: 'Evento inválido' });
    }


    await NotificationService.process(event);
    return res.status(202).json({ status: 'Evento recebido' });
});


router.get('/notifications/:userId', async (req, res) => {
    const { userId } = req.params;


    const notificacoes = await Notification.findAll({
        where: { destinatarioId: userId }
    });


    return res.json(notificacoes);
});


router.post('/notifications/:id/read', async (req, res) => {
    const { id } = req.params;


    const notification = await Notification.findByPk(id);


    if (!notification) {
        return res.status(404).json({ error: 'Notificação não encontrada' });
    }


    notification.lido = true;
    return res.json({ status: 'ok', id });
});


module.exports = router;