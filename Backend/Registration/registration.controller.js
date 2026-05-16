// @ts-nocheck
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./registration.model');

// ✅ FIX: Use the same secret as your auth middleware
const SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development-only';

console.log('🔐 Login Controller - JWT Config:', {
  hasEnvSecret: !!process.env.JWT_SECRET,
  secretLength: SECRET.length,
  usingFallback: !process.env.JWT_SECRET
});

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    console.log('📨 Register request received:', req.body);
    
    // Check if body exists
    if (!req.body) {
      return res.status(400).json({ 
        message: 'Request body is required',
        error: 'No data received in request body'
      });
    }

    const { firstName, lastName, phone, email, password, confirmPassword, role, notifications } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        message: 'Please fill all required fields.',
        missing: {
          firstName: !firstName,
          lastName: !lastName,
          phone: !phone,
          email: !email,
          password: !password,
          confirmPassword: !confirmPassword
        }
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      phone,
      email,
      password: hashed,
      role: role || 'passenger',
      notifications: notifications ? true : false,
    });

    // Remove password from response
    const userResponse = { ...newUser.toJSON() };
    delete userResponse.password;

    res.status(201).json({ 
      message: 'Registration successful', 
      user: userResponse 
    });

  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ 
      message: 'Server error during registration', 
      error: err.message 
    });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    console.log('📨 Login request received:', req.body);
    
    // Check if body exists
    if (!req.body) {
      return res.status(400).json({ 
        message: 'Request body is required',
        error: 'No data received in request body'
      });
    }

    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        missing: {
          email: !email,
          password: !password
        }
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ FIX: Using the same SECRET as auth middleware
    const token = jwt.sign({ 
      user_id: user.user_id, 
      email: user.email,
      role: user.role 
    }, SECRET, { expiresIn: '24h' }); // Increased to 24h for development

    console.log('✅ Login successful - Token generated for user:', {
      email: user.email,
      role: user.role,
      tokenLength: token.length
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        notifications: user.notifications
      },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ 
      message: 'Server error during login', 
      error: err.message 
    });
  }
};

// ADMIN: GET ALL PASSENGERS
exports.getAllPassengers = async (req, res) => {
  try {
    const passengers = await User.findAll({ 
      where: { role: 'passenger' },
      attributes: { exclude: ['password'] } // Don't return passwords
    });
    res.json({
      success: true,
      count: passengers.length,
      data: passengers
    });
  } catch (err) {
    console.error('❌ Get passengers error:', err);
    res.status(500).json({ 
      message: 'Error fetching passengers', 
      error: err.message 
    });
  }
};

// ADMIN: UPDATE PASSENGER
exports.updatePassenger = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { firstName, lastName, phone, notifications } = req.body;

    const passenger = await User.findByPk(user_id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    await passenger.update({ firstName, lastName, phone, notifications });
    
    // Remove password from response
    const updatedPassenger = { ...passenger.toJSON() };
    delete updatedPassenger.password;

    res.json({ 
      message: 'Passenger updated successfully', 
      passenger: updatedPassenger 
    });
  } catch (err) {
    console.error('❌ Update passenger error:', err);
    res.status(500).json({ 
      message: 'Error updating passenger', 
      error: err.message 
    });
  }
};

// ADMIN: DELETE PASSENGER
exports.deletePassenger = async (req, res) => {
  try {
    const { user_id } = req.params;
    const passenger = await User.findByPk(user_id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    await passenger.destroy();
    res.json({ message: 'Passenger deleted successfully' });
  } catch (err) {
    console.error('❌ Delete passenger error:', err);
    res.status(500).json({ 
      message: 'Error deleting passenger', 
      error: err.message 
    });
  }
};