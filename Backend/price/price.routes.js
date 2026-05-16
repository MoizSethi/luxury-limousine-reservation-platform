// price/price.routes.js
const express = require('express');
const router = express.Router();
const priceController = require('./price.controller');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public routes (viewing prices)
router.get('/', priceController.listPrices);                      // Get all prices
router.get('/:price_id', priceController.getPrice);               // Get single price by ID
router.get('/vehicle/:vehicle_id', priceController.getPricesByVehicle); // Get prices by vehicle ID

// Protected admin routes (managing prices)
router.post('/', verifyToken, isAdmin, priceController.createOrUpdatePrice);     // Create or update price
router.put('/:price_id', verifyToken, isAdmin, priceController.updatePrice);     // Update price
router.delete('/:price_id', verifyToken, isAdmin, priceController.deletePrice);  // Delete price
router.patch('/:price_id/toggle', verifyToken, isAdmin, priceController.togglePriceStatus); // Toggle active status

module.exports = router;