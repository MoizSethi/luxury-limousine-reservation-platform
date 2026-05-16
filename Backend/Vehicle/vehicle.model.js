const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Vehicle = sequelize.define('Vehicle', {
  vehicle_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  seats: { type: DataTypes.INTEGER, allowNull: false },
  luggageCapacity: { type: DataTypes.INTEGER, allowNull: false },
  usbPowerOutlets: { type: DataTypes.BOOLEAN, defaultValue: false },
  coloredAccentLights: { type: DataTypes.BOOLEAN, defaultValue: false },
  deluxeAudioSystem: { type: DataTypes.BOOLEAN, defaultValue: false },
  forwardSeatingWithSeatBelts: { type: DataTypes.BOOLEAN, defaultValue: true },
  rearHeatACControls: { type: DataTypes.BOOLEAN, defaultValue: false },
  eleganceStylish: { type: DataTypes.BOOLEAN, defaultValue: false },
  extraLegroomComfortable: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'vehicles',
  timestamps: false
});

module.exports = Vehicle;
