// server.js

require("dotenv").config(); // load .env
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// DB connection
const sequelize = require("./db");

// Models
const User = require("./Registration/registration.model");
const Vehicle = require("./Vehicle/vehicle.model");
const VehicleImage = require("./VehicleImages/model");
const Price = require("./price/price.model");
const Blog = require("./blogs/model");
const Reservation = require("./reservation/reservation.model");
const Service = require("./service/model");
const Contact = require("./contact/contact.model");

// Routes
const registrationRoutes = require("./Registration/registration.routes");
const reservationRoutes = require("./reservation/reservation.routes");
const vehicleRoutes = require("./Vehicle/vehicle.routes");
const vehicleImageRoutes = require("./VehicleImages/routes");
const priceRoutes = require("./price/price.routes");
const blogRoutes = require("./blogs/routes");
const serviceRoutes = require("./service/routes");
const contactRoutes = require("./contact/contact.routes");

// Express app
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routes
app.use("/api", registrationRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/vehicle-images", vehicleImageRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api", contactRoutes);
app.get("/api/_health", (req, res) => {
  res.json({ ok: true, service: "main-server", time: new Date().toISOString() });
});

// Associations
Vehicle.hasMany(VehicleImage, { foreignKey: "vehicle_id", as: "images" });
VehicleImage.belongsTo(Vehicle, { foreignKey: "vehicle_id" });

Vehicle.hasMany(Price, { foreignKey: "vehicle_id" });
Price.belongsTo(Vehicle, { foreignKey: "vehicle_id" });

// Server start & DB sync
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully");

    // Sync all models in proper order
    await User.sync({ alter: true });
    await Vehicle.sync({ alter: true });
    await VehicleImage.sync({ alter: true });
    await Price.sync({ alter: true });
    await Blog.sync({ alter: true });
        await Reservation.sync({ alter: true });
    await Service.sync({ alter: true });
await Contact.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`\n✅ Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
};

startServer();