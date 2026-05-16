// price/price.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Vehicle = require('../Vehicle/vehicle.model');

const Price = sequelize.define('Price', {
  price_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Vehicle,
      key: 'vehicle_id'
    },
    onDelete: 'CASCADE'
  },
  serviceType: {
    type: DataTypes.ENUM('hourly', 'daily', 'point-to-point'),
    allowNull: false
  },
  
  // Base rates
  baseRate: { 
    type: DataTypes.FLOAT, 
    allowNull: false,
    validate: {
      min: 0
    }
  },
  
  // For point-to-point
  perKmRate: { 
    type: DataTypes.FLOAT, 
    allowNull: true,
    validate: {
      min: 0
    }
  },
  
  // Additional charges
  operatingCost: { 
    type: DataTypes.FLOAT, 
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  creditCardProcessing: { 
    type: DataTypes.FLOAT, 
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  stateSalesTax: { 
    type: DataTypes.FLOAT, 
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  congestionSurcharge: { 
    type: DataTypes.FLOAT, 
    allowNull: false, 
    defaultValue: 2.75,
    validate: {
      min: 0
    }
  },
  discount: { 
    type: DataTypes.FLOAT, 
    allowNull: false, 
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  
  // Calculated total
  totalPrice: { 
    type: DataTypes.FLOAT, 
    allowNull: false,
    validate: {
      min: 0
    }
  },
  
  // Additional info
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

}, {
  tableName: 'prices',
  timestamps: true,
  indexes: [
    {
      fields: ['vehicle_id', 'serviceType'],
      unique: true,
      name: 'unique_vehicle_service'
    }
  ]
});

// Associations
Price.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });
Vehicle.hasMany(Price, { foreignKey: 'vehicle_id' });
module.exports = Price;