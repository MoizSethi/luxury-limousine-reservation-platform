// reservation/reservation.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Reservation = sequelize.define(
  "Reservation",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    // Trip
    service_type: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    pickup_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    pickup_time: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    pickup_location: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dropoff_location: {
      type: DataTypes.TEXT,
      allowNull: true, // null for hourly
    },
    duration_hours: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true, // for hourly
    },
    return_trip: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    return_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    return_time: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    passengers: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    luggage: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    vehicle_type: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
        // Vehicle Selection
    vehicle_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true, // allow old reservations without vehicleId
    },
    selected_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    vehicle_image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Options
    meet_greet: { type: DataTypes.BOOLEAN, defaultValue: false },
    child_seat: { type: DataTypes.BOOLEAN, defaultValue: false },
    booster_seat: { type: DataTypes.BOOLEAN, defaultValue: false },

    // Airport details
    is_airport: { type: DataTypes.BOOLEAN, defaultValue: false },
    airline: { type: DataTypes.STRING(60), allowNull: true },
    flight_number: { type: DataTypes.STRING(30), allowNull: true },
    arrival_time: { type: DataTypes.STRING(30), allowNull: true },

    // Passenger
    first_name: { type: DataTypes.STRING(60), allowNull: false },
    last_name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false },
    phone: { type: DataTypes.STRING(30), allowNull: false },

    // Notes
    notes: { type: DataTypes.TEXT, allowNull: true },

    // Status (useful for admin dashboard)
    status: {
      type: DataTypes.ENUM("new", "confirmed", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "new",
    },
  },
  {
    tableName: "reservations",
    timestamps: true,
    underscored: true,
  }
);

module.exports = Reservation;
