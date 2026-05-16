// VehicleImages/model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const VehicleImage = sequelize.define('VehicleImage', {
  image_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'vehicle_images',
  timestamps: true,
});

module.exports = VehicleImage;