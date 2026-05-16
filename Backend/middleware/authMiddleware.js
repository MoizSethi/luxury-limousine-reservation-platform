// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Use a fallback secret if environment variable is not set
const SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development-only';

console.log('🔐 JWT Config:', {
  hasEnvSecret: !!process.env.JWT_SECRET,
  secretLength: SECRET.length,
  usingFallback: !process.env.JWT_SECRET
});

exports.verifyToken = (req, res, next) => {
  console.log('🔐 Auth Headers:', req.headers);
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header required' });
  }

  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;

  console.log('🔐 Token received:', token ? `Present (${token.length} chars)` : 'Missing');

  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log('✅ Token verified:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return res.status(401).json({ 
      message: 'Invalid token',
      error: error.message 
    });
  }
};

exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admin only' });
  }
  
  console.log('✅ Admin access granted for user:', req.user.email);
  next();
};