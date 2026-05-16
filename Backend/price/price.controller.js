// price/price.controller.js
const Price = require('./price.model');
const Vehicle = require('../Vehicle/vehicle.model');

const priceController = {
  // Create or update pricing for a vehicle
  createOrUpdatePrice: async (req, res) => {
    try {
      const { vehicle_id, serviceType, baseRate, perKmRate, description, isActive = true } = req.body;

      console.log('📨 Received price data:', { vehicle_id, serviceType, baseRate, perKmRate });

      // Validate required fields
      if (!vehicle_id || !serviceType || baseRate === undefined) {
        return res.status(400).json({ 
          message: 'vehicle_id, serviceType, and baseRate are required' 
        });
      }

      // Check if vehicle exists
      const vehicle = await Vehicle.findByPk(vehicle_id);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      // Validate service type
      const validServiceTypes = ['hourly', 'daily', 'point-to-point'];
      if (!validServiceTypes.includes(serviceType)) {
        return res.status(400).json({ 
          message: 'Invalid service type. Must be: hourly, daily, or point-to-point' 
        });
      }

      // For point-to-point, perKmRate is required
      if (serviceType === 'point-to-point' && perKmRate === undefined) {
        return res.status(400).json({ 
          message: 'perKmRate is required for point-to-point service type' 
        });
      }

      // ✅ FIX: Convert baseRate to number and validate
      const baseRateNum = parseFloat(baseRate);
      if (isNaN(baseRateNum)) {
        return res.status(400).json({ 
          message: 'baseRate must be a valid number' 
        });
      }

      // ✅ FIX: Convert perKmRate to number if provided
      const perKmRateNum = perKmRate ? parseFloat(perKmRate) : null;
      if (perKmRate && isNaN(perKmRateNum)) {
        return res.status(400).json({ 
          message: 'perKmRate must be a valid number' 
        });
      }

      console.log('🔢 Parsed numbers:', { baseRateNum, perKmRateNum });

      // Calculate additional charges
      const operatingCost = baseRateNum * 0.20; // 20% operating cost
      const creditCardProcessing = baseRateNum * 0.03; // 3% credit card fee
      const stateSalesTax = baseRateNum * 0.089; // 8.9% sales tax
      const congestionSurcharge = 2.75; // Fixed congestion surcharge
      const discount = serviceType === 'daily' ? baseRateNum * 0.30 : 0; // 30% discount for daily

      // Calculate total price
      const totalPrice = baseRateNum + operatingCost + creditCardProcessing + 
                        stateSalesTax + congestionSurcharge - discount;

      console.log('💰 Price Calculation Details:', {
        baseRate: baseRateNum,
        operatingCost,
        creditCardProcessing,
        stateSalesTax,
        congestionSurcharge,
        discount,
        totalPrice
      });

      // Check if pricing already exists for this vehicle and service type
      const existingPrice = await Price.findOne({
        where: { vehicle_id, serviceType }
      });

      let price;
      const priceData = {
        baseRate: baseRateNum,
        perKmRate: serviceType === 'point-to-point' ? perKmRateNum : null,
        operatingCost: parseFloat(operatingCost.toFixed(2)),
        creditCardProcessing: parseFloat(creditCardProcessing.toFixed(2)),
        stateSalesTax: parseFloat(stateSalesTax.toFixed(2)),
        congestionSurcharge: parseFloat(congestionSurcharge.toFixed(2)),
        discount: parseFloat(discount.toFixed(2)),
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        description,
        isActive
      };

      console.log('💾 Saving price data:', priceData);

      if (existingPrice) {
        // Update existing price
        price = await existingPrice.update(priceData);
      } else {
        // Create new price
        price = await Price.create({
          vehicle_id,
          serviceType,
          ...priceData
        });
      }

      // Include vehicle info in response
      const priceWithVehicle = await Price.findByPk(price.price_id, {
        include: [{
          model: Vehicle,
          attributes: ['vehicle_id', 'name', 'seats']
        }]
      });

      console.log('✅ Price saved successfully:', {
        price_id: priceWithVehicle.price_id,
        totalPrice: priceWithVehicle.totalPrice
      });

      res.status(200).json({
        message: existingPrice ? 'Price updated successfully' : 'Price created successfully',
        price: priceWithVehicle
      });

    } catch (err) {
      console.error('❌ Create/Update price error:', err);
      res.status(500).json({ 
        message: 'Server error', 
        error: err.message 
      });
    }
  },

  // Get all prices with vehicle information
  listPrices: async (req, res) => {
    try {
      const { vehicle_id, serviceType, isActive } = req.query;
      
      const where = {};
      if (vehicle_id) where.vehicle_id = vehicle_id;
      if (serviceType) where.serviceType = serviceType;
      if (isActive !== undefined) where.isActive = isActive === 'true';

      const prices = await Price.findAll({
        where,
        include: [{
          model: Vehicle,
          attributes: ['vehicle_id', 'name', 'seats', 'luggageCapacity']
        }],
        order: [['vehicle_id', 'ASC'], ['serviceType', 'ASC']]
      });

      console.log(`📊 Returning ${prices.length} prices`);
      
      // Log first price to verify totalPrice exists
      if (prices.length > 0) {
        console.log('🔍 Sample price data:', {
          price_id: prices[0].price_id,
          serviceType: prices[0].serviceType,
          baseRate: prices[0].baseRate,
          totalPrice: prices[0].totalPrice,
          vehicle: prices[0].Vehicle?.name
        });
      }

      res.json({
        count: prices.length,
        prices
      });
    } catch (err) {
      console.error('List prices error:', err);
      res.status(500).json({ 
        message: 'Server error', 
        error: err.message 
      });
    }
  },

  // Get single price by ID
  getPrice: async (req, res) => {
    try {
      const price = await Price.findByPk(req.params.price_id, {
        include: [{
          model: Vehicle,
          attributes: ['vehicle_id', 'name', 'seats', 'luggageCapacity']
        }]
      });
      
      if (!price) {
        return res.status(404).json({ message: 'Price not found' });
      }
      
      res.json(price);
    } catch (err) {
      console.error('Get price error:', err);
      res.status(500).json({ 
        message: 'Server error', 
        error: err.message 
      });
    }
  },

  // Get prices by vehicle ID
  getPricesByVehicle: async (req, res) => {
    try {
      const prices = await Price.findAll({
        where: { vehicle_id: req.params.vehicle_id },
        include: [{
          model: Vehicle,
          attributes: ['vehicle_id', 'name', 'seats', 'luggageCapacity']
        }],
        order: [['serviceType', 'ASC']]
      });

      res.json({
        vehicle_id: req.params.vehicle_id,
        count: prices.length,
        prices
      });
    } catch (err) {
      console.error('Get prices by vehicle error:', err);
      res.status(500).json({ 
        message: 'Server error', 
        error: err.message 
      });
    }
  },

  // Update price
  updatePrice: async (req, res) => {
    try {
      const price = await Price.findByPk(req.params.price_id);
      if (!price) {
        return res.status(404).json({ message: 'Price not found' });
      }

      // Recalculate totals if baseRate is updated
      if (req.body.baseRate !== undefined) {
        const baseRateNum = parseFloat(req.body.baseRate);
        if (isNaN(baseRateNum)) {
          return res.status(400).json({ 
            message: 'baseRate must be a valid number' 
          });
        }

        const operatingCost = baseRateNum * 0.20;
        const creditCardProcessing = baseRateNum * 0.03;
        const stateSalesTax = baseRateNum * 0.089;
        const congestionSurcharge = 2.75;
        const discount = price.serviceType === 'daily' ? baseRateNum * 0.30 : 0;
        const totalPrice = baseRateNum + operatingCost + creditCardProcessing + 
                          stateSalesTax + congestionSurcharge - discount;

        req.body.operatingCost = parseFloat(operatingCost.toFixed(2));
        req.body.creditCardProcessing = parseFloat(creditCardProcessing.toFixed(2));
        req.body.stateSalesTax = parseFloat(stateSalesTax.toFixed(2));
        req.body.congestionSurcharge = parseFloat(congestionSurcharge.toFixed(2));
        req.body.discount = parseFloat(discount.toFixed(2));
        req.body.totalPrice = parseFloat(totalPrice.toFixed(2));
        
        console.log('🔄 Recalculated price:', {
          baseRate: baseRateNum,
          totalPrice: req.body.totalPrice
        });
      }

      await price.update(req.body);

      const updatedPrice = await Price.findByPk(price.price_id, {
        include: [{
          model: Vehicle,
          attributes: ['vehicle_id', 'name', 'seats']
        }]
      });

      res.json({
        message: 'Price updated successfully',
        price: updatedPrice
      });
    } catch (err) {
      console.error('Update price error:', err);
      res.status(500).json({ 
        message: 'Server error', 
        error: err.message 
      });
    }
  },

  // Delete price
  deletePrice: async (req, res) => {
    try {
      const price = await Price.findByPk(req.params.price_id);
      if (!price) {
        return res.status(404).json({ message: 'Price not found' });
      }

      await price.destroy();
      res.json({ message: 'Price deleted successfully' });
    } catch (err) {
      console.error('Delete price error:', err);
      res.status(500).json({ 
        message: 'Server error', 
        error: err.message 
      });
    }
  },

  // Toggle price active status
  togglePriceStatus: async (req, res) => {
    try {
      const price = await Price.findByPk(req.params.price_id);
      if (!price) {
        return res.status(404).json({ message: 'Price not found' });
      }

      await price.update({ isActive: !price.isActive });
      
      res.json({
        message: `Price ${price.isActive ? 'activated' : 'deactivated'} successfully`,
        price
      });
    } catch (err) {
      console.error('Toggle price status error:', err);
      res.status(500).json({ 
        message: 'Server error', 
        error: err.message 
      });
    }
  }
};

module.exports = priceController;