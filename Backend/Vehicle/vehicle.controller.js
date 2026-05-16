// @ts-nocheck
const Vehicle = require('./vehicle.model');

const vehicleController = {

  // Get all vehicles
  listVehicles: async (req, res) => {
    try {
      const vehicles = await Vehicle.findAll();
      return res.json(vehicles);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Get 1 vehicle
  getVehicle: async (req, res) => {
    try {
      const vehicle = await Vehicle.findByPk(req.params.vehicle_id);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      return res.json(vehicle);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Create
  createVehicle: async (req, res) => {
    try {
      if (!req.body.name || !req.body.seats) {
        return res.status(400).json({ message: 'Name & seats are required' });
      }

      const vehicle = await Vehicle.create(req.body);
      return res.status(201).json(vehicle);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Update
  updateVehicle: async (req, res) => {
    try {
      const vehicle = await Vehicle.findByPk(req.params.vehicle_id);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      await vehicle.update(req.body);
      return res.json(vehicle);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete
  deleteVehicle: async (req, res) => {
    try {
      const vehicle = await Vehicle.findByPk(req.params.vehicle_id);

      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }

      await vehicle.destroy();
      return res.json({ message: 'Vehicle deleted successfully' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

};

module.exports = vehicleController;
