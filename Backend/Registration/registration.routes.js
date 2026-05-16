// @ts-nocheck
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllPassengers,
  updatePassenger,
  deletePassenger,
} = require('./registration.controller');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin-protected routes
router.get('/passengers', verifyToken, isAdmin, getAllPassengers);
router.put('/passenger/:user_id', verifyToken, isAdmin, updatePassenger);
router.delete('/passenger/:user_id', verifyToken, isAdmin, deletePassenger);

module.exports = router;
