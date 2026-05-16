const express = require('express');
const router = express.Router();
const vehicleController = require('./vehicle.controller');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public routes - No authentication required
router.get('/', vehicleController.listVehicles);              // Get all vehicles
router.get('/:vehicle_id', vehicleController.getVehicle);    // Get single vehicle by ID

// Admin-only routes - Require authentication and admin role
router.post('/', verifyToken, isAdmin, vehicleController.createVehicle);         // Create new vehicle
router.put('/:vehicle_id', verifyToken, isAdmin, vehicleController.updateVehicle); // Update vehicle
router.delete('/:vehicle_id', verifyToken, isAdmin, vehicleController.deleteVehicle); // Delete vehicle

module.exports = router;