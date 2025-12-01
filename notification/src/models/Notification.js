const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');

const Notification = sequelize.define('Notification', {
  destinatarioId: { type: DataTypes.INTEGER, allowNull: false },
  curtidorId: { type: DataTypes.INTEGER, allowNull: true },
  filmeId: { type: DataTypes.INTEGER, allowNull: true },
  tipo: { type: DataTypes.STRING, allowNull: false },
  lido: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Notification;
